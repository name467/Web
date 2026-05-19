/**
 * ============================================================================
 * NEONVAULT THEMES - Pre-built theme configurations
 * ============================================================================
 * This file contains all the built-in themes for the gaming portal.
 * Each theme defines a complete visual style including colors, fonts,
 * and effect settings. Users can switch between these or create custom themes.
 * 
 * HOW THEMES WORK:
 * 1. Themes are JavaScript objects that define CSS custom properties
 * 2. When a theme is applied, we update CSS variables on the :root element
 * 3. Tailwind classes reference these variables (e.g., bg-background)
 * 4. This allows instant theme switching without page reload
 */

import { Theme } from './types';

// ============================================================================
// CYBERPUNK NEON THEME (Default)
// ============================================================================
/**
 * The signature look - dark backgrounds with vibrant cyan and magenta neon
 * Inspired by cyberpunk aesthetics and futuristic gaming interfaces
 */
export const cyberpunkTheme: Theme = {
  id: 'cyberpunk',
  name: 'Cyberpunk Neon',
  description: 'Futuristic dark theme with cyan and magenta neon accents',
  colors: {
    // Deep dark backgrounds for that cyberpunk feel
    background: '#0a0a0f',
    foreground: '#e0e0e0',
    
    // Slightly lighter cards for depth
    card: '#12121a',
    cardForeground: '#e0e0e0',
    
    // Cyan as primary - the classic cyberpunk accent
    primary: '#00f0ff',
    primaryForeground: '#0a0a0f',
    
    // Purple secondary for contrast
    secondary: '#1a1a2e',
    secondaryForeground: '#e0e0e0',
    
    // Muted elements
    muted: '#16161f',
    mutedForeground: '#6b6b80',
    
    // Magenta accent for highlights
    accent: '#ff00aa',
    accentForeground: '#ffffff',
    
    // Borders with subtle glow potential
    border: '#2a2a3e',
    ring: '#00f0ff',
    
    // Neon glow colors
    neonPrimary: '#00f0ff',
    neonSecondary: '#ff00aa',
  },
  fonts: {
    heading: 'Orbitron, sans-serif',
    body: 'Rajdhani, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  effects: {
    glowIntensity: 0.8,
    particleColor: '#00f0ff',
    particleDensity: 0.6,
    animationSpeed: 1,
  },
};

// ============================================================================
// RETRO ARCADE THEME
// ============================================================================
/**
 * Nostalgic 80s arcade vibes with warm colors and pixel-perfect aesthetics
 * Orange, yellow, and pink create that classic arcade atmosphere
 */
export const retroArcadeTheme: Theme = {
  id: 'retro',
  name: 'Retro Arcade',
  description: '80s arcade vibes with warm neon colors and pixel aesthetics',
  colors: {
    // Dark but warmer than cyberpunk
    background: '#0d0d12',
    foreground: '#f0e6d3',
    
    // Warm-tinted cards
    card: '#1a1520',
    cardForeground: '#f0e6d3',
    
    // Hot orange/amber primary
    primary: '#ff6b00',
    primaryForeground: '#0d0d12',
    
    // Deep purple secondary
    secondary: '#2d1b3d',
    secondaryForeground: '#f0e6d3',
    
    // Muted warm tones
    muted: '#1f1825',
    mutedForeground: '#8b7b6b',
    
    // Hot pink accent
    accent: '#ff2d6a',
    accentForeground: '#ffffff',
    
    // Warm borders
    border: '#3d2850',
    ring: '#ff6b00',
    
    // Neon glow colors
    neonPrimary: '#ff6b00',
    neonSecondary: '#ff2d6a',
  },
  fonts: {
    heading: 'Press Start 2P, monospace',
    body: 'VT323, monospace',
    mono: 'VT323, monospace',
  },
  effects: {
    glowIntensity: 0.9,
    particleColor: '#ff6b00',
    particleDensity: 0.4,
    animationSpeed: 0.8,
  },
};

// ============================================================================
// MINIMALIST DARK THEME
// ============================================================================
/**
 * Clean, professional dark theme with subtle accents
 * Perfect for users who prefer less visual noise
 */
