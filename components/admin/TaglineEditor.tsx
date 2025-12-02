'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase';

interface Tagline {
  id: string;
  text: string;
  sort_order: number;
  is_active: boolean;
}

export default function TaglineEditor() {
  const [taglines, setTaglines] = useState<Tagline[]>([]);
  const [newTagline, setNewTagline] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  
  const supabase = createClient();
  
  useEffect(() => {
    fetchTaglines();
  }, []);
  
  async function fetchTaglines() {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('taglines')
      .select('*')
      .order('sort_order', { ascending: true });
    
    if (error) {
      setError('Failed to load taglines');
    } else {
      setTaglines(data || []);
    }
    setIsLoading(false);
  }
  
  async function addTagline() {
    if (!newTagline.trim()) return;
    setIsSaving(true);
    
    const { error } = await supabase
      .from('taglines')
      .insert({
        text: newTagline.trim(),
        sort_order: taglines.length,
        is_active: true
      });
    
    if (error) {
      setError('Failed to add tagline');
    } else {
      setNewTagline('');
      fetchTaglines();
    }
    setIsSaving(false);
  }
  
  async function toggleActive(id: string, currentState: boolean) {
    const { error } = await supabase
      .from('taglines')
      .update({ is_active: !currentState })
      .eq('id', id);
    
    if (error) {
      setError('Failed to update tagline');
    } else {
      fetchTaglines();
    }
  }
  
  async function deleteTagline(id: string) {
    if (!confirm('Delete this tagline?')) return;
    
    const { error } = await supabase
      .from('taglines')
      .delete()
      .eq('id', id);
    
    if (error) {
      setError('Failed to delete tagline');
    } else {
      fetchTaglines();
    }
  }
  
  async function updateTagline(id: string, text: string) {
    const { error } = await supabase
      .from('taglines')
      .update({ text })
      .eq('id', id);
    
    if (error) {
      setError('Failed to update tagline');
    }
  }
  
  if (isLoading) {
    return <div className="text-zinc-500">Loading taglines...</div>;
  }
  
  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-2 rounded">
          {error}
          <button onClick={() => setError('')} className="ml-2 underline">dismiss</button>
        </div>
      )}
      
      {/* Add New */}
      <div className="flex gap-2">
        <input
          type="text"
          value={newTagline}
          onChange={(e) => setNewTagline(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addTagline()}
          placeholder="New tagline..."
          className="flex-1 px-4 py-3 bg-zinc-800 border border-zinc-700 rounded text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
        />
        <button
          onClick={addTagline}
          disabled={isSaving || !newTagline.trim()}
          className="px-4 py-3 bg-green-500 text-black font-bold rounded hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          ADD
        </button>
      </div>
      
      {/* Tagline List */}
      <div className="space-y-2">
        {taglines.map((tagline) => (
          <div
            key={tagline.id}
            className={`flex items-center gap-3 p-3 bg-zinc-800 rounded border ${
              tagline.is_active ? 'border-zinc-700' : 'border-zinc-800 opacity-50'
            }`}
          >
            {/* Toggle */}
            <button
              onClick={() => toggleActive(tagline.id, tagline.is_active)}
              className={`w-10 h-6 rounded-full transition-colors ${
                tagline.is_active ? 'bg-green-500' : 'bg-zinc-600'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full transition-transform ${
                  tagline.is_active ? 'translate-x-4' : 'translate-x-0.5'
                }`}
              />
            </button>
            
            {/* Text */}
            <input
              type="text"
              value={tagline.text}
              onChange={(e) => {
                const updated = taglines.map(t =>
                  t.id === tagline.id ? { ...t, text: e.target.value } : t
                );
                setTaglines(updated);
              }}
              onBlur={(e) => updateTagline(tagline.id, e.target.value)}
              className="flex-1 bg-transparent text-white focus:outline-none"
            />
            
            {/* Delete */}
            <button
              onClick={() => deleteTagline(tagline.id)}
              className="text-zinc-500 hover:text-red-500 transition-colors p-1"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </div>
        ))}
      </div>
      
      {taglines.length === 0 && (
        <p className="text-zinc-500 text-center py-8">No taglines yet. Add one above.</p>
      )}
    </div>
  );
}
