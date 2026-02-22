'use client';

import { useEffect, useState } from 'react';
import { getProfiles, deleteProfile } from '@/app/actions/admin-actions';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Trash2,
    ExternalLink,
    ShieldCheck,
    Users,
    CreditCard,
    ArrowLeft
} from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
    const [profiles, setProfiles] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        loadProfiles();
    }, []);

    const loadProfiles = async () => {
        const data = await getProfiles();
        setProfiles(data);
        setIsLoading(false);
    };

    const handleDelete = async (id: string, name: string) => {
        if (!confirm(`Are you sure you want to delete ${name}'s legacy? This action is permanent.`)) return;

        const res = await deleteProfile(id);
        if (res.success) {
            setProfiles(profiles.filter(p => p.id !== id));
        } else {
            alert('Deletion failed: ' + res.error);
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#050505] flex items-center justify-center">
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] p-8 lg:p-16 relative overflow-hidden">
            {/* Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] grain-overlay" />

            <div className="max-w-7xl mx-auto relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                    <div className="space-y-4">
                        <Link href="/intake" className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest font-bold opacity-40 hover:opacity-100 transition-opacity">
                            <ArrowLeft className="w-3 h-3" /> Dashboard
                        </Link>
                        <h1 className="font-display text-5xl lg:text-6xl font-medium tracking-tight">
                            Platform <span className="italic opacity-60">Control.</span>
                        </h1>
                        <div className="flex items-center gap-6 pt-2">
                            <div className="flex items-center gap-2">
                                <Users className="w-3 h-3 opacity-30" />
                                <span className="text-[10px] uppercase tracking-widest font-bold opacity-40">{profiles.length} Curators</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                                <span className="text-[10px] uppercase tracking-widest font-bold text-emerald-500/60">Admin Security Active</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <AnimatePresence>
                        {profiles.map((profile, i) => (
                            <motion.div
                                key={profile.id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white/[0.02] border border-white/5 rounded-2xl p-6 lg:p-8 flex items-center justify-between gap-8 hover:bg-white/[0.04] hover:border-white/10 transition-all duration-500"
                            >
                                <div className="flex items-center gap-6">
                                    <div className="w-16 h-16 rounded-full overflow-hidden bg-neutral-900 border border-white/5 grayscale">
                                        {profile.profile_img ? (
                                            <img src={profile.profile_img} className="w-full h-full object-cover" alt={profile.full_name} />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Users className="w-6 h-6 opacity-20" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-display text-xl">{profile.full_name}</h3>
                                        <div className="flex items-center gap-3">
                                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-30">{profile.profession}</p>
                                            <span className="w-1 h-1 rounded-full bg-white/10" />
                                            <p className="text-[10px] font-mono opacity-20 lowercase">{profile.subdomain}.artfledge.co</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="hidden md:block text-right space-y-1">
                                        <div className="flex items-center justify-end gap-2">
                                            <CreditCard className={`w-3 h-3 ${profile.subscription_status === 'pro' ? 'text-amber-400' : 'opacity-20'}`} />
                                            <span className={`text-[9px] uppercase tracking-widest font-bold ${profile.subscription_status === 'pro' ? 'text-amber-400' : 'opacity-30'}`}>
                                                {profile.subscription_status || 'free'}
                                            </span>
                                        </div>
                                        <p className="text-[8px] opacity-10 uppercase tracking-widest uppercase">Since {new Date(profile.created_at).toLocaleDateString()}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <a
                                            href={`/portfolio/${profile.subdomain}`}
                                            target="_blank"
                                            className="p-3 rounded-full hover:bg-white/5 transition-colors group/link"
                                        >
                                            <ExternalLink className="w-4 h-4 opacity-20 group-hover/link:opacity-100 transition-opacity" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(profile.id, profile.full_name)}
                                            className="p-3 rounded-full hover:bg-red-500/10 transition-colors group/del"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500 opacity-20 group-hover/del:opacity-100 transition-opacity" />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {profiles.length === 0 && (
                        <div className="py-24 text-center space-y-4">
                            <p className="font-display text-2xl italic opacity-20">The collective is empty.</p>
                            <p className="text-[10px] uppercase tracking-widest font-bold opacity-10">Waiting for first curator...</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
