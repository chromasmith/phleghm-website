'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BannerData {
  id: string;
  enabled: boolean;
  text: string;
  subtext: string | null;
  link_url: string | null;
  link_text: string | null;
}

export default function BannerEditor() {
  const [banner, setBanner] = useState<BannerData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    fetchBanner();
  }, []);
  
  async function fetchBanner() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('announcement_banner')
      .select('*')
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      setError('Failed to load banner');
    } else if (data) {
      setBanner(data);
    }
    setIsLoading(false);
  }
  
  async function saveBanner() {
    if (!banner) return;
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    const { error } = await supabase
      .from('announcement_banner')
      .update({
        enabled: banner.enabled,
        text: banner.text,
        subtext: banner.subtext,
        link_url: banner.link_url,
        link_text: banner.link_text,
        updated_at: new Date().toISOString()
      })
      .eq('id', banner.id);
    
    if (error) {
      setError('Failed to save banner');
    } else {
      setSuccess('Banner saved!');
      setTimeout(() => setSuccess(''), 2000);
    }
    setIsSaving(false);
  }
  
  function updateField(field: keyof BannerData, value: string | boolean) {
    if (!banner) return;
    setBanner({ ...banner, [field]: value });
  }
  
  if (isLoading) {
    return <div className="text-zinc-500">Loading banner...</div>;
  }
  
  if (!banner) {
    return <div className="text-zinc-500">No banner configured.</div>;
  }
  
  return (
    <div className="space-y-6">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline">dismiss</button>
        </div>
      )}
      
      {success && (
        <div className="bg-green-500/10 border border-green-500 text-green-500 px-4 py-2 rounded">
          {success}
        </div>
      )}
      
      {/* Enable Toggle */}
      <div className="flex items-center justify-between p-4 bg-zinc-800 rounded border border-zinc-700">
        <div>
          <div className="font-medium text-white">Show Banner</div>
          <div className="text-sm text-zinc-500">Display banner on the website</div>
        </div>
        <button
          onClick={() => updateField('enabled', !banner.enabled)}
          className={`w-14 h-8 rounded-full transition-colors ${
            banner.enabled ? 'bg-green-500' : 'bg-zinc-600'
          }`}
        >
          <div
            className={`w-6 h-6 bg-white rounded-full transition-transform ${
              banner.enabled ? 'translate-x-7' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {/* Main Text */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Banner Text *
        </label>
        <input
          type="text"
          value={banner.text || ''}
          onChange={(e) => updateField('text', e.target.value)}
          placeholder="NEW SINGLE OUT NOW"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
        />
      </div>
      
      {/* Subtext */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Subtext (optional)
        </label>
        <input
          type="text"
          value={banner.subtext || ''}
          onChange={(e) => updateField('subtext', e.target.value)}
          placeholder="Available on all platforms"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
        />
      </div>
      
      {/* Link URL */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Link URL (optional)
        </label>
        <input
          type="url"
          value={banner.link_url || ''}
          onChange={(e) => updateField('link_url', e.target.value)}
          placeholder="https://open.spotify.com/..."
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
        />
      </div>
      
      {/* Link Text */}
      <div>
        <label className="block text-sm font-medium text-zinc-400 mb-2">
          Button Text (optional)
        </label>
        <input
          type="text"
          value={banner.link_text || ''}
          onChange={(e) => updateField('link_text', e.target.value)}
          placeholder="LISTEN NOW"
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
        />
      </div>
      
      {/* Save Button */}
      <button
        onClick={saveBanner}
        disabled={isSaving}
        className="w-full py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? 'SAVING...' : 'SAVE BANNER'}
      </button>
    </div>
  );
}
