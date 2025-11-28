'use client';

import { useState } from 'react';
import { PastShow } from '@/types/database';

interface PastShowsProps {
  shows: PastShow[];
}

export default function PastShows({ shows }: PastShowsProps) {
  return (
    <section className="py-16 px-4 bg-zinc-950">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-black tracking-tight mb-8 text-center">
          Past Shows
        </h2>
        <div className="space-y-8">
          {shows.map((show) => (
            <PastShowCard key={show.id} show={show} />
          ))}
        </div>
      </div>
    </section>
  );
}

function PastShowCard({ show }: { show: PastShow }) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const hasImages = show.image_urls && show.image_urls.length > 0;
  const hasMultipleImages = hasImages && show.image_urls.length > 1;
  
  const date = new Date(show.show_date);
  const formattedDate = date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    year: 'numeric' 
  }).toUpperCase();

  const nextImage = () => {
    setCurrentImageIndex((prev) => 
      prev === show.image_urls.length - 1 ? 0 : prev + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => 
      prev === 0 ? show.image_urls.length - 1 : prev - 1
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6 border border-zinc-800 bg-zinc-900/30">
      {/* Image Carousel */}
      <div className="relative w-full md:w-96 h-64 bg-zinc-800 flex-shrink-0">
        {hasImages ? (
          <>
            <img
              src={show.image_urls[currentImageIndex]}
              alt={`${show.venue} - ${show.show_date}`}
              className="w-full h-full object-cover"
            />
            {hasMultipleImages && (
              <>
                {/* Navigation arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/60 hover:bg-black/80 flex items-center justify-center transition-colors"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
                {/* Image counter */}
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-xs">
                  {currentImageIndex + 1} / {show.image_urls.length}
                </div>
                {/* Dot indicators */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
                  {show.image_urls.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentImageIndex(i)}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        i === currentImageIndex ? 'bg-[#00ff41]' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-zinc-600">
            No photos yet
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col justify-center">
        {show.event_name && (
          <span className="inline-block self-start px-2 py-1 border border-[#00ff41] text-[#00ff41] text-xs uppercase tracking-wider mb-2">
            {show.event_name}
          </span>
        )}
        <p className="text-[#00ff41] tracking-widest text-sm mb-1">
          {formattedDate}
        </p>
        <h3 className="text-2xl font-bold hover:text-[#00ff41] transition-colors">
          {show.venue}
        </h3>
        <p className="text-zinc-500 flex items-center gap-1 mt-1">
          <LocationIcon className="w-4 h-4" />
          {show.city}
        </p>
      </div>
    </div>
  );
}

function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
    </svg>
  );
}

function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function LocationIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}
