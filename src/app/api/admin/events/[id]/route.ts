import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { uploadToS3 } from '@/lib/s3';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

import { sendStatusUpdateEmail } from '@/lib/email';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const eventDoc = await Event.findById(id);
        if (!eventDoc) return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
        return NextResponse.json({ success: true, event: eventDoc.toJSON() });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const body = await req.json();
        const { status, featured } = body;

        const updateData: any = {};
        if (status) updateData.status = status;
        if (typeof featured === 'boolean') updateData.featured = featured;

        const eventDoc = await Event.findByIdAndUpdate(id, updateData, { new: true });
        if (!eventDoc) return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });

        // Trigger status update email
        if (status === 'approved' || status === 'rejected') {
            await sendStatusUpdateEmail(eventDoc.organiserEmail, eventDoc.organiser, eventDoc.title, status, eventDoc._id.toString());
        }

        return NextResponse.json({ success: true, event: eventDoc.toJSON() });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id: eventId } = await params;
        const formData = await req.formData();

        const existingEvent = await Event.findById(eventId);
        if (!existingEvent) return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });

        // Extract fields
        const updateData: any = {};
        const fields = [
            'title', 'description', 'category', 'format',
            'date', 'startDate', 'endDate', 'startTime', 'endTime', 'location', 'organiser',
            'organiserEmail', 'bookingUrl', 'isFree', 'priceFrom', 'priceTo'
        ];

        fields.forEach(field => {
            const val = formData.get(field);
            if (val !== null) {
                if (field === 'isFree') updateData[field] = val === 'true';
                else if (field === 'priceFrom' || field === 'priceTo') updateData[field] = parseFloat(val as string);
                else updateData[field] = val;
            }
        });

        const subjectAreas = formData.get('subjectAreas');
        if (subjectAreas) updateData.subjectAreas = JSON.parse(subjectAreas as string);

        const phases = formData.get('phases');
        if (phases) updateData.phases = JSON.parse(phases as string);

        // Handle Image Update
        const file = formData.get('image') as File;
        if (file && typeof file !== 'string') {
            const buffer = Buffer.from(await file.arrayBuffer());
            const fileName = `${uuidv4()}-${file.name}`;
            const uploadDir = path.join(process.cwd(), 'tmp/uploads');
            if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
            const filePath = path.join(uploadDir, fileName);
            fs.writeFileSync(filePath, buffer);

            const uploadResult = await uploadToS3(filePath, 'events');
            updateData.image = uploadResult.url;
        }

        const updatedEvent = await Event.findByIdAndUpdate(eventId, updateData, { new: true });

        return NextResponse.json({
            success: true,
            message: "Event Updated Successfully.",
            event: updatedEvent?.toJSON()
        });

    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: error.message || "Internal Server Error"
        }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;
        const event = await Event.findByIdAndDelete(id);
        if (!event) return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
        return NextResponse.json({ success: true, message: 'Event deleted' });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
