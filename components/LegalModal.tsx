'use client';

import { useEffect } from 'react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LegalModal({ isOpen, onClose }: LegalModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

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
        <h2 
          className="text-3xl font-black text-[#00ff41] mb-6"
          style={{ letterSpacing: '0.02em' }}
        >
          PHLEGM®
        </h2>
        
        <div className="text-zinc-300 space-y-4 text-sm">
          <p>
            PHLEGM is a registered trademark under{' '}
            <a 
              href="https://my.uspto.gov/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#00ff41] hover:underline"
            >
              USPTO
            </a>.
          </p>
          
          <p>
            All content on this website, including music, images, and videos, 
            is owned by PHLEGM and may not be reproduced without permission.
          </p>
          
          <p className="text-zinc-500">
            © {currentYear} PHLEGM. All rights reserved.
          </p>
        </div>
        
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
