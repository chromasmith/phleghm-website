'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface AboutContent {
  hero_video_url: string | null;
  hero_video_width: number;
  hero_video_height: number;
  use_legal_content: boolean;
  title: string;
  about_text: string;
}

interface LegalContent {
  title: string;
  trademark_text: string;
  trademark_link_text: string;
  trademark_url: string;
  copyright_text: string;
  rights_text: string;
}

// Fallback config in case database fetch fails
const FALLBACK_ABOUT = {
  hero_video_url: null,
  hero_video_width: 576,
  hero_video_height: 758,
  use_legal_content: true,
  title: 'PHLEGM',
  about_text: '',
};

const FALLBACK_LEGAL = {
  title: 'PHLEGM®',
  trademark_text: 'PHLEGM is a registered trademark under',
  trademark_link_text: 'USPTO',
  trademark_url: 'https://my.uspto.gov/',
  copyright_text: 'All content on this website, including music, images, and videos, is owned by PHLEGM and may not be reproduced without permission.',
  rights_text: 'All rights reserved.',
};

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const [about, setAbout] = useState<AboutContent>(FALLBACK_ABOUT);
  const [legal, setLegal] = useState<LegalContent>(FALLBACK_LEGAL);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchContent() {
      setLoading(true);

      // Fetch about content
      const { data: aboutData, error: aboutError } = await supabase
        .from('about_content')
        .select('*')
        .limit(1)
        .single();

      if (aboutError) {
        console.error('Error fetching about content:', aboutError);
      }

      if (aboutData) {
        setAbout({
          hero_video_url: aboutData.hero_video_url,
          hero_video_width: aboutData.hero_video_width || 576,
          hero_video_height: aboutData.hero_video_height || 758,
          use_legal_content: aboutData.use_legal_content ?? true,
          title: aboutData.title || 'PHLEGM',
          about_text: aboutData.about_text || '',
        });
      }

      // Fetch legal content
      const { data: legalData, error: legalError } = await supabase
        .from('legal_content')
        .select('*')
        .limit(1)
        .single();

      if (legalError) {
        console.error('Error fetching legal content:', legalError);
      }

      if (legalData) {
        setLegal({
          title: legalData.title || 'PHLEGM®',
          trademark_text: legalData.trademark_text || FALLBACK_LEGAL.trademark_text,
          trademark_link_text: legalData.trademark_link_text || FALLBACK_LEGAL.trademark_link_text,
          trademark_url: legalData.trademark_url || FALLBACK_LEGAL.trademark_url,
          copyright_text: legalData.copyright_text || FALLBACK_LEGAL.copyright_text,
          rights_text: legalData.rights_text || FALLBACK_LEGAL.rights_text,
        });
      }

      setLoading(false);
    }

    fetchContent();
  }, [isOpen]);

  if (!isOpen) return null;

  const aspectRatio = about.hero_video_width / about.hero_video_height;
  const currentYear = new Date().getFullYear();

  // Shared close button component
  const CloseButtonBottom = () => (
    <button
      onClick={onClose}
      className="w-full py-4 mt-6 border border-zinc-700 text-zinc-500 hover:text-[#00ff41] hover:border-[#00ff41] transition-colors uppercase tracking-[0.3em] text-sm font-mono"
    >
      Close
    </button>
  );

  // Legal content display component
  const LegalContentDisplay = () => (
    <div className="space-y-4">
      <p className="text-zinc-300 font-mono text-sm leading-relaxed">
        {legal.trademark_text}{' '}
        <a
          href={legal.trademark_url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#00ff41] hover:underline"
        >
          {legal.trademark_link_text}
        </a>.
      </p>

      <p className="text-zinc-300 font-mono text-sm leading-relaxed">
        {legal.copyright_text}
      </p>

      <p className="text-zinc-500 font-mono text-sm">
        © {currentYear} PHLEGM. {legal.rights_text}
      </p>
    </div>
  );

  // Custom about content display
  const CustomContentDisplay = () => {
    const paragraphs = about.about_text.split('\n\n').filter(p => p.trim());
    return (
      <div className="text-zinc-300 font-mono text-sm leading-relaxed space-y-3">
        {paragraphs.map((paragraph, index) => (
          <p key={index}>{paragraph}</p>
        ))}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      {/* Close Button - Top Right */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 md:top-6 md:right-6 text-zinc-500 hover:text-[#00ff41] transition-colors text-3xl z-[70]"
        aria-label="Close about"
      >
        ✕
      </button>

      {/* Mobile Layout - stacked, full bleed, scrollable page */}
      <div className="md:hidden h-full overflow-y-auto">
        {/* Video - full width, natural aspect ratio, no cropping */}
        {about.hero_video_url && (
          <div
            className="w-full bg-black"
            style={{ aspectRatio: aspectRatio }}
          >
            <video
              src={about.hero_video_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-contain"
            />
          </div>
        )}

        {/* About - below video, user scrolls to see */}
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
                  {about.use_legal_content ? legal.title : about.title}
                </h2>

                {about.use_legal_content ? <LegalContentDisplay /> : <CustomContentDisplay />}

                <CloseButtonBottom />
              </>
            )}
          </div>
        </div>
      </div>

      {/* Desktop Layout - side by side, full bleed */}
      <div className="hidden md:flex h-full">
        {/* Video - height fills viewport, width from aspect ratio */}
        {about.hero_video_url && (
          <div
            className="h-full flex-shrink-0 bg-black"
            style={{ aspectRatio: aspectRatio }}
          >
            <video
              src={about.hero_video_url}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* About - fills remaining width, scrolls internally */}
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
                  {about.use_legal_content ? legal.title : about.title}
                </h2>

                {about.use_legal_content ? (
                  <div className="space-y-5">
                    <p className="text-zinc-300 font-mono text-base lg:text-lg leading-relaxed">
                      {legal.trademark_text}{' '}
                      <a
                        href={legal.trademark_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#00ff41] hover:underline"
                      >
                        {legal.trademark_link_text}
                      </a>.
                    </p>

                    <p className="text-zinc-300 font-mono text-base lg:text-lg leading-relaxed">
                      {legal.copyright_text}
                    </p>

                    <p className="text-zinc-500 font-mono text-base lg:text-lg">
                      © {currentYear} PHLEGM. {legal.rights_text}
                    </p>
                  </div>
                ) : (
                  <div className="text-zinc-300 font-mono text-base lg:text-lg leading-relaxed space-y-5">
                    {about.about_text.split('\n\n').filter(p => p.trim()).map((paragraph, index) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}

                <CloseButtonBottom />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
