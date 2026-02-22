'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Profile } from '@/lib/supabase';

type Props = { profile: Profile };

const PROFESSION_CONFIG: Record<string, { accent: string; accentHex: string; label: string }> = {
    'Fashion Designer': { accent: 'text-[#D9C5B2]', accentHex: '#D9C5B2', label: 'Fashion Designer' },
    'Developer': { accent: 'text-[#818CF8]', accentHex: '#818CF8', label: 'Systems & Code' },
    'Freelancer': { accent: 'text-[#FDE047]', accentHex: '#FDE047', label: 'Independent' },
    'Photographer': { accent: 'text-[#E07A7A]', accentHex: '#E07A7A', label: 'Visual Storyteller' },
    'Creative Director': { accent: 'text-[#D9C5B2]', accentHex: '#D9C5B2', label: 'Creative Direction' },
    'Architect': { accent: 'text-[#7FB7BE]', accentHex: '#7FB7BE', label: 'Strategic Space' },
    'Other': { accent: 'text-[#2DD4BF]', accentHex: '#2DD4BF', label: 'Creative' },
};

function getConfig(profession: string) {
    return PROFESSION_CONFIG[profession] || PROFESSION_CONFIG['Other'];
}

export default function PortfolioPage({ profile }: Props) {
    const config = getConfig(profile.profession);
    const firstName = profile.full_name.split(' ')[0];
    const lastName = profile.full_name.split(' ').slice(1).join(' ');
    const projects = profile.projects_json || [];

    return (
        <div className="min-h-screen bg-[#050505] text-[#ECECEC] font-sans selection:bg-white selection:text-black overflow-x-hidden">

            {/* ── HEADER/NAV ── */}
            <nav className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-8 py-8 lg:px-16 pointer-events-none">
                <div className="text-sm font-semibold tracking-tighter pointer-events-auto">
                    <Link href="/" className="hover:opacity-60 transition-opacity">© {new Date().getFullYear()}</Link>
                </div>
                <div className="flex gap-12 text-[11px] uppercase tracking-[0.2em] font-medium pointer-events-auto hidden sm:flex">
                    <a href="#work" className="hover:opacity-40 transition-opacity">Work</a>
                    <a href={`mailto:${profile.email}`} className="hover:opacity-40 transition-opacity">Contact</a>
                </div>
            </nav>

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex items-center justify-center px-8 lg:px-16 xl:px-24 overflow-hidden">
                <div className="grid lg:grid-cols-12 w-full max-w-[1800px] gap-12 lg:gap-24 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-7 flex flex-col items-start relative z-10 pt-12 lg:pt-0">
                        <div className="mb-12 overflow-hidden">
                            <span
                                className="inline-block text-[10px] uppercase tracking-[0.4em] font-bold animate-reveal-up"
                                style={{ color: config.accentHex }}
                            >
                                {config.label}
                            </span>
                        </div>

                        <h1 className="font-display text-7xl sm:text-8xl xl:text-9xl leading-[0.85] font-medium mb-12 flex flex-col text-white tracking-tighter">
                            <span className="animate-reveal-up animate-delay-100">{firstName}</span>
                            {lastName && (
                                <span className="animate-reveal-up animate-delay-200 opacity-60 ml-12 lg:ml-24 italic pr-4">
                                    {lastName}
                                </span>
                            )}
                        </h1>

                        <div className="max-w-md animate-reveal-up animate-delay-300">
                            <p className="text-lg lg:text-xl text-neutral-400 leading-relaxed font-light mb-12 text-balance">
                                {profile.bio || profile.raw_bio}
                            </p>

                            <div className="flex flex-wrap items-center gap-8">
                                <a
                                    href={`mailto:${profile.email}`}
                                    className="btn-premium group"
                                    style={{ background: config.accentHex, color: '#000' }}
                                >
                                    <span className="relative z-10 text-sm font-bold tracking-tight uppercase">Let's build together</span>
                                </a>
                                <div
                                    className="h-px w-24 animate-line-draw animate-delay-700 hidden sm:block"
                                    style={{ background: config.accentHex }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Image */}
                    <div className="lg:col-span-5 relative group order-first lg:order-last">
                        <div className="aspect-[4/5] lg:aspect-[3/4] overflow-hidden rounded-2xl relative animate-reveal-in">
                            {profile.profile_img ? (
                                <img
                                    src={profile.profile_img}
                                    alt={profile.full_name}
                                    className="absolute inset-0 w-full h-full object-cover grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000 ease-out"
                                />
                            ) : (
                                <div className="absolute inset-0 bg-neutral-900 flex items-center justify-center">
                                    <span className="text-8xl font-display opacity-10">{firstName[0]}</span>
                                </div>
                            )}
                            {/* Accent highlight */}
                            <div
                                className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full blur-[80px] opacity-20"
                                style={{ background: config.accentHex }}
                            />
                        </div>
                    </div>
                </div>

                {/* Vertical Text */}
                <div className="absolute right-8 bottom-32 hidden xl:block animate-reveal-up animate-delay-500">
                    <span className="text-[10px] uppercase tracking-[0.5em] font-medium text-neutral-600 [writing-mode:vertical-rl]">
                        Based in {profile.profession === 'Other' ? 'Creative Space' : 'The Creative Edge'}
                    </span>
                </div>
            </section>

            {/* ── PROJECT GALLERY ── */}
            {projects.length > 0 && (
                <section id="work" className="px-8 py-32 lg:px-16 xl:px-24 bg-[#080808]">
                    <div className="max-w-[1800px] mx-auto">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 mb-24">
                            <div>
                                <h2 className="font-display text-5xl lg:text-7xl font-medium tracking-tight mb-4">Selected <span className="opacity-40 italic">Works</span></h2>
                                <p className="text-neutral-500 max-w-sm">A collection of visions brought to life through dedicated craft and strategic thinking.</p>
                            </div>
                            <div className="hidden sm:block">
                                <span className="text-[10px] uppercase tracking-[0.3em] font-bold opacity-30">Archive {projects.length.toString().padStart(2, '0')}</span>
                            </div>
                        </div>

                        {/* Staggered Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
                            {projects.map((project, i) => (
                                <div
                                    key={i}
                                    className={`project-card group rounded-2xl animate-reveal-up ${i % 3 === 0 ? 'lg:translate-y-12' :
                                            i % 3 === 2 ? 'lg:-translate-y-12' : ''
                                        }`}
                                    style={{ animationDelay: `${i * 0.15}s` }}
                                >
                                    <div className="aspect-[3/4] overflow-hidden rounded-2xl">
                                        <img
                                            src={project.img_url}
                                            alt={project.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.5s] ease-out"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500 flex justify-between items-end">
                                            <div>
                                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-0 group-hover:opacity-60 transition-opacity duration-500 delay-100" style={{ color: config.accentHex }}>
                                                    Project {i + 1}
                                                </span>
                                                <h3 className="project-card-title mt-2 group-hover:opacity-100">{project.title}</h3>
                                            </div>
                                            <div className="w-10 h-10 rounded-full glass flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                                                <svg className="w-4 h-4 rotate-[-45deg]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── ABOUT SECTION (Expanded) ── */}
            <section className="px-8 py-48 lg:px-16 flex flex-col items-center justify-center bg-black border-y border-white/[0.03]">
                <div className="max-w-4xl w-full">
                    <div className="flex items-center gap-6 mb-16 opacity-30">
                        <div className="flex-1 h-px bg-white" />
                        <span className="text-[10px] uppercase tracking-[0.5em] font-bold">The Philosophy</span>
                        <div className="flex-1 h-px bg-white" />
                    </div>
                    <blockquote className="font-display text-4xl lg:text-5xl xl:text-6xl text-center leading-[1.1] mb-16 px-4">
                        "Good design is not just what it looks like and feels like. <br className="hidden lg:block" />
                        <span className="italic opacity-50 underline decoration-1 underline-offset-8">Design is how it works.</span>"
                    </blockquote>
                    <div className="flex justify-center flex-wrap gap-4">
                        {['Strategic', 'Avant-Garde', 'Minimalist', 'Impactful'].map((tag) => (
                            <span
                                key={tag}
                                className="px-5 py-2 rounded-full border border-white/10 text-[10px] uppercase tracking-widest font-medium"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer className="px-8 py-24 lg:px-16 xl:px-24">
                <div className="max-w-[1800px] mx-auto grid md:grid-cols-2 gap-24 items-end">
                    <div>
                        <h2 className="font-display text-5xl lg:text-7xl font-medium tracking-tight mb-12">
                            Ready to start <br />
                            <span className="opacity-40 italic">something new?</span>
                        </h2>
                        <a
                            href={`mailto:${profile.email}`}
                            className="text-2xl lg:text-3xl font-light hover:opacity-50 transition-opacity underline underline-offset-[12px] decoration-1"
                            style={{ textDecorationColor: `${config.accentHex}40` }}
                        >
                            {profile.email}
                        </a>
                    </div>

                    <div className="flex flex-col items-start md:items-end gap-12">
                        <div className="flex gap-12 text-[11px] uppercase tracking-[0.2em] font-medium">
                            <a href="#" className="hover:opacity-40 transition-opacity">Instagram</a>
                            <a href="#" className="hover:opacity-40 transition-opacity">LinkedIn</a>
                            <a href="#" className="hover:opacity-40 transition-opacity">Dribbble</a>
                        </div>

                        <div className="text-right">
                            <p className="text-[11px] uppercase tracking-widest opacity-30 mb-2">Designed with</p>
                            <p className="text-sm font-semibold tracking-tighter">Portfolio Engine v2.0</p>
                        </div>
                    </div>
                </div>

                <div className="max-w-[1800px] mx-auto mt-24 pt-12 border-t border-white/[0.05] flex flex-col sm:flex-row justify-between gap-6 opacity-30 text-[10px] uppercase tracking-[0.2em]">
                    <span>© {profile.full_name} {new Date().getFullYear()}</span>
                    <Link href="/intake" className="hover:opacity-100 transition-opacity">Built your legacy →</Link>
                </div>
            </footer>
        </div>
    );
}
