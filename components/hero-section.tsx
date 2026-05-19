'use client';

/**
 * ============================================================================
 * HERO SECTION COMPONENT
 * ============================================================================
 * The main hero banner on the homepage featuring:
 * - Animated gradient background
 * - Main headline with neon glow
 * - Call-to-action buttons
 * - Decorative elements
 * 
 * This sets the tone for the entire gaming portal experience.
 */

import Link from 'next/link';
import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { Gamepad2, ArrowRight, Sparkles } from 'lucide-react';

export function HeroSection() {
  const { playSound } = useGame();

  return (
    <section className="relative overflow-hidden py-16 md:py-24">
      {/* Background gradient effects */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Primary glow */}
        <div 
          className="absolute top-0 left-1/4 w-96 h-96 rounded-full blur-[120px] opacity-30"
          style={{ background: 'var(--neon-primary)' }}
        />
        {/* Secondary glow */}
        <div 
          className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full blur-[120px] opacity-20"
          style={{ background: 'var(--neon-secondary)' }}
        />
        {/* Grid pattern overlay */}
        <div 
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `
              linear-gradient(var(--primary) 1px, transparent 1px),
              linear-gradient(90deg, var(--primary) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px',
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm animate-fade-in-up">
          <Sparkles className="w-4 h-4" />
          <span>New Games Added Weekly</span>
        </div>

        {/* Main headline */}
        <h1 
          className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight animate-fade-in-up"
          style={{ 
            fontFamily: 'Orbitron, sans-serif',
            animationDelay: '0.1s',
          }}
        >
          <span className="text-foreground">Welcome to </span>
          <span className="gradient-text">NeonVault</span>
        </h1>

        {/* Subheadline */}
        <p 
          className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 leading-relaxed animate-fade-in-up"
          style={{ animationDelay: '0.2s' }}
        >
          Your gateway to the ultimate browser gaming experience. 
          Explore hundreds of games with stunning neon aesthetics and 
          customize everything to match your style.
        </p>

        {/* CTA Buttons */}
        <div 
          className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '0.3s' }}
        >
          <Link href="/games">
            <Button 
              size="lg"
              className="group bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-6 text-lg"
              onClick={() => playSound('click')}
            >
              <Gamepad2 className="w-5 h-5 mr-2" />
              Browse Games
              <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
          
          <Link href="/settings">
            <Button 
              size="lg"
              variant="outline"
              className="border-primary/50 text-primary hover:bg-primary/10 px-8 py-6 text-lg"
              onClick={() => playSound('click')}
            >
              Customize Theme
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div 
          className="flex flex-wrap items-center justify-center gap-8 mt-12 animate-fade-in-up"
          style={{ animationDelay: '0.4s' }}
        >
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-primary">20+</p>
            <p className="text-sm text-muted-foreground">Games</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-accent">5</p>
            <p className="text-sm text-muted-foreground">Themes</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-3xl md:text-4xl font-bold text-foreground">100%</p>
            <p className="text-sm text-muted-foreground">Free</p>
          </div>
        </div>
      </div>

      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-20 h-20 border-l-2 border-t-2 border-primary/30 hidden md:block" />
      <div className="absolute top-8 right-8 w-20 h-20 border-r-2 border-t-2 border-primary/30 hidden md:block" />
      <div className="absolute bottom-8 left-8 w-20 h-20 border-l-2 border-b-2 border-accent/30 hidden md:block" />
      <div className="absolute bottom-8 right-8 w-20 h-20 border-r-2 border-b-2 border-accent/30 hidden md:block" />
    </section>
  );
}
