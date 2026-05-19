'use client';

/**
 * ============================================================================
 * TOP HEADER COMPONENT
 * ============================================================================
 * The top navigation bar that appears on all pages.
 * 
 * FEATURES:
 * - Mobile hamburger menu toggle
 * - Search bar with keyboard shortcut
 * - Page title display
 * - Quick action buttons
 * - Notification bell (mockup)
 * 
 * RESPONSIVE BEHAVIOR:
 * - Desktop: Search bar visible, hamburger hidden
 * - Mobile: Hamburger visible, search icon only
 */

import { useGame } from '@/lib/game-context';
import { Button } from '@/components/ui/button';
import { 
  Menu, 
  Search, 
  Bell,
  X
} from 'lucide-react';

interface HeaderProps {
  title?: string;
  subtitle?: string;
}

export function Header({ title = 'NeonVault', subtitle }: HeaderProps) {
  const { 
    setSidebarOpen, 
    uiState,
    setSearchOpen,
    playSound 
  } = useGame();

  /**
   * Open search modal
   */
  const handleSearchClick = () => {
    playSound('click');
    setSearchOpen(true);
  };

  /**
   * Toggle mobile sidebar
   */
  const handleMenuClick = () => {
    playSound('click');
    setSidebarOpen(!uiState.sidebarOpen);
  };

  return (
    <header className="sticky top-0 z-30 w-full border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="flex items-center justify-between h-16 px-4 md:px-6">
        {/* Left section: Menu button (mobile) + Title */}
        <div className="flex items-center gap-4">
          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={handleMenuClick}
            aria-label={uiState.sidebarOpen ? 'Close menu' : 'Open menu'}
          >
            {uiState.sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </Button>

          {/* Page title */}
          <div>
            <h1 
              className="text-xl md:text-2xl font-bold tracking-wide"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              {title}
            </h1>
            {subtitle && (
              <p className="text-sm text-muted-foreground hidden sm:block">
                {subtitle}
              </p>
            )}
          </div>
        </div>

        {/* Center section: Search bar (desktop) */}
        <div className="hidden md:flex flex-1 max-w-md mx-4">
          <button
            onClick={handleSearchClick}
            className="
              w-full flex items-center gap-3 px-4 py-2
              bg-muted/50 border border-border rounded-lg
              text-muted-foreground text-sm
              hover:bg-muted hover:border-primary/50
              transition-all duration-200
              hover-glow
            "
          >
            <Search className="w-4 h-4" />
            <span className="flex-1 text-left">Search games...</span>
            <kbd className="px-2 py-0.5 bg-background rounded text-xs font-mono border border-border">
              Ctrl+K
            </kbd>
          </button>
        </div>

        {/* Right section: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile search button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-muted-foreground hover:text-foreground"
            onClick={handleSearchClick}
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </Button>

          {/* Notifications (mockup) */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-muted-foreground hover:text-foreground"
            aria-label="Notifications"
          >
            <Bell className="w-5 h-5" />
            {/* Notification badge */}
            <span className="absolute top-1 right-1 w-2 h-2 bg-accent rounded-full animate-pulse" />
          </Button>
        </div>
      </div>
    </header>
  );
}
