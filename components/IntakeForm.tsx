'use client';

import { useRef, useState, useTransition, DragEvent } from 'react';
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

type Step = 'idle' | 'uploading' | 'ai' | 'saving' | 'done' | 'error';

const STEP_LABELS: Record<Step, string> = {
    idle: 'Generate My Portfolio →',
    uploading: 'Uploading images...',
    ai: 'Polishing your story with AI...',
    saving: 'Publishing your portfolio...',
    done: 'Portfolio live!',
    error: 'Something went wrong',
};

export default function IntakeForm() {
    const [isPending, startTransition] = useTransition();
    const [step, setStep] = useState<Step>('idle');
    const [subdomain, setSubdomain] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string>('');

    // Profile photo
    const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
    const [profilePreview, setProfilePreview] = useState<string | null>(null);
    const [profileDragging, setProfileDragging] = useState(false);
    const profileRef = useRef<HTMLInputElement>(null);

    // Project photos
    const [projectPhotos, setProjectPhotos] = useState<File[]>([]);
    const [projectPreviews, setProjectPreviews] = useState<string[]>([]);
    const [projectDragging, setProjectDragging] = useState(false);
    const projectRef = useRef<HTMLInputElement>(null);

    function handleProfileChange(files: FileList | null) {
        if (!files || files.length === 0) return;
        const file = files[0];
        setProfilePhoto(file);
    }

    function handleProjectChange(files: FileList | null) {
        if (!files) return;
        const newFiles = Array.from(files).slice(0, 5 - projectPhotos.length);
        const combined = [...projectPhotos, ...newFiles].slice(0, 5);
        setProjectPhotos(combined);
    }

    function removeProject(index: number) {
        const updated = projectPhotos.filter((_, i) => i !== index);
        setProjectPhotos(updated);
    }

    function handleProfileDrop(e: DragEvent) {
        e.preventDefault();
        setProfileDragging(false);
        handleProfileChange(e.dataTransfer.files);
    }

    function handleProjectDrop(e: DragEvent) {
        e.preventDefault();
        setProjectDragging(false);
        handleProjectChange(e.dataTransfer.files);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const form = e.currentTarget;
        const formData = new FormData(form);

        if (profilePhoto) formData.set('profile_photo', profilePhoto);
        projectPhotos.forEach((f) => formData.append('project_photos', f));

        setStep('uploading');
        setErrorMsg('');

        startTransition(async () => {
            // Simulate step progression for UX
            setTimeout(() => setStep('ai'), 1500);
            setTimeout(() => setStep('saving'), 4000);

            const result = await submitPortfolio(formData);

            if (result.success) {
                setSubdomain(result.subdomain);
                setStep('done');
            } else {
                setStep('error');
                setErrorMsg(result.error);
            }
        });
    }

    if (step === 'done' && subdomain) {
        const portfolioUrl = `/portfolio/${subdomain}`;
        return (
            <div className="min-h-screen flex items-center justify-center px-6">
                <div className="max-w-md w-full text-center animate-reveal-up">
                    {/* Success icon */}
                    <div className="w-24 h-24 rounded-full bg-emerald-500/5 border border-emerald-500/10 flex items-center justify-center mx-auto mb-10 relative">
                        <div className="absolute inset-0 rounded-full blur-2xl bg-emerald-500/10 animate-pulse" />
                        <svg className="w-10 h-10 text-emerald-400 relative z-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                        </svg>
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
                    <div className="mt-8 flex flex-col gap-2">
                        <p className="text-neutral-700 text-[10px] uppercase tracking-widest">Permanent Link</p>
                        <span className="text-neutral-400 font-mono text-xs">{typeof window !== 'undefined' ? window.location.origin.replace(/^https?:\/\//, '') : ''}{portfolioUrl}</span>
                    </div>
                </div>
            </div>
        );
    }

    const isLoading = step !== 'idle' && step !== 'error';

    return (
        <form onSubmit={handleSubmit} className="w-full space-y-10">

            {/* Name + Email row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-reveal-up animate-delay-100">
                <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">
                        Principal Name
                    </label>
                    <input
                        name="full_name"
                        required
                        placeholder="Aria Chen"
                        className="input-field bg-white/[0.02] border-white/5 focus:border-white/20 transition-all rounded-xl py-4"
                        disabled={isLoading}
                    />
                </div>
                <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">
                        Direct Email
                    </label>
                    <input
                        name="email"
                        type="email"
                        required
                        placeholder="aria@studio.com"
                        className="input-field bg-white/[0.02] border-white/5 focus:border-white/20 transition-all rounded-xl py-4"
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Profession */}
            <div className="animate-reveal-up animate-delay-200 space-y-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">
                    Creative Domain
                </label>
                <div className="relative">
                    <select
                        name="profession"
                        required
                        className="input-field bg-white/[0.02] border-white/5 focus:border-white/20 transition-all rounded-xl py-4 appearance-none cursor-pointer"
                        defaultValue=""
                        disabled={isLoading}
                    >
                        <option value="" disabled>Define your discipline</option>
                        {PROFESSIONS.map((p) => (
                            <option key={p} value={p} className="bg-neutral-900">{p}</option>
                        ))}
                    </select>
                    <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
            </div>

            {/* Raw Bio */}
            <div className="animate-reveal-up animate-delay-300 space-y-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1 flex justify-between">
                    <span>Core Narrative</span>
                    <span className="text-[9px] font-medium opacity-40 lowercase tracking-normal italic">(Input for AI Polish)</span>
                </label>
                <textarea
                    name="raw_bio"
                    required
                    rows={4}
                    placeholder="Briefly describe your craft, your mission, and your unique perspective..."
                    className="input-field bg-white/[0.02] border-white/5 focus:border-white/20 transition-all rounded-xl py-4 resize-none"
                    disabled={isLoading}
                />
            </div>

            {/* Profile Photo */}
            <div className="animate-reveal-up animate-delay-300 space-y-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1">
                    Visual Identity (Portrait)
                </label>
                <div
                    className={`drop-zone border-white/5 bg-white/[0.01] hover:bg-white/[0.03] rounded-2xl p-10 transition-all ${profileDragging ? 'border-white/30 bg-white/[0.05]' : ''}`}
                    onClick={() => profileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setProfileDragging(true); }}
                    onDragLeave={() => setProfileDragging(false)}
                    onDrop={handleProfileDrop}
                >
                    {profilePhoto ? (
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                </svg>
                            </div>
                            <div className="text-left flex-1 overflow-hidden">
                                <p className="text-sm text-white font-medium truncate">{profilePhoto.name}</p>
                                <p className="text-[9px] text-neutral-500 uppercase tracking-widest font-bold">Image Locked</p>
                            </div>
                            <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); setProfilePhoto(null); }}
                                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                            >
                                <svg className="w-4 h-4 text-neutral-500 hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                                <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                                </svg>
                            </div>
                            <p className="text-[11px] text-neutral-500 font-medium uppercase tracking-[0.1em]">Upload <span className="text-white">Profile Portrait</span> (Optional)</p>
                        </div>
                    )}
                    <input
                        ref={profileRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleProfileChange(e.target.files)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Project Photos */}
            <div className="animate-reveal-up animate-delay-400 space-y-2">
                <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] ml-1 flex justify-between">
                    <span>Curated Gallery</span>
                    <span className="opacity-40">{projectPhotos.length}/5</span>
                </label>
                <div
                    className={`drop-zone border-white/5 bg-white/[0.01] hover:bg-white/[0.03] rounded-2xl p-10 transition-all ${projectDragging ? 'border-white/30 bg-white/[0.05]' : ''} ${projectPhotos.length >= 5 ? 'opacity-50 pointer-events-none' : ''}`}
                    onClick={() => projectRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setProjectDragging(true); }}
                    onDragLeave={() => setProjectDragging(false)}
                    onDrop={handleProjectDrop}
                >
                    {projectPhotos.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                            {projectPhotos.map((file, i) => (
                                <div key={i} className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl p-3 glass">
                                    <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5 text-neutral-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                    </div>
                                    <span className="text-[11px] text-neutral-400 truncate flex-1 text-left font-medium">{file.name}</span>
                                    <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); removeProject(i); }}
                                        className="w-6 h-6 flex items-center justify-center hover:bg-red-500/10 rounded-full transition-colors"
                                    >
                                        <svg className="w-3.5 h-3.5 text-neutral-700 hover:text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {projectPhotos.length < 5 && (
                                <p className="text-[10px] text-neutral-600 mt-4 uppercase tracking-widest font-bold">Click to add more</p>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center mx-auto transition-transform group-hover:scale-110">
                                <svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                            </div>
                            <p className="text-[11px] text-neutral-500 font-medium uppercase tracking-[0.1em]">Upload <span className="text-white">Portfolio Works</span> (Max 5)</p>
                        </div>
                    )}
                    <input
                        ref={projectRef}
                        type="file"
                        accept="image/*"
                        multiple
                        className="hidden"
                        onChange={(e) => handleProjectChange(e.target.files)}
                        disabled={isLoading}
                    />
                </div>
            </div>

            {/* Error */}
            {step === 'error' && errorMsg && (
                <div className="px-6 py-4 rounded-xl bg-red-500/5 border border-red-500/10 text-[11px] font-bold uppercase tracking-widest text-red-500 animate-reveal-in">
                    {errorMsg}
                </div>
            )}

            {/* Submit */}
            <div className="animate-reveal-up animate-delay-500 pt-6">
                <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full btn-premium bg-white text-black py-5 disabled:opacity-40 disabled:cursor-not-allowed group"
                >
                    {isLoading ? (
                        <span className="flex items-center justify-center gap-4">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            <span className="text-sm font-bold tracking-tight uppercase">{STEP_LABELS[step]}</span>
                        </span>
                    ) : (
                        <span className="text-sm font-bold tracking-tight uppercase">{STEP_LABELS[step]}</span>
                    )}
                </button>
                <div className="flex justify-center flex-col items-center gap-2 mt-8 opacity-20 group-hover:opacity-40 transition-opacity">
                    <p className="text-[9px] uppercase tracking-[0.4em] font-bold">Autonomous Design Engine</p>
                    <div className="w-12 h-px bg-white" />
                </div>
            </div>
        </form>
    );
}
