import { UpcomingShow } from '@/types/database';

interface UpcomingShowsProps {
  shows: UpcomingShow[];
}

const formatTime = (time: string | null | undefined): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const h = parseInt(hours);
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${minutes} ${ampm}`;
};

export default function UpcomingShows({ shows }: UpcomingShowsProps) {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-2 h-2 bg-[#00ff41]" />
          <h2 className="font-body text-xs tracking-[0.4em] text-zinc-500 uppercase">
            Upcoming Shows
          </h2>
        </div>
        
        <div className="space-y-1">
          {shows.map((show) => {
            const date = new Date(show.show_date);
            const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
            const timeDisplay = formatTime(show.show_time);
            
            return (
              <div
                key={show.id}
                className="group grid grid-cols-[1fr_auto] md:flex md:flex-row md:items-center md:justify-between p-5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all gap-4"
              >
                {/* Mobile: Event Name - Top Right (order-first on mobile, appears in right column) */}
                {/* Desktop: Moves to Column 3 position */}
                {show.event_name && (
                  <div className="col-start-2 row-start-1 row-span-2 self-start justify-self-end md:order-3 md:flex-1 md:self-auto md:justify-self-auto">
                    <h3 className="font-headline text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-wide text-[#00ff41] group-hover:text-white transition-colors text-right md:text-left">
                      {show.event_name}
                    </h3>
                  </div>
                )}
                
                {/* Mobile: Left column stacked info */}
                {/* Desktop: Column 1 - Date & Time */}
                <div className="col-start-1 row-start-1 md:order-1 md:w-24 md:shrink-0">
                  <span className="font-headline text-[#00ff41] text-2xl sm:text-3xl font-bold tracking-wider block">
                    {monthDay}
                  </span>
                  {timeDisplay && (
                    <span className="font-body text-zinc-500 text-xs tracking-wide">
                      {timeDisplay}
                    </span>
                  )}
                </div>
                
                {/* Mobile: Venue & City below Date/Time on left */}
                {/* Desktop: Column 2 */}
                <div className="col-start-1 row-start-2 md:order-2 md:w-44 md:shrink-0">
                  <h3 className="font-headline text-lg sm:text-xl md:text-2xl tracking-wide text-white group-hover:text-[#00ff41] transition-colors">
                    {show.venue}
                  </h3>
                  <p className="font-body text-zinc-500 text-sm">
                    {show.city}
                  </p>
                </div>
                
                {/* Mobile: Ticket Button - Bottom Right */}
                {/* Desktop: Column 4 */}
                <div className="col-start-2 row-start-3 self-end justify-self-end md:order-4 md:self-auto md:justify-self-auto md:shrink-0">
                  {show.ticket_url ? (
                    <a
                      href={show.ticket_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-body border border-zinc-700 px-6 py-3 text-xs tracking-widest uppercase hover:border-[#00ff41] hover:text-[#00ff41] transition-all inline-block"
                    >
                      Get Tickets →
                    </a>
                  ) : (
                    <span className="font-body px-6 py-3 text-zinc-600 text-xs tracking-widest uppercase inline-block">
                      Free
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}