import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { eventId } = await req.json();

        if (!eventId) {
            return NextResponse.json({ success: false, message: 'Missing event ID' }, { status: 400 });
        }

        // Only delete if it's still unpaid to prevent accidental deletion of paid events
        const event = await Event.findById(eventId);

        if (event && event.paymentStatus === 'unpaid') {
            await Event.findByIdAndDelete(eventId);
            return NextResponse.json({ success: true, message: 'Unpaid event cleaned up' });
        }

        return NextResponse.json({ success: true, message: 'No cleanup needed or event not found' });
    } catch (error: any) {
        console.error('Cleanup Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
