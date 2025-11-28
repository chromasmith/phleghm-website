import { UpcomingShow } from '@/types/database';

interface UpcomingShowsProps {
  shows: UpcomingShow[];
}

export default function UpcomingShows({ shows }: UpcomingShowsProps) {
  return (
    <section className="py-16 px-4">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black tracking-tight mb-8 text-center">
          Upcoming Shows
        </h2>
        <div className="space-y-2">
          {shows.map((show) => {
            const date = new Date(show.show_date);
            const monthDay = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase();
            
            return (
              <div
                key={show.id}
                className="group flex items-center justify-between p-4 border border-zinc-800 hover:bg-zinc-900/50 transition-colors"
              >
                <div className="flex items-center gap-6">
                  <span className="text-[#00ff41] font-black text-lg w-20">
                    {monthDay}
                  </span>
                  <div>
                    <h3 className="text-xl font-bold group-hover:text-[#00ff41] transition-colors">
                      {show.venue}
                    </h3>
                    <p className="text-zinc-600 text-sm">{show.city}</p>
                  </div>
                </div>
                {show.ticket_url ? (
                  <a
                    href={show.ticket_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 border border-zinc-700 text-sm uppercase tracking-wider hover:border-[#00ff41] hover:text-[#00ff41] transition-colors"
                  >
                    Tickets
                  </a>
                ) : (
                  <span className="px-4 py-2 text-zinc-600 text-sm uppercase tracking-wider">
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
