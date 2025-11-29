'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface BioContent {
  hero_video_url: string | null;
  hero_video_width: number;
  hero_video_height: number;
  title: string;
  tagline: string;
  bio_text: string;
  speaks_in_items: string[];
  closing_text: string;
}

// Fallback config in case database fetch fails
const FALLBACK_CONFIG = {
  hero_video_url: 'https://chromasmith-cdn.b-cdn.net/phleghm-website/hero/Phlegm_MeVme.mp4.mp4',
  hero_video_width: 576,
  hero_video_height: 758,
  title: 'PHLEGM',
  tagline: 'Rain. Static. The space between.',
  bio_text: '',
  speaks_in_items: [],
  closing_text: '',
};

export default function BioModal({ isOpen, onClose }: BioModalProps) {
  const [bio, setBio] = useState<BioContent>(FALLBACK_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchBio() {
      setLoading(true);

      const { data, error } = await supabase
        .from('bio_content')
        .select('*')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching bio content:', error);
        setLoading(false);
        return;
      }

      if (data) {
        setBio({
          hero_video_url: data.hero_video_url,
          hero_video_width: data.hero_video_width || 576,
          hero_video_height: data.hero_video_height || 758,
          title: data.title || 'PHLEGM',
          tagline: data.tagline || '',
          bio_text: data.bio_text || '',
          speaks_in_items: data.speaks_in_items || [],
          closing_text: data.closing_text || '',
        });
      }

      setLoading(false);
    }

    fetchBio();
  }, [isOpen]);

  if (!isOpen) return null;

  const aspectRatio = bio.hero_video_width / bio.hero_video_height;

  // Split bio_text into paragraphs
  const bioParagraphs = bio.bio_text.split('\n\n').filter(p => p.trim());
  const closingParagraphs = bio.closing_text.split('\n\n').filter(p => p.trim());

  // Shared close button component
  const CloseButtonBottom = () => (
    <button
      onClick={onClose}
      className="w-full py-4 mt-6 border border-zinc-700 text-zinc-500 hover:text-[#00ff41] hover:border-[#00ff41] transition-colors uppercase tracking-[0.3em] text-sm font-mono"
    >
      Close
    </button>
  );

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      {/* Close Button - Top Right */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 md:top-6 md:right-6 text-zinc-500 hover:text-[#00ff41] transition-colors text-3xl z-[70]"
        aria-label="Close bio"
      >
        ✕
      </button>

      {/* Mobile Layout - stacked, full bleed, scrollable page */}
      <div className="md:hidden h-full overflow-y-auto">
        {/* Video - full width, natural aspect ratio, no cropping */}
        {bio.hero_video_url && (
          <div 
            className="w-full bg-black"
            style={{ aspectRatio: aspectRatio }}
          >
            <video
              src={bio.hero_video_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* Bio - below video, user scrolls to see */}
        <div className="bg-zinc-900 border-t border-zinc-700">
          <div className="p-6">
            {loading ? (
              <div className="text-zinc-500 font-mono text-sm">Loading...</div>
            ) : (
              <>
                <h2 
                  className="text-[#00ff41] text-3xl font-black tracking-tight mb-4" 
                  style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
                >
                  {bio.title}
                </h2>

                <p className="text-zinc-400 text-base font-mono italic mb-4">
                  {bio.tagline}
                </p>

                <div className="text-zinc-300 font-mono text-sm leading-relaxed space-y-3">
                  {bioParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}

                  {bio.speaks_in_items.length > 0 && (
                    <div className="mt-4">
                      <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-2">He speaks in:</p>
                      <ul className="space-y-1 text-zinc-400 text-sm">
                        {bio.speaks_in_items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-[#00ff41]">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {closingParagraphs.map((paragraph, index) => (
                    <p key={index} className="mt-4">{paragraph}</p>
                  ))}
                </div>

                <CloseButtonBottom />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout - side by side, full bleed */}
      <div className="hidden md:flex h-full">
        {/* Video - height fills viewport, width from aspect ratio */}
        {bio.hero_video_url && (
          <div 
            className="h-full flex-shrink-0 bg-black"
            style={{ aspectRatio: aspectRatio }}
          >
            <video
              src={bio.hero_video_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Bio - fills remaining width, scrolls internally */}
        <div className="flex-1 overflow-y-auto bg-zinc-900 border-l border-zinc-700">
          <div className="p-8 lg:p-12">
            {loading ? (
              <div className="text-zinc-500 font-mono text-sm">Loading...</div>
            ) : (
              <>
                <h2 
                  className="text-[#00ff41] text-5xl lg:text-6xl font-black tracking-tight mb-6" 
                  style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
                >
                  {bio.title}
                </h2>

                <p className="text-zinc-400 text-xl lg:text-2xl font-mono italic mb-8">
                  {bio.tagline}
                </p>

                <div className="text-zinc-300 font-mono text-base lg:text-lg leading-relaxed space-y-5">
                  {bioParagraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}

                  {bio.speaks_in_items.length > 0 && (
                    <div className="mt-8">
                      <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-3">He speaks in:</p>
                      <ul className="space-y-2 text-zinc-400">
                        {bio.speaks_in_items.map((item, index) => (
                          <li key={index} className="flex items-center gap-2">
                            <span className="text-[#00ff41]">•</span> {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {closingParagraphs.map((paragraph, index) => (
                    <p key={index} className="mt-8">{paragraph}</p>
                  ))}
                </div>

                <CloseButtonBottom />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}