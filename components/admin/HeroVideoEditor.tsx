'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface HeroVideos {
  desktop_url: string;
  mobile_url: string;
}

const DEFAULT_VIDEOS: HeroVideos = {
  desktop_url: 'https://chromasmith-cdn.b-cdn.net/phleghm-website/hero/Veteran_720H_web2.mp4',
  mobile_url: 'https://chromasmith-cdn.b-cdn.net/phleghm-website/hero/Veteran_V.mp4'
};

export default function HeroVideoEditor() {
  const [videos, setVideos] = useState<HeroVideos>(DEFAULT_VIDEOS);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  useEffect(() => {
    fetchVideos();
  }, []);
  
  async function fetchVideos() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', 'hero_videos')
      .single();
    
    if (error && error.code !== 'PGRST116') {
      setError('Failed to load video settings');
    } else if (data) {
      setSettingId(data.id);
      setVideos(data.value as HeroVideos);
    }
    setIsLoading(false);
  }
  
  async function saveVideos() {
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    let result;
    if (settingId) {
      result = await supabase
        .from('site_settings')
        .update({
          value: videos,
          updated_at: new Date().toISOString()
        })
        .eq('id', settingId);
    } else {
      result = await supabase
        .from('site_settings')
        .insert({
          key: 'hero_videos',
          value: videos
        })
        .select()
        .single();
      
      if (result.data) {
        setSettingId(result.data.id);
      }
    }
    
    if (result.error) {
      setError('Failed to save video settings');
    } else {
      setSuccess('Videos saved!');
      setTimeout(() => setSuccess(''), 2000);
    }
    setIsSaving(false);
  }
  
  if (isLoading) {
    return <div className="text-zinc-500">Loading video settings...</div>;
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
      
      {/* Desktop Video */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-400">
          Desktop Video (Landscape 16:9)
        </label>
        {videos.desktop_url && (
          <video
            src={videos.desktop_url}
            className="w-full max-w-md rounded border border-zinc-700"
            muted
            playsInline
            loop
            autoPlay
          />
        )}
        <input
          type="url"
          value={videos.desktop_url}
          onChange={(e) => setVideos({ ...videos, desktop_url: e.target.value })}
          placeholder="https://chromasmith-cdn.b-cdn.net/..."
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 text-sm"
        />
      </div>
      
      {/* Mobile Video */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-zinc-400">
          Mobile Video (Portrait 9:16)
        </label>
        {videos.mobile_url && (
          <video
            src={videos.mobile_url}
            className="w-32 rounded border border-zinc-700"
            muted
            playsInline
            loop
            autoPlay
          />
        )}
        <input
          type="url"
          value={videos.mobile_url}
          onChange={(e) => setVideos({ ...videos, mobile_url: e.target.value })}
          placeholder="https://chromasmith-cdn.b-cdn.net/..."
          className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 text-sm"
        />
      </div>
      
      <p className="text-xs text-zinc-600">
        Upload videos to Bunny CDN, then paste the URL here.
      </p>
      
      {/* Save Button */}
      <button
        onClick={saveVideos}
        disabled={isSaving}
        className="w-full py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {isSaving ? 'SAVING...' : 'SAVE VIDEOS'}
      </button>
    </div>
  );
}
