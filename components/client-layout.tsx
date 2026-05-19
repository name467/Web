'use client';

/**
 * ============================================================================
 * CLIENT LAYOUT COMPONENT
 * ============================================================================
 * This component handles all the client-side layout logic that can't be in
 * the server-side root layout. It includes:
 * - Loading screen display
 * - Sidebar rendering
 * - Search modal
 * - Main content area with responsive padding
 * 
 * WHY THIS EXISTS:
 * Next.js 14+ encourages keeping the root layout as a server component.
 * All client-side interactivity (useState, useEffect, context consumers)
 * must be in client components. This component bridges that gap.
 */

import { useGame } from '@/lib/game-context';
import { LoadingScreen } from '@/components/loading-screen';
import { Sidebar } from '@/components/sidebar';
import { SearchModal } from '@/components/search-modal';
import { ParticleBackground } from '@/components/particle-background';

interface ClientLayoutProps {
  children: React.ReactNode;
}

export function ClientLayout({ children }: ClientLayoutProps) {
  const { uiState, settings } = useGame();

  return (
    <>
      {/* Loading screen - shows during initial load */}
      {uiState.isLoading && <LoadingScreen />}
      
      {/* Particle background - can be disabled in settings */}
      {settings.particlesEnabled && !settings.reducedMotion && (
        <ParticleBackground />
      )}
      
      {/* Search modal - triggered by Ctrl+K or search button */}
      <SearchModal />
      
      {/* Main app structure */}
      <div className={`min-h-screen ${settings.reducedMotion ? 'reduced-motion' : ''}`}>
        {/* Sidebar navigation */}
        <Sidebar />
        
        {/* Main content area - offset by sidebar width on desktop */}
        <main 
          className={`
            min-h-screen transition-all duration-300
            ${uiState.sidebarOpen ? 'lg:ml-72' : 'lg:ml-0'}
          `}
        >
          {/* 
            Page content is rendered here.
            Each page component handles its own header and layout.
          */}
          {children}
        </main>
      </div>
    </>
  );
}
