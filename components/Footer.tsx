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
          className="font-headline text-4xl tracking-wide opacity-20 mb-4 hover:opacity-40 transition-opacity cursor-pointer bg-transparent border-none"
        >
          PHLEGM®
        </button>
        <p className="font-body text-zinc-700 text-xs">
          © {new Date().getFullYear()} PHLEGM. SEATTLE UNDERGROUND.
        </p>
      </div>
      <LegalModal isOpen={legalOpen} onClose={() => setLegalOpen(false)} />
    </footer>
  );
}
