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
  event_name?: string | null;
}

export default function ShowsEditor() {
  const [shows, setShows] = useState<UpcomingShow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [eventName, setEventName] = useState('');
  const [date, setDate] = useState('');
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [ticketUrl, setTicketUrl] = useState('');
  
  // Track if form is visible (for new shows or editing)
  const [formVisible, setFormVisible] = useState(false);
  
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
  
  async function saveShow() {
    if (!date || !venue || !city) {
      setError('Date, venue, and city are required');
      return;
    }
    
    const showData: Record<string, unknown> = {
      show_date: date,
      venue: venue,
      city: city,
      event_name: eventName || null,
      ticket_url: ticketUrl || null,
    };
    
    if (editingId) {
      // Update existing show
      const { error } = await supabase
        .from('upcoming_shows')
        .update(showData)
        .eq('id', editingId);
      
      if (error) {
        setError('Failed to update show');
      } else {
        resetForm();
        fetchShows();
        showSuccessMsg('Show updated!');
      }
    } else {
      // Insert new show
      const { error } = await supabase
        .from('upcoming_shows')
        .insert(showData);
      
      if (error) {
        setError('Failed to add show');
      } else {
        resetForm();
        fetchShows();
        showSuccessMsg('Show added!');
      }
    }
  }
  
  async function deleteShow(id: string) {
    if (!confirm('Delete this show?')) return;
    
    const { error } = await supabase
      .from('upcoming_shows')
      .delete()
      .eq('id', id);
    
    if (error) {
      setError('Failed to delete show');
    } else {
      // If we were editing this show, clear the form
      if (editingId === id) {
        resetForm();
      }
      fetchShows();
      showSuccessMsg('Show deleted');
    }
  }
  
  function editShow(show: UpcomingShow) {
    setEditingId(show.id);
    setEventName(show.event_name || '');
    setDate(show.show_date);
    setVenue(show.venue);
    setCity(show.city);
    setTicketUrl(show.ticket_url || '');
    setFormVisible(true);
  }
  
  function resetForm() {
    setEditingId(null);
    setEventName('');
    setDate('');
    setVenue('');
    setCity('');
    setTicketUrl('');
    setFormVisible(false);
  }
  
  function showSuccessMsg(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2000);
  }
  
  function formatDate(dateStr: string) {
    const d = new Date(dateStr + 'T00:00:00');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
      {!formVisible && (
        <button
          onClick={() => setFormVisible(true)}
          className="w-full py-2 bg-zinc-800 text-white text-sm font-medium rounded hover:bg-zinc-700 border border-dashed border-zinc-600"
        >
          + ADD SHOW
        </button>
      )}
      
      {/* Form (Add/Edit) */}
      {formVisible && (
        <div className="bg-zinc-800 rounded-lg p-4 border border-zinc-700 space-y-3">
          <div className="text-xs text-zinc-400 font-medium mb-2">
            {editingId ? 'EDIT SHOW' : 'NEW SHOW'}
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Event Name</label>
            <input
              type="text"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Phlegm and Friends"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Date *</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm [color-scheme:dark]"
            />
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Venue *</label>
            <input
              type="text"
              value={venue}
              onChange={(e) => setVenue(e.target.value)}
              placeholder="The Crocodile"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">City *</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Seattle, WA"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Ticket URL</label>
            <input
              type="url"
              value={ticketUrl}
              onChange={(e) => setTicketUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={resetForm}
              className="flex-1 py-2 bg-zinc-700 text-white text-sm font-medium rounded hover:bg-zinc-600"
            >
              CANCEL
            </button>
            <button
              onClick={saveShow}
              className="flex-1 py-2 bg-green-500 text-black text-sm font-bold rounded hover:bg-green-400"
            >
              SAVE
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
                  {show.event_name && (
                    <div className="text-green-400 text-sm font-semibold mb-1">{show.event_name}</div>
                  )}
                  <div className="text-green-500 text-sm font-medium">{formatDate(show.show_date)}</div>
                  <div className="text-white font-medium truncate">{show.venue}</div>
                  <div className="text-zinc-500 text-sm">{show.city}</div>
                  {show.ticket_url && (
                    <a 
                      href={show.ticket_url} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-xs text-blue-400 mt-1 block truncate hover:underline"
                    >
                      {show.ticket_url}
                    </a>
                  )}
                </div>
                <div className="flex gap-1 flex-shrink-0">
                  <button
                    onClick={() => editShow(show)}
                    className="text-zinc-500 hover:text-white p-1"
                    title="Edit show"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => deleteShow(show.id)}
                    className="text-zinc-500 hover:text-red-500 p-1"
                    title="Delete show"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
