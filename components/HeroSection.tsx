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
  const [displayedChars, setDisplayedChars] = useState<Array<{ char: string; revealed: boolean }>>([]);
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [phase, setPhase] = useState<'typing' | 'visible' | 'glitching' | 'waiting'>('typing');
  const [glitchingChars, setGlitchingChars] = useState<Set<number>>(new Set());
  const [shuffledTaglines, setShuffledTaglines] = useState<string[]>([]);
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

  // Random single-letter jitter (every 3-6 seconds, truly random letter)
  useEffect(() => {
    const scheduleJitter = () => {
      const delay = 3000 + Math.random() * 3000; // 3-6 seconds
      jitterTimeoutRef.current = setTimeout(() => {
        // Truly random letter selection
        const randomIndex = Math.floor(Math.random() * titleLetters.length);
        setJitteringLetter(randomIndex);
        
        // Quick jitter duration
        setTimeout(() => {
          setJitteringLetter(-1);
        }, 50 + Math.random() * 50);
        
        // Schedule next jitter
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

  const currentTagline = shuffledTaglines[currentTaglineIndex] || '';

  // Typewriter effect
  useEffect(() => {
    if (shuffledTaglines.length === 0) return;

    if (phase === 'typing') {
      const totalChars = currentTagline.length;
      const revealedCount = displayedChars.filter(c => c.revealed).length;
      
      if (revealedCount < totalChars) {
        if (displayedChars.length === 0) {
          const chars = currentTagline.split('').map((char) => ({
            char,
            revealed: false,
          }));
          setDisplayedChars(chars);
          return;
        }

        const unrevealedIndices = displayedChars
          .map((c, i) => (!c.revealed ? i : -1))
          .filter(i => i !== -1);

        if (unrevealedIndices.length > 0) {
          const timeout = setTimeout(() => {
            setDisplayedChars(prev => {
              const next = [...prev];
              const useSequential = Math.random() > 0.3;
              const firstUnrevealed = next.findIndex(c => !c.revealed);
              
              let indexToReveal: number;
              if (useSequential || unrevealedIndices.length <= 2) {
                indexToReveal = firstUnrevealed;
              } else {
                const weighted = unrevealedIndices.filter(i => i <= firstUnrevealed + 4);
                indexToReveal = weighted[Math.floor(Math.random() * weighted.length)];
              }

              if (indexToReveal !== undefined && indexToReveal !== -1) {
                next[indexToReveal] = { ...next[indexToReveal], revealed: true };
                
                if (Math.random() > 0.7 && unrevealedIndices.length > 3) {
                  const burstCount = Math.floor(Math.random() * 2) + 1;
                  for (let i = 0; i < burstCount; i++) {
                    const nextSeq = next.findIndex(c => !c.revealed);
                    if (nextSeq !== -1) {
                      next[nextSeq] = { ...next[nextSeq], revealed: true };
                    }
                  }
                }
              }
              
              return next;
            });
            
            if (Math.random() > 0.85) {
              const recentlyRevealed = displayedChars
                .map((c, i) => (c.revealed ? i : -1))
                .filter(i => i !== -1)
                .slice(-5);
              if (recentlyRevealed.length > 0) {
                const glitchIndex = recentlyRevealed[Math.floor(Math.random() * recentlyRevealed.length)];
                setGlitchingChars(new Set([glitchIndex]));
                setTimeout(() => setGlitchingChars(new Set()), 100);
              }
            }
          }, 30 + Math.random() * 80);
          
          return () => clearTimeout(timeout);
        }
      } else {
        setPhase('visible');
      }
    }

    if (phase === 'visible') {
      const timeout = setTimeout(() => {
        setPhase('glitching');
      }, 5000);
      return () => clearTimeout(timeout);
    }

    if (phase === 'glitching') {
      let glitchCount = 0;
      const glitchInterval = setInterval(() => {
        glitchCount++;
        
        const glitchSet = new Set<number>();
        const numGlitches = Math.floor(Math.random() * 5) + 3;
        for (let i = 0; i < numGlitches; i++) {
          glitchSet.add(Math.floor(Math.random() * currentTagline.length));
        }
        setGlitchingChars(glitchSet);
        
        if (glitchCount > 8) {
          clearInterval(glitchInterval);
          setGlitchingChars(new Set());
          setDisplayedChars([]);
          setPhase('waiting');
        }
      }, 50);
      
      return () => clearInterval(glitchInterval);
    }

    if (phase === 'waiting') {
      const timeout = setTimeout(() => {
        setCurrentTaglineIndex((prev) => (prev + 1) % shuffledTaglines.length);
        setPhase('typing');
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [phase, displayedChars, currentTagline, shuffledTaglines, currentTaglineIndex]);

  const glitchChars = '!@#$%&*<>[]{}';

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
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/50" />
      
      {/* Content */}
      <div className="relative z-10 text-center px-4">
        
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
          
          {/* Black distress marks ON TOP of text */}
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 20 }}>
            {/* Spray splatter cluster 1 - on the P */}
            <div 
              className="absolute"
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
            
            {/* Spray splatter cluster 2 - between H and L */}
            <div 
              className="absolute"
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
            
            {/* Spray drip on E */}
            <div 
              className="absolute"
              style={{
                left: '52%',
                top: '45%',
                width: '3px',
                height: '18px',
                background: 'linear-gradient(180deg, #000 60%, transparent)',
                borderRadius: '50% 50% 50% 50% / 10% 10% 90% 90%',
              }}
            />
            
            {/* Small speckles */}
            <div className="absolute" style={{ left: '18%', top: '55%', width: '2px', height: '2px', background: '#000', borderRadius: '50%' }} />
            <div className="absolute" style={{ left: '72%', top: '30%', width: '3px', height: '3px', background: '#000', borderRadius: '50%' }} />
            <div 
              className="absolute"
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
            
            {/* Scratch on G */}
            <div 
              className="absolute"
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
            
            {/* Paint fleck near M */}
            <div 
              className="absolute"
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
            
            {/* Tiny scattered dots */}
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
            className={`font-body text-lg md:text-xl font-bold tracking-wider transition-all duration-75 ${
              phase === 'glitching' ? 'opacity-50' : 'opacity-100'
            }`}
            style={{
              color: phase === 'glitching' ? '#ff0040' : '#a1a1aa',
              textShadow: phase === 'glitching' ? '-2px 0 #00ff41, 2px 0 #ff0040' : 'none',
              transform: phase === 'glitching' ? `translateX(${Math.random() * 4 - 2}px)` : 'none',
            }}
          >
            {displayedChars.map((charObj, i) => {
              if (!charObj.revealed) return null;
              
              const isGlitching = glitchingChars.has(i);
              const displayChar = isGlitching 
                ? glitchChars[Math.floor(Math.random() * glitchChars.length)]
                : charObj.char;
              
              return (
                <span
                  key={i}
                  className="inline-block transition-all duration-75"
                  style={{
                    color: isGlitching ? '#00ff41' : undefined,
                    transform: isGlitching ? `translateY(${Math.random() * 4 - 2}px)` : 'none',
                    textShadow: isGlitching ? '0 0 10px #00ff41' : 'none',
                  }}
                >
                  {displayChar}
                </span>
              );
            })}
            {phase === 'typing' && (
              <span 
                className="inline-block w-2 h-5 ml-1 animate-pulse"
                style={{ backgroundColor: '#00ff41' }}
              />
            )}
          </p>
        </div>
        
        {/* TikTok button - wider letter spacing */}
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
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-px h-16 bg-gradient-to-b from-transparent via-[#00ff41] to-transparent opacity-50" />
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