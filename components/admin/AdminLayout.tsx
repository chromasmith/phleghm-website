'use client';

import { useState } from 'react';
import TaglineEditor from './TaglineEditor';
import BannerEditor from './BannerEditor';

interface AdminLayoutProps {
  onLogout: () => void;
}

const NAV_ITEMS = [
  { id: 'hero', label: 'Hero Video' },
  { id: 'taglines', label: 'Taglines' },
  { id: 'shows', label: 'Shows' },
  { id: 'bio', label: 'Bio' },
  { id: 'contact', label: 'Contact' },
  { id: 'banner', label: 'Banner' },
];

export default function AdminLayout({ onLogout }: AdminLayoutProps) {
  const [activeSection, setActiveSection] = useState('hero');
  
  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-zinc-900 border-b border-zinc-800">
        <div className="flex items-center justify-between px-4 py-3">
          <h1 className="text-lg font-bold text-green-500">PHLEGM Admin</h1>
          <button
            onClick={onLogout}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
        
        {/* Mobile Nav - Horizontal Scroll */}
        <nav className="flex overflow-x-auto border-t border-zinc-800">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? 'text-green-500 border-b-2 border-green-500'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      
      {/* Content Area */}
      <main className="p-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">
            {NAV_ITEMS.find(item => item.id === activeSection)?.label}
          </h2>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            {activeSection === 'taglines' && <TaglineEditor />}
            {activeSection === 'banner' && <BannerEditor />}
            {!['taglines', 'banner'].includes(activeSection) && (
              <p className="text-zinc-500">{activeSection} editor coming soon...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
