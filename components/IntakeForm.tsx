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
    Globe
} from 'lucide-react';
import { submitPortfolio } from '@/app/actions/submit-portfolio';
import { checkSubscriptionStatus } from '@/app/actions/check-subscription';
import { subscribeToNewsletter } from '@/app/actions/subscribe-newsletter';
import { createClient } from '@/lib/supabase/client';
import { Sparkles as SparklesIcon, Zap, LogOut, Settings } from 'lucide-react';
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
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-40">
                                Step {currentStepIndex + 1} / {steps.length}
                            </span>
                            {user && (
                                <div className="h-4 w-[1px] bg-white/10" />
                            )}
                            {user && (
                                <button
                                    onClick={handleSignOut}
                                    className="flex items-center gap-1 text-[8px] uppercase tracking-widest font-bold opacity-20 hover:opacity-100 transition-opacity"
                                >
                                    <LogOut className="w-2 h-2" /> Sign Out
                                </button>
                            )}
                        </div>
                        <div className="flex gap-1">
                            {steps.map((s, i) => (
                                <div
                                    key={s}
                                    className={`h-1 w-8 rounded-full transition-all duration-500 ${i <= currentStepIndex ? 'bg-white' : 'bg-white/10'
                                        }`}
                                />
                            ))}
                        </div>
                    </div>
                    <h1 className="font-display text-4xl lg:text-5xl font-medium tracking-tight">
                        {formStep === 'identity' && 'Tell us your name.'}
                        {formStep === 'narrative' && 'The creative story.'}
                        {formStep === 'visuals' && 'Curation & identity.'}
                        {formStep === 'review' && 'One final check.'}
                    </h1>
                </div>

                <div className="min-h-[440px]">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={formStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {formStep === 'identity' && (
                                <div className="space-y-8">
                                    <div className="group space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 group-focus-within:opacity-100 transition-opacity">Full Name</label>
                                        <div className="relative">
                                            <User className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                                            <input
                                                type="text"
                                                value={fullName}
                                                onChange={(e) => setFullName(e.target.value)}
                                                placeholder="e.g. Alexander McQueen"
                                                className="w-full bg-transparent border-b border-white/10 py-4 pl-10 focus:border-white transition-colors outline-none text-xl font-light placeholder:opacity-20"
                                            />
                                        </div>
                                    </div>

                                    <div className="group space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 group-focus-within:opacity-100 transition-opacity">Email Address</label>
                                        <div className="relative">
                                            <Globe className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                                            <input
                                                type="email"
                                                readOnly
                                                value={email}
                                                placeholder="hello@studio.com"
                                                className="w-full bg-transparent border-b border-white/10 py-4 pl-10 focus:border-white transition-colors outline-none text-xl font-light placeholder:opacity-20 opacity-50 cursor-not-allowed"
                                            />
                                        </div>
                                    </div>

                                    <div className="group space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 group-focus-within:opacity-100 transition-opacity">Profession</label>
                                        <div className="relative">
                                            <Briefcase className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                                            <select
                                                value={profession}
                                                onChange={(e) => setProfession(e.target.value)}
                                                className="w-full bg-transparent border-b border-white/10 py-4 pl-10 focus:border-white transition-colors outline-none text-xl font-light appearance-none cursor-pointer"
                                            >
                                                <option value="" disabled className="bg-black">Select your craft</option>
                                                {PROFESSIONS.map(p => (
                                                    <option key={p} value={p} className="bg-black">{p}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formStep === 'narrative' && (
                                <div className="space-y-8">
                                    <div className="group space-y-3">
                                        <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 group-focus-within:opacity-100 transition-opacity">Raw Bio</label>
                                        <div className="relative">
                                            <PenTool className="absolute left-0 top-4 w-5 h-5 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                                            <textarea
                                                value={rawBio}
                                                onChange={(e) => setRawBio(e.target.value)}
                                                placeholder="Describe your work and vision..."
                                                rows={4}
                                                className="w-full bg-transparent border-b border-white/10 py-4 pl-10 focus:border-white transition-colors outline-none text-xl font-light resize-none placeholder:opacity-20"
                                            />
                                        </div>
                                    </div>

                                    <div className={`group space-y-3 relative transition-all duration-700 ${!isPro ? 'opacity-30 grayscale' : ''}`}>
                                        <div className="flex items-center justify-between pb-1">
                                            <label className="text-[10px] uppercase tracking-widest font-bold opacity-40 group-focus-within:opacity-100 transition-opacity">Creative Philosophy</label>
                                            {!isPro && (
                                                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-full">
                                                    <Zap className="w-3 h-3 text-amber-400" />
                                                    <span className="text-[8px] uppercase tracking-widest font-bold text-neutral-400">Pro Feature</span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <SparklesIcon className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 opacity-20 group-focus-within:opacity-100 transition-opacity" />
                                            <input
                                                type="text"
                                                disabled={!isPro}
                                                value={philosophy}
                                                onChange={(e) => setPhilosophy(e.target.value)}
                                                placeholder={isPro ? "e.g. Less is more." : "Unlock 'The Spirit' with Pro"}
                                                className="w-full bg-transparent border-b border-white/10 py-4 pl-10 focus:border-white transition-colors outline-none text-xl font-light placeholder:opacity-20 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                        {!isPro && (
                                            <div className="mt-4 p-6 border border-white/5 bg-white/[0.02] rounded-2xl flex items-center justify-between gap-6">
                                                <div className="space-y-1">
                                                    <p className="text-[9px] uppercase tracking-widest font-bold text-white">Editorial Suite</p>
                                                    <p className="text-[8px] text-neutral-500 max-w-[200px]">Unlock deep AI narratives, expanded galleries, and studio-grade storytelling.</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => window.open('https://your-store.lemonsqueezy.com/checkout/buy/...', '_blank')}
                                                    className="bg-white text-black text-[9px] font-bold uppercase tracking-widest px-4 py-2 rounded-full hover:scale-105 transition-transform"
                                                >
                                                    Upgrade
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {formStep === 'visuals' && (
                                <div className="space-y-8">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="group space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Portal Identity</label>
                                            <div
                                                onClick={() => profileRef.current?.click()}
                                                onDragOver={(e) => { e.preventDefault(); setProfileDragging(true); }}
                                                onDragLeave={() => setProfileDragging(false)}
                                                onDrop={(e) => { e.preventDefault(); setProfileDragging(false); const f = e.dataTransfer.files[0]; if (f) setProfilePhoto(f); }}
                                                className={`relative aspect-square w-full rounded-sm border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${profilePhoto || profileDragging ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                {profilePhoto ? (
                                                    <img src={URL.createObjectURL(profilePhoto)} className="absolute inset-0 w-full h-full object-cover grayscale opacity-60" alt="Preview" />
                                                ) : (
                                                    <Upload className="w-6 h-6 opacity-20" />
                                                )}
                                                <input ref={profileRef} type="file" className="hidden" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} />
                                            </div>
                                        </div>

                                        <div className="group space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Works Curation ({projectPhotos.length}/{isPro ? 5 : 1})</label>
                                            <div
                                                onClick={() => projectRef.current?.click()}
                                                onDragOver={(e) => { e.preventDefault(); setProjectDragging(true); }}
                                                onDragLeave={() => setProjectDragging(false)}
                                                onDrop={(e) => { e.preventDefault(); setProjectDragging(false); const fs = Array.from(e.dataTransfer.files).slice(0, (isPro ? 5 : 1) - projectPhotos.length); setProjectPhotos(p => [...p, ...fs]); }}
                                                className={`relative aspect-square w-full rounded-sm border border-dashed flex flex-col items-center justify-center cursor-pointer transition-all ${projectDragging ? 'border-white bg-white/5' : 'border-white/10 hover:border-white/30'
                                                    }`}
                                            >
                                                <div className="flex -space-x-2">
                                                    {projectPhotos.map((f, i) => (
                                                        <div key={i} className="w-8 h-8 rounded-full border border-black bg-neutral-800 overflow-hidden">
                                                            <img src={URL.createObjectURL(f)} className="w-full h-full object-cover" alt="p" />
                                                        </div>
                                                    ))}
                                                    {projectPhotos.length === 0 && <ImageIcon className="w-6 h-6 opacity-20" />}
                                                </div>
                                                <input ref={projectRef} type="file" multiple className="hidden" onChange={(e) => setProjectPhotos(p => [...p, ...Array.from(e.target.files || [])].slice(0, isPro ? 5 : 1))} />
                                            </div>
                                            {!isPro && projectPhotos.length >= 1 && (
                                                <p className="text-[8px] uppercase tracking-widest font-bold text-amber-400 mt-2">Free Limit Reached — Upgrade for more</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {formStep === 'review' && (
                                <div className="space-y-8">
                                    <div className="p-8 border border-white/5 bg-white/[0.02] rounded-sm space-y-6">
                                        <div className="flex justify-between items-center">
                                            <span className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-40">Ready for Launch</span>
                                            <Check className="w-4 h-4 text-white" />
                                        </div>
                                        <p className="text-xl font-light text-neutral-400 leading-relaxed italic">
                                            "I am {fullName || '...'}, a {profession || '...'} dedicated to the craft of {rawBio ? 'intentional design' : '...'}."
                                        </p>
                                        <p className="text-xs opacity-60 leading-relaxed">
                                            Your legacy will be crafted with Gemini 3.0 AI and hosted on a unique editorial subdomain.
                                        </p>
                                    </div>

                                    <div
                                        onClick={() => setSubscribeNewsletter(!subscribeNewsletter)}
                                        className="flex items-center gap-3 px-2 cursor-pointer group/nsub"
                                    >
                                        <div className={`w-5 h-5 rounded-md border transition-all flex items-center justify-center ${subscribeNewsletter ? 'bg-white border-white' : 'border-white/10 group-hover/nsub:border-white/30'}`}>
                                            {subscribeNewsletter && <Check className="w-3 h-3 text-black" />}
                                        </div>
                                        <span className="text-[10px] uppercase tracking-widest font-bold opacity-30 group-hover/nsub:opacity-100 transition-opacity">Stay in the loop with the Curator Collective</span>
                                    </div>

                                    {subState === 'error' && errorMsg && (
                                        <p className="text-xs text-red-500 font-mono">{errorMsg}</p>
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
