'use client';

import { useState } from 'react';
import LegalModal from './LegalModal';

export default function Footer() {
  const [legalOpen, setLegalOpen] = useState(false);

  return (
    <footer className="py-12 px-4 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto text-center">
        <button
          onClick={() => setLegalOpen(true)}
          className="cursor-pointer hover:opacity-80 transition-opacity text-center bg-transparent border-none"
        >
          <div className="font-headline text-4xl tracking-wide opacity-20">
            PHLEGM<span className="text-[0.6em]">®</span>
          </div>
          <div className="font-body text-zinc-700 text-xs mt-4">
            © {new Date().getFullYear()} PHLEGM. SEATTLE UNDERGROUND.
          </div>
        </button>
      </div>
      <LegalModal isOpen={legalOpen} onClose={() => setLegalOpen(false)} />
    </footer>
  );
}
