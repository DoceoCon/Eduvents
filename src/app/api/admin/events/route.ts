import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

export async function GET() {
    try {
        await dbConnect();
        // Admin needs to see all events
        const eventsList = await Event.find({}).sort({ createdAt: -1 });
        const events = eventsList.map(e => e.toJSON());
        return NextResponse.json({ success: true, events });
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
