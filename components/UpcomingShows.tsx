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
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mb-4 sm:mb-0 flex-1">
                  {/* Column 1: Date & Time */}
                  <div className="w-24 shrink-0">
                    <span className="font-headline text-[#00ff41] text-2xl sm:text-3xl font-bold block">
                      {monthDay}
                    </span>
                    {timeDisplay && (
                      <span className="font-body text-zinc-500 text-xs tracking-wide">
                        {timeDisplay}
                      </span>
                    )}
                  </div>
                  
                  {/* Column 2: Venue & City */}
                  <div className="sm:w-44 shrink-0">
                    <h3 className="font-headline text-xl sm:text-2xl text-white group-hover:text-[#00ff41] transition-colors">
                      {show.venue}
                    </h3>
                    <p className="font-body text-zinc-500 text-sm">
                      {show.city}
                    </p>
                  </div>
                  
                  {/* Column 3: Event Name (LARGEST) */}
                  {show.event_name && (
                    <div className="flex-1">
                      <h3 className="font-headline text-3xl sm:text-4xl lg:text-5xl font-bold text-[#00ff41] group-hover:text-white transition-colors">
                        {show.event_name}
                      </h3>
                    </div>
                  )}
                </div>
                
                {/* Column 4: Ticket Button */}
                {show.ticket_url ? (
                  <a
                    href={show.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body border border-zinc-700 px-6 py-3 text-xs tracking-widest uppercase hover:border-[#00ff41] hover:text-[#00ff41] transition-all self-start sm:self-auto shrink-0"
                  >
                    Get Tickets →
                  </a>
                ) : (
                  <span className="font-body px-6 py-3 text-zinc-600 text-xs tracking-widest uppercase self-start sm:self-auto shrink-0">
                    Free
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}