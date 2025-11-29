'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SocialLink {
  id: string;
  platform: string;
  url: string;
  is_primary: boolean;
  sort_order: number;
}

interface BookingInfo {
  booking_email: string | null;
  booking_phone: string | null;
  manager_name: string | null;
  additional_notes: string | null;
}

// Platform icons - keyed by platform name
const platformIcons: Record<string, JSX.Element> = {
  TikTok: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
    </svg>
  ),
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
    </svg>
  ),
  Spotify: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
    </svg>
  ),
  SoundCloud: (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
      <path d="M1.175 12.225c-.051 0-.094.046-.101.1l-.233 2.154.233 2.105c.007.058.05.098.101.098.05 0 .09-.04.099-.098l.255-2.105-.27-2.154c-.009-.06-.052-.1-.102-.1m-.899.828c-.06 0-.091.037-.104.094L0 14.479l.165 1.308c.014.057.045.094.09.094s.089-.037.099-.094l.19-1.308-.19-1.334c-.01-.057-.044-.09-.09-.09m1.83-1.229c-.061 0-.12.045-.12.104l-.21 2.563.225 2.458c0 .06.045.104.106.104.061 0 .12-.044.12-.104l.24-2.458-.24-2.563c0-.06-.059-.104-.12-.104m.945-.089c-.075 0-.135.06-.15.135l-.193 2.64.21 2.544c.016.077.075.138.149.138.075 0 .135-.061.15-.138l.225-2.544-.225-2.64c-.015-.075-.075-.135-.15-.135m1.065.202c-.09 0-.166.075-.166.165l-.165 2.445.18 2.49c0 .09.075.164.165.164.089 0 .165-.074.165-.164l.195-2.49-.195-2.445c0-.09-.075-.165-.165-.165m1.035-.397c-.104 0-.176.086-.193.18l-.164 2.66.18 2.494c.017.09.09.18.18.18.09 0 .164-.09.181-.18l.193-2.489-.21-2.659c-.016-.09-.09-.18-.18-.18m1.095-.24c-.12 0-.21.09-.225.21l-.151 2.67.166 2.494c.015.12.105.21.21.21.119 0 .209-.09.224-.21l.18-2.494-.18-2.67c-.015-.12-.105-.21-.21-.21m1.155-.449c-.135 0-.24.105-.255.24l-.15 2.88.15 2.459c.015.135.12.24.255.24.12 0 .24-.105.24-.24l.165-2.459-.165-2.88c0-.135-.12-.24-.24-.24m1.125-.034c-.148 0-.27.12-.27.27l-.135 2.67.15 2.459c0 .15.12.27.27.27.135 0 .255-.12.27-.27l.166-2.459-.166-2.67c-.015-.15-.135-.27-.27-.27m1.172-.085c-.165 0-.3.135-.3.3l-.12 2.512.135 2.444c0 .165.135.3.285.3.165 0 .3-.135.315-.3l.15-2.444-.15-2.512c-.015-.165-.15-.3-.3-.3m1.155.36c-.18 0-.315.135-.33.315l-.105 2.16.12 2.415c.015.18.15.315.315.315.18 0 .315-.135.315-.315l.135-2.415-.135-2.16c-.015-.18-.135-.315-.315-.315m1.14-.615c-.195 0-.345.15-.36.345l-.105 2.415.12 2.4c.015.195.165.345.345.345.195 0 .345-.15.36-.345l.12-2.4-.12-2.415c-.015-.195-.165-.345-.345-.345m1.155.195c-.21 0-.375.165-.375.375l-.09 1.845.105 2.385c0 .21.165.375.375.375.195 0 .375-.165.375-.375l.105-2.385-.12-1.845c0-.21-.165-.375-.36-.375m1.14-.93c-.209 0-.39.18-.39.39l-.09 2.775.105 2.355c.015.21.181.39.391.39.21 0 .375-.18.39-.39l.12-2.355-.12-2.775c-.015-.21-.181-.39-.391-.39m1.186.615c-.225 0-.405.18-.42.405l-.075 2.16.09 2.34c.015.225.195.405.405.405.225 0 .405-.18.405-.405l.105-2.34-.105-2.16c0-.225-.18-.405-.405-.405m1.14-.855c-.225 0-.42.195-.435.42l-.074 3.015.089 2.31c.016.24.196.42.42.42.24 0 .42-.18.435-.42l.105-2.31-.105-3.015c-.015-.225-.195-.42-.42-.42m1.186.45c-.24 0-.435.21-.435.449l-.06 2.566.075 2.294c0 .24.195.45.435.45.24 0 .435-.21.45-.45l.09-2.294-.09-2.566c-.015-.24-.21-.449-.45-.449m1.14-.585c-.255 0-.45.21-.465.45l-.06 3.15.075 2.265c.015.255.21.465.45.465.255 0 .45-.21.465-.465l.09-2.265-.09-3.15c-.015-.24-.21-.45-.45-.45m1.231.255c-.27 0-.48.224-.495.48l-.045 2.415.06 2.25c.015.27.225.48.48.48.27 0 .48-.21.495-.48l.075-2.25-.075-2.415c-.015-.255-.225-.48-.48-.48m1.17-.645c-.285 0-.51.24-.51.51l-.045 3.06.06 2.22c0 .27.225.51.495.51.285 0 .51-.24.51-.51l.075-2.22-.075-3.06c0-.27-.225-.51-.495-.51m1.215.585c-.3 0-.525.24-.54.525l-.03 2.475.045 2.19c.015.3.24.54.525.54.3 0 .525-.24.54-.54l.06-2.19-.06-2.475c-.015-.285-.24-.525-.525-.525m1.14-1.065c-.3 0-.555.255-.555.54l-.03 3.54.045 2.175c.015.3.255.54.54.54.3 0 .54-.24.555-.54l.06-2.175-.06-3.54c0-.285-.255-.54-.54-.54m1.23.27c-.315 0-.57.255-.585.555l-.015 3.255.03 2.16c.015.315.27.57.57.57.315 0 .57-.255.57-.57l.045-2.16-.045-3.255c0-.3-.255-.555-.555-.555m2.344 1.32c-.27 0-.48.12-.66.3-.18.18-.285.42-.285.69l.015 2.16.03 2.1c.015.57.465 1.02 1.035 1.02h3.69c.84 0 1.695-.255 2.4-.69 1.095-.72 1.815-1.95 1.815-3.345 0-2.25-1.83-4.08-4.08-4.08-.57 0-1.11.12-1.605.315-.42-2.37-2.49-4.17-4.995-4.17-1.26 0-2.415.45-3.315 1.2-.24.21-.285.375-.285.585v8.25"/>
    </svg>
  ),
};

