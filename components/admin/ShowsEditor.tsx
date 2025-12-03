'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import MediaUploader from './MediaUploader';
import BunnyFilePicker from './BunnyFilePicker';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface UpcomingShow {
  id: string;
  show_date: string;
  venue: string;
  city: string;
  ticket_url?: string | null;
}

interface PastShow {
  id: string;
  show_date: string;
  venue: string;
  city: string;
  event_name?: string | null;
  image_urls?: string[] | null;
}

type ShowType = 'upcoming' | 'past';

export default function ShowsEditor() {
  const [showType, setShowType] = useState<ShowType>('upcoming');
  const [shows, setShows] = useState<(UpcomingShow | PastShow)[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // New show form
  const [isAdding, setIsAdding] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newTicketUrl, setNewTicketUrl] = useState('');
  const [newEventName, setNewEventName] = useState('');
  
  // Media upload state
  const [showMediaPicker, setShowMediaPicker] = useState(false);
  const [mediaUrls, setMediaUrls] = useState<string[]>([]);
  
  useEffect(() => {
    fetchShows();
  }, [showType]);
  
  async function fetchShows() {
    setIsLoading(true);
    setError('');
    const table = showType === 'upcoming' ? 'upcoming_shows' : 'past_shows';
    const order = showType === 'upcoming' ? { ascending: true } : { ascending: false };
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('show_date', order);
    
    if (error) {
      setError('Failed to load shows');
    } else {
      setShows(data || []);
    }
    setIsLoading(false);
  }
  
  async function addShow() {
    if (!newDate || !newVenue || !newCity) {
      setError('Date, venue, and city are required');
      return;
    }
    
    const table = showType === 'upcoming' ? 'upcoming_shows' : 'past_shows';
    
    let insertData: Record<string, unknown> = {
      show_date: newDate,
      venue: newVenue,
      city: newCity
    };
    
    if (showType === 'upcoming' && newTicketUrl) {
      insertData.ticket_url = newTicketUrl;
    }
    
    if (showType === 'past') {
      if (newEventName) {
        insertData.event_name = newEventName;
      }
      if (mediaUrls.length > 0) {
        insertData.image_urls = mediaUrls;
      }
    }
    
    const { error } = await supabase.from(table).insert(insertData);
    
    if (error) {
      setError('Failed to add show');
    } else {
      resetForm();
      setIsAdding(false);
      fetchShows();
      showSuccessMsg('Show added!');
    }
  }
  
  async function deleteShow(id: string) {
    if (!confirm('Delete this show?')) return;
    
    const table = showType === 'upcoming' ? 'upcoming_shows' : 'past_shows';
    const { error } = await supabase.from(table).delete().eq('id', id);
    
    if (error) {
      setError('Failed to delete show');
    } else {
      fetchShows();
      showSuccessMsg('Show deleted');
    }
  }
  
  function resetForm() {
    setNewDate('');
    setNewVenue('');
    setNewCity('');
    setNewTicketUrl('');
    setNewEventName('');
    setMediaUrls([]);
  }
  
  function showSuccessMsg(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2000);
  }
  
  function formatDate(dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
  
  function handleMediaSelect(url: string) {
    if (!mediaUrls.includes(url)) {
      setMediaUrls([...mediaUrls, url]);
    }
    setShowMediaPicker(false);
  }
  
  function handleMediaUpload(url: string) {
    if (!mediaUrls.includes(url)) {
      setMediaUrls([...mediaUrls, url]);
    }
  }
  
  function removeMedia(url: string) {
    setMediaUrls(mediaUrls.filter(u => u !== url));
  }
  
  function isVideo(url: string) {
    return /\.(mp4|webm|mov|avi)$/i.test(url);
  }
  
  return (
    <div className="space-y-4">
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
      
      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => { setShowType('upcoming'); setIsAdding(false); }}
          className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
            showType === 'upcoming'
              ? 'bg-green-500 text-black'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          UPCOMING
        </button>
        <button
          onClick={() => { setShowType('past'); setIsAdding(false); }}
          className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
            showType === 'past'
              ? 'bg-green-500 text-black'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          PAST
        </button>
      </div>
      
      {/* Add Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-2 bg-zinc-800 text-white text-sm font-medium rounded hover:bg-zinc-700 border border-dashed border-zinc-600"
        >
          + ADD {showType.toUpperCase()} SHOW
        </button>
      )}
      
      {/* Add Form */}
      {isAdding && (
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-3">
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Date *</label>
            <div className="relative">
              <input
                type="date"
                value={newDate}
                onChange={(e) => setNewDate(e.target.value)}
                className="w-full px-3 py-2 pr-10 bg-zinc-900 border border-zinc-700 rounded text-white text-sm [color-scheme:dark]"
              />
              <svg 
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white pointer-events-none" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Venue *</label>
            <input
              type="text"
              value={newVenue}
              onChange={(e) => setNewVenue(e.target.value)}
              placeholder="The Crocodile"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">City *</label>
            <input
              type="text"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
              placeholder="Seattle, WA"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          {showType === 'upcoming' && (
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Ticket URL</label>
              <input
                type="url"
                value={newTicketUrl}
                onChange={(e) => setNewTicketUrl(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
              />
            </div>
          )}
          
          {showType === 'past' && (
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Event Name</label>
              <input
                type="text"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                placeholder="Underground Fridays"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
              />
            </div>
          )}
          
          {/* Media Upload Section */}
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Photos & Videos</label>
            <div className="flex flex-col sm:flex-row gap-2">
              <button
                type="button"
                onClick={() => setShowMediaPicker(true)}
                className="flex-1 py-2 px-3 bg-zinc-700 text-white text-sm font-medium rounded hover:bg-zinc-600 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Browse Library
              </button>
              <MediaUploader
                folder="phleghm-website/shows/"
                accept="image/*,video/*"
                onUpload={handleMediaUpload}
                buttonText="Upload New"
                buttonClassName="flex-1 py-2 px-3 bg-green-600 text-white text-sm font-medium rounded hover:bg-green-500 flex items-center justify-center gap-2"
              />
            </div>
            
            {/* Media Thumbnails */}
            {mediaUrls.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                {mediaUrls.map((url, idx) => (
                  <div key={idx} className="relative group aspect-square bg-zinc-900 rounded overflow-hidden">
                    {isVideo(url) ? (
                      <video 
                        src={url} 
                        className="w-full h-full object-cover"
                        muted
                      />
                    ) : (
                      <img 
                        src={url} 
                        alt={`Media ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <button
                      type="button"
                      onClick={() => removeMedia(url)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                    {isVideo(url) && (
                      <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                        VIDEO
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => { setIsAdding(false); resetForm(); }}
              className="flex-1 py-2 bg-zinc-700 text-white text-sm font-medium rounded"
            >
              CANCEL
            </button>
            <button
              onClick={addShow}
              className="flex-1 py-2 bg-green-500 text-black text-sm font-bold rounded"
            >
              ADD SHOW
            </button>
          </div>
        </div>
      )}
      
      {/* BunnyFilePicker Modal */}
      {showMediaPicker && (
        <BunnyFilePicker
          folder="phleghm-website/shows/"
          accept="image/*,video/*"
          onSelect={handleMediaSelect}
          onClose={() => setShowMediaPicker(false)}
        />
      )}
      
      {/* Shows List */}
      {isLoading ? (
        <div className="text-zinc-500">Loading...</div>
      ) : shows.length === 0 ? (
        <div className="text-zinc-500 text-center py-8">No {showType} shows yet.</div>
      ) : (
        <div className="space-y-2">
          {shows.map((show) => (
            <div
              key={show.id}
              className="bg-zinc-800 rounded-lg p-4 border border-zinc-700"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="text-green-500 text-sm font-medium">{formatDate(show.show_date)}</div>
                  <div className="text-white font-medium truncate">{show.venue}</div>
                  <div className="text-zinc-500 text-sm">{show.city}</div>
                  {'event_name' in show && show.event_name && (
                    <div className="text-xs text-green-500 mt-1">{show.event_name}</div>
                  )}
                  {'ticket_url' in show && show.ticket_url && (
                    <a href={show.ticket_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 mt-1 block truncate hover:underline">
                      {show.ticket_url}
                    </a>
                  )}
                  {'image_urls' in show && show.image_urls && show.image_urls.length > 0 && (
                    <div className="flex gap-1 mt-2 overflow-x-auto">
                      {show.image_urls.slice(0, 4).map((url, idx) => (
                        <div key={idx} className="w-12 h-12 flex-shrink-0 bg-zinc-900 rounded overflow-hidden">
                          {isVideo(url) ? (
                            <video src={url} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={url} alt="" className="w-full h-full object-cover" />
                          )}
                        </div>
                      ))}
                      {show.image_urls.length > 4 && (
                        <div className="w-12 h-12 flex-shrink-0 bg-zinc-900 rounded flex items-center justify-center text-xs text-zinc-400">
                          +{show.image_urls.length - 4}
                        </div>
                      )}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => deleteShow(show.id)}
                  className="text-zinc-500 hover:text-red-500 p-1 flex-shrink-0"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
