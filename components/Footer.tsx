'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import LegalModal from './LegalModal';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LegalContent {
  title: string;
  rights_text: string;
}

const FALLBACK = {
  title: 'PHLEGM®',
  rights_text: 'All rights reserved.',
};

export default function Footer() {
  const [legalOpen, setLegalOpen] = useState(false);
  const [legal, setLegal] = useState<LegalContent>(FALLBACK);

  useEffect(() => {
    async function fetchLegal() {
      const { data, error } = await supabase
        .from('legal_content')
        .select('title, rights_text')
        .limit(1)
        .single();

      if (error) {
        console.error('Error fetching legal content:', error);
        return;
      }

      if (data) {
        setLegal({
          title: data.title || FALLBACK.title,
          rights_text: data.rights_text || FALLBACK.rights_text,
        });
      }
    }

    fetchLegal();
  }, []);

  // Extract the base title without the ® symbol for display
  const displayTitle = legal.title.replace('®', '');

  return (
    <footer className="py-12 px-4 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto text-center">
        <button
          onClick={() => setLegalOpen(true)}
          className="cursor-pointer hover:opacity-80 transition-opacity text-center bg-transparent border-none"
        >
          <div className="font-headline text-4xl tracking-wide opacity-20">
            {displayTitle}<span className="text-[0.6em] align-super">®</span>
          </div>
          <div className="font-body text-zinc-700 text-xs mt-4">
            © {new Date().getFullYear()} PHLEGM. {legal.rights_text}
          </div>
        </button>
      </div>
      <LegalModal isOpen={legalOpen} onClose={() => setLegalOpen(false)} />
    </footer>
  );
}
