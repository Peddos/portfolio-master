'use server';

import { createServiceClient } from '@/lib/supabase';

export async function checkSubscriptionStatus(email: string) {
    const supabase = createServiceClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('subscription_status')
        .eq('email', email)
        .single();

    if (error || !data) return { isPro: false };
    return { isPro: data.subscription_status === 'pro' };
}
