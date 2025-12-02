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
  bio_text: string | null;
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
        bio_text: bio.bio_text,
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
      
      {/* Video Section - Under Construction */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-4 opacity-60">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">Bio Video</h3>
          <span className="text-xs text-yellow-500 bg-yellow-500/10 px-2 py-1 rounded">UNDER CONSTRUCTION</span>
        </div>
        
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
        
        <p className="text-xs text-zinc-500">Video upload coming soon.</p>
      </div>
      
      {/* Bio Text Section */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-4">
        <h3 className="font-medium text-white">Bio Text</h3>
        
        <textarea
          value={bio.bio_text || ''}
          onChange={(e) => setBio({ ...bio, bio_text: e.target.value })}
          placeholder="Enter bio text..."
          rows={12}
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm resize-none"
        />
        
        <button
          onClick={saveBio}
          disabled={isSaving}
          className="w-full py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'SAVING...' : 'SAVE BIO'}
        </button>
      </div>
    </div>
  );
}