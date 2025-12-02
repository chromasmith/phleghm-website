'use client';

import { useState } from 'react';
import TaglineEditor from './TaglineEditor';
import BannerEditor from './BannerEditor';
import HeroVideoEditor from './HeroVideoEditor';

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
          <h1 className="text-lg font-bold text-green-500">PHLEGM Admin Dashboard</h1>
          <button
            onClick={onLogout}
            className="text-sm text-zinc-400 hover:text-white transition-colors"
          >
            Logout
          </button>
        </div>
        
        {/* Section Dropdown */}
        <div className="flex items-end gap-3 px-4 py-3 border-t border-zinc-800">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Edit</label>
            <select
              value={activeSection}
              onChange={(e) => setActiveSection(e.target.value)}
              className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white focus:outline-none focus:border-green-500"
            >
              {NAV_ITEMS.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
          {/* Future buttons go here */}
        </div>
      </header>
      
      {/* Content Area */}
      <main className="p-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-4">
            {NAV_ITEMS.find(item => item.id === activeSection)?.label}
          </h2>
          <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
            {activeSection === 'hero' && <HeroVideoEditor />}
            {activeSection === 'taglines' && <TaglineEditor />}
            {activeSection === 'banner' && <BannerEditor />}
            {!['hero', 'taglines', 'banner'].includes(activeSection) && (
              <p className="text-zinc-500">{activeSection} editor coming soon...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
