'use client';

import { useState, useEffect, useRef } from 'react';
import { HeroContent } from '@/types/database';

const taglines = [
  'SEATTLE UNDERGROUND',
  "THIS AIN'T GONNA BE PRETTY",
  'VERSES HIT HARD, HOOKS THAT STICK',
  "SEATTLE'S BAD IDEA DONE RIGHT",
  'RAISED IN RAIN. BUILT IN STATIC.',
  'THE SOUND OF A GOOD BAD MOOD',
  'SURREAL. SICK. SHARP.',
];

const titleLetters = ['P', 'H', 'L', 'E', 'G', 'M'];

interface HeroSectionProps {
  content: HeroContent | null;
}

export default function HeroSection({ content }: HeroSectionProps) {
  const [titleGlitch, setTitleGlitch] = useState(false);
  const [jitteringLetter, setJitteringLetter] = useState(-1);
  const [displayedText, setDisplayedText] = useState('');
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'visible' | 'glitching' | 'waiting'>('typing');
  const [isGlitchingOut, setIsGlitchingOut] = useState(false);
  const [shuffledTaglines, setShuffledTaglines] = useState<string[]>([]);
  const [visibleSplatters, setVisibleSplatters] = useState<Set<number>>(new Set([0, 1, 2, 3, 4, 5, 6, 7]));
  const [splatterGlitch, setSplatterGlitch] = useState(false);
  const jitterTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Shuffle taglines on mount
  useEffect(() => {
    const shuffled = [...taglines].sort(() => Math.random() - 0.5);
    setShuffledTaglines(shuffled);
  }, []);

  // Title glitch effect (every 4 seconds)
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setTitleGlitch(true);
      setTimeout(() => setTitleGlitch(false), 150);
    }, 4000);
    return () => clearInterval(glitchInterval);
  }, []);

  // Random single-letter jitter (every 3-6 seconds)
  useEffect(() => {
    const scheduleJitter = () => {
      const delay = 3000 + Math.random() * 3000;
      jitterTimeoutRef.current = setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * titleLetters.length);
        setJitteringLetter(randomIndex);
        
        setTimeout(() => {
          setJitteringLetter(-1);
        }, 50 + Math.random() * 50);
        
        scheduleJitter();
      }, delay);
    };
    
    scheduleJitter();
    
    return () => {
      if (jitterTimeoutRef.current) {
        clearTimeout(jitterTimeoutRef.current);
      }
    };
  }, []);

  // Animated splatters - random glitchy appearance/disappearance
  useEffect(() => {
    const splatterInterval = setInterval(() => {
      // Randomly decide to glitch the splatters
      if (Math.random() > 0.6) {
        setSplatterGlitch(true);
        
        // Randomly hide/show some splatters
        const newVisible = new Set<number>();
        for (let i = 0; i < 8; i++) {
          if (Math.random() > 0.3) {
            newVisible.add(i);
          }
        }
        setVisibleSplatters(newVisible);
        
        // Reset after brief glitch
        setTimeout(() => {
          setSplatterGlitch(false);
          // Restore most splatters but keep some randomness
          const restored = new Set<number>();
          for (let i = 0; i < 8; i++) {
            if (Math.random() > 0.15) {
              restored.add(i);
            }
          }
          setVisibleSplatters(restored);
        }, 100 + Math.random() * 100);
      }
    }, 2000 + Math.random() * 2000);
    
    return () => clearInterval(splatterInterval);
  }, []);

  const currentTagline = shuffledTaglines[currentTaglineIndex] || '';

  // Typewriter effect
  useEffect(() => {
    if (shuffledTaglines.length === 0) return;

    if (phase === 'typing') {
      if (displayedText.length < currentTagline.length) {
        const timeout = setTimeout(() => {
          setDisplayedText(currentTagline.slice(0, displayedText.length + 1));
        }, 40 + Math.random() * 60);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setPhase('glitching');
        }, 5000);
        return () => clearTimeout(timeout);
      }
    }

    if (phase === 'glitching') {
      setIsGlitchingOut(true);
      const timeout = setTimeout(() => {
        setIsGlitchingOut(false);
        setDisplayedText('');
        setPhase('waiting');
      }, 200);
      return () => clearTimeout(timeout);
    }

    if (phase === 'waiting') {
      const timeout = setTimeout(() => {
        setCurrentTaglineIndex((prev) => (prev + 1) % shuffledTaglines.length);
        setPhase('typing');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [phase, displayedText, currentTagline, shuffledTaglines, currentTaglineIndex]);

  const getJitterStyle = (index: number): React.CSSProperties => {
    if (index !== jitteringLetter) return {};
    
    const transforms = [
      { transform: 'translateY(-2px)' },
      { transform: 'translateY(1px)' },
      { transform: 'translateX(-1px)' },
      { transform: 'translateX(1px) rotate(0.5deg)' },
      { transform: 'translateY(-1px) skewX(1deg)' },
    ];
    
    const randomTransform = transforms[Math.floor(Math.random() * transforms.length)];
    
    return {
      ...randomTransform,
      color: Math.random() > 0.6 ? '#00ff41' : '#ff0040',
      textShadow: '0 0 8px currentColor',
    };
  };

  // Get random offset for splatter glitch
  const getSplatterGlitchStyle = (): React.CSSProperties => {
    if (!splatterGlitch) return {};
    return {
      transform: `translate(${Math.random() * 4 - 2}px, ${Math.random() * 4 - 2}px)`,
      opacity: 0.8 + Math.random() * 0.2,
    };
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Desktop video (horizontal) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover hidden md:block"
      >
        <source src="https://chromasmith-cdn.b-cdn.net/phleghm-website/hero/Veteran_H.mp4" type="video/mp4" />
      </video>
      
      {/* Mobile video (vertical) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover md:hidden"
      >
        <source src="https://chromasmith-cdn.b-cdn.net/phleghm-website/hero/Veteran_V.mp4" type="video/mp4" />
      </video>
      
      {/* Scanlines overlay - increased intensity */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.3) 2px, rgba(0,0,0,0.3) 4px)',
          opacity: 0.7,
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" style={{ zIndex: 2 }} />
      
      {/* Content */}
      <div className="relative text-center px-4" style={{ zIndex: 10 }}>
        
        {/* Title container with distress effects */}
        <div className="relative inline-block mb-6">
          
          {/* Title with per-letter jitter */}
          <h1 className="relative select-none">
            {titleLetters.map((letter, i) => (
              <span
                key={i}
                className="inline-block transition-all duration-75"
                style={{
                  fontFamily: "'Impact', 'Haettenschweiler', 'Arial Narrow Bold', sans-serif",
                  fontSize: 'clamp(4rem, 15vw, 10rem)',
                  fontWeight: 900,
                  letterSpacing: '0.02em',
                  color: titleGlitch ? '#ff0040' : '#ffffff',
                  textShadow: titleGlitch 
                    ? '-3px 0 #00ff41, 3px 0 #ff0040, 0 0 20px rgba(255,0,64,0.5)' 
                    : '0 0 60px rgba(0,255,65,0.3), 0 0 120px rgba(0,255,65,0.1)',
                  ...(titleGlitch ? { transform: 'translateX(2px)' } : {}),
                  ...getJitterStyle(i),
                }}
              >
                {letter}
              </span>
            ))}
          </h1>
          
          {/* Animated black distress marks */}
          <div 
            className="absolute inset-0 pointer-events-none transition-all duration-75" 
            style={{ zIndex: 20, ...getSplatterGlitchStyle() }}
          >
            {/* Splatter 0 - on the P */}
            {visibleSplatters.has(0) && (
              <div 
                className="absolute transition-opacity duration-75"
                style={{
                  left: '8%',
                  top: '35%',
                  width: '6px',
                  height: '6px',
                  background: '#000',
                  borderRadius: '50%',
                  boxShadow: '2px 3px 0 1px #000, -1px 5px 0 0px #000, 3px -1px 0 0px #000',
                }}
              />
            )}
            
            {/* Splatter 1 - between H and L */}
            {visibleSplatters.has(1) && (
              <div 
                className="absolute transition-opacity duration-75"
                style={{
                  left: '28%',
                  top: '25%',
                  width: '4px',
                  height: '4px',
                  background: '#000',
                  borderRadius: '50%',
                  boxShadow: '1px 2px 0 0px #000, -2px 1px 0 1px #000',
                }}
              />
            )}
            
            {/* Splatter 2 - drip on E */}
            {visibleSplatters.has(2) && (
              <div 
                className="absolute transition-opacity duration-75"
                style={{
                  left: '52%',
                  top: '45%',
                  width: '3px',
                  height: '18px',
                  background: 'linear-gradient(180deg, #000 60%, transparent)',
                  borderRadius: '50% 50% 50% 50% / 10% 10% 90% 90%',
                }}
              />
            )}
            
            {/* Splatter 3 - small speckle */}
            {visibleSplatters.has(3) && (
              <div className="absolute transition-opacity duration-75" style={{ left: '18%', top: '55%', width: '2px', height: '2px', background: '#000', borderRadius: '50%' }} />
            )}
            
            {/* Splatter 4 - speckle on G area */}
            {visibleSplatters.has(4) && (
              <div className="absolute transition-opacity duration-75" style={{ left: '72%', top: '30%', width: '3px', height: '3px', background: '#000', borderRadius: '50%' }} />
            )}
            
            {/* Splatter 5 - cluster near M */}
            {visibleSplatters.has(5) && (
              <div 
                className="absolute transition-opacity duration-75"
                style={{
                  left: '85%',
                  top: '50%',
                  width: '2px',
                  height: '2px',
                  background: '#000',
                  borderRadius: '50%',
                  boxShadow: '-2px 3px 0 0px #000, 1px -2px 0 0px #000',
                }}
              />
            )}
            
            {/* Splatter 6 - scratch on G */}
            {visibleSplatters.has(6) && (
              <div 
                className="absolute transition-opacity duration-75"
                style={{
                  left: '68%',
                  top: '40%',
                  width: '12px',
                  height: '2px',
                  background: '#000',
                  transform: 'rotate(-25deg)',
                  opacity: 0.7,
                }}
              />
            )}
            
            {/* Splatter 7 - fleck near M */}
            {visibleSplatters.has(7) && (
              <div 
                className="absolute transition-opacity duration-75"
                style={{
                  right: '5%',
                  top: '35%',
                  width: '5px',
                  height: '7px',
                  background: '#000',
                  borderRadius: '40% 60% 30% 70%',
                  transform: 'rotate(15deg)',
                }}
              />
            )}
            
            {/* Tiny scattered dots - always visible */}
            <div 
              className="absolute"
              style={{
                left: '40%',
                top: '20%',
                width: '1px',
                height: '1px',
                background: '#000',
                boxShadow: '5px 8px 0 #000, -3px 15px 0 #000, 8px 20px 0 #000',
              }}
            />
          </div>
        </div>
        
        {/* Typewriter tagline */}
        <div className="h-10 flex items-center justify-center">
          <p 
            className={`font-body text-lg md:text-xl font-bold tracking-wider transition-all duration-75 whitespace-pre ${
              isGlitchingOut ? 'opacity-50' : 'opacity-100'
            }`}
            style={{
              color: isGlitchingOut ? '#ff0040' : '#a1a1aa',
              textShadow: isGlitchingOut ? '-2px 0 #00ff41, 2px 0 #ff0040' : 'none',
              transform: isGlitchingOut ? 'translateX(2px)' : 'none',
            }}
          >
            {displayedText}
            {phase === 'typing' && displayedText.length < currentTagline.length && (
              <span 
                className="inline-block w-2 h-5 ml-0.5 animate-pulse align-middle"
                style={{ backgroundColor: '#00ff41' }}
              />
            )}
          </p>
        </div>
        
        {/* TikTok button */}
        <a
          href="https://www.tiktok.com/@phlegmssg"
          target="_blank"
          rel="noopener noreferrer"
          className="font-headline inline-flex items-center gap-4 mt-12 px-10 py-4 bg-[#00ff41] text-black font-bold text-sm uppercase hover:bg-white transition-all duration-300"
          style={{ letterSpacing: '0.15em' }}
        >
          <TikTokIcon className="w-5 h-5" />
          Watch on TikTok
        </a>
      </div>
    </section>
  );
}

function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
    </svg>
  );
}