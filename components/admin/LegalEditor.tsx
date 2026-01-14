'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface LegalContent {
  id: string;
  title: string;
  trademark_text: string;
  trademark_link_text: string;
  trademark_url: string;
  copyright_text: string;
  rights_text: string;
}

export default function LegalEditor() {
  const [legal, setLegal] = useState<LegalContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchLegal();
  }, []);

  async function fetchLegal() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('legal_content')
      .select('*')
      .limit(1)
      .single();

    if (data) setLegal(data);
    if (error && error.code !== 'PGRST116') setError('Failed to load legal content');
    setIsLoading(false);
  }

  async function saveLegal() {
    if (!legal) return;
    setIsSaving(true);
    setError('');

    const { error } = await supabase
      .from('legal_content')
      .update({
        title: legal.title,
        trademark_text: legal.trademark_text,
        trademark_link_text: legal.trademark_link_text,
        trademark_url: legal.trademark_url,
        copyright_text: legal.copyright_text,
        rights_text: legal.rights_text,
        updated_at: new Date().toISOString()
      })
      .eq('id', legal.id);

    if (error) {
      setError('Failed to save legal content');
    } else {
      setSuccess('Legal content saved!');
      setTimeout(() => setSuccess(''), 2000);
    }
    setIsSaving(false);
  }

  if (isLoading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  if (!legal) {
    return <div className="text-zinc-500">No legal content found. Run the SQL migration first.</div>;
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

      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">Legal / Footer Content</h3>
          <span className="text-xs text-zinc-500">Used in Footer and Legal Modal</span>
        </div>

        {/* Title */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Title</label>
          <input
            type="text"
            value={legal.title}
            onChange={(e) => setLegal({ ...legal, title: e.target.value })}
            placeholder="PHLEGM®"
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
          />
        </div>

        {/* Trademark Text */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Trademark Text</label>
          <input
            type="text"
            value={legal.trademark_text}
            onChange={(e) => setLegal({ ...legal, trademark_text: e.target.value })}
            placeholder="PHLEGM is a registered trademark under"
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
          />
        </div>

        {/* Trademark Link */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-sm text-zinc-400">Link Text</label>
            <input
              type="text"
              value={legal.trademark_link_text}
              onChange={(e) => setLegal({ ...legal, trademark_link_text: e.target.value })}
              placeholder="USPTO"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-zinc-400">Link URL</label>
            <input
              type="url"
              value={legal.trademark_url}
              onChange={(e) => setLegal({ ...legal, trademark_url: e.target.value })}
              placeholder="https://my.uspto.gov/"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
        </div>

        {/* Copyright Text */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Copyright Text</label>
          <textarea
            value={legal.copyright_text}
            onChange={(e) => setLegal({ ...legal, copyright_text: e.target.value })}
            placeholder="All content on this website..."
            rows={3}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm resize-none"
          />
        </div>

        {/* Rights Text */}
        <div className="space-y-1">
          <label className="text-sm text-zinc-400">Rights Text</label>
          <input
            type="text"
            value={legal.rights_text}
            onChange={(e) => setLegal({ ...legal, rights_text: e.target.value })}
            placeholder="All rights reserved."
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
          />
        </div>

        {/* Preview */}
        <div className="bg-zinc-900 rounded p-4 border border-zinc-700">
          <p className="text-xs text-zinc-500 mb-2">Preview:</p>
          <div className="text-zinc-300 text-sm space-y-2">
            <p className="text-[#00ff41] font-bold">{legal.title}</p>
            <p>
              {legal.trademark_text}{' '}
              <span className="text-[#00ff41]">{legal.trademark_link_text}</span>.
            </p>
            <p>{legal.copyright_text}</p>
            <p className="text-zinc-500">© {new Date().getFullYear()} PHLEGM. {legal.rights_text}</p>
          </div>
        </div>

        <button
          onClick={saveLegal}
          disabled={isSaving}
          className="w-full py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'SAVING...' : 'SAVE LEGAL CONTENT'}
        </button>
      </div>
    </div>
  );
}
