import IntakeForm from '@/components/IntakeForm';

export const metadata = {
    title: 'Create Your Portfolio — Portfolio Engine',
    description: 'Fill in your details and get a stunning AI-polished portfolio in seconds.',
};

export default function IntakePage() {
    return (
        <main className="min-h-screen flex bg-[#050505]">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-2/5 xl:w-[35%] flex-col justify-between p-16 bg-[#080808] border-r border-white/[0.03] relative overflow-hidden">
                {/* Background decoration */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-white/[0.01] blur-[120px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                {/* Logo */}
                <div className="relative animate-reveal-up">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                            <svg className="w-5 h-5 text-black" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
                            </svg>
                        </div>
                        <span className="text-sm font-bold tracking-[-0.05em] text-white uppercase tracking-[0.2em]">Portfolio Engine <span className="opacity-20 ml-2 font-light italic text-[10px]">v2.0</span></span>
                    </div>
                </div>

                {/* Center copy */}
                <div className="relative max-w-sm space-y-10">
                    <div className="space-y-6">
                        <div className="w-12 h-px bg-white/20 animate-line-draw animate-delay-200" />
                        <h1 className="font-display text-5xl xl:text-6xl font-medium text-white leading-[0.9] tracking-tighter animate-reveal-up animate-delay-300">
                            Your story, <br />
                            <span className="opacity-30 italic">reimagined.</span>
                        </h1>
                        <p className="text-neutral-500 text-lg leading-relaxed font-light animate-reveal-up animate-delay-500">
                            We transform your raw experience into a high-end editorial narrative using advanced AI synthesis.
                        </p>
                    </div>

                    <div className="space-y-4 pt-4 animate-reveal-up animate-delay-700">
                        {[
                            'Luxury AI Bio Synthesis',
                            'Cloudinary Asset Optimization',
                            'High-End Editorial Layouts',
                        ].map((feat) => (
                            <div key={feat} className="flex items-center gap-4 group">
                                <div className="w-5 h-5 rounded-full border border-white/10 flex items-center justify-center flex-shrink-0 group-hover:border-white/30 transition-colors">
                                    <div className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                </div>
                                <span className="text-[11px] uppercase tracking-widest font-bold text-neutral-500 group-hover:text-neutral-300 transition-colors">{feat}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer copy */}
                <div className="relative animate-reveal-up animate-delay-1000">
                    <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-700">
                        Propelling the next generation of creatives
                    </p>
                </div>
            </div>

            {/* Right Panel — Form */}
            <div className="flex-1 flex flex-col justify-center px-6 py-20 lg:px-16 xl:px-32 overflow-y-auto">
                <div className="max-w-xl w-full mx-auto">
                    {/* Header */}
                    <div className="mb-16 animate-reveal-up">
                        <div className="inline-block px-3 py-1 rounded-full border border-white/5 bg-white/[0.02] text-[9px] uppercase tracking-widest font-bold text-neutral-500 mb-6">
                            Onboarding Portal
                        </div>
                        <h2 className="font-display text-4xl font-medium text-white mb-4 tracking-tight leading-tight">
                            Build Your <br /><span className="italic opacity-40">Digital Legacy</span>
                        </h2>
                        <p className="text-neutral-500 text-base font-light">
                            One single entry point to a published, high-end professional presence.
                        </p>
                    </div>

                    <IntakeForm />
                </div>
            </div>
        </main>
    );
}
