# Portfolio Engine v2.0 — Editorial Edition

A high-end, AI-powered portfolio generator that transforms raw experience into premium digital legacies.

## ✨ Features

- **Luxury AI Synthesis**: Powered by Gemini 2.5 Flash to weave raw bios into sophisticated editorial narratives.
- **High-End Design System**: Built with Playfair Display & Inter, featuring asymmetric layouts and staggered masonry galleries.
- **Sophisticated Motion**: Smooth entrance animations and reveal effects for a premium transition experience.
- **Dynamic Subdomains**: Autonomous routing for personalized portfolio namespaces.
- **Optimized Assets**: Cloudinary integration for lightning-fast, high-quality visual delivery.

## 🚀 Getting Started

1. **Clone & Install**:
   ```bash
   npm install
   ```

2. **Environment Setup**:
   Copy `.env.example` to `.env.local` and fill in your keys for Supabase, Cloudinary, and Gemini.

3. **Run Locally**:
   ```bash
   npm run dev
   ```

## 🌍 Vercel Deployment

Deploying is seamless on Vercel. Ensure you add the following Environment Variables in your Vercel Dashboard:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_ROOT_DOMAIN` (Your production domain, e.g., `agency.vercel.app`)
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 🛠️ Stack

- **Framework**: Next.js 15 (App Router)
- **Database/Auth**: Supabase
- **AI**: Google Gemini 2.5 Flash
- **Images**: Cloudinary
- **Styling**: Tailwind CSS + Custom Design Tokens
