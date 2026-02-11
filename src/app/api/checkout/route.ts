import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2024-12-18.acacia' as any,
});

export async function POST(req: NextRequest) {
    try {
        const { eventId, title, email } = await req.json();

        if (!eventId || !title) {
            return NextResponse.json({ success: false, message: 'Missing event information' }, { status: 400 });
        }

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: email,
            line_items: [
                {
                    price_data: {
                        currency: 'gbp',
                        product_data: {
                            name: `Event Listing Fee: ${title}`,

                        },
                        unit_amount: 9900, // £99.00
                    },
                    quantity: 1,
                },
            ],
            mode: 'payment',
            success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/list-event?success=true&session_id={CHECKOUT_SESSION_ID}&event_id=${eventId}`,
            cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/list-event?canceled=true`,
            metadata: {
                eventId: eventId,
            },
        });

        return NextResponse.json({ url: session.url });
    } catch (error: any) {
        console.error('Stripe Session Error:', error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