export const minimalistTheme: Theme = {
  id: 'minimalist',
  name: 'Minimalist Dark',
  description: 'Clean and subtle dark theme with minimal distractions',
  colors: {
    // Pure dark grays
    background: '#111111',
    foreground: '#d4d4d4',
    
    // Subtle card distinction
    card: '#1a1a1a',
    cardForeground: '#d4d4d4',
    
    // Soft blue-gray primary
    primary: '#6366f1',
    primaryForeground: '#ffffff',
    
    // Neutral secondary
    secondary: '#262626',
    secondaryForeground: '#d4d4d4',
    
    // Muted grays
    muted: '#1f1f1f',
    mutedForeground: '#737373',
    
    // Subtle accent
    accent: '#8b5cf6',
    accentForeground: '#ffffff',
    
    // Clean borders
    border: '#2e2e2e',
    ring: '#6366f1',
    
    // Softer glows
    neonPrimary: '#6366f1',
    neonSecondary: '#8b5cf6',
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  effects: {
    glowIntensity: 0.3,
    particleColor: '#6366f1',
    particleDensity: 0.2,
    animationSpeed: 0.7,
  },
};

// ============================================================================
// HACKER TERMINAL THEME
// ============================================================================
/**
 * Matrix-inspired green-on-black terminal aesthetic
 * For those who want to feel like they're hacking the mainframe
 */
export const hackerTheme: Theme = {
  id: 'hacker',
  name: 'Hacker Terminal',
  description: 'Matrix-inspired green terminal with command-line aesthetics',
  colors: {
    // Pure black background
    background: '#000000',
    foreground: '#00ff00',
    
    // Slightly visible cards
    card: '#0a0f0a',
    cardForeground: '#00ff00',
    
    // Classic terminal green
    primary: '#00ff00',
    primaryForeground: '#000000',
    
    // Dark green secondary
    secondary: '#0a1a0a',
    secondaryForeground: '#00ff00',
    
    // Dim green muted
    muted: '#051005',
    mutedForeground: '#008000',
    
    // Bright lime accent
    accent: '#39ff14',
    accentForeground: '#000000',
    
    // Green borders
    border: '#003300',
    ring: '#00ff00',
    
    // Neon greens
    neonPrimary: '#00ff00',
    neonSecondary: '#39ff14',
  },
  fonts: {
    heading: 'Share Tech Mono, monospace',
    body: 'Share Tech Mono, monospace',
    mono: 'Share Tech Mono, monospace',
  },
  effects: {
    glowIntensity: 0.7,
    particleColor: '#00ff00',
    particleDensity: 0.5,
    animationSpeed: 1.2,
  },
};

// ============================================================================
// SYNTHWAVE THEME
// ============================================================================
/**
 * Outrun/Synthwave aesthetic with sunset gradients
 * Purple, pink, and orange create that retro-futuristic sunset vibe
 */
export const synthwaveTheme: Theme = {
  id: 'synthwave',
  name: 'Synthwave Sunset',
  description: 'Retro-futuristic sunset vibes with purple and orange gradients',
  colors: {
    // Deep purple-blue background
    background: '#0f0a1a',
    foreground: '#f5e6ff',
    
    // Purple-tinted cards
    card: '#1a0f2e',
    cardForeground: '#f5e6ff',
    
    // Hot pink primary
    primary: '#ff2a6d',
    primaryForeground: '#0f0a1a',
    
    // Deep purple secondary
    secondary: '#2d1f4a',
    secondaryForeground: '#f5e6ff',
    
    // Muted purple
    muted: '#1f1535',
    mutedForeground: '#9b8ab8',
    
    // Orange sunset accent
    accent: '#ff9f1c',
    accentForeground: '#0f0a1a',
    
    // Purple borders
    border: '#3d2a5c',
    ring: '#ff2a6d',
    
    // Sunset neon colors
    neonPrimary: '#ff2a6d',
    neonSecondary: '#ff9f1c',
  },
  fonts: {
    heading: 'Audiowide, sans-serif',
    body: 'Exo 2, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  effects: {
    glowIntensity: 0.85,
    particleColor: '#ff2a6d',
    particleDensity: 0.5,
    animationSpeed: 0.9,
  },
};

// ============================================================================
// THEME COLLECTION
// ============================================================================

/**
 * All available themes as an array for easy iteration
 * Used in theme selector and settings
 */
export const themes: Theme[] = [
  cyberpunkTheme,
  retroArcadeTheme,
  minimalistTheme,
  hackerTheme,
  synthwaveTheme,
];

/**
 * Get a theme by its ID
 * Falls back to cyberpunk if not found
 */
export function getThemeById(id: string): Theme {
  return themes.find(t => t.id === id) || cyberpunkTheme;
}

/**
 * Convert theme colors to CSS custom properties
 * This is used when applying a theme to the document
 */
export function themeToCSSVariables(theme: Theme): Record<string, string> {
  return {
    '--background': theme.colors.background,
    '--foreground': theme.colors.foreground,
    '--card': theme.colors.card,
    '--card-foreground': theme.colors.cardForeground,
    '--primary': theme.colors.primary,
    '--primary-foreground': theme.colors.primaryForeground,
    '--secondary': theme.colors.secondary,
    '--secondary-foreground': theme.colors.secondaryForeground,
    '--muted': theme.colors.muted,
    '--muted-foreground': theme.colors.mutedForeground,
    '--accent': theme.colors.accent,
    '--accent-foreground': theme.colors.accentForeground,
    '--border': theme.colors.border,
    '--ring': theme.colors.ring,
    '--neon-primary': theme.colors.neonPrimary,
    '--neon-secondary': theme.colors.neonSecondary,
  };
}
