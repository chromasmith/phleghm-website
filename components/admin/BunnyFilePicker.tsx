'use client';

import { useState, useEffect } from 'react';

interface BunnyFile {
  name: string;
  url: string;
  size: number;
  modified: string;
  isVideo: boolean;
}

interface BunnyFilePickerProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (url: string) => void;
  folder?: string;
  filterType?: 'all' | 'video' | 'image';
}

export default function BunnyFilePicker({
  isOpen,
  onClose,
  onSelect,
  folder = 'phleghm-website/hero',
  filterType = 'all',
}: BunnyFilePickerProps) {
  const [files, setFiles] = useState<BunnyFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchFiles();
    }
  }, [isOpen, folder]);

  async function fetchFiles() {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/list-bunny-files?folder=${encodeURIComponent(folder)}`);
      if (!response.ok) throw new Error('Failed to load files');
      
      const data = await response.json();
      let filtered = data.files || [];
      
      if (filterType === 'video') {
        filtered = filtered.filter((f: BunnyFile) => f.isVideo);
      } else if (filterType === 'image') {
        filtered = filtered.filter((f: BunnyFile) => !f.isVideo);
      }
      
      setFiles(filtered);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load files');
    } finally {
      setLoading(false);
    }
  }

  function formatSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  }

  function handleSelect(url: string) {
    onSelect(url);
    onClose();
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />
      
      <div className="relative bg-zinc-900 rounded-lg border border-zinc-700 w-full max-w-2xl max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-zinc-700">
          <h2 className="text-lg font-medium text-white">Select from Library</h2>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          {loading && (
            <div className="flex items-center justify-center py-12">
              <svg className="animate-spin h-8 w-8 text-zinc-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            </div>
          )}
          
          {error && (
            <div className="text-red-500 text-center py-12">{error}</div>
          )}
          
          {!loading && !error && files.length === 0 && (
            <div className="text-zinc-500 text-center py-12">No files found</div>
          )}
          
          {!loading && !error && files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {files.map((file) => (
                <button
                  key={file.url}
                  onClick={() => handleSelect(file.url)}
                  className="group relative aspect-video bg-zinc-800 rounded border border-zinc-700 overflow-hidden hover:border-[#00ff41] transition-colors"
                >
                  {file.isVideo ? (
                    <video
                      src={file.url}
                      className="w-full h-full object-cover"
                      muted
                      playsInline
                      onMouseEnter={(e) => e.currentTarget.play()}
                      onMouseLeave={(e) => { e.currentTarget.pause(); e.currentTarget.currentTime = 0; }}
                    />
                  ) : (
                    <img
                      src={file.url}
                      alt={file.name}
                      className="w-full h-full object-cover"
                    />
                  )}
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors" />
                  
                  <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/80 to-transparent">
                    <p className="text-xs text-white truncate">{file.name}</p>
                    <p className="text-xs text-zinc-400">{formatSize(file.size)}</p>
                  </div>
                  
                  {file.isVideo && (
                    <div className="absolute top-2 right-2 bg-black/60 rounded px-1.5 py-0.5">
                      <span className="text-xs text-white">VIDEO</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
