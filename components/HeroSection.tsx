'use client';

import { HeroContent } from '@/types/database';

interface HeroSectionProps {
  content: HeroContent | null;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const tagline = content?.tagline || 'Seattle Underground';

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-zinc-950 via-black to-black">
      {/* Background gradient effects */}
      <div className="absolute inset-0 opacity-40"
           style={{
             backgroundImage: 'radial-gradient(ellipse at 30% 20%, #1a1a1a 0%, transparent 50%), radial-gradient(ellipse at 70% 80%, #0d0d0d 0%, transparent 50%)'
           }} />
      
      {/* Animated fog effect */}
      <div className="absolute inset-0 opacity-20 animate-pulse"
           style={{
             background: 'linear-gradient(135deg, transparent 30%, rgba(0,255,65,0.05) 50%, transparent 70%)'
           }} />
      
      {/* Background video - will use content.video_url when available */}
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
        <h1 className="font-headline text-7xl md:text-9xl font-black text-white"
            style={{
              textShadow: '0 0 60px rgba(0,255,65,0.3), 0 0 120px rgba(0,255,65,0.1)'
            }}>
          PHLEGHM<span className="text-[#00ff41]">™</span>
        </h1>
        <p className="font-body mt-6 text-zinc-500 tracking-[0.3em] uppercase text-sm">
          {tagline}
        </p>
        
        <a
          href="#"
          className="font-headline inline-flex items-center gap-3 mt-12 px-8 py-4 bg-[#00ff41] text-black font-bold text-sm tracking-wider uppercase hover:bg-white transition-all duration-300"
        >
          <TikTokIcon className="w-5 h-5" />
          Watch on TikTok
        </a>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#00ff41] to-transparent opacity-50" />
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