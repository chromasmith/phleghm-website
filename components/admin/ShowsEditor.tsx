'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

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

export default function ShowsEditor() {
  const [shows, setShows] = useState<UpcomingShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // New show form
  const [isAdding, setIsAdding] = useState(false);
  const [newDate, setNewDate] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newTicketUrl, setNewTicketUrl] = useState('');
  
  useEffect(() => {
    fetchShows();
  }, []);
  
  async function fetchShows() {
    setIsLoading(true);
    setError('');
    
    const { data, error } = await supabase
      .from('upcoming_shows')
      .select('*')
      .order('show_date', { ascending: true });
    
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
    
    const insertData: Record<string, unknown> = {
      show_date: newDate,
      venue: newVenue,
      city: newCity
    };
    
    if (newTicketUrl) {
      insertData.ticket_url = newTicketUrl;
    }
    
    const { error } = await supabase.from('upcoming_shows').insert(insertData);
    
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
    
    const { error } = await supabase.from('upcoming_shows').delete().eq('id', id);
    
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
  }
  
  function showSuccessMsg(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2000);
  }
  
  function formatDate(dateStr: string) {
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
      
      {/* Add Button */}
      {!isAdding && (
        <button
          onClick={() => setIsAdding(true)}
          className="w-full py-2 bg-zinc-800 text-white text-sm font-medium rounded hover:bg-zinc-700 border border-dashed border-zinc-600"
        >
          + ADD UPCOMING SHOW
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
      
      {/* Shows List */}
      {isLoading ? (
        <div className="text-zinc-500">Loading...</div>
      ) : shows.length === 0 ? (
        <div className="text-zinc-500 text-center py-8">No upcoming shows yet.</div>
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
                  {show.ticket_url && (
                    <a href={show.ticket_url} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-400 mt-1 block truncate hover:underline">
                      {show.ticket_url}
                    </a>
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
