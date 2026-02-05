import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Event from "@/models/Event";
import { uploadToS3 } from "@/lib/s3";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import {
  sendEventConfirmationEmail,
  sendAdminNewEventNotification,
  sendStatusUpdateEmail,
} from "@/lib/email";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia" as any,
});

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const formData = await req.formData();

    // Extract fields
    const title = formData.get("title") as string;
    const description = formData.get("description") as string;
    const category = formData.get("category") as string;
    const format = formData.get("format") as string;
    const subjectAreas = JSON.parse(
      (formData.get("subjectAreas") as string) || "[]",
    );
    const phases = JSON.parse((formData.get("phases") as string) || "[]");
    const date = formData.get("date") as string;
    const startTime = formData.get("startTime") as string;
    const endTime = formData.get("endTime") as string;
    const location = formData.get("location") as string;
    const organiser = formData.get("organiser") as string;
    const organiserEmail = formData.get("organiserEmail") as string;
    const bookingUrl = formData.get("bookingUrl") as string;
    const isFree = formData.get("isFree") === "true";
    const price = formData.get("price")
      ? parseFloat(formData.get("price") as string)
      : undefined;
    const isAdmin = formData.get("isAdmin") === "true";
    const file = formData.get("image") as File;

    // Validation
    const errors: any = {};
    if (!title) errors.title = "Required";
    else if (title.length > 100)
      errors.title = "Title must be 100 characters or less";

    if (!description) errors.description = "Required";
    else if (description.length > 1000)
      errors.description = "Description must be less then 1000 characters ";

    if (!organiser) errors.organiser = "Required";
    else if (organiser.length > 50)
      errors.organiser = "Name must be 50 characters or less";

    if (!organiserEmail) errors.organiserEmail = "Required";
    else if (!organiserEmail.includes("@"))
      errors.organiserEmail = "Incorrect email format. Email must contain @";

    if (!bookingUrl) errors.bookingUrl = "Required";
    else {
      try {
        new URL(bookingUrl);
      } catch {
        errors.bookingUrl = "Incorrect URL. Please enter a valid URL.";
      }
    }

    if (!file) errors.image = "Required";
    else {
      const allowedTypes = ["image/png", "image/jpeg", "image/jpg"];
      if (!allowedTypes.includes(file.type)) {
        errors.image = "Incorrect File Format. File must be PNG or JPG.";
      }
      if (file.size > 25 * 1024 * 1024) {
        errors.image = "File size too big. File size should be less than 25mb";
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Handle File Upload to S3
    let imageUrl = "";
    if (file) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const fileName = `${uuidv4()}-${file.name}`;
      const uploadDir = path.join(process.cwd(), "tmp/uploads");
      if (!fs.existsSync(uploadDir))
        fs.mkdirSync(uploadDir, { recursive: true });
      const filePath = path.join(uploadDir, fileName);
      fs.writeFileSync(filePath, buffer);

      const uploadResult = await uploadToS3(filePath, "events");
      imageUrl = uploadResult.url;
    }

    // Create Event
    const newEvent = new Event({
      title,
      description,
      category,
      format,
      subjectAreas,
      phases,
      date,
      startTime,
      endTime,
      location,
      organiser,
      organiserEmail,
      image: imageUrl,
      bookingUrl,
      isFree,
      price,
      status: isAdmin ? "approved" : "pending",
      featured: false,
      isAdminCreated: isAdmin,
      paymentStatus: isAdmin ? "paid" : "unpaid",
    });

    await newEvent.save();

    // Notify Admin
    await sendAdminNewEventNotification(newEvent);

    if (isAdmin) {
      // Admin created: Send approval email since event is already approved
      await sendStatusUpdateEmail(organiserEmail, organiser, title, "approved");
      return NextResponse.json(
        {
          success: true,
          message: "Event Created Successfully.",
          event: newEvent.toJSON(),
        },
        { status: 201 },
      );
    } else {
      // User submission: Create Stripe session
      try {
        const session = await stripe.checkout.sessions.create({
          payment_method_types: ["card"],
          customer_email: organiserEmail,
          line_items: [
            {
              price_data: {
                currency: "gbp",
                product_data: {
                  name: `Event Listing Fee: ${title}`,
                  description: "Listing your event on EDUVENTS for 3 months.",
                },
                unit_amount: 9900, // £99.00
              },
              quantity: 1,
            },
          ],
          mode: "payment",
          success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/list-event?success=true&session_id={CHECKOUT_SESSION_ID}&event_id=${newEvent._id}`,
          cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/list-event?canceled=true&event_id=${newEvent._id}`,
          metadata: {
            eventId: newEvent._id.toString(),
          },
        });

        return NextResponse.json(
          {
            success: true,
            message: "Event Created. Redirecting to payment...",
            event: newEvent.toJSON(),
            stripeUrl: session.url,
          },
          { status: 201 },
        );
      } catch (stripeError: any) {
        console.error("Stripe Session Error:", stripeError);
        // Atomic Rollback: delete the event record if payment initiation fails
        await Event.findByIdAndDelete(newEvent._id);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to initiate payment. Please try again.",
          },
          { status: 500 },
        );
      }
    }
  } catch (error: any) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 },
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search")?.trim();
    const category = searchParams.get("category");
    const format = searchParams.get("format");
    const subject = searchParams.get("subject");
    const phase = searchParams.get("phase");
    const date = searchParams.get("date");
    const sort = searchParams.get("sort") || "newest";

    // Build query
    const query: any = { status: "approved" };

    // Handle Search
    if (search) {
      const searchLower = search.toLowerCase();

      if (searchLower === "free") {
        query.isFree = true;
      } else {
        // Day of week detection (support partial matches like "wed")
        const days = [
          "sunday",
          "monday",
          "tuesday",
          "wednesday",
          "thursday",
          "friday",
          "saturday",
        ];
        const matchedDayIndex = days.findIndex((d) =>
          d.startsWith(searchLower),
        );

        const searchAsPrice = !isNaN(Number(search)) ? Number(search) : null;
        const searchAsDay = matchedDayIndex !== -1 ? matchedDayIndex + 1 : null;

        query.$or = [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { organiser: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { format: { $regex: search, $options: "i" } },
          { subjectAreas: { $in: [new RegExp(search, "i")] } },
          { phases: { $in: [new RegExp(search, "i")] } },
        ];

        if (searchAsPrice !== null) {
          query.$or.push({ price: searchAsPrice });
        }

        if (searchAsDay) {
          query.$or.push({
            $expr: {
              $eq: [
                { $dayOfWeek: { $dateFromString: { dateString: "$date" } } },
                searchAsDay,
              ],
            },
          });
        }
      }
    }

    // Exact Filters
    if (category && category !== "all") {
      query.category = category;
    }
    if (format && format !== "all") {
      query.format = format;
    }
    if (subject && subject !== "all") {
      query.subjectAreas = { $in: [subject] };
    }
    if (phase && phase !== "all") {
      query.phases = { $in: [phase] };
    }
    if (date) {
      query.date = date;
    }

    // Sort configuration
    let sortOption: any = { createdAt: -1 };
    if (sort === "date") {
      sortOption = { date: 1 };
    } else if (sort === "popularity") {
      // Placeholder for popularity, if you have a views field
      sortOption = { createdAt: -1 };
    }

    const eventsList = await Event.find(query).sort(sortOption);
    const events = eventsList.map((e) => e.toJSON());

    return NextResponse.json({ success: true, events });
  } catch (error: any) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
