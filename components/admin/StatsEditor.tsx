'use client';

import { useState, useEffect } from 'react';

interface StatsData {
  aggregate: {
    visitors: { value: number };
    pageviews: { value: number };
    bounce_rate: { value: number };
    visit_duration: { value: number };
  };
  topSources: Array<{ source: string; visitors: number }>;
  topPages: Array<{ page: string; visitors: number }>;
  socialClicks: Array<{ platform: string; visitors: number }>;
  period: string;
}

const PERIODS = [
  { value: '7d', label: 'Last 7 days' },
  { value: '30d', label: 'Last 30 days' },
  { value: '6mo', label: 'Last 6 months' },
  { value: '12mo', label: 'Last 12 months' },
];

export default function StatsEditor() {
  const [stats, setStats] = useState<StatsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState('30d');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(`/api/stats?period=${period}`);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || 'Failed to fetch stats');
        }

        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    }

    fetchStats();
  }, [period]);

  function formatDuration(seconds: number): string {
    if (seconds < 60) return `${Math.round(seconds)}s`;
    const mins = Math.floor(seconds / 60);
    const secs = Math.round(seconds % 60);
    return `${mins}m ${secs}s`;
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-800 rounded-lg p-8 text-center">
          <div className="animate-pulse">
            <div className="w-16 h-16 mx-auto bg-zinc-700 rounded-lg mb-4"></div>
            <div className="h-6 w-48 mx-auto bg-zinc-700 rounded mb-2"></div>
            <div className="h-4 w-64 mx-auto bg-zinc-700 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="bg-zinc-800 rounded-lg p-8 text-center">
          <div className="mb-4">
            <svg
              className="w-16 h-16 mx-auto text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Unable to Load Analytics</h2>
          <p className="text-zinc-400 mb-4">{error}</p>
          <p className="text-zinc-500 text-sm">
            Make sure the PLAUSIBLE_API_KEY environment variable is configured in Vercel.
          </p>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="flex justify-end">
        <select
          value={period}
          onChange={(e) => setPeriod(e.target.value)}
          className="px-3 py-2 bg-zinc-800 border border-zinc-700 rounded text-white text-sm focus:outline-none focus:border-green-500"
        >
          {PERIODS.map((p) => (
            <option key={p.value} value={p.value}>{p.label}</option>
          ))}
        </select>
      </div>

      {/* Aggregate Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-zinc-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-500">
            {stats.aggregate.visitors?.value?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Visitors</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-white">
            {stats.aggregate.pageviews?.value?.toLocaleString() || '0'}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Pageviews</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-white">
            {stats.aggregate.bounce_rate?.value || 0}%
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Bounce Rate</div>
        </div>
        <div className="bg-zinc-800 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-white">
            {formatDuration(stats.aggregate.visit_duration?.value || 0)}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-wider mt-1">Avg. Duration</div>
        </div>
      </div>

      {/* Social Clicks */}
      {stats.socialClicks && stats.socialClicks.length > 0 && (
        <div className="bg-zinc-800 rounded-lg p-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
            Social Link Clicks
          </h3>
          <div className="space-y-3">
            {stats.socialClicks.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-white">{item.platform}</span>
                <span className="text-green-500 font-mono">{item.visitors}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Sources & Pages */}
      <div className="grid md:grid-cols-2 gap-4">
        {/* Top Sources */}
        <div className="bg-zinc-800 rounded-lg p-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
            Top Sources
          </h3>
          {stats.topSources && stats.topSources.length > 0 ? (
            <div className="space-y-3">
              {stats.topSources.map((source, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-white truncate mr-2">
                    {source.source || 'Direct / None'}
                  </span>
                  <span className="text-zinc-400 font-mono text-sm">{source.visitors}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">No data yet</p>
          )}
        </div>

        {/* Top Pages */}
        <div className="bg-zinc-800 rounded-lg p-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-4">
            Top Pages
          </h3>
          {stats.topPages && stats.topPages.length > 0 ? (
            <div className="space-y-3">
              {stats.topPages.map((page, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="text-white truncate mr-2">{page.page}</span>
                  <span className="text-zinc-400 font-mono text-sm">{page.visitors}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-500 text-sm">No data yet</p>
          )}
        </div>
      </div>

      {/* Link to Plausible */}
      <div className="text-center pt-4">
        <a
          href="https://plausible.io/phlegm.music"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-zinc-500 hover:text-green-500 transition-colors"
        >
          View full dashboard on Plausible &rarr;
        </a>
      </div>
    </div>
  );
}
