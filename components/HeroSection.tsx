'use client';

import { HeroContent } from '@/types/database';

interface HeroSectionProps {
  content: HeroContent | null;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const tagline = content?.tagline || 'Seattle Underground';

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 via-black to-black">
      {/* Background video placeholder - will use content.video_url when available */}
      {content?.video_url && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        >
          <source src={content.video_url} type="video/mp4" />
        </video>
      )}
      
      <div className="relative z-10 text-center px-4">
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white">
          PHLEGHM<span className="text-[#00ff41]">™</span>
        </h1>
        <p className="mt-4 text-zinc-500 tracking-[0.3em] uppercase text-sm md:text-base">
          {tagline}
        </p>
        
        <a
          href="#"
          className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-[#00ff41] text-black font-bold uppercase tracking-wide hover:bg-[#00cc33] transition-colors"
        >
          <TikTokIcon className="w-5 h-5" />
          Watch on TikTok
        </a>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-12 bg-gradient-to-b from-zinc-500 to-transparent" />
      </div>
    </section>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}
