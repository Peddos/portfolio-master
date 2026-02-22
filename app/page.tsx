import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/[0.05]">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 rounded-md bg-white flex items-center justify-center">
            <svg className="w-3.5 h-3.5 text-black" fill="currentColor" viewBox="0 0 24 24">
              <path d="M13 3L4 14h7l-2 7 9-11h-7l2-7z" />
            </svg>
          </div>
          <span className="font-medium text-white tracking-tight text-sm">Portfolio Engine</span>
        </div>
        <Link
          href="/intake"
          className="text-sm font-medium text-neutral-400 hover:text-white transition-colors"
        >
          Get Started →
        </Link>
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/[0.03] mb-8 animate-fade-up">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span className="text-xs text-neutral-400 tracking-wide">AI-powered · Free to start</span>
        </div>

        {/* Headline */}
        <h1 className="font-display text-5xl sm:text-6xl lg:text-8xl font-bold text-white leading-[1.02] max-w-4xl animate-fade-up animate-delay-100">
          Your portfolio,<br />
          <span className="text-neutral-600">in 30 seconds.</span>
        </h1>

        <p className="mt-8 text-lg sm:text-xl text-neutral-400 max-w-xl leading-relaxed animate-fade-up animate-delay-200">
          Fill in your details. Our AI polishes your story with luxury copywriting.
          Your portfolio goes live on a shareable URL instantly.
        </p>

        <div className="mt-10 flex flex-col sm:flex-row items-center gap-4 animate-fade-up animate-delay-300">
          <Link
            href="/intake"
            id="cta-build"
            className="inline-flex items-center gap-3 bg-white text-black px-8 py-4 rounded-full font-semibold text-sm tracking-wide hover:bg-neutral-100 transition-colors"
          >
            Build My Portfolio
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>
          <span className="text-xs text-neutral-600">No account needed</span>
        </div>

        {/* Feature pills */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-3 animate-fade-up animate-delay-400">
          {[
            { icon: '✦', text: 'Gemini AI Copywriting' },
            { icon: '◈', text: 'Cloudinary Image Optimization' },
            { icon: '●', text: 'Instant Live URL' },
            { icon: '◇', text: 'Fashion · Dev · Freelance' },
          ].map((f) => (
            <div
              key={f.text}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.03] border border-white/[0.07] text-sm text-neutral-400"
            >
              <span className="text-neutral-600 text-xs">{f.icon}</span>
              {f.text}
            </div>
          ))}
        </div>
      </section>

      {/* Profession showcase preview */}
      <section className="px-8 pb-24">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Fashion Designer', color: '#C9A882', desc: 'Luxury editorial aesthetic with full-bleed photography' },
              { label: 'Developer', color: '#6366F1', desc: 'Clean, modern layout that shows technical depth' },
              { label: 'Freelancer', color: '#D4A840', desc: 'Warm professional tone that wins clients' },
            ].map((p) => (
              <div
                key={p.label}
                className="p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors group"
              >
                <div
                  className="w-8 h-8 rounded-lg mb-4 flex items-center justify-center text-xs font-bold transition-transform group-hover:scale-110"
                  style={{ background: `${p.color}20`, color: p.color }}
                >
                  ✦
                </div>
                <p className="text-sm font-medium text-white mb-2" style={{ color: p.color }}>{p.label}</p>
                <p className="text-xs text-neutral-600 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="border-t border-white/[0.05] px-8 py-6 text-center">
        <p className="text-xs text-neutral-800">
          Portfolio Engine — Powered by Gemini AI · Cloudinary · Supabase
        </p>
      </footer>
    </main>
  );
}
