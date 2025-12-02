'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Show {
  id: string;
  date: string;
  venue: string;
  city: string;
  ticket_link?: string | null;
  ticket_price?: string | null;
  notes?: string | null;
  event_name?: string | null;
}

type ShowType = 'upcoming' | 'past';

export default function ShowsEditor() {
  const [showType, setShowType] = useState<ShowType>('upcoming');
  const [shows, setShows] = useState<Show[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // New show form
  const [isAdding, setIsAdding] = useState(false);
  const [newShow, setNewShow] = useState<Partial<Show>>({
    date: '',
    venue: '',
    city: '',
    ticket_link: '',
    ticket_price: '',
    notes: '',
    event_name: ''
  });
  
  useEffect(() => {
    fetchShows();
  }, [showType]);
  
  async function fetchShows() {
    setIsLoading(true);
    const table = showType === 'upcoming' ? 'upcoming_shows' : 'past_shows';
    const order = showType === 'upcoming' ? { ascending: true } : { ascending: false };
    
    const { data, error } = await supabase
      .from(table)
      .select('*')
      .order('date', order);
    
    if (error) {
      setError('Failed to load shows');
    } else {
      setShows(data || []);
    }
    setIsLoading(false);
  }
  
  async function addShow() {
    if (!newShow.date || !newShow.venue || !newShow.city) {
      setError('Date, venue, and city are required');
      return;
    }
    
    const table = showType === 'upcoming' ? 'upcoming_shows' : 'past_shows';
    
    const { error } = await supabase.from(table).insert({
      date: newShow.date,
      venue: newShow.venue,
      city: newShow.city,
      ticket_link: newShow.ticket_link || null,
      ticket_price: newShow.ticket_price || null,
      notes: newShow.notes || null,
      event_name: newShow.event_name || null
    });
    
    if (error) {
      setError('Failed to add show');
    } else {
      setNewShow({ date: '', venue: '', city: '', ticket_link: '', ticket_price: '', notes: '', event_name: '' });
      setIsAdding(false);
      fetchShows();
      showSuccess('Show added!');
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
      showSuccess('Show deleted');
    }
  }
  
  async function updateShow(id: string, updates: Partial<Show>) {
    const table = showType === 'upcoming' ? 'upcoming_shows' : 'past_shows';
    const { error } = await supabase.from(table).update(updates).eq('id', id);
    
    if (error) {
      setError('Failed to update show');
    }
  }
  
  function showSuccess(msg: string) {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 2000);
  }
  
  function formatDate(dateStr: string) {
    const date = new Date(dateStr);
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
      
      {/* Toggle */}
      <div className="flex gap-2">
        <button
          onClick={() => setShowType('upcoming')}
          className={`flex-1 py-2 text-sm font-medium rounded transition-colors ${
            showType === 'upcoming'
              ? 'bg-green-500 text-black'
              : 'bg-zinc-800 text-zinc-400 hover:text-white'
          }`}
        >
          UPCOMING
        </button>
        <button
          onClick={() => setShowType('past')}
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
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-xs text-zinc-500 mb-1">Date *</label>
              <input
                type="date"
                value={newShow.date}
                onChange={(e) => setNewShow({ ...newShow, date: e.target.value })}
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white text-sm"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Venue *</label>
            <input
              type="text"
              value={newShow.venue}
              onChange={(e) => setNewShow({ ...newShow, venue: e.target.value })}
              placeholder="The Crocodile"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">City *</label>
            <input
              type="text"
              value={newShow.city}
              onChange={(e) => setNewShow({ ...newShow, city: e.target.value })}
              placeholder="Seattle, WA"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          {showType === 'upcoming' && (
            <>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Ticket Link</label>
                <input
                  type="url"
                  value={newShow.ticket_link || ''}
                  onChange={(e) => setNewShow({ ...newShow, ticket_link: e.target.value })}
                  placeholder="https://..."
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
                />
              </div>
              <div>
                <label className="block text-xs text-zinc-500 mb-1">Ticket Price</label>
                <input
                  type="text"
                  value={newShow.ticket_price || ''}
                  onChange={(e) => setNewShow({ ...newShow, ticket_price: e.target.value })}
                  placeholder="$15 / $20 door"
                  className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
                />
              </div>
            </>
          )}
          
          {showType === 'past' && (
            <div>
              <label className="block text-xs text-zinc-500 mb-1">Event Name</label>
              <input
                type="text"
                value={newShow.event_name || ''}
                onChange={(e) => setNewShow({ ...newShow, event_name: e.target.value })}
                placeholder="Underground Fridays"
                className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
              />
            </div>
          )}
          
          <div>
            <label className="block text-xs text-zinc-500 mb-1">Notes</label>
            <input
              type="text"
              value={newShow.notes || ''}
              onChange={(e) => setNewShow({ ...newShow, notes: e.target.value })}
              placeholder="All ages, 21+ bar"
              className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded text-white placeholder-zinc-500 text-sm"
            />
          </div>
          
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setIsAdding(false)}
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
                  <div className="text-green-500 text-sm font-medium">{formatDate(show.date)}</div>
                  <div className="text-white font-medium truncate">{show.venue}</div>
                  <div className="text-zinc-500 text-sm">{show.city}</div>
                  {show.event_name && (
                    <div className="text-xs text-green-500 mt-1">{show.event_name}</div>
                  )}
                  {show.notes && (
                    <div className="text-xs text-zinc-500 mt-1">{show.notes}</div>
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
