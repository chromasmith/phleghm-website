'use client';

export default function StatsEditor() {
  return (
    <div className="space-y-6">
      <div className="bg-zinc-800 rounded-lg p-8 text-center">
        <div className="mb-4">
          <svg 
            className="w-16 h-16 mx-auto text-zinc-600" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={1.5} 
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
            />
          </svg>
        </div>
        
        <h2 
          className="text-2xl font-bold text-white mb-2"
          style={{ letterSpacing: '0.02em' }}
        >
          Analytics Coming Soon
        </h2>
        
        <p className="text-zinc-400 max-w-md mx-auto">
          Site analytics will be available after launching on the live domain. 
          You'll be able to see page views, unique visitors, top referrers, 
          and social link clicks.
        </p>
        
        <div className="mt-6 flex justify-center gap-4 text-sm text-zinc-500">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
            <span>Page Views</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
            <span>Visitors</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-zinc-600 rounded-full"></div>
            <span>Link Clicks</span>
          </div>
        </div>
      </div>
    </div>
  );
}
