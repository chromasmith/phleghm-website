'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

interface BookingInfo {
  id: string;
  booking_email: string | null;
  booking_phone: string | null;
  manager_name: string | null;
  additional_notes: string | null;
}

const PLATFORMS = ['TikTok', 'YouTube', 'Instagram', 'Spotify', 'SoundCloud', 'Twitter', 'Facebook', 'Other'];

export default function ContactEditor() {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // New link form
  const [newPlatform, setNewPlatform] = useState('TikTok');
  const [newUrl, setNewUrl] = useState('');
  
  useEffect(() => {
    fetchData();
  }, []);
  
  async function fetchData() {
    setIsLoading(true);
    
    const [linksRes, bookingRes] = await Promise.all([
      supabase.from('social_links').select('*').order('sort_order'),
      supabase.from('booking_info').select('*').limit(1).single()
    ]);
    
    if (linksRes.data) setSocialLinks(linksRes.data);
    if (bookingRes.data) setBookingInfo(bookingRes.data);
    
    setIsLoading(false);
  }
  
  async function addSocialLink() {
    if (!newUrl.trim()) return;
    setIsSaving(true);
    
    const { error } = await supabase.from('social_links').insert({
      platform: newPlatform,
      url: newUrl.trim(),
      is_primary: false,
      sort_order: socialLinks.length
    });
    
    if (error) {
      setError('Failed to add link');
    } else {
      setNewUrl('');
      fetchData();
      showSuccess('Link added!');
    }
    setIsSaving(false);
  }
  
  async function updateSocialLink(id: string, updates: Partial<SocialLink>) {
    const { error } = await supabase
      .from('social_links')
      .update(updates)
      .eq('id', id);
    
    if (error) {
      setError('Failed to update link');
    } else {
      fetchData();
    }
  }
  
  async function deleteSocialLink(id: string) {
    if (!confirm('Delete this link?')) return;
    
    const { error } = await supabase.from('social_links').delete().eq('id', id);
    
    if (error) {
      setError('Failed to delete link');
    } else {
      fetchData();
      showSuccess('Link deleted');
    }
  }
  
  async function togglePrimary(id: string, currentlyPrimary: boolean) {
    if (currentlyPrimary) {
      // Turn off primary
      await supabase.from('social_links').update({ is_primary: false }).eq('id', id);
    } else {
      // Clear all, then set new primary
      await supabase.from('social_links').update({ is_primary: false }).neq('id', '');
      await supabase.from('social_links').update({ is_primary: true }).eq('id', id);
    }
    fetchData();
    showSuccess('Primary updated');
  }
  
  async function saveBookingInfo() {
    if (!bookingInfo) return;
    setIsSaving(true);
    
    const { error } = await supabase
      .from('booking_info')
      .update({
        booking_email: bookingInfo.booking_email,
        booking_phone: bookingInfo.booking_phone,
        manager_name: bookingInfo.manager_name,
        additional_notes: bookingInfo.additional_notes,
        updated_at: new Date().toISOString()
      })
      .eq('id', bookingInfo.id);
    
    if (error) {
      setError('Failed to save booking info');
    } else {
      showSuccess('Booking info saved!');
    }
    setIsSaving(false);
  }
  
  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2000);
  }
  
  if (isLoading) {
    return <div className="text-zinc-500">Loading...</div>;
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
      
      {/* Social Links Section */}
      <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-4">
        <h3 className="font-medium text-white">Social Links</h3>
        
        {/* Add New */}
        <div className="flex gap-2">
          <select
            value={newPlatform}
            onChange={(e) => setNewPlatform(e.target.value)}
            className="px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm"
          >
            {PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
          <input
            type="url"
            value={newUrl}
            onChange={(e) => setNewUrl(e.target.value)}
            placeholder="https://..."
            className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
          />
          <button
            onClick={addSocialLink}
            disabled={isSaving || !newUrl.trim()}
            className="px-4 py-2 bg-green-500 text-black font-bold rounded text-sm disabled:opacity-50"
          >
            ADD
          </button>
        </div>
        
        {/* Links List */}
        <div className="space-y-2">
          {socialLinks.map((link) => (
            <div
              key={link.id}
              className={`flex items-center gap-2 p-3 bg-zinc-900 rounded border ${
                link.is_primary ? 'border-green-500' : 'border-zinc-700'
              }`}
            >
              <span className="text-sm font-medium text-white w-24">{link.platform}</span>
              <input
                type="url"
                value={link.url}
                onChange={(e) => {
                  const updated = socialLinks.map(l =>
                    l.id === link.id ? { ...l, url: e.target.value } : l
                  );
                  setSocialLinks(updated);
                }}
                onBlur={(e) => updateSocialLink(link.id, { url: e.target.value })}
                className="flex-1 px-2 py-1 bg-transparent text-white text-sm focus:outline-none"
              />
              <button
                onClick={() => togglePrimary(link.id, link.is_primary)}
                className={`text-xs px-2 py-1 rounded ${
                  link.is_primary
                    ? 'bg-green-500 text-black'
                    : 'bg-zinc-700 text-zinc-400 hover:text-white'
                }`}
              >
                {link.is_primary ? 'PRIMARY' : 'Set Primary'}
              </button>
              <button
                onClick={() => deleteSocialLink(link.id)}
                className="text-zinc-500 hover:text-red-500 p-1"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      
      {/* Booking Info Section */}
      {bookingInfo && (
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-4">
          <h3 className="font-medium text-white">Booking Info</h3>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Email</label>
            <input
              type="email"
              value={bookingInfo.booking_email || ''}
              onChange={(e) => setBookingInfo({ ...bookingInfo, booking_email: e.target.value })}
              placeholder="booking@phlegm.com"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Phone</label>
            <input
              type="tel"
              value={bookingInfo.booking_phone || ''}
              onChange={(e) => setBookingInfo({ ...bookingInfo, booking_phone: e.target.value })}
              placeholder="(555) 123-4567"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Manager Name</label>
            <input
              type="text"
              value={bookingInfo.manager_name || ''}
              onChange={(e) => setBookingInfo({ ...bookingInfo, manager_name: e.target.value })}
              placeholder="Manager name"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Additional Notes</label>
            <textarea
              value={bookingInfo.additional_notes || ''}
              onChange={(e) => setBookingInfo({ ...bookingInfo, additional_notes: e.target.value })}
              placeholder="Any additional booking info..."
              rows={3}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm resize-none"
            />
          </div>
          
          <button
            onClick={saveBookingInfo}
            disabled={isSaving}
            className="w-full py-2 bg-green-500 text-black font-bold rounded text-sm disabled:opacity-50"
          >
            {isSaving ? 'SAVING...' : 'SAVE BOOKING INFO'}
          </button>
        </div>
      )}
    </div>
  );
}
