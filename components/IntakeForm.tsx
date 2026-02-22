'use client';

import { useRef, useState, useTransition, DragEvent } from 'react';
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
    const [isPending, startTransition] = useTransition();
    const [formStep, setFormStep] = useState<FormStep>('identity');
    const [subState, setSubState] = useState<SubmissionState>('idle');
    const [subdomain, setSubdomain] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');

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
                className="max-w-md w-full text-center"
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
                <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-3">
                    <p className="text-neutral-700 text-[9px] uppercase tracking-[0.3em] font-bold">Public Endpoint</p>
                    <span className="text-neutral-400 font-mono text-[10px] break-all opacity-60">
                        {typeof window !== 'undefined' ? window.location.origin.replace(/^https?:\/\//, '') : ''}{portfolioUrl}
                    </span>
                </div>
            </motion.div>
        );
    }

    return (
        <div className="w-full">
            {/* Progress Bar */}
            <div className="mb-12 flex items-center gap-4">
                {steps.map((s, i) => (
                    <div key={s} className="flex-1 flex flex-col gap-2">
                        <div className={`h-1 rounded-full transition-all duration-500 ${i <= currentStepIndex ? 'bg-white' : 'bg-white/5'}`} />
                        <span className={`text-[8px] uppercase tracking-widest font-bold transition-opacity duration-500 ${i === currentStepIndex ? 'opacity-100' : 'opacity-20'}`}>
                            {s}
                        </span>
                    </div>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={formStep}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-10"
                >
                    {formStep === 'identity' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="group space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                        <User className="w-3 h-3" /> Full Name
                                    </label>
                                    <input
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        placeholder="Aria Chen"
                                        className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 transition-all rounded-xl py-5 px-6 text-white placeholder-neutral-700 outline-none"
                                    />
                                </div>
                                <div className="group space-y-3">
                                    <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                        <Globe className="w-3 h-3" /> Email
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="aria@studio.com"
                                        className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 transition-all rounded-xl py-5 px-6 text-white placeholder-neutral-700 outline-none"
                                    />
                                </div>
                            </div>
                            <div className="group space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                    <Briefcase className="w-3 h-3" /> Creative Discipline
                                </label>
                                <div className="relative">
                                    <select
                                        value={profession}
                                        onChange={(e) => setProfession(e.target.value)}
                                        className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 transition-all rounded-xl py-5 px-6 text-white appearance-none cursor-pointer outline-none"
                                    >
                                        <option value="" disabled className="bg-black">Select your craft</option>
                                        {PROFESSIONS.map((p) => (
                                            <option key={p} value={p} className="bg-black">{p}</option>
                                        ))}
                                    </select>
                                    <ChevronRight className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 rotate-90 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}

                    {formStep === 'narrative' && (
                        <div className="space-y-8">
                            <div className="group space-y-3">
                                <label className="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                    <span className="flex items-center gap-2 text-white"><PenTool className="w-3 h-3" /> The Raw Bio</span>
                                    <span className="opacity-40 italic lowercase tracking-normal font-normal">Input for AI Polish</span>
                                </label>
                                <textarea
                                    value={rawBio}
                                    onChange={(e) => setRawBio(e.target.value)}
                                    rows={4}
                                    placeholder="Describe your craft, mission, and unique perspective..."
                                    className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 transition-all rounded-xl py-5 px-6 text-white placeholder-neutral-700 outline-none resize-none"
                                />
                            </div>
                            <div className="group space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                    <Sparkles className="w-3 h-3 text-white" /> Creative Philosophy
                                </label>
                                <textarea
                                    value={philosophy}
                                    onChange={(e) => setPhilosophy(e.target.value)}
                                    rows={3}
                                    placeholder="What values drive your creative decisions?"
                                    className="w-full bg-white/[0.02] border border-white/5 focus:border-white/20 transition-all rounded-xl py-5 px-6 text-white placeholder-neutral-700 outline-none resize-none"
                                />
                            </div>
                        </div>
                    )}

                    {formStep === 'visuals' && (
                        <div className="space-y-8">
                            {/* Profile Photo */}
                            <div className="space-y-3">
                                <label className="flex items-center gap-2 text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                    <User className="w-3 h-3" /> Portrait Identity
                                </label>
                                <div
                                    className={`relative border border-dashed rounded-2xl p-8 transition-all duration-500 cursor-pointer flex flex-col items-center justify-center gap-4 ${profileDragging ? 'border-white/40 bg-white/5' : 'border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'}`}
                                    onDragOver={(e) => { e.preventDefault(); setProfileDragging(true); }}
                                    onDragLeave={() => setProfileDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setProfileDragging(false);
                                        const file = e.dataTransfer.files?.[0];
                                        if (file) setProfilePhoto(file);
                                    }}
                                    onClick={() => profileRef.current?.click()}
                                >
                                    {profilePhoto ? (
                                        <div className="flex items-center gap-6 w-full">
                                            <div className="w-16 h-16 rounded-xl bg-white/10 flex items-center justify-center overflow-hidden">
                                                <img src={URL.createObjectURL(profilePhoto)} alt="Preview" className="w-full h-full object-cover grayscale" />
                                            </div>
                                            <div className="flex-1 overflow-hidden">
                                                <p className="text-xs text-white font-medium truncate">{profilePhoto.name}</p>
                                                <p className="text-[9px] text-neutral-600 uppercase tracking-widest mt-1">Ready for curation</p>
                                            </div>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); setProfilePhoto(null); }}
                                                className="p-2 rounded-full hover:bg-white/10 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4 text-neutral-600" />
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <Upload className="w-5 h-5 text-neutral-600" />
                                            </div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-600">Drop Portrait <span className="text-white">or click</span></p>
                                        </>
                                    )}
                                    <input ref={profileRef} type="file" className="hidden" accept="image/*" onChange={(e) => setProfilePhoto(e.target.files?.[0] || null)} />
                                </div>
                            </div>

                            {/* Project Photos */}
                            <div className="space-y-3">
                                <label className="flex items-center justify-between text-[10px] font-bold text-neutral-500 uppercase tracking-widest ml-1">
                                    <span className="flex items-center gap-2"><ImageIcon className="w-3 h-3" /> Selected Works</span>
                                    <span className="opacity-40">{projectPhotos.length}/5</span>
                                </label>
                                <div
                                    className={`relative border border-dashed rounded-2xl p-8 transition-all duration-500 cursor-pointer ${projectDragging ? 'border-white/40 bg-white/5' : 'border-white/10 bg-white/[0.01] hover:border-white/20 hover:bg-white/[0.02]'} ${projectPhotos.length >= 5 ? 'opacity-40 cursor-not-allowed' : ''}`}
                                    onDragOver={(e) => { e.preventDefault(); setProjectDragging(true); }}
                                    onDragLeave={() => setProjectDragging(false)}
                                    onDrop={(e) => {
                                        e.preventDefault();
                                        setProjectDragging(false);
                                        const files = Array.from(e.dataTransfer.files).slice(0, 5 - projectPhotos.length);
                                        setProjectPhotos(prev => [...prev, ...files]);
                                    }}
                                    onClick={() => projectPhotos.length < 5 && projectRef.current?.click()}
                                >
                                    {projectPhotos.length > 0 ? (
                                        <div className="space-y-3">
                                            {projectPhotos.map((file, i) => (
                                                <div key={i} className="flex items-center gap-4 bg-white/5 p-3 rounded-xl">
                                                    <div className="w-8 h-8 rounded-lg bg-white/10 overflow-hidden">
                                                        <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-full object-cover grayscale" />
                                                    </div>
                                                    <span className="text-[10px] text-neutral-400 flex-1 truncate">{file.name}</span>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setProjectPhotos(prev => prev.filter((_, idx) => idx !== i)); }}
                                                        className="p-1 rounded-full hover:bg-white/10"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5 text-neutral-700" />
                                                    </button>
                                                </div>
                                            ))}
                                            {projectPhotos.length < 5 && (
                                                <p className="text-[9px] text-center text-neutral-600 mt-2 uppercase tracking-widest">Add more works</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center justify-center gap-4">
                                            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                                                <Upload className="w-5 h-5 text-neutral-600" />
                                            </div>
                                            <p className="text-[10px] uppercase tracking-widest font-bold text-neutral-600">Curate Gallery Images</p>
                                        </div>
                                    )}
                                    <input ref={projectRef} type="file" className="hidden" multiple accept="image/*" onChange={(e) => {
                                        const files = Array.from(e.target.files || []).slice(0, 5 - projectPhotos.length);
                                        setProjectPhotos(prev => [...prev, ...files]);
                                    }} />
                                </div>
                            </div>
                        </div>
                    )}

                    {formStep === 'review' && (
                        <div className="space-y-10">
                            <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-10 space-y-8">
                                <div className="space-y-2">
                                    <h3 className="font-display text-3xl text-white font-medium italic">{fullName || 'Principal Name'}</h3>
                                    <p className="text-[10px] uppercase tracking-[0.4em] text-neutral-600 font-bold">{profession || ' Discipline'}</p>
                                </div>
                                <div className="h-px bg-white/5" />
                                <div className="space-y-6">
                                    <div className="space-y-2">
                                        <p className="text-[8px] uppercase tracking-widest font-bold text-neutral-700 font-bold">Contact Channel</p>
                                        <p className="text-xs text-neutral-400 font-light">{email || 'No email provided'}</p>
                                    </div>
                                    <div className="space-y-2">
                                        <p className="text-[8px] uppercase tracking-widest font-bold text-neutral-700 font-bold">The Narrative</p>
                                        <p className="text-xs text-neutral-400 font-light leading-relaxed line-clamp-3 italic opacity-60">"{rawBio || 'No bio provided'}"</p>
                                    </div>
                                </div>
                            </div>

                            {subState === 'error' && errorMsg && (
                                <p className="text-[10px] uppercase tracking-widest font-bold text-red-500/80 text-center">{errorMsg}</p>
                            )}
                        </div>
                    )}
                </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="mt-16 pt-8 border-t border-white/5 flex items-center justify-between gap-6">
                {currentStepIndex > 0 ? (
                    <button
                        onClick={prevStep}
                        disabled={subState !== 'idle' && subState !== 'error'}
                        className="flex items-center gap-3 text-[10px] uppercase tracking-[0.3em] font-bold text-neutral-500 hover:text-white transition-colors disabled:opacity-20"
                    >
                        <ChevronLeft className="w-4 h-4" /> Go Back
                    </button>
                ) : <div />}

                {formStep === 'review' ? (
                    <button
                        onClick={handleSubmit}
                        disabled={subState !== 'idle' && subState !== 'error' || !fullName || !email || !profession}
                        className="btn-premium bg-white text-black py-5 px-10 disabled:opacity-20 flex items-center gap-4"
                    >
                        {subState === 'idle' || subState === 'error' ? (
                            <>
                                <span className="text-xs font-bold uppercase tracking-widest">Publish Legacy</span>
                                <Sparkles className="w-4 h-4" />
                            </>
                        ) : (
                            <>
                                <div className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                                <span className="text-xs font-bold uppercase tracking-widest">
                                    {subState === 'uploading' && 'Syncing Assets...'}
                                    {subState === 'ai' && 'AI Narrative...'}
                                    {subState === 'saving' && 'Deploying...'}
                                </span>
                            </>
                        )}
                    </button>
                ) : (
                    <button
                        onClick={nextStep}
                        className="btn-premium bg-white text-black py-5 px-10 flex items-center gap-4"
                    >
                        <span className="text-xs font-bold uppercase tracking-widest">Continue</span>
                        <ChevronRight className="w-4 h-4" />
                    </button>
                )}
            </div>

            <div className="mt-12 flex justify-center">
                <span className="text-[8px] uppercase tracking-[0.6em] font-bold text-neutral-800">Autonomous Creative Engine v2.0</span>
            </div>
        </div>
    );
}
