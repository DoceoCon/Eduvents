import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { uploadToS3 } from '@/lib/s3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { sendEventConfirmationEmail } from '@/lib/email';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const formData = await req.formData();

        // Extract fields
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const fullDescription = formData.get('fullDescription') as string;
        const category = formData.get('category') as string;
        const format = formData.get('format') as string;
        const subjectAreas = JSON.parse(formData.get('subjectAreas') as string || '[]');
        const phases = JSON.parse(formData.get('phases') as string || '[]');
        const date = formData.get('date') as string;
        const startTime = formData.get('startTime') as string;
        const endTime = formData.get('endTime') as string;
        const location = formData.get('location') as string;
        const organiser = formData.get('organiser') as string;
        const organiserEmail = formData.get('organiserEmail') as string;
        const bookingUrl = formData.get('bookingUrl') as string;
        const isFree = formData.get('isFree') === 'true';
        const price = formData.get('price') ? parseFloat(formData.get('price') as string) : undefined;
        const isAdmin = formData.get('isAdmin') === 'true';
        const file = formData.get('image') as File;

        // Validation
        const errors: any = {};
        if (!title) errors.title = "Required";
        else if (title.length > 50) errors.title = "Title must be 50 characters or less";

        if (!description) errors.description = "Required";
        else if (description.length > 100) errors.description = "Description must be 200 characters or less";

        if (!organiser) errors.organiser = "Required";
        else if (organiser.length > 50) errors.organiser = "Name must be 50 characters or less";

        if (!organiserEmail) errors.organiserEmail = "Required";
        else if (!organiserEmail.includes('@')) errors.organiserEmail = "Incorrect email format. Email must contain @";

        if (!bookingUrl) errors.bookingUrl = "Required";
        else {
            try { new URL(bookingUrl); } catch { errors.bookingUrl = "Incorrect URL. Please enter a valid URL."; }
        }

        if (!file) errors.image = "Required";
        else {
            const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
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
        let imageUrl = '';
        if (file) {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${uuidv4()}-${file.name}`;
            const uploadDir = path.join(process.cwd(), 'tmp/uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, buffer);

            const uploadResult = await uploadToS3(filePath, 'events');
            imageUrl = uploadResult.url;
        }

        // Create Event
        const newEvent = new Event({
            title,
            description,
            fullDescription: fullDescription || description,
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
            status: isAdmin ? 'approved' : 'pending',
            featured: false,
            isAdminCreated: isAdmin,
            paymentStatus: isAdmin ? 'paid' : 'unpaid'
        });

        await newEvent.save();

        if (isAdmin) {
            // Admin created: Send email immediately
            await sendEventConfirmationEmail(organiserEmail, organiser, title);
            return NextResponse.json({
                success: true,
                message: "Event Created Successfully.",
                event: newEvent.toJSON()
            }, { status: 201 });
        } else {
            // User submission: Create Stripe session
            try {
                const session = await stripe.checkout.sessions.create({
                    payment_method_types: ['card'],
                    customer_email: organiserEmail,
                    line_items: [
                        {
                            price_data: {
                                currency: 'gbp',
                                product_data: {
                                    name: `Event Listing Fee: ${title}`,
                                    description: 'Listing your event on EDUVENTS for 3 months.',
                                },
                                unit_amount: 9900, // £99.00
                            },
                            quantity: 1,
                        },
                    ],
                    mode: 'payment',
                    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/list-event?success=true&session_id={CHECKOUT_SESSION_ID}&event_id=${newEvent._id}`,
                    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/list-event?canceled=true&event_id=${newEvent._id}`,
                    metadata: {
                        eventId: newEvent._id.toString(),
                    },
                });

                return NextResponse.json({
                    success: true,
                    message: "Event Created. Redirecting to payment...",
                    event: newEvent.toJSON(),
                    stripeUrl: session.url
                }, { status: 201 });

            } catch (stripeError: any) {
                console.error("Stripe Session Error:", stripeError);
                // Atomic Rollback: delete the event record if payment initiation fails
                await Event.findByIdAndDelete(newEvent._id);
                return NextResponse.json({
                    success: false,
                    message: "Failed to initiate payment. Please try again."
                }, { status: 500 });
            }
        }

    } catch (error: any) {
        console.error("Error creating event:", error);
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}

export async function GET() {
    try {
        await dbConnect();
        const eventsList = await Event.find({ status: 'approved' }).sort({ createdAt: -1 });
        const events = eventsList.map(e => e.toJSON());
        return NextResponse.json({ success: true, events });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
