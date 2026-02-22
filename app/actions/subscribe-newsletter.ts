'use server';

import { createServiceClient } from '@/lib/supabase';

export async function subscribeToNewsletter(email: string) {
    if (!email || !email.includes('@')) {
        return { success: false, error: 'Invalid email address.' };
    }

    const supabase = createServiceClient();

    const { error } = await supabase
        .from('newsletter_subscribers')
        .upsert({ email }, { onConflict: 'email' });

    if (error) {
        console.error('Newsletter subscription error:', error);
        return { success: false, error: 'Failed to subscribe. Please try again.' };
    }

    return { success: true };
}
