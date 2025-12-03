'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import MediaUploader from './MediaUploader';
import BunnyFilePicker from './BunnyFilePicker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface VideoCardProps {
  label: string;
  aspect: string;
  videoKey: 'desktop_url' | 'mobile_url';
  previewClass: string;
}

const DEFAULT_URLS = {
  desktop_url: 'https://chromasmith-cdn.b-cdn.net/phleghm-website/hero/Veteran_720H_web2.mp4',
  mobile_url: 'https://chromasmith-cdn.b-cdn.net/phleghm-website/hero/Veteran_V.mp4'
};

function VideoCard({ label, aspect, videoKey, previewClass }: VideoCardProps) {
  const [url, setUrl] = useState(DEFAULT_URLS[videoKey]);
  const [settingId, setSettingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  
  useEffect(() => {
    fetchVideo();
  }, []);
  
  async function fetchVideo() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('site_settings')
      .select('*')
      .eq('key', `hero_${videoKey}`)
      .single();
    
    if (data) {
      setSettingId(data.id);
      setUrl(data.value?.url || DEFAULT_URLS[videoKey]);
    }
    setIsLoading(false);
  }
  
  async function saveVideo(urlToSave?: string) {
    const saveUrl = urlToSave || url;
    setIsSaving(true);
    setError('');
    setSuccess('');
    
    let result;
    if (settingId) {
      result = await supabase
        .from('site_settings')
        .update({
          value: { url: saveUrl },
          updated_at: new Date().toISOString()
        })
        .eq('id', settingId);
    } else {
      result = await supabase
        .from('site_settings')
        .insert({
          key: `hero_${videoKey}`,
          value: { url: saveUrl }
        })
        .select()
        .single();
      
      if (result.data) {
        setSettingId(result.data.id);
      }
    }
    
    if (result.error) {
      setError('Failed to save');
    } else {
      setSuccess('Saved!');
      setTimeout(() => setSuccess(''), 2000);
    }
    setIsSaving(false);
  }
  
  function handleUploadComplete(newUrl: string) {
    setUrl(newUrl);
    saveVideo(newUrl);
  }

  function handlePickerSelect(selectedUrl: string) {
    setUrl(selectedUrl);
    saveVideo(selectedUrl);
  }
  
  if (isLoading) {
    return (
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700">
        <div className="text-zinc-500">Loading...</div>
      </div>
    );
  }
  
  return (
    <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-medium text-white">{label}</h3>
          <p className="text-xs text-zinc-500">{aspect}</p>
        </div>
        {success && <span className="text-green-500 text-sm">{success}</span>}
        {error && <span className="text-red-500 text-sm">{error}</span>}
      </div>
      
      {/* Preview */}
      {url && (
        <video
          key={url}
          src={url}
          className={`${previewClass} rounded border border-zinc-700`}
          muted
          playsInline
          loop
          autoPlay
        />
      )}
      
      {/* URL Input */}
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://chromasmith-cdn.b-cdn.net/..."
        className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 text-sm"
      />
      
      {/* Actions */}
      <div className="flex items-center gap-3 mt-3">
        <button
          onClick={() => setShowPicker(true)}
          className="h-10 px-4 text-sm font-medium inline-flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
        >
          Browse Library
        </button>
        <MediaUploader
          onUploadComplete={handleUploadComplete}
          folder="phleghm-website/hero"
          accept="video/*"
          label="Upload New"
          className="h-10 px-4 text-sm font-medium inline-flex items-center justify-center gap-2 border border-zinc-600 hover:bg-zinc-700 text-white rounded transition-colors"
        />
        <button
          onClick={() => saveVideo()}
          disabled={isSaving}
          className="h-10 px-4 text-sm font-medium inline-flex items-center justify-center gap-2 bg-[#00ff41] hover:bg-[#00dd38] text-black rounded transition-colors disabled:opacity-50"
        >
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      <BunnyFilePicker
        isOpen={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={handlePickerSelect}
        folder="phleghm-website/hero"
        filterType="video"
      />
    </div>
  );
}

export default function HeroVideoEditor() {
  return (
    <div className="space-y-4">
      <VideoCard
        label="Desktop Video"
        aspect="Landscape 16:9"
        videoKey="desktop_url"
        previewClass="w-full max-w-sm"
      />
      <VideoCard
        label="Mobile Video"
        aspect="Portrait 9:16"
        videoKey="mobile_url"
        previewClass="w-32"
      />
    </div>
  );
}