// Fallback icon for unknown platforms
const fallbackIcon = (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
  </svg>
);

export default function ContactModal({ isOpen, onClose }: ContactModalProps) {
  const [socialLinks, setSocialLinks] = useState<SocialLink[]>([]);
  const [bookingInfo, setBookingInfo] = useState<BookingInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    async function fetchData() {
      setLoading(true);

      // Fetch social links
      const { data: linksData, error: linksError } = await supabase
        .from('social_links')
        .select('*')
        .eq('is_active', true)
        .order('sort_order', { ascending: true });

      if (linksError) {
        console.error('Error fetching social links:', linksError);
      } else {
        setSocialLinks(linksData || []);
      }

      // Fetch booking info
      const { data: bookingData, error: bookingError } = await supabase
        .from('booking_info')
        .select('*')
        .limit(1)
        .single();

      if (bookingError) {
        console.error('Error fetching booking info:', bookingError);
      } else {
        setBookingInfo(bookingData);
      }

      setLoading(false);
    }

    fetchData();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/95"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto bg-zinc-900 border border-zinc-700">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-[#00ff41] transition-colors text-2xl z-20"
          aria-label="Close contact"
        >
          ✕
        </button>

        <div className="p-6 md:p-8">
          {/* Title */}
          <h2 
            className="text-[#00ff41] text-3xl md:text-4xl font-black tracking-tight mb-8" 
            style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
          >
            CONTACT
          </h2>

          {loading ? (
            <div className="text-zinc-500 font-mono text-sm">Loading...</div>
          ) : (
            <>
              {/* Social Links */}
              {socialLinks.length > 0 && (
                <div className="mb-8">
                  <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-4">Connect</p>
                  <div className="grid grid-cols-5 gap-3">
                    {socialLinks.map((link) => (
                      <a
                        key={link.id}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`flex items-center justify-center p-3 border transition-colors ${
                          link.is_primary 
                            ? 'border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black' 
                            : 'border-zinc-700 text-zinc-400 hover:border-[#00ff41] hover:text-[#00ff41]'
                        }`}
                        title={link.platform}
                      >
                        {platformIcons[link.platform] || fallbackIcon}
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Booking Info */}
              {bookingInfo && (
                <div className="mb-6">
                  <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-4">Booking</p>
                  
                  {bookingInfo.booking_email && (
                    <a 
                      href={`mailto:${bookingInfo.booking_email}`}
                      className="block text-white hover:text-[#00ff41] transition-colors font-mono text-lg mb-2"
                    >
                      {bookingInfo.booking_email}
                    </a>
                  )}

                  {bookingInfo.booking_phone && (
                    <a 
                      href={`tel:${bookingInfo.booking_phone}`}
                      className="block text-white hover:text-[#00ff41] transition-colors font-mono text-lg mb-2"
                    >
                      {bookingInfo.booking_phone}
                    </a>
                  )}

                  {bookingInfo.manager_name && (
                    <p className="text-zinc-400 font-mono text-sm mb-2">
                      Manager: {bookingInfo.manager_name}
                    </p>
                  )}
                  
                  {bookingInfo.additional_notes && (
                    <p className="text-zinc-500 font-mono text-sm">
                      {bookingInfo.additional_notes}
                    </p>
                  )}
                </div>
              )}
            </>
          )}

          {/* Close Button Bottom */}
          <button
            onClick={onClose}
            className="w-full py-4 mt-6 border border-zinc-700 text-zinc-500 hover:text-[#00ff41] hover:border-[#00ff41] transition-colors uppercase tracking-[0.3em] text-sm font-mono"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}