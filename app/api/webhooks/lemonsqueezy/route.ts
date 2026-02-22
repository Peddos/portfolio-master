import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createServiceClient } from '@/lib/supabase';

export async function POST(req: Request) {
    try {
        const text = await req.text();
        const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET || '');
        const digest = Buffer.from(hmac.update(text).digest('hex'), 'utf8');
        const signature = Buffer.from(req.headers.get('x-signature') || '', 'utf8');

        if (!crypto.timingSafeEqual(digest, signature)) {
            return new Response('Invalid signature.', { status: 400 });
        }

        const payload = JSON.parse(text);
        const eventName = payload.meta.event_name;
        const body = payload.data;

        const supabase = createServiceClient();

        if (eventName === 'subscription_created' || eventName === 'subscription_updated') {
            const attributes = body.attributes;
            const email = attributes.user_email;
            const status = attributes.status; // 'active', 'on_trial', 'past_due', 'unpaid', 'cancelled', 'expired'
            const variantId = attributes.variant_id.toString();
            const customerId = body.id;

            // Map LS status to our internal status
            let internalStatus: 'pro' | 'free' | 'past_due' | 'canceled' = 'free';
            if (status === 'active' || status === 'on_trial') {
                internalStatus = 'pro';
            } else if (status === 'past_due' || status === 'unpaid') {
                internalStatus = 'past_due';
            } else if (status === 'cancelled' || status === 'expired') {
                internalStatus = 'canceled';
            }

            const { error: dbError } = await supabase
                .from('profiles')
                .update({
                    subscription_status: internalStatus,
                    lemon_squeezy_id: customerId,
                    variant_id: variantId
                })
                .eq('email', email);

            if (dbError) {
                console.error('Database update error:', dbError);
                return NextResponse.json({ error: 'DB update failed' }, { status: 500 });
            }
        }

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error('Webhook processing error:', err);
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
