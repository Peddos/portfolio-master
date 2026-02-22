import { createBrowserClient, Profile } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import PortfolioPage from '@/components/PortfolioPage';

export const revalidate = 0; // Always fresh

type Props = {
    params: Promise<{ subdomain: string }>;
};

export async function generateMetadata({ params }: Props) {
    const { subdomain } = await params;
    const supabase = createBrowserClient();
    const { data } = await supabase
        .from('profiles')
        .select('full_name, profession, bio')
        .eq('subdomain', subdomain)
        .single();

    if (!data) return { title: 'Portfolio Not Found' };

    return {
        title: `${data.full_name} — ${data.profession} Portfolio`,
        description: data.bio?.slice(0, 155),
    };
}

export default async function Page({ params }: Props) {
    const { subdomain } = await params;
    const supabase = createBrowserClient();

    const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('subdomain', subdomain)
        .single();

    if (error || !data) {
        notFound();
    }

    return <PortfolioPage profile={data as Profile} />;
}
