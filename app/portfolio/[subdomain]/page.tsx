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
        .select('full_name, profession, bio, profile_img')
        .eq('subdomain', subdomain)
        .single();

    if (!data) return { title: 'Portfolio Not Found' };

    return {
        title: `${data.full_name} — ${data.profession} Portfolio`,
        description: data.bio?.slice(0, 155),
        openGraph: {
            title: `${data.full_name} | ${data.profession}`,
            description: data.bio?.slice(0, 160),
            images: data.profile_img ? [data.profile_img] : [],
            type: 'website',
        },
        twitter: {
            card: 'summary_large_image',
            title: data.full_name,
            description: data.bio?.slice(0, 160),
            images: data.profile_img ? [data.profile_img] : [],
        },
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

    const profile = data as Profile;

    // JSON-LD for Search Engines
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: profile.full_name,
        jobTitle: profile.profession,
        description: profile.bio,
        image: profile.profile_img,
        url: `https://${subdomain}.${process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'localhost:3000'}`,
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
            <PortfolioPage profile={profile} />
        </>
    );
}
