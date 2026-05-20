/**
 * ============================================================================
 * NEONVAULT TYPES - Type definitions for the gaming portal
 * ============================================================================
 * This file contains all TypeScript interfaces and types used throughout
 * the application. Having centralized types ensures consistency and makes
 * the codebase easier to maintain.
 */

// ============================================================================
// GAME TYPES
// ============================================================================

/**
 * Represents a single game in the library
 * Each game has metadata for display, filtering, and tracking
 */
export interface Game {
  id: string;                    // Unique identifier for the game
  title: string;                 // Display name of the game
  description: string;           // Short description shown on cards
  image: string;                 // URL/path to the game's cover image
  category: GameCategory;        // Primary category for filtering
  tags: string[];               // Additional tags for search/filter
  rating: number;               // Rating from 1-5 stars
  players: string;              // e.g., "1 Player", "1-4 Players", "Multiplayer"
  releaseYear: number;          // Year the game was released
  isFeatured?: boolean;         // Whether to show in featured section
  isNew?: boolean;              // Show "NEW" badge
  url?: string;                 // External URL to play the game (via proxy)
}

/**
 * Available game categories for filtering
 * These match common browser game genres
 */
export type GameCategory = 
  | 'action'
  | 'puzzle'
  | 'racing'
  | 'sports'
  | 'strategy'
  | 'arcade'
  | 'adventure'
  | 'simulation';

// ============================================================================
// THEME TYPES
// ============================================================================

/**
 * Theme configuration object
 * Defines all visual properties for a theme
 */
export interface Theme {
  id: string;                    // Unique identifier (used in localStorage)
  name: string;                  // Display name in theme selector
  description: string;           // Short description of the theme
  colors: ThemeColors;           // Color palette
  fonts: ThemeFonts;            // Font configuration
  effects: ThemeEffects;        // Visual effects settings
}

/**
 * Color palette for a theme
 * Using CSS custom property format for easy application
 */
export interface ThemeColors {
  // Base colors
  background: string;           // Main background color
  foreground: string;           // Main text color
  
  // Component colors
  card: string;                 // Card/panel background
  cardForeground: string;       // Text on cards
  
  // Interactive colors
  primary: string;              // Primary accent color (buttons, links)
  primaryForeground: string;    // Text on primary elements
  
  // Secondary elements
  secondary: string;            // Secondary background
  secondaryForeground: string;  // Text on secondary elements
  
  // Muted/subtle elements
  muted: string;                // Muted background
  mutedForeground: string;      // Muted text (subtitles, hints)
  
  // Special colors
  accent: string;               // Neon/highlight color
  accentForeground: string;     // Text on accent elements
  
  // Utility colors
  border: string;               // Border color
  ring: string;                 // Focus ring color
  
  // Neon glow colors (unique to gaming themes)
  neonPrimary: string;          // Primary glow color
  neonSecondary: string;        // Secondary glow color
}

/**
 * Font configuration for a theme
 */
export interface ThemeFonts {
  heading: string;              // Font family for headings
  body: string;                 // Font family for body text
  mono: string;                 // Font family for code/monospace
}

/**
 * Visual effects configuration
 */
export interface ThemeEffects {
  glowIntensity: number;        // 0-1 intensity of neon glows
  particleColor: string;        // Color of background particles
  particleDensity: number;      // 0-1 density of particles
  animationSpeed: number;       // Multiplier for animation speeds
}

// ============================================================================
// SETTINGS TYPES
// ============================================================================

/**
 * User settings stored in localStorage
 * These preferences persist across sessions
 */
export interface UserSettings {
  // Appearance
  themeId: string;              // Current theme identifier
  customTheme?: Partial<Theme>; // User's custom theme modifications
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;       // Disable animations for accessibility
  
  // Audio
  soundEnabled: boolean;        // Global sound toggle
  musicEnabled: boolean;        // Background music toggle
  soundVolume: number;          // 0-100 sound effect volume
  musicVolume: number;          // 0-100 music volume
  
  // Display
  fullscreenOnPlay: boolean;    // Auto-fullscreen when starting games
  showFPS: boolean;             // Show FPS counter (if supported)
  particlesEnabled: boolean;    // Background particles toggle
  closeConfirmation: boolean;   // Show confirm dialog when leaving games
  
  // Tab Cloaking
  tabCloakEnabled: boolean;     // Enable tab cloaking
  tabCloakTitle: string;        // Custom tab title
  tabCloakFavicon: string;      // Custom favicon URL
  openInAboutBlank: boolean;    // Open site in about:blank
  closeTabConfirmation: boolean; // Ask for confirmation when closing tab
  
  // Accessibility
  highContrast: boolean;        // High contrast mode
  largeText: boolean;           // Increase text sizes
  screenReaderOptimized: boolean; // Optimize for screen readers
  
  // Keyboard shortcuts
  shortcuts: KeyboardShortcuts;
}

/**
 * Keyboard shortcuts configuration
 * Each action maps to a key combination
 */
export interface KeyboardShortcuts {
  toggleFullscreen: string;     // Default: 'F11'
  toggleSound: string;          // Default: 'M'
  openSearch: string;           // Default: 'Ctrl+K'
  goHome: string;              // Default: 'H'
  goGames: string;             // Default: 'G'
  goSettings: string;          // Default: ','
  toggleSidebar: string;       // Default: '['
}

/**
 * Default settings used when no saved settings exist
 */
export const DEFAULT_SETTINGS: UserSettings = {
  themeId: 'cyberpunk',
  fontSize: 'medium',
  reducedMotion: false,
  soundEnabled: true,
  musicEnabled: false,
  soundVolume: 70,
  musicVolume: 50,
  fullscreenOnPlay: false,
  showFPS: false,
  particlesEnabled: true,
  closeConfirmation: true,
  tabCloakEnabled: false,
  tabCloakTitle: 'Google',
  tabCloakFavicon: 'https://www.google.com/favicon.ico',
  openInAboutBlank: false,
  closeTabConfirmation: false,
  highContrast: false,
  largeText: false,
  screenReaderOptimized: false,
  shortcuts: {
    toggleFullscreen: 'F11',
    toggleSound: 'M',
    openSearch: 'Ctrl+K',
    goHome: 'H',
    goGames: 'G',
    goSettings: ',',
    toggleSidebar: '[',
  },
};

// ============================================================================
// USER DATA TYPES
// ============================================================================

/**
 * User profile information (mockup - no real auth)
 */
export interface UserProfile {
  id: string;
  username: string;
  avatar: string;               // URL to avatar image
  level: number;                // Gamification level
  xp: number;                   // Experience points
  joinDate: string;             // ISO date string
}

/**
 * Recently played game entry
 */
export interface RecentlyPlayed {
  gameId: string;
  lastPlayed: string;           // ISO date string
  playTime: number;             // Total seconds played
}

/**
 * User's game-related data
 */
export interface UserGameData {
  favorites: string[];          // Array of favorited game IDs
  recentlyPlayed: RecentlyPlayed[];
}

/**
 * Default user game data
 */
export const DEFAULT_USER_DATA: UserGameData = {
  favorites: [],
  recentlyPlayed: [],
};

// ============================================================================
// UI STATE TYPES
// ============================================================================

/**
 * Global UI state managed by context
 */
export interface UIState {
  sidebarOpen: boolean;
  searchOpen: boolean;
  isLoading: boolean;
  currentPage: 'home' | 'games' | 'browser' | 'settings';
  hasUnsavedChanges: boolean;
  isGameActive: boolean;
}
