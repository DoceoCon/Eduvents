import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        await dbConnect();
        const { id } = await params;

        // Try slug first
        let eventDoc = await Event.findOne({ slug: id });

        // Fallback: try as MongoDB ObjectId for backward compatibility
        if (!eventDoc && /^[0-9a-fA-F]{24}$/.test(id)) {
            eventDoc = await Event.findById(id);
        }

        if (!eventDoc) return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
        return NextResponse.json({ success: true, event: eventDoc.toJSON() });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
