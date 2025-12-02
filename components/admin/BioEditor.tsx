'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface BioContent {
  id: string;
  hero_video_url: string | null;
  hero_video_width: number;
  hero_video_height: number;
  title: string | null;
  tagline: string | null;
  bio_text: string | null;
  speaks_in_items: string[] | null;
  closing_text: string | null;
}

export default function BioEditor() {
  const [bio, setBio] = useState<BioContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    fetchBio();
  }, []);
  
  async function fetchBio() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('bio_content')
      .select('*')
      .limit(1)
      .single();
    
    if (data) setBio(data);
    if (error && error.code !== 'PGRST116') setError('Failed to load bio');
    setIsLoading(false);
  }
  
  async function saveBio() {
    if (!bio) return;
    setIsSaving(true);
    setError('');
    
    const { error } = await supabase
      .from('bio_content')
      .update({
        hero_video_url: bio.hero_video_url,
        hero_video_width: bio.hero_video_width,
        hero_video_height: bio.hero_video_height,
        title: bio.title,
        tagline: bio.tagline,
        bio_text: bio.bio_text,
        speaks_in_items: bio.speaks_in_items,
        closing_text: bio.closing_text,
        updated_at: new Date().toISOString()
      })
      .eq('id', bio.id);
    
    if (error) {
      setError('Failed to save bio');
    } else {
      setSuccess('Bio saved!');
      setTimeout(() => setSuccess(''), 2000);
    }
    setIsSaving(false);
  }
  
  function handleUploadClick() {
    alert('Direct upload coming soon. For now, upload to Bunny CDN and paste the URL.');
  }
  
  if (isLoading) {
    return <div className="text-zinc-500">Loading...</div>;
  }
  
  if (!bio) {
    return <div className="text-zinc-500">No bio content found.</div>;
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
      
      {/* Video Section */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-4">
        <h3 className="font-medium text-white">Bio Video</h3>
        
        {bio.hero_video_url && (
          <video
            src={bio.hero_video_url}
            className="w-32 rounded border border-zinc-700"
            muted
            playsInline
            loop
            autoPlay
          />
        )}
        
        <input
          type="url"
          value={bio.hero_video_url || ''}
          onChange={(e) => setBio({ ...bio, hero_video_url: e.target.value })}
          placeholder="https://chromasmith-cdn.b-cdn.net/..."
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
        />
        
        <div className="flex gap-4">
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 mb-1">Width</label>
            <input
              type="number"
              value={bio.hero_video_width}
              onChange={(e) => setBio({ ...bio, hero_video_width: parseInt(e.target.value) || 576 })}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs text-zinc-500 mb-1">Height</label>
            <input
              type="number"
              value={bio.hero_video_height}
              onChange={(e) => setBio({ ...bio, hero_video_height: parseInt(e.target.value) || 758 })}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm"
            />
          </div>
        </div>
        
        <button
          onClick={handleUploadClick}
          className="w-full py-2 bg-zinc-700 text-white text-sm font-medium rounded hover:bg-zinc-600"
        >
          UPLOAD VIDEO
        </button>
      </div>
      
      {/* Text Content Section */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-4">
        <h3 className="font-medium text-white">Bio Text</h3>
        
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Title</label>
          <input
            type="text"
            value={bio.title || ''}
            onChange={(e) => setBio({ ...bio, title: e.target.value })}
            placeholder="PHLEGM"
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Tagline</label>
          <input
            type="text"
            value={bio.tagline || ''}
            onChange={(e) => setBio({ ...bio, tagline: e.target.value })}
            placeholder="Seattle Underground"
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Bio Text (separate paragraphs with blank lines)</label>
          <textarea
            value={bio.bio_text || ''}
            onChange={(e) => setBio({ ...bio, bio_text: e.target.value })}
            placeholder="Main bio text..."
            rows={6}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm resize-none"
          />
        </div>
        
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Speaks In (comma separated)</label>
          <input
            type="text"
            value={bio.speaks_in_items?.join(', ') || ''}
            onChange={(e) => setBio({ ...bio, speaks_in_items: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
            placeholder="grit, bars, punchlines"
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
          />
        </div>
        
        <div>
          <label className="block text-xs text-zinc-500 mb-1">Closing Text</label>
          <textarea
            value={bio.closing_text || ''}
            onChange={(e) => setBio({ ...bio, closing_text: e.target.value })}
            placeholder="Closing statement..."
            rows={3}
            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm resize-none"
          />
        </div>
      </div>
      
      {/* Save Button */}
      <button
        onClick={saveBio}
        disabled={isSaving}
        className="w-full py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 disabled:opacity-50 transition-colors"
      >
        {isSaving ? 'SAVING...' : 'SAVE BIO'}
      </button>
    </div>
  );
}
