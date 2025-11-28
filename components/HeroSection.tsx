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

  const currentTagline = shuffledTaglines[currentTaglineIndex] || '';

  // Simplified typewriter effect - preserves spaces properly
  useEffect(() => {
    if (shuffledTaglines.length === 0) return;

    if (phase === 'typing') {
      if (displayedText.length < currentTagline.length) {
        const timeout = setTimeout(() => {
          // Add next character (including spaces)
          setDisplayedText(currentTagline.slice(0, displayedText.length + 1));
        }, 40 + Math.random() * 60);
        return () => clearTimeout(timeout);
      } else {
        // Finished typing, wait 5 seconds
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
      textShadow: '