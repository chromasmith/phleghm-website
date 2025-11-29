'use client';

interface BioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Video configuration - update these values if video changes
const VIDEO_CONFIG = {
  url: 'https://chromasmith-cdn.b-cdn.net/phleghm-website/hero/Phlegm_MeVme.mp4.mp4',
  width: 576,
  height: 758,
};

export default function BioModal({ isOpen, onClose }: BioModalProps) {
  if (!isOpen) return null;

  const aspectRatio = VIDEO_CONFIG.width / VIDEO_CONFIG.height;

  return (
    <div className="fixed inset-0 z-[60] bg-black">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="fixed top-4 right-4 md:top-6 md:right-6 text-zinc-500 hover:text-[#00ff41] transition-colors text-3xl z-[70]"
        aria-label="Close bio"
      >
        ✕
      </button>

      {/* Mobile Layout - stacked, full bleed */}
      <div className="md:hidden h-full flex flex-col overflow-hidden">
        {/* Video - full width, aspect ratio locked */}
        <div 
          className="w-full flex-shrink-0 bg-black"
          style={{ aspectRatio: aspectRatio }}
        >
          <video
            src={VIDEO_CONFIG.url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bio - fills remaining space, scrolls */}
        <div className="flex-1 overflow-y-auto bg-zinc-900 border-t border-zinc-700">
          <div className="p-6">
            <h2 
              className="text-[#00ff41] text-3xl font-black tracking-tight mb-4" 
              style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
            >
              PHLEGM
            </h2>

            <p className="text-zinc-400 text-base font-mono italic mb-4">
              Rain. Static. The space between.
            </p>

            <div className="text-zinc-300 font-mono text-sm leading-relaxed space-y-3">
              <p>
                Born in frequencies that bleed through AM radios at 3:47 AM. Voices from the overpass. Dreams that taste like copper pennies.
              </p>
              <p>
                Seattle raised him wrong. Or right. Depending on how you hold the mirror.
              </p>
              <p>
                Teenage notebooks. Ink running in the drizzle. Words that move when you&apos;re not looking directly at them. Started there. Or maybe it started him.
              </p>
              <p>
                Sound as archaeology. Digging through the city&apos;s fever dreams. Beats that remember being heartbeats. Vocals from the place where sleep forgot to wake up.
              </p>

              <div className="mt-4">
                <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-2">He speaks in:</p>
                <ul className="space-y-1 text-zinc-400 text-sm">
                  <li className="flex items-center gap-2">
                    <span className="text-[#00ff41]">•</span> Broken frequencies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00ff41]">•</span> Half-remembered conversations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00ff41]">•</span> The color between blue and grey
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00ff41]">•</span> Basement philosophy
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00ff41]">•</span> Midnight mathematics
                  </li>
                </ul>
              </div>

              <p className="mt-4">
                The underground found him first and the internet is still processing.
              </p>
              <p>
                Currently transmitting from coordinates that don&apos;t appear on maps with songs that arrive before you press play.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout - side by side, full bleed */}
      <div className="hidden md:flex h-full">
        {/* Video - height fills viewport, width from aspect ratio */}
        <div 
          className="h-full flex-shrink-0 bg-black"
          style={{ aspectRatio: aspectRatio }}
        >
          <video
            src={VIDEO_CONFIG.url}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>

        {/* Bio - fills remaining width, scrolls internally */}
        <div className="flex-1 overflow-y-auto bg-zinc-900 border-l border-zinc-700">
          <div className="p-8 lg:p-12">
            <h2 
              className="text-[#00ff41] text-5xl lg:text-6xl font-black tracking-tight mb-6" 
              style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}
            >
              PHLEGM
            </h2>

            <p className="text-zinc-400 text-xl lg:text-2xl font-mono italic mb-8">
              Rain. Static. The space between.
            </p>

            <div className="text-zinc-300 font-mono text-base lg:text-lg leading-relaxed space-y-5">
              <p>
                Born in frequencies that bleed through AM radios at 3:47 AM. Voices from the overpass. Dreams that taste like copper pennies.
              </p>
              <p>
                Seattle raised him wrong. Or right. Depending on how you hold the mirror.
              </p>
              <p>
                Teenage notebooks. Ink running in the drizzle. Words that move when you&apos;re not looking directly at them. Started there. Or maybe it started him.
              </p>
              <p>
                Sound as archaeology. Digging through the city&apos;s fever dreams. Beats that remember being heartbeats. Vocals from the place where sleep forgot to wake up.
              </p>

              <div className="mt-8">
                <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-3">He speaks in:</p>
                <ul className="space-y-2 text-zinc-400">
                  <li className="flex items-center gap-2">
                    <span className="text-[#00ff41]">•</span> Broken frequencies
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00ff41]">•</span> Half-remembered conversations
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00ff41]">•</span> The color between blue and grey
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00ff41]">•</span> Basement philosophy
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#00ff41]">•</span> Midnight mathematics
                  </li>
                </ul>
              </div>

              <p className="mt-8">
                The underground found him first and the internet is still processing.
              </p>
              <p>
                Currently transmitting from coordinates that don&apos;t appear on maps with songs that arrive before you press play.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}