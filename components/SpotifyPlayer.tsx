export default function SpotifyPlayer() {
  const artistId = '3brB4yhi4ZJtxQkbZX0wkk';

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