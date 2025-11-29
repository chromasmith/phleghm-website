'use client';

// Banner configuration - will be controlled by admin/database later
const BANNER_CONFIG = {
  enabled: true,
  text: 'NEW SINGLE "STATIC DREAMS" OUT NOW',
  subtext: 'Available on all platforms',
  media: null, // URL to image or video, or null for text-only
  mediaType: null, // 'image' | 'video' | null
  linkUrl: 'https://open.spotify.com/artist/3brB4yhi4ZJtxQkbZX0wkk',
  linkText: 'LISTEN NOW',
};

export default function AnnouncementBanner() {
  if (!BANNER_CONFIG.enabled) return null;

  return (
    <div className="w-full bg-zinc-900 border-y border-zinc-800">
      <div className="max-w-7xl mx-auto">
        {/* Banner with optional media */}
        <div className="flex flex-col md:flex-row items-center">
          
          {/* Media Section (if present) */}
          {BANNER_CONFIG.media && BANNER_CONFIG.mediaType === 'image' && (
            <div className="w-full md:w-48 h-32 md:h-auto md:aspect-square flex-shrink-0 bg-black">
              <img 
                src={BANNER_CONFIG.media} 
                alt="Announcement" 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          {BANNER_CONFIG.media && BANNER_CONFIG.mediaType === 'video' && (
            <div className="w-full md:w-48 h-32 md:h-auto md:aspect-square flex-shrink-0 bg-black">
              <video 
                src={BANNER_CONFIG.media} 
                autoPlay 
                loop 
                muted 
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Content Section */}
          <div className="flex-1 flex flex-col md:flex-row items-center justify-between gap-4 p-6 md:px-8">
            {/* Text */}
            <div className="text-center md:text-left">
              <p 
                className="text-[#00ff41] text-lg md:text-xl font-black tracking-tight"
                style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
              >
                {BANNER_CONFIG.text}
              </p>
              {BANNER_CONFIG.subtext && (
                <p className="text-zinc-500 text-sm font-mono mt-1">
                  {BANNER_CONFIG.subtext}
                </p>
              )}
            </div>

            {/* CTA Button */}
            {BANNER_CONFIG.linkUrl && BANNER_CONFIG.linkText && (
              <a
                href={BANNER_CONFIG.linkUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-shrink-0 px-6 py-3 bg-[#00ff41] text-black font-bold uppercase tracking-[0.15em] text-sm hover:bg-white transition-colors"
              >
                {BANNER_CONFIG.linkText}
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}