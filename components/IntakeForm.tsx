'use client';

import { useRef, useState, useTransition } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User,
    Briefcase,
    PenTool,
    Image as ImageIcon,
    Upload,
    Check,
    ChevronRight,
    ChevronLeft,
    Sparkles,
    Trash2,
    Globe,
    LogOut,
    Zap,
    Settings
} from 'lucide-react';
import { submitPortfolio } from '@/app/actions/submit-portfolio';
import { checkSubscriptionStatus } from '@/app/actions/check-subscription';
import { subscribeToNewsletter } from '@/app/actions/subscribe-newsletter';
import { createClient } from '@/lib/supabase/client';
import { useEffect } from 'react';

const PROFESSIONS = [
    'Fashion Designer',
    'Developer',
    'Freelancer',
    'Photographer',
    'Creative Director',
    'Architect',
    'Other',
];

type FormStep = 'identity' | 'narrative' | 'visuals' | 'review';
type SubmissionState = 'idle' | 'uploading' | 'ai' | 'saving' | 'done' | 'error';

export default function IntakeForm() {
    const [, startTransition] = useTransition();
    const [formStep, setFormStep] = useState<FormStep>('identity');
    const [subState, setSubState] = useState<SubmissionState>('idle');
    const [subdomain, setSubdomain] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const [isPro, setIsPro] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [subscribeNewsletter, setSubscribeNewsletter] = useState(true);

    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                setUser(authUser);
                setEmail(authUser.email || '');
                handleCheckSub(authUser.email || '');
            }
        };
        getUser();
    }, []);

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    // Form Data State
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [profession, setProfession] = useState('');
    const [rawBio, setRawBio] = useState('');
    const [philosophy, setPhilosophy] = useState('');
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [projectPhotos, setProjectPhotos] = useState<File[]>([]);

    const [profileDragging, setProfileDragging] = useState(false);
    const [projectDragging, setProjectDragging] = useState(false);
    const profileRef = useRef<HTMLInputElement>(null);
    const projectRef = useRef<HTMLInputElement>(null);

    const steps: FormStep[] = ['identity', 'narrative', 'visuals', 'review'];
    const currentStepIndex = steps.indexOf(formStep);

    const nextStep = () => {
        if (currentStepIndex < steps.length - 1) {
            setFormStep(steps[currentStepIndex + 1]);
        }
    };

    const prevStep = () => {
        if (currentStepIndex > 0) {
            setFormStep(steps[currentStepIndex - 1]);
        }
    };

    const handleCheckSub = async (val: string) => {
        setEmail(val);
        if (val.includes('@') && val.includes('.')) {
            const { isPro: subStatus } = await checkSubscriptionStatus(val);
            setIsPro(subStatus);
        }
    };

    async function handleSubmit() {
        const formData = new FormData();
        formData.append('full_name', fullName);
        formData.append('email', email);
        formData.append('profession', profession);
        formData.append('raw_bio', rawBio);
        formData.append('philosophy', philosophy);
        if (profilePhoto) formData.set('profile_photo', profilePhoto);
        projectPhotos.forEach((f) => formData.append('project_photos', f));

        setSubState('uploading');
        setErrorMsg('');

        startTransition(async () => {
            setTimeout(() => setSubState('ai'), 1500);
            setTimeout(() => setSubState('saving'), 4000);

            const result = await submitPortfolio(formData);

            if (result.success) {
                if (subscribeNewsletter && email) {
                    await subscribeToNewsletter(email);
                }
                setSubdomain(result.subdomain);
                setSubState('done');
            } else {
                setSubState('error');
                setErrorMsg(result.error);
            }
        });
    }

    if (subState === 'done' && subdomain) {
        const portfolioUrl = `/portfolio/${subdomain}`;
        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-md w-full text-center mx-auto"
            >
                <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-10 relative">
                    <div className="absolute inset-0 rounded-full blur-2xl bg-white/5 animate-pulse" />
                    <Check className="w-10 h-10 text-white relative z-10" />
                </div>
                <h2 className="font-display text-4xl font-medium text-white mb-4 tracking-tight">
                    Your legacy is <span className="italic opacity-60">published.</span>
                </h2>
                <p className="text-neutral-500 mb-12 leading-relaxed font-light">
                    Our AI has woven your experience into a premium editorial narrative. Your professional story is now live.
                </p>
                <a
                    href={portfolioUrl}
                    className="btn-premium bg-white text-black w-full"
                >
                    <span className="text-sm font-bold uppercase tracking-tight">Enter Your Space</span>
                </a>
                {isPro && (
                    <button
                        onClick={() => window.open('https://your-store.lemonsqueezy.com/billing', '_blank')}
                        className="mt-4 flex items-center justify-center gap-2 w-full text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity"
                    >
                        <Settings className="w-3 h-3" /> Manage Subscription
                    </button>
                )}
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-3">
                    <p className="text-neutral-700 text-[9px] uppercase tracking-[0.3em] font-bold">Public Endpoint</p>
                    <span className="text-neutral-400 font-mono text-[10px] break-all opacity-60">
                        {typeof window !== 'undefined' ? window.location.origin.replace(/^https?:\/\//, '') : ''}{portfolioUrl}
                    </span>
                </div>
            </motion.div>
        );
    }

    const isLoading = subState !== 'idle' && subState !== 'error';

    return (
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-12 items-start px-4">
            {/* ── FORM SIDE ── */}
            <div className="space-y-12">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">
                                Phase {currentStepIndex + 1} <span className="mx-2 opacity-20">/</span> {steps.length}
                            </span>
                            {user && (
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-2 text-[8px] uppercase tracking-widest font-bold opacity-20 hover:opacity-100 transition-opacity"
                                >
                                    <LogOut className="w-2.5 h-2.5" /> Sign Out
                                </button>
                            )}
                        </div>
                        <div className="flex gap-1.5">
                            {steps.map((s, i) => (
                                <div
                                    key={s}
                                    className={`h-1 rounded-full transition-all duration-700 ${i <= currentStepIndex ? 'w-8 bg-white shadow-[0_0_10px_rgba(255,255,255,0.3)]' : 'w-4 bg-white/5'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/[0.05] to-transparent" />
                    <h1 className="font-display text-4xl lg:text-5xl font-medium tracking-tight h-[1.2em]">
                        {formStep === 'identity' && 'The Curator ID.'}
                        {formStep === 'narrative' && 'The Narrative Essence.'}
                        {formStep === 'visuals' && 'The Curation Strategy.'}
                        {formStep === 'review' && 'Final Intent.'}
                    </h1>
                </div>

                <div className="min-h-[500px] relative">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={formStep}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                            className="space-y-10"
                        >
                            {formStep === 'identity' && (
                                <div className="space-y-12 animate-reveal-in">
                                    <div className="group space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 group-focus-within:opacity-100 transition-opacity">Full Name</label>
                                            <User className="w-3 h-3 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                                        </div>
                                        <input
                                            type="text"
                                            value={fullName}
                                            onChange={(e) => setFullName(e.target.value)}
                                            placeholder="e.g. Alexander McQueen"
                                            className="input-premium"
                                        />
                                    </div>

                                    <div className="group space-y-4 opacity-70">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Email Address</label>
                                            <Globe className="w-3 h-3 opacity-20" />
                                        </div>
                                        <input
                                            type="email"
                                            readOnly
                                            value={email}
                                            className="input-premium cursor-not-allowed bg-white/[0.01]"
                                        />
                                    </div>

                                    <div className="group space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 group-focus-within:opacity-100 transition-opacity">Profession</label>
                                            <Briefcase className="w-3 h-3 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                                        </div>
                                        <div className="relative">
                                            <select
                                                value={profession}
                                                onChange={(e) => setProfession(e.target.value)}
                                                className="input-premium appearance-none cursor-pointer pr-12"
                                            >
                                                <option value="" disabled className="bg-black">Select your craft</option>
                                                {PROFESSIONS.map(p => (
                                                    <option key={p} value={p} className="bg-black">{p}</option>
                                                ))}
                                            </select>
                                            <ChevronRight className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20 pointer-events-none rotate-90" />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formStep === 'narrative' && (
                                <div className="space-y-12 animate-reveal-in">
                                    <div className="group space-y-4">
                                        <div className="flex items-center justify-between">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 group-focus-within:opacity-100 transition-opacity">Raw Bio</label>
                                            <PenTool className="w-3 h-3 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                                        </div>
                                        <textarea
                                            value={rawBio}
                                            onChange={(e) => setRawBio(e.target.value)}
                                            placeholder="Describe your work and vision in its rawest form. Our AI will refine the essence."
                                            rows={6}
                                            className="input-premium resize-none py-6"
                                        />
                                    </div>

                                    <div className={`group space-y-4 transition-all duration-700 ${!isPro ? 'opacity-30 grayscale pointer-events-none' : ''}`}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <label className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40 group-focus-within:opacity-100 transition-opacity">Creative Philosophy</label>
                                                {!isPro && (
                                                    <span className="text-[8px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">Pro</span>
                                                )}
                                            </div>
                                            <Sparkles className="w-3 h-3 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                                        </div>
                                        <input
                                            type="text"
                                            disabled={!isPro}
                                            value={philosophy}
                                            onChange={(e) => setPhilosophy(e.target.value)}
                                            placeholder={isPro ? "A singular sentence defining your artistic intent." : "Unlock deep philosophy with Pro"}
                                            className="input-premium"
                                        />
                                    </div>
                                </div>
                            )}

                            {formStep === 'visuals' && (
                                <div className="space-y-12 animate-reveal-in">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="group space-y-4">
                                            <label className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Portal Identity</label>
                                            <div
                                                onClick={() => profileRef.current?.click()}
                                                onDragOver={(e) => { e.preventDefault(); setProfileDragging(true); }}
                                                onDragLeave={() => setProfileDragging(false)}
                                                onDrop={(e) => { e.preventDefault(); setProfileDragging(false); const f = e.dataTransfer.files[0]; if (f) setProfilePhoto(f); }}
                                                className={`relative aspect-square w-full rounded-2xl border border-dashed transition-all duration-500 overflow-hidden group/img ${profilePhoto || profileDragging ? 'border-white bg-white/[0.05]' : 'border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                {profilePhoto ? (
                                                    <>
                                                        <img src={URL.createObjectURL(profilePhoto)} className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 group-hover/img:scale-110 transition-transform duration-1000" alt="Preview" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity">
                                                            <span className="text-[10px] uppercase tracking-widest font-bold">Replace</span>
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="flex flex-col items-center gap-4">
                                                        <Upload className="w-5 h-5 opacity-20 group-hover:opacity-40 transition-opacity" />
                                                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-20">Square Portrait</span>
                                                    </div>
                                                )}
                                                <input ref={profileRef} type="file" className="hidden" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} />
                                            </div>
                                        </div>

                                        <div className="group space-y-4">
                                            <div className="flex items-center justify-between">
                                                <label className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">Works Curation</label>
                                                <span className="text-[10px] opacity-20">{projectPhotos.length}/{isPro ? 5 : 1}</span>
                                            </div>
                                            <div
                                                onClick={() => projectRef.current?.click()}
                                                onDragOver={(e) => { e.preventDefault(); setProjectDragging(true); }}
                                                onDragLeave={() => setProjectDragging(false)}
                                                onDrop={(e) => { e.preventDefault(); setProjectDragging(false); const fs = Array.from(e.dataTransfer.files).slice(0, (isPro ? 5 : 1) - projectPhotos.length); setProjectPhotos(p => [...p, ...fs]); }}
                                                className={`relative aspect-square w-full rounded-2xl border border-dashed transition-all duration-500 flex flex-col items-center justify-center cursor-pointer ${projectDragging ? 'border-white bg-white/[0.05]' : 'border-white/10 hover:border-white/20'
                                                    }`}
                                            >
                                                <div className="flex -space-x-3 mb-4">
                                                    {projectPhotos.map((f, i) => (
                                                        <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-neutral-900 overflow-hidden soft-glow">
                                                            <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="p" />
                                                        </div>
                                                    ))}
                                                    {projectPhotos.length === 0 && <ImageIcon className="w-5 h-5 opacity-20" />}
                                                </div>
                                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-20">Upload Files</span>
                                                <input ref={projectRef} type="file" multiple className="hidden" onChange={(e) => setProjectPhotos(p => [...p, ...Array.from(e.target.files || [])].slice(0, isPro ? 5 : 1))} />
                                            </div>
                                            {!isPro && projectPhotos.length >= 1 && (
                                                <p className="text-[9px] uppercase tracking-widest font-bold text-amber-500/60 text-center">Free Version: 1 Image Limit</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formStep === 'review' && (
                                <div className="space-y-12 animate-reveal-in">
                                    <div className="glass-premium p-10 rounded-3xl space-y-8 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] blur-3xl rounded-full translate-x-12 -translate-y-12" />

                                        <div className="flex justify-between items-center relative z-10">
                                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Final Verification</span>
                                            <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center">
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        </div>

                                        <div className="space-y-6 relative z-10">
                                            <p className="text-2xl font-light text-neutral-300 leading-tight italic">
                                                "I am {fullName || '...'}, a {profession || '...'} dedicated to the craft of {rawBio ? 'honest form' : '...'}."
                                            </p>
                                            <div className="h-px w-12 bg-white/10" />
                                            <p className="text-[11px] text-neutral-500 leading-relaxed max-w-sm">
                                                Your digital legacy will be crafted using high-fidelity AI models and hosted on our premium creative infrastructure.
                                            </p>
                                        </div>
                                    </div>

                                    <div
                                        onClick={() => setSubscribeNewsletter(!subscribeNewsletter)}
                                        className="flex items-center gap-4 px-4 py-4 rounded-2xl border border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group/nsub"
                                    >
                                        <div className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all ${subscribeNewsletter ? 'bg-white border-white' : 'border-white/20 group-hover/nsub:border-white/40'}`}>
                                            {subscribeNewsletter && <Check className="w-3 h-3 text-black" />}
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-40 group-hover/nsub:opacity-100 transition-opacity">Join the Curator Collective Newsletter</span>
                                    </div>

                                    {subState === 'error' && errorMsg && (
                                        <div className="p-4 rounded-xl bg-red-500/5 border border-red-500/10 text-center">
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-red-500/60">{errorMsg}</p>
                                        </div>
                                    )}
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="flex items-center justify-between pt-12 border-t border-white/10">
                    <button
                        onClick={prevStep}
                        disabled={currentStepIndex === 0 || isLoading}
                        className="flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 disabled:opacity-5 transition-opacity"
                    >
                        <ChevronLeft className="w-4 h-4" />
                        Back
                    </button>

                    {currentStepIndex < steps.length - 1 ? (
                        <button
                            onClick={nextStep}
                            className="btn-premium bg-white text-black py-4 px-12 group"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest">Continue</span>
                            <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    ) : (
                        <button
                            onClick={handleSubmit}
                            disabled={isLoading || !fullName || !email}
                            className="btn-premium bg-white text-black py-4 px-12 disabled:opacity-40"
                        >
                            <span className="text-xs font-bold uppercase tracking-widest">
                                {subState === 'idle' ? 'Launch Legacy' : 'Publishing...'}
                            </span>
                        </button>
                    )}
                </div>
            </div>

            {/* ── PREVIEW SIDE ── */}
            <div className="hidden lg:sticky lg:top-24 lg:block">
                <div className="aspect-[3/4] rounded-sm overflow-hidden bg-[#0a0a0a] border border-white/5 relative group p-10 flex flex-col justify-end">
                    <div className="absolute inset-0 bg-neutral-900 opacity-20" />
                    {profilePhoto && (
                        <motion.img
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            src={URL.createObjectURL(profilePhoto)}
                            className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale brightness-50"
                        />
                    )}

                    <div className="relative space-y-6">
                        <div className="h-[1px] w-8 bg-white/20" />
                        <div>
                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">
                                {profession || 'The Artist'}
                            </span>
                            <h2 className="font-display text-4xl leading-[0.9] tracking-tighter mt-4">
                                {fullName.split(' ')[0] || 'First'} <br />
                                <span className="italic opacity-30 font-light">{fullName.split(' ').slice(1).join(' ') || 'Name'}</span>
                            </h2>
                        </div>
                        <p className="text-[10px] text-neutral-500 leading-relaxed italic line-clamp-3">
                            {rawBio ? `"${rawBio.slice(0, 100)}..."` : '"Design is the silent ambassador of your brand."'}
                        </p>
                    </div>

                    <div className="absolute top-10 right-10">
                        <div className="w-2 h-2 rounded-full bg-white opacity-20" />
                    </div>

                    <div className="absolute inset-0 border border-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-[8px] uppercase tracking-widest font-bold opacity-10">Draft Preview</div>
                </div>

                <p className="mt-4 text-[9px] uppercase tracking-[0.4em] font-bold text-center opacity-20">Real-time Vision</p>
            </div>
        </div>
    );
}
