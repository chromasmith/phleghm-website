'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@supabase/supabase-js';
import { useScrollReveal } from '@/hooks/useParallax';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BannerData {
  enabled: boolean;
  text: string;
  subtext: string | null;
  media_url: string | null;
  media_type: 'image' | 'video' | null;
  link_url: string | null;
  link_text: string | null;
}

export default function AnnouncementBanner() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [loading, setLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement>(null);
  const { isVisible } = useScrollReveal(sectionRef);

  useEffect(() => {
    async function fetchBanner() {
      const { data, error } = await supabase
        .from('announcement_banner')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching announcement banner:', error);
        setLoading(false);
        return;
      }

      setBanner(data);
      setLoading(false);
    }

    fetchBanner();
  }, []);

  // Don't render while loading or if disabled/no data
  if (loading || !banner || !banner.enabled) return null;

  return (
    <div 
      ref={sectionRef}
      className={`w-full bg-zinc-900 border-y border-zinc-800 scroll-reveal ${isVisible ? 'visible' : ''}`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Banner with optional media */}
        <div className="flex flex-col md:flex-row items-center">
          
          {/* Media Section (if present) */}
          {banner.media_url && banner.media_type === 'image' && (
            <div className="w-full md:w-48 h-32 md:h-auto md:aspect-square flex-shrink-0 bg-black">
              <img 
                src={banner.media_url} 
                alt="Announcement" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {banner.media_url && banner.media_type === 'video' && (
            <div className="w-full md:w-48 h-32 md:h-auto md:aspect-square flex-shrink-0 bg-black">
              <video 
                src={banner.media_url} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4 p-6 md:px-8">
            {/* Text */}
            <div className="text-center md:text-left">
              <p 
                className="text-[#00ff41] text-lg md:text-xl font-black tracking-tight"
                style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
              >
                {banner.text}
              </p>
              {banner.subtext && (
                <p className="text-zinc-500 text-sm font-mono mt-1">
                  {banner.subtext}
                </p>
              )}
            </div>

            {/* CTA Button */}
            {banner.link_url && banner.link_text && (
              <a
                href={banner.link_url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-6 py-3 bg-[#00ff41] text-black font-bold uppercase tracking-[0.15em] text-sm hover:bg-white transition-colors"
              >
                {banner.link_text}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}