'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import MediaUploader from './MediaUploader';
import BunnyFilePicker from './BunnyFilePicker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface AboutContent {
  id: string;
  hero_video_url: string | null;
  hero_video_width: number;
  hero_video_height: number;
  use_legal_content: boolean;
  title: string;
  about_text: string;
}

export default function AboutEditor() {
  const [about, setAbout] = useState<AboutContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPicker, setShowPicker] = useState(false);

  useEffect(() => {
    fetchAbout();
  }, []);

  async function fetchAbout() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('about_content')
      .select('*')
      .limit(1)
      .single();

    if (data) setAbout(data);
    if (error && error.code !== 'PGRST116') setError('Failed to load about content');
    setIsLoading(false);
  }

  async function saveAbout() {
    if (!about) return;
    setIsSaving(true);
    setError('');

    const { error } = await supabase
      .from('about_content')
      .update({
        hero_video_url: about.hero_video_url,
        hero_video_width: about.hero_video_width,
        hero_video_height: about.hero_video_height,
        use_legal_content: about.use_legal_content,
        title: about.title,
        about_text: about.about_text,
        updated_at: new Date().toISOString()
      })
      .eq('id', about.id);

    if (error) {
      setError('Failed to save about content');
    } else {
      setSuccess('About content saved!');
      setTimeout(() => setSuccess(''), 2000);
    }
    setIsSaving(false);
  }

  function handleUploadComplete(newUrl: string) {
    if (!about) return;
    setAbout({ ...about, hero_video_url: newUrl });
  }

  function handlePickerSelect(selectedUrl: string) {
    if (!about) return;
    setAbout({ ...about, hero_video_url: selectedUrl });
  }

  if (isLoading) {
    return <div className="text-zinc-500">Loading...</div>;
  }

  if (!about) {
    return <div className="text-zinc-500">No about content found. Run the SQL migration first.</div>;
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
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-white">About Video</h3>
          <span className="text-xs text-zinc-500">Portrait 9:16 recommended</span>
        </div>

        {about.hero_video_url && (
          <video
            key={about.hero_video_url}
            src={about.hero_video_url}
            className="w-32 rounded border border-zinc-700"
            muted
            playsInline
            loop
            autoPlay
          />
        )}

        <input
          type="url"
          value={about.hero_video_url || ''}
          onChange={(e) => setAbout({ ...about, hero_video_url: e.target.value || null })}
          placeholder="https://chromasmith-cdn.b-cdn.net/..."
          className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-green-500 text-sm"
        />

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPicker(true)}
            className="h-10 px-4 text-sm font-medium inline-flex items-center justify-center gap-2 bg-zinc-700 hover:bg-zinc-600 text-white rounded transition-colors"
          >
            Browse Library
          </button>
          <MediaUploader
            onUploadComplete={handleUploadComplete}
            folder="phleghm-website/about"
            accept="video/*"
            label="Upload New"
            className="h-10 px-4 text-sm font-medium inline-flex items-center justify-center gap-2 border border-zinc-600 hover:bg-zinc-700 text-white rounded transition-colors"
          />
        </div>

        <BunnyFilePicker
          isOpen={showPicker}
          onClose={() => setShowPicker(false)}
          onSelect={handlePickerSelect}
          folder="phleghm-website/about"
          filterType="video"
        />
      </div>

      {/* Content Sync Toggle */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-4">
        <h3 className="font-medium text-white">About Content</h3>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={about.use_legal_content}
            onChange={(e) => setAbout({ ...about, use_legal_content: e.target.checked })}
            className="w-5 h-5 rounded border-zinc-600 bg-zinc-900 text-green-500 focus:ring-green-500 focus:ring-offset-zinc-800"
          />
          <span className="text-zinc-300">Use Legal/Footer content</span>
        </label>

        {about.use_legal_content ? (
          <div className="bg-zinc-900 rounded p-4 border border-zinc-700">
            <p className="text-zinc-400 text-sm">
              Content synced from Legal/Footer settings. Edit it in the "Legal / Footer" section.
            </p>
          </div>
        ) : (
          <>
            {/* Custom Title */}
            <div className="space-y-1">
              <label className="text-sm text-zinc-400">Title</label>
              <input
                type="text"
                value={about.title}
                onChange={(e) => setAbout({ ...about, title: e.target.value })}
                placeholder="PHLEGM"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
              />
            </div>

            {/* Custom About Text */}
            <div className="space-y-1">
              <label className="text-sm text-zinc-400">About Text</label>
              <textarea
                value={about.about_text}
                onChange={(e) => setAbout({ ...about, about_text: e.target.value })}
                placeholder="Enter about text... Use double line breaks for paragraphs."
                rows={8}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm resize-none"
              />
            </div>
          </>
        )}

        <button
          onClick={saveAbout}
          disabled={isSaving}
          className="w-full py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 disabled:opacity-50 transition-colors"
        >
          {isSaving ? 'SAVING...' : 'SAVE ABOUT CONTENT'}
        </button>
      </div>
    </div>
  );
}
