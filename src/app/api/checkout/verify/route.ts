import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import dbConnect from '@/lib/mongodb';
import Event from '@/models/Event';
import { sendEventConfirmationEmail } from '@/lib/email';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: NextRequest) {
    try {
        await dbConnect();
        const { sessionId, eventId } = await req.json();

        if (!sessionId || !eventId) {
            return NextResponse.json({ success: false, message: 'Missing parameters' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const event = await Event.findById(eventId);
            if (!event) {
                return NextResponse.json({ success: false, message: 'Event not found' }, { status: 404 });
            }

            if (event.paymentStatus !== 'paid') {
                event.paymentStatus = 'paid';
                event.stripeSessionId = sessionId;
                await event.save();

                // Now send the confirmation email
                await sendEventConfirmationEmail(event.organiserEmail, event.organiser, event.title);
            }

            return NextResponse.json({ success: true, event });
        } else {
            return NextResponse.json({ success: false, message: 'Payment not completed' }, { status: 400 });
        }
    } catch (error: any) {
        console.error('Verify Payment Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
