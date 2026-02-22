'use server';

import { createServiceClient } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

/**
 * Fetch all profiles with their subscription details.
 */
export async function getProfiles() {
    const supabase = createServiceClient();
    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }
    return data;
}

/**
 * Delete a profile by ID.
 */
export async function deleteProfile(id: string) {
    const supabase = createServiceClient();
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting profile:', error);
        return { success: false, error: error.message };
    }

    revalidatePath('/admin');
    return { success: true };
}
