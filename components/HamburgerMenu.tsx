'use client';

import { useState } from 'react';

export default function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { label: 'BIO', action: 'bio' },
    { label: 'CONTACT', action: 'contact' },
  ];

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleMenu}
        className="fixed top-6 right-6 z-50 flex flex-col justify-center items-center w-12 h-12 bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 rounded-sm hover:border-[#00ff41] transition-colors"
        aria-label="Toggle menu"
      >
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? 'rotate-45 translate-y-1.5' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white my-1 transition-all duration-300 ${
            isOpen ? 'opacity-0' : ''
          }`}
        />
        <span
          className={`block w-6 h-0.5 bg-white transition-all duration-300 ${
            isOpen ? '-rotate-45 -translate-y-1.5' : ''
          }`}
        />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/80 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={toggleMenu}
      />

      {/* Slide-out Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-72 bg-zinc-900 border-l border-zinc-700 z-50 transform transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Close Button */}
        <button
          onClick={toggleMenu}
          className="absolute top-6 right-6 text-zinc-500 hover:text-[#00ff41] transition-colors text-2xl"
          aria-label="Close menu"
        >
          ✕
        </button>

        {/* Menu Items */}
        <nav className="flex flex-col items-start justify-center h-full px-8">
          {menuItems.map((item) => (
            <button
              key={item.action}
              onClick={() => {
                console.log(`Open ${item.action} modal`);
                setIsOpen(false);
              }}
              className="text-white text-3xl font-bold tracking-[0.3em] uppercase mb-8 hover:text-[#00ff41] transition-colors font-mono"
            >
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}