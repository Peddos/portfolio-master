import { createClient } from '@/lib/supabase/client';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Send, Check } from 'lucide-react';
import { useState } from 'react';
import { subscribeToNewsletter } from '@/app/actions/subscribe-newsletter';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [subscribe, setSubscribe] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [isSent, setIsSent] = useState(false);
    const [message, setMessage] = useState('');
    const supabase = createClient();

    const handleEmailLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: `${window.location.origin}/auth/callback`,
            },
        });

        setIsLoading(false);
        if (error) {
            setMessage(error.message);
        } else {
            if (subscribe) {
                await subscribeToNewsletter(email);
            }
            setIsSent(true);
        }
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
                    <Sparkles className="w-6 h-6 text-white" />
                </div>

                <h1 className="font-display text-4xl font-medium tracking-tight mb-4">
                    The <span className="italic opacity-60">Identity.</span>
                </h1>

                <AnimatePresence mode="wait">
                    {!isSent ? (
                        <motion.div
                            key="login-form"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <p className="text-neutral-500 mb-12 leading-relaxed font-light">
                                Authenticate your creative essence. We'll send a magic link to your inbox.
                            </p>

                            <form onSubmit={handleEmailLogin} className="space-y-4">
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full bg-white/[0.03] border border-white/5 rounded-xl py-4 pl-12 pr-4 focus:border-white/20 transition-colors outline-none text-sm font-light placeholder:opacity-20"
                                    />
                                </div>

                                <div
                                    onClick={() => setSubscribe(!subscribe)}
                                    className="flex items-center gap-3 px-2 cursor-pointer group/sub"
                                >
                                    <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${subscribe ? 'bg-white border-white' : 'border-white/10 group-hover/sub:border-white/30'}`}>
                                        {subscribe && <Check className="w-3 h-3 text-black" />}
                                    </div>
                                    <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 group-hover/sub:opacity-100 transition-opacity">Join the Curator Collective Newsletter</span>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full btn-premium bg-white text-black py-4 flex items-center justify-center gap-3 group disabled:opacity-50"
                                >
                                    {isLoading ? (
                                        <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
                                            <span className="text-xs font-bold uppercase tracking-widest">Send Magic Link</span>
                                        </>
                                    )}
                                </button>
                                {message && <p className="text-red-500 text-[10px] uppercase tracking-widest font-bold mt-4">{message}</p>}
                            </form>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="sent-message"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="space-y-6"
                        >
                            <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto">
                                <Send className="w-5 h-5 text-emerald-500" />
                            </div>
                            <p className="text-neutral-400 leading-relaxed font-light">
                                A portal has been opened in your inbox. Check <span className="text-white font-medium">{email}</span> to enter.
                            </p>
                            <button
                                onClick={() => setIsSent(false)}
                                className="text-[10px] uppercase tracking-widest font-bold opacity-30 hover:opacity-100 transition-opacity"
                            >
                                Use a different email
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mt-12 flex justify-center">
                    <span className="text-[8px] uppercase tracking-[0.6em] font-bold text-neutral-800">Autonomous Creative Engine</span>
                </div>
            </motion.div>
        </div>
    );
}
