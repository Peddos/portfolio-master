'use client';

import { createClient } from '@/lib/supabase/client';
import { motion } from 'framer-motion';
import { Chrome } from 'lucide-react';

export default function LoginPage() {
    const supabase = createClient();

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#050505] flex items-center justify-center p-6 relative overflow-hidden">
            {/* Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] grain-overlay" />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full bg-white/[0.02] border border-white/5 rounded-3xl p-12 text-center relative z-10"
            >
                <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-8">
                    <Chrome className="w-6 h-6 text-white" />
                </div>

                <h1 className="font-display text-4xl font-medium tracking-tight mb-4">
                    Welcome <span className="italic opacity-60">Home.</span>
                </h1>
                <p className="text-neutral-500 mb-12 leading-relaxed font-light">
                    Join the elite creative collective. Sign in to curate your editorial legacy.
                </p>

                <button
                    onClick={handleGoogleLogin}
                    className="w-full btn-premium bg-white text-black py-5 flex items-center justify-center gap-4 group"
                >
                    <Chrome className="w-5 h-5 transition-transform group-hover:scale-110" />
                    <span className="text-xs font-bold uppercase tracking-widest">Sign in with Google</span>
                </button>

                <div className="mt-12 flex justify-center">
                    <span className="text-[8px] uppercase tracking-[0.6em] font-bold text-neutral-800">Autonomous Creative Engine</span>
                </div>
            </motion.div>
        </div>
    );
}
