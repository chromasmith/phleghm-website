'use client';

import { useState } from 'react';
import { PastShow } from '@/types/database';

interface PastShowsProps {
  shows: PastShow[];
}

export default function PastShows({ shows }: PastShowsProps) {
  return (
    <section className="py-24 px-4 bg-zinc-950">
      <div className="max-w-5xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-12">
          <div className="w-2 h-2 bg-zinc-600" />
          <h2 className="font-body text-xs tracking-[0.4em] text-zinc-500 uppercase">
            Past Shows
          </h2>
        </div>
        
        <div className="space-y-6">
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
    <div className="relative w-full h-80 md:h-96 overflow-hidden group">
      {/* Full-bleed background image */}
      {hasImages ? (
        <img
          src={show.image_urls[currentImageIndex]}
          alt={`${show.venue} - ${show.show_date}`}
          className="absolute inset-0 w-full h-full object-cover"
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-zinc-800" />
      )}
      
      {/* Dark gradient overlay for text readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
      
      {/* Navigation arrows - only show if multiple images */}
      {hasMultipleImages && (
        <>
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-[#00ff41] text-white hover:text-black flex items-center justify-center transition-colors z-10"
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </button>
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/70 hover:bg-[#00ff41] text-white hover:text-black flex items-center justify-center transition-colors z-10"
          >
            <ChevronRightIcon className="w-5 h-5" />
          </button>
        </>
      )}
      
      {/* Image counter - top right */}
      {hasMultipleImages && (
        <div className="absolute top-4 right-4 px-2 py-1 bg-black/70 font-body text-xs z-10">
          {currentImageIndex + 1} / {show.image_urls.length}
        </div>
      )}
      
      {/* Dot indicators - bottom center */}
      {hasMultipleImages && (
        <div className="absolute bottom-24 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {show.image_urls.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentImageIndex(i)}
              className={`w-2 h-2 rounded-full transition-colors ${
                i === currentImageIndex ? 'bg-[#00ff41]' : 'bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Text overlay - bottom left */}
      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <div className="max-w-2xl">
          {show.event_name && (
            <span className="inline-block bg-[#00ff41]/10 border border-[#00ff41]/30 text-[#00ff41] px-3 py-1 font-body text-xs tracking-wider uppercase mb-3">
              {show.event_name}
            </span>
          )}
          <p className="font-body text-[#00ff41] tracking-wider text-sm mb-2">
            {formattedDate}
          </p>
          <h3 className="font-headline text-3xl md:text-4xl text-white group-hover:text-[#00ff41] transition-colors">
            {show.venue}
          </h3>
          <p className="font-body text-zinc-500 flex items-center gap-2 mt-2 text-sm">
            <LocationIcon className="w-4 h-4" />
            {show.city}
          </p>
        </div>
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