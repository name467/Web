'use client';

/**
 * ============================================================================
 * PARTICLE BACKGROUND COMPONENT
 * ============================================================================
 * Creates an animated particle effect in the background.
 * 
 * FEATURES:
 * - Floating particles with glow effects
 * - Connects nearby particles with lines
 * - Responds to theme colors
 * - Performance optimized (canvas-based)
 * - Can be disabled in settings
 * 
 * This uses the tsparticles library for efficient particle rendering.
 * The particle config is customized to match our neon aesthetic.
 */

import { useCallback, useMemo } from 'react';
import Particles from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';
import type { Engine, ISourceOptions } from '@tsparticles/engine';
import { useGame } from '@/lib/game-context';

export function ParticleBackground() {
  const { currentTheme, settings } = useGame();

  /**
   * Initialize the particles engine
   * This is called once when the component mounts
   */
  const particlesInit = useCallback(async (engine: Engine) => {
    // Load the "slim" bundle - smaller than full tsparticles
    await loadSlim(engine);
  }, []);

  /**
   * Particle configuration
   * Memoized to prevent unnecessary recalculations
   */
  const options: ISourceOptions = useMemo(() => ({
    // Particle system settings
    fullScreen: {
      enable: true,
      zIndex: -1, // Behind all content
    },
    
    // Background is handled by CSS, keep transparent
    background: {
      color: {
        value: 'transparent',
      },
    },
    
    // Frames per second limit for performance
    fpsLimit: 60,
    
    // Interactivity - particles respond to mouse
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: 'grab', // Particles connect to cursor
        },
        onClick: {
          enable: true,
          mode: 'push', // Add particles on click
        },
      },
      modes: {
        grab: {
          distance: 140,
          links: {
            opacity: 0.5,
          },
        },
        push: {
          quantity: 4,
        },
      },
    },
    
    // Particle appearance and behavior
    particles: {
      // Color from current theme
      color: {
        value: currentTheme.effects.particleColor,
      },
      
      // Lines connecting nearby particles
      links: {
        color: currentTheme.effects.particleColor,
        distance: 150,
        enable: true,
        opacity: 0.2 * currentTheme.effects.glowIntensity,
        width: 1,
      },
      
      // Movement behavior
      move: {
        direction: 'none',
        enable: true,
        outModes: {
          default: 'bounce', // Bounce off edges
        },
        random: true,
        speed: 1 * currentTheme.effects.animationSpeed,
        straight: false,
      },
      
      // Particle count based on theme density
      number: {
        density: {
          enable: true,
          width: 1200,
          height: 800,
        },
        value: Math.floor(80 * currentTheme.effects.particleDensity),
      },
      
      // Particle opacity with animation
      opacity: {
        value: {
          min: 0.1,
          max: 0.5,
        },
        animation: {
          enable: true,
          speed: 1,
          sync: false,
        },
      },
      
      // Particle shape
      shape: {
        type: 'circle',
      },
      
      // Particle size
      size: {
        value: {
          min: 1,
          max: 3,
        },
      },
    },
    
    // Detection settings
    detectRetina: true,
  }), [currentTheme]);

  // Don't render if particles are disabled
  if (!settings.particlesEnabled || settings.reducedMotion) {
    return null;
  }

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      options={options}
      className="absolute inset-0 pointer-events-none"
    />
  );
}
