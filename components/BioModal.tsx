'use client';

interface BioModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BioModal({ isOpen, onClose }: BioModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative z-10 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-500 hover:text-[#00ff41] transition-colors text-3xl z-20"
          aria-label="Close bio"
        >
          ✕
        </button>

        {/* Hero Photo */}
        <div className="relative w-full aspect-[3/4] max-h-[50vh] overflow-hidden border border-zinc-700">
          <div className="absolute inset-0 bg-zinc-800 flex items-center justify-center">
            <span className="text-zinc-600 uppercase tracking-[0.3em] text-sm font-mono">
              Photo Coming Soon
            </span>
          </div>
          {/* Gradient overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
        </div>

        {/* Bio Section */}
        <div className="bg-zinc-900/95 border border-t-0 border-zinc-700 p-6 md:p-8">
          {/* Title */}
          <h2 className="text-[#00ff41] text-4xl md:text-5xl font-black tracking-tight mb-6" style={{ fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif" }}>
            PHLEGM
          </h2>

          {/* Tagline */}
          <p className="text-zinc-400 text-lg md:text-xl font-mono italic mb-6">
            Rain. Static. The space between.
          </p>

          {/* Bio Content */}
          <div className="text-zinc-300 font-mono text-sm md:text-base leading-relaxed space-y-4">
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

            {/* He speaks in: list */}
            <div className="mt-6">
              <p className="text-zinc-500 uppercase tracking-[0.3em] text-xs mb-3">He speaks in:</p>
              <ul className="space-y-1 text-zinc-400">
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

            <p className="mt-6">
              The underground found him first and the internet is still processing.
            </p>
            <p>
              Currently transmitting from coordinates that don&apos;t appear on maps with songs that arrive before you press play.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}