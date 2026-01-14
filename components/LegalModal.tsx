'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface LegalContent {
  title: string;
  trademark_text: string;
  trademark_link_text: string;
  trademark_url: string;
  copyright_text: string;
  rights_text: string;
}

const FALLBACK = {
  title: 'PHLEGM®',
  trademark_text: 'PHLEGM is a registered trademark under',
  trademark_link_text: 'USPTO',
  trademark_url: 'https://my.uspto.gov/',
  copyright_text: 'All content on this website, including music, images, and videos, is owned by PHLEGM and may not be reproduced without permission.',
  rights_text: 'All rights reserved.',
};

export default function LegalModal({ isOpen, onClose }: LegalModalProps) {
  const [legal, setLegal] = useState<LegalContent>(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      fetchLegal();
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  async function fetchLegal() {
    setLoading(true);
    const { data, error } = await supabase
      .from('legal_content')
      .select('*')
      .limit(1)
      .single();

    if (error) {
      console.error('Error fetching legal content:', error);
      setLoading(false);
      return;
    }

    if (data) {
      setLegal({
        title: data.title || FALLBACK.title,
        trademark_text: data.trademark_text || FALLBACK.trademark_text,
        trademark_link_text: data.trademark_link_text || FALLBACK.trademark_link_text,
        trademark_url: data.trademark_url || FALLBACK.trademark_url,
        copyright_text: data.copyright_text || FALLBACK.copyright_text,
        rights_text: data.rights_text || FALLBACK.rights_text,
      });
    }
    setLoading(false);
  }

  if (!isOpen) return null;

  const currentYear = new Date().getFullYear();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-zinc-900 border border-zinc-700 rounded-lg p-8 max-w-md mx-4 text-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Content */}
        {loading ? (
          <div className="text-zinc-500 text-sm">Loading...</div>
        ) : (
          <>
            <h2
              className="text-3xl font-black text-[#00ff41] mb-6"
              style={{ letterSpacing: '0.02em' }}
            >
              {legal.title}
            </h2>

            <div className="text-zinc-300 space-y-4 text-sm">
              <p>
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

              <p>
                {legal.copyright_text}
              </p>

              <p className="text-zinc-500">
                © {currentYear} PHLEGM. {legal.rights_text}
              </p>
            </div>
          </>
        )}

        {/* Close button bottom */}
        <button
          onClick={onClose}
          className="mt-6 px-6 py-2 bg-zinc-800 text-white rounded hover:bg-zinc-700 transition-colors uppercase tracking-wider text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}
