'use client';

/**
 * ============================================================================
 * SIDEBAR NAVIGATION COMPONENT
 * ============================================================================
 * The main navigation sidebar for the gaming portal.
 * 
 * FEATURES:
 * - Collapsible on mobile (hamburger menu)
 * - Active page highlighting with neon glow
 * - User profile mockup at top
 * - Quick action buttons
 * - Keyboard shortcut hints
 * - Smooth open/close animations
 * 
 * RESPONSIVE BEHAVIOR:
 * - Desktop: Always visible as a sidebar
 * - Mobile: Slides in/out as an overlay
 */

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useGame } from '@/lib/game-context';
import { 
  Home, 
  Gamepad2, 
  Settings, 
  Heart, 
  Volume2, 
  VolumeX,
  Maximize,
  Minimize,
  ChevronLeft,
  ChevronRight,
  Clock,
  User,
  Keyboard,
  X,
  Globe,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

/**
 * Navigation item configuration
 * Each item represents a main page in the app
 */
const navItems = [
  { 
    href: '/', 
    label: 'Home', 
    icon: Home,
    shortcut: 'H',
    description: 'Welcome to NeonVault',
    external: false
  },
  { 
    href: 'https://gn-math.dev', 
    label: 'Games', 
    icon: Gamepad2,
    shortcut: 'G',
    description: 'Play Games',
    external: true
  },
  { 
    href: '/browser', 
    label: 'Browser', 
    icon: Globe,
    shortcut: 'B',
    description: 'Open Web Browser',
    external: false
  },
  { 
    href: '/settings', 
    label: 'Settings', 
    icon: Settings,
    shortcut: ',',
    description: 'Customize Your Experience',
    external: false
  },
];

/**
 * Quick action item configuration
 * These are secondary actions available in the sidebar
 */
const quickActions = [
  { 
    href: '/games?filter=favorites', 
    label: 'Favorites', 
    icon: Heart,
    description: 'Your Favorited Games'
  },
  { 
    href: '/games?filter=recent', 
    label: 'Recent', 
    icon: Clock,
    description: 'Recently Played'
  },
];

export function Sidebar() {
  // Get current route to highlight active nav item
  const pathname = usePathname();
  
  // Get state and actions from game context
  const { 
    uiState,
    setSidebarOpen,
    settings,
    updateSettings,
    toggleFullscreen,
    isFullscreen,
    playSound,
  } = useGame();
  
  const { sidebarOpen } = uiState;

  /**
   * Handle navigation click
   * Plays sound and closes sidebar on mobile
   */
  const handleNavClick = () => {
    playSound('click');
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  /**
   * Toggle sound with feedback
   */
  const handleSoundToggle = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
    // Play click sound before it might get disabled
    if (!settings.soundEnabled) {
      playSound('click');
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}
      
      {/* Sidebar container */}
      <aside 
        className={`
          fixed top-0 left-0 z-50 h-full
          w-72 bg-sidebar border-r border-sidebar-border
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
        role="navigation"
        aria-label="Main navigation"
      >
        {/* ----------------------------------------------------------------
            HEADER SECTION
            Logo and mobile close button
        ---------------------------------------------------------------- */}
        <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
          {/* Logo */}
          <Link 
            href="/"
            className="flex items-center gap-2 group"
            onClick={handleNavClick}
          >
            <div className="relative">
              {/* Logo icon with glow */}
              <Gamepad2 className="w-8 h-8 text-primary transition-all duration-300 group-hover:scale-110" />
              <div className="absolute inset-0 blur-lg bg-primary opacity-30 group-hover:opacity-50 transition-opacity" />
            </div>
            <span 
              className="text-xl font-bold tracking-wider"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              <span className="text-primary">NEON</span>
              <span className="text-accent">VAULT</span>
            </span>
          </Link>
          
          {/* Mobile close button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* ----------------------------------------------------------------
            USER PROFILE SECTION (Mockup)
            Displays user avatar and basic info
        ---------------------------------------------------------------- */}
        <div className="p-4 border-b border-sidebar-border">
          <div className="flex items-center gap-3">
            {/* Avatar placeholder */}
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <User className="w-6 h-6 text-primary-foreground" />
              </div>
              {/* Online status indicator */}
              <div className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-sidebar" />
            </div>
            
            {/* User info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sidebar-foreground truncate">
                Player One
              </p>
              <p className="text-xs text-muted-foreground">
                Level 42 • 12,500 XP
              </p>
            </div>
          </div>
        </div>

        {/* ----------------------------------------------------------------
            MAIN NAVIGATION
            Primary navigation links
        ---------------------------------------------------------------- */}
        <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide">
          {/* Main nav section */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Main Menu
            </p>
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = !item.external && pathname === item.href;
                const Icon = item.icon;
                
                // Handle external links (like games) differently
                const handleClick = (e: React.MouseEvent) => {
                  if (item.external) {
                    e.preventDefault();
                    playSound('click');
                    window.open(item.href, '_blank', 'noopener,noreferrer');
                    // Close sidebar on mobile
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  } else {
                    handleNavClick();
                  }
                };
                
                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.external ? '#' : item.href}
                          onClick={handleClick}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg
                            transition-all duration-200
                            group relative
                            ${isActive 
                              ? 'bg-primary/10 text-primary neon-border' 
                              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            }
                          `}
                          aria-current={isActive ? 'page' : undefined}
                        >
                          <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'text-primary' : ''} group-hover:scale-110`} />
                          <span className="flex-1 font-medium">{item.label}</span>
                          
                          {/* External link indicator */}
                          {item.external && (
                            <span className="text-xs text-muted-foreground">
                              <ExternalLink className="w-3 h-3" />
                            </span>
                          )}
                          
                          {/* Keyboard shortcut hint */}
                          <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
                            {item.shortcut}
                          </span>
                          
                          {/* Active indicator glow */}
                          {isActive && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full shadow-[0_0_10px_var(--neon-primary)]" />
                          )}
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Quick actions section */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Quick Access
            </p>
            <ul className="space-y-1">
              {quickActions.map((item) => {
                const Icon = item.icon;
                const isActive = pathname + (typeof window !== 'undefined' ? window.location.search : '') === item.href;
                
                return (
                  <li key={item.href}>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Link
                          href={item.href}
                          onClick={handleNavClick}
                          className={`
                            flex items-center gap-3 px-3 py-2.5 rounded-lg
                            transition-all duration-200
                            group
                            ${isActive 
                              ? 'bg-accent/10 text-accent' 
                              : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                            }
                          `}
                        >
                          <Icon className={`w-5 h-5 transition-transform duration-200 ${item.label === 'Favorites' ? 'text-red-400' : ''} group-hover:scale-110`} />
                          <span className="flex-1 font-medium">{item.label}</span>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.description}</p>
                      </TooltipContent>
                    </Tooltip>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Keyboard shortcuts hint */}
          <div className="p-3 rounded-lg bg-muted/30 border border-border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Keyboard className="w-4 h-4" />
              <span>Press</span>
              <kbd className="px-1.5 py-0.5 bg-muted rounded text-xs font-mono">Ctrl+K</kbd>
              <span>to search</span>
            </div>
          </div>
        </nav>

        {/* ----------------------------------------------------------------
            FOOTER SECTION
            Quick action buttons (sound, fullscreen)
        ---------------------------------------------------------------- */}
        <div className="p-4 border-t border-sidebar-border">
          <div className="flex items-center gap-2">
            {/* Sound toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSoundToggle}
                  className={`flex-1 ${settings.soundEnabled ? 'text-primary border-primary/50' : 'text-muted-foreground'}`}
                >
                  {settings.soundEnabled ? (
                    <Volume2 className="w-5 h-5" />
                  ) : (
                    <VolumeX className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{settings.soundEnabled ? 'Mute Sound' : 'Enable Sound'} (M)</p>
              </TooltipContent>
            </Tooltip>

            {/* Fullscreen toggle */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleFullscreen}
                  className="flex-1 text-muted-foreground hover:text-foreground"
                >
                  {isFullscreen ? (
                    <Minimize className="w-5 h-5" />
                  ) : (
                    <Maximize className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>{isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'} (F11)</p>
              </TooltipContent>
            </Tooltip>

            {/* Collapse sidebar (desktop only) */}
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="hidden lg:flex flex-1 text-muted-foreground hover:text-foreground"
                >
                  {sidebarOpen ? (
                    <ChevronLeft className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Sidebar ([)</p>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </aside>
    </TooltipProvider>
  );
}
