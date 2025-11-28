export default function SpotifyPlayer() {
  // Replace ARTIST_ID with actual Phleghm Spotify artist ID when available
  const artistId = 'ARTIST_ID_HERE';
  const hasRealArtistId = artistId !== 'ARTIST_ID_HERE';

  if (hasRealArtistId) {
    return (
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto">
          <iframe
            src={`https://open.spotify.com/embed/artist/${artistId}?utm_source=generator&theme=0`}
            width="100%"
            height="352"
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
            className="rounded-xl"
          />
        </div>
      </section>
    );
  }

  // Fallback UI when no Spotify ID is configured
  return (
    <section className="py-12 px-4">
      <div className="max-w-2xl mx-auto bg-zinc-900 rounded-xl p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center text-3xl font-black text-[#00ff41]">
            P
          </div>
          <div>
            <h3 className="text-xl font-bold">PHLEGHM</h3>
            <p className="text-zinc-500 text-sm">Underground Hip-Hop</p>
          </div>
        </div>
        <div className="space-y-3">
          {['Track 1', 'Track 2', 'Track 3', 'Track 4', 'Track 5'].map((track, i) => (
            <div key={i} className="flex items-center justify-between py-2 px-3 rounded hover:bg-zinc-800 transition-colors">
              <div className="flex items-center gap-3">
                <span className="text-zinc-600 w-4">{i + 1}</span>
                <span className="text-white">{track}</span>
              </div>
              <span className="text-zinc-600 text-sm">--:--</span>
            </div>
          ))}
        </div>
        <a
          href="https://open.spotify.com"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2 bg-[#1DB954] text-black font-semibold rounded-full hover:bg-[#1ed760] transition-colors"
        >
          Open in Spotify
        </a>
        <p className="mt-4 text-zinc-600 text-xs">
          Preview UI — Connect Spotify artist ID to show real content
        </p>
      </div>
    </section>
  );
}
