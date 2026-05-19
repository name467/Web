'use client';

/**
 * ============================================================================
 * LOADING SCREEN COMPONENT
 * ============================================================================
 * Displays an animated loading screen when the app is initializing.
 * This gives a polished feel and allows time for:
 * - localStorage data to load
 * - Fonts to load
 * - Initial theme to apply
 * 
 * The loading screen features:
 * - Animated logo with glow effects
 * - Progress bar animation
 * - Smooth fade-out transition
 */

import { useEffect, useState } from 'react';

export function LoadingScreen() {
  // Track loading progress for the progress bar
  const [progress, setProgress] = useState(0);
  
  // Simulate loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        // Accelerate progress as it gets closer to 100
        return prev + Math.random() * 15;
      });
    }, 100);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            background: `
              radial-gradient(circle at 20% 50%, var(--neon-primary) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, var(--neon-secondary) 0%, transparent 50%)
            `,
          }}
        />
      </div>
      
      {/* Logo */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Glowing logo text */}
        <h1 
          className="text-5xl md:text-7xl font-bold tracking-wider animate-glow-pulse"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          <span className="text-primary">NEON</span>
          <span className="text-accent">VAULT</span>
        </h1>
        
        {/* Tagline */}
        <p className="mt-4 text-muted-foreground text-lg tracking-widest uppercase">
          Loading your gaming experience
        </p>
        
        {/* Progress bar container */}
        <div className="mt-8 w-64 md:w-80 h-1 bg-muted rounded-full overflow-hidden">
          {/* Animated progress bar */}
          <div 
            className="h-full rounded-full transition-all duration-300 ease-out"
            style={{
              width: `${Math.min(progress, 100)}%`,
              background: `linear-gradient(90deg, var(--neon-primary), var(--neon-secondary))`,
              boxShadow: '0 0 10px var(--neon-primary)',
            }}
          />
        </div>
        
        {/* Progress percentage */}
        <p className="mt-2 text-sm text-muted-foreground font-mono">
          {Math.min(Math.round(progress), 100)}%
        </p>
      </div>
      
      {/* Decorative corner elements */}
      <div className="absolute top-4 left-4 w-16 h-16 border-l-2 border-t-2 border-primary opacity-50" />
      <div className="absolute top-4 right-4 w-16 h-16 border-r-2 border-t-2 border-primary opacity-50" />
      <div className="absolute bottom-4 left-4 w-16 h-16 border-l-2 border-b-2 border-accent opacity-50" />
      <div className="absolute bottom-4 right-4 w-16 h-16 border-r-2 border-b-2 border-accent opacity-50" />
    </div>
  );
}
