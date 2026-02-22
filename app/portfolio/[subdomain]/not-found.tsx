import Link from 'next/link';

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center px-6">
            <div className="text-center animate-fade-up">
                <p className="text-6xl font-display font-bold text-white/10 mb-6">404</p>
                <h1 className="font-display text-2xl font-semibold text-white mb-3">
                    Portfolio not found
                </h1>
                <p className="text-neutral-500 mb-8 max-w-sm">
                    This portfolio URL doesn&apos;t exist yet. Create yours in seconds.
                </p>
                <Link
                    href="/intake"
                    className="inline-flex items-center gap-2 bg-white text-black px-7 py-3.5 rounded-full text-sm font-semibold hover:bg-neutral-200 transition-colors"
                >
                    Build My Portfolio
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                    </svg>
                </Link>
            </div>
        </div>
    );
}
