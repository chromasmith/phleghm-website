import { UpcomingShow } from '@/types/database';

interface UpcomingShowsProps {
  shows: UpcomingShow[];
}

export default function UpcomingShows({ shows }: UpcomingShowsProps) {
  return (
    <section className="py-24 px-4 bg-black">
      <div className="max-w-4xl mx-auto">
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
            
            return (
              <div
                key={show.id}
                className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/30 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-8 mb-4 sm:mb-0">
                  <span className="font-headline text-[#00ff41] text-2xl sm:text-3xl w-24">
                    {monthDay}
                  </span>
                  <div>
                    <h3 className="font-headline text-xl sm:text-2xl text-white group-hover:text-[#00ff41] transition-colors">
                      {show.venue}
                    </h3>
                    <p className="font-body text-zinc-600 text-sm">
                      {show.city}
                    </p>
                  </div>
                </div>
                {show.ticket_url ? (
                  <a
                    href={show.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-body border border-zinc-700 px-6 py-3 text-xs tracking-widest uppercase hover:border-[#00ff41] hover:text-[#00ff41] transition-all self-start sm:self-auto"
                  >
                    Get Tickets →
                  </a>
                ) : (
                  <span className="font-body px-6 py-3 text-zinc-600 text-xs tracking-widest uppercase self-start sm:self-auto">
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