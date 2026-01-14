'use client';

export default function StatsEditor() {
  return (
    <div className="space-y-4">
      <p className="text-zinc-400 text-sm">
        Live analytics for phlegm.music
      </p>

      <div className="bg-zinc-800 rounded-lg overflow-hidden">
        <iframe
          plausible-embed
          src="https://plausible.io/share/phlegm.music?auth=x4HCngyu7Qha9ihYIQ77k&embed=true&theme=dark"
          scrolling="no"
          frameBorder="0"
          loading="lazy"
          style={{
            width: '1px',
            minWidth: '100%',
            height: '1600px',
          }}
        />
      </div>

      <div className="text-xs text-zinc-600 pt-2">
        Stats powered by{' '}
        <a
          href="https://plausible.io"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-400 hover:underline"
        >
          Plausible Analytics
        </a>
      </div>
    </div>
  );
}
