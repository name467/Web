'use client';

/**
 * ============================================================================
 * NEONVAULT GAME CONTEXT
 * ============================================================================
 * This is the central state management system for the gaming portal.
 * It uses React Context to share state across all components without prop drilling.
 * 
 * HOW IT WORKS:
 * 1. GameProvider wraps the entire app in layout.tsx
 * 2. Any component can access state via useGame() hook
 * 3. State changes trigger re-renders in consuming components
 * 4. Settings are automatically saved to localStorage
 * 
 * WHAT IT MANAGES:
 * - Theme selection and application
 * - User settings (sound, display, accessibility)
 * - Favorites and recently played tracking
 * - UI state (sidebar, search, loading)
 * - Keyboard shortcuts
 */

import React, { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react';
import { Theme, UserSettings, UserGameData, UIState, DEFAULT_SETTINGS, DEFAULT_USER_DATA, RecentlyPlayed } from './types';
import { themes, getThemeById, themeToCSSVariables, cyberpunkTheme } from './themes';

// ============================================================================
// CONTEXT TYPE DEFINITION
// ============================================================================

interface GameContextType {
  // Theme state
  currentTheme: Theme;
  setTheme: (themeId: string) => void;
  availableThemes: Theme[];
  customTheme: Partial<Theme> | null;
  setCustomTheme: (theme: Partial<Theme>) => void;
  
  // Settings state
  settings: UserSettings;
  updateSettings: (updates: Partial<UserSettings>) => void;
  resetSettings: () => void;
  
  // User data (favorites, recently played)
  userData: UserGameData;
  toggleFavorite: (gameId: string) => void;
  isFavorite: (gameId: string) => boolean;
  addToRecentlyPlayed: (gameId: string) => void;
  
  // UI state
  uiState: UIState;
  setSidebarOpen: (open: boolean) => void;
  setSearchOpen: (open: boolean) => void;
  setIsLoading: (loading: boolean) => void;
  setCurrentPage: (page: UIState['currentPage']) => void;
  setHasUnsavedChanges: (unsaved: boolean) => void;
  setIsGameActive: (active: boolean) => void;
  
  // Utility functions
  playSound: (sound: 'click' | 'hover' | 'success' | 'error') => void;
  toggleFullscreen: () => void;
  isFullscreen: boolean;
}

// ============================================================================
// LOCAL STORAGE KEYS
// ============================================================================
// We use consistent keys for localStorage to persist user preferences

const STORAGE_KEYS = {
  SETTINGS: 'neonvault-settings',
  USER_DATA: 'neonvault-user-data',
  CUSTOM_THEME: 'neonvault-custom-theme',
} as const;

// ============================================================================
// CONTEXT CREATION
// ============================================================================

const GameContext = createContext<GameContextType | null>(null);

/**
 * Custom hook to access the game context
 * Throws an error if used outside of GameProvider
 */
export function useGame(): GameContextType {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

interface GameProviderProps {
  children: ReactNode;
}

export function GameProvider({ children }: GameProviderProps) {
  // -------------------------------------------------------------------------
  // STATE INITIALIZATION
  // -------------------------------------------------------------------------
  // We initialize with defaults, then load from localStorage in useEffect
  
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [userData, setUserData] = useState<UserGameData>(DEFAULT_USER_DATA);
  const [customTheme, setCustomThemeState] = useState<Partial<Theme> | null>(null);
  const [currentTheme, setCurrentTheme] = useState<Theme>(cyberpunkTheme);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  
  // UI state for global UI elements
  const [uiState, setUIState] = useState<UIState>({
    sidebarOpen: true,
    searchOpen: false,
    isLoading: true,
    currentPage: 'home',
    hasUnsavedChanges: false,
    isGameActive: false,
  });

  // -------------------------------------------------------------------------
  // LOAD DATA FROM LOCALSTORAGE
  // -------------------------------------------------------------------------
  // This runs once on mount to restore user preferences
  
  useEffect(() => {
    // Only run on client side
    if (typeof window === 'undefined') return;
    
    try {
      // Load settings
      const savedSettings = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (savedSettings) {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...DEFAULT_SETTINGS, ...parsed });
      }
      
      // Load user data (favorites, recently played)
      const savedUserData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
      if (savedUserData) {
        const parsed = JSON.parse(savedUserData);
        setUserData({ ...DEFAULT_USER_DATA, ...parsed });
      }
      
      // Load custom theme if exists
      const savedCustomTheme = localStorage.getItem(STORAGE_KEYS.CUSTOM_THEME);
      if (savedCustomTheme) {
        setCustomThemeState(JSON.parse(savedCustomTheme));
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
    
    // Mark as hydrated (localStorage loaded)
    setIsHydrated(true);
    
    // End loading screen after a short delay for effect
    setTimeout(() => {
      setUIState(prev => ({ ...prev, isLoading: false }));
    }, 1500);
  }, []);

  // -------------------------------------------------------------------------
  // APPLY THEME TO DOCUMENT
  // -------------------------------------------------------------------------
  // When theme changes, update CSS variables on :root
  
  useEffect(() => {
    if (!isHydrated) return;
    
    // Get the theme based on settings
    const theme = getThemeById(settings.themeId);
    setCurrentTheme(theme);
    
    // Apply CSS variables to document root
    const cssVars = themeToCSSVariables(theme);
    const root = document.documentElement;
    
    Object.entries(cssVars).forEach(([property, value]) => {
      root.style.setProperty(property, value);
    });
    
    // Also add dark class for any components that need it
    root.classList.add('dark');
  }, [settings.themeId, isHydrated]);

  // -------------------------------------------------------------------------
  // PERSIST SETTINGS TO LOCALSTORAGE
  // -------------------------------------------------------------------------
  
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  }, [settings, isHydrated]);

  // -------------------------------------------------------------------------
  // APPLY TAB CLOAKING
  // -------------------------------------------------------------------------
  
  useEffect(() => {
    if (!isHydrated) return;
    
    if (settings.tabCloakEnabled) {
      // Update document title
      document.title = settings.tabCloakTitle || 'Google';
      
      // Update favicon
      const existingFavicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (existingFavicon) {
        existingFavicon.href = settings.tabCloakFavicon || 'https://www.google.com/favicon.ico';
      } else {
        const favicon = document.createElement('link');
        favicon.rel = 'icon';
        favicon.href = settings.tabCloakFavicon || 'https://www.google.com/favicon.ico';
        document.head.appendChild(favicon);
      }
    } else {
      // Reset to default
      document.title = 'NeonVault';
      const existingFavicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
      if (existingFavicon) {
        existingFavicon.href = '/favicon.ico';
      }
    }
  }, [settings.tabCloakEnabled, settings.tabCloakTitle, settings.tabCloakFavicon, isHydrated]);

  // -------------------------------------------------------------------------
  // CLOSE TAB CONFIRMATION
  // -------------------------------------------------------------------------
  
  useEffect(() => {
    if (!isHydrated) return;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (settings.closeTabConfirmation) {
        e.preventDefault();
        e.returnValue = '';
        return '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [settings.closeTabConfirmation, isHydrated]);

  // -------------------------------------------------------------------------
  // PERSIST USER DATA TO LOCALSTORAGE
  // -------------------------------------------------------------------------
  
  useEffect(() => {
    if (!isHydrated) return;
    localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
  }, [userData, isHydrated]);

  // -------------------------------------------------------------------------
  // KEYBOARD SHORTCUTS
  // -------------------------------------------------------------------------
  
  useEffect(() => {
    if (!isHydrated) return;
    
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      
      const { shortcuts } = settings;
      
      // Build the key string (e.g., "Ctrl+K")
      const key = e.key.toUpperCase();
      const ctrl = e.ctrlKey || e.metaKey;
      const keyCombo = ctrl ? `Ctrl+${key}` : key;
      
      // Check against shortcuts
      if (keyCombo === shortcuts.toggleFullscreen || e.key === 'F11') {
        e.preventDefault();
        toggleFullscreen();
      } else if (keyCombo === shortcuts.toggleSound) {
        updateSettings({ soundEnabled: !settings.soundEnabled });
      } else if (keyCombo === shortcuts.openSearch) {
        e.preventDefault();
        setUIState(prev => ({ ...prev, searchOpen: true }));
      } else if (keyCombo === shortcuts.toggleSidebar) {
        setUIState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }));
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [settings, isHydrated]);

  // -------------------------------------------------------------------------
  // FULLSCREEN TRACKING
  // -------------------------------------------------------------------------
  
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // -------------------------------------------------------------------------
  // THEME FUNCTIONS
  // -------------------------------------------------------------------------
  
  const setTheme = useCallback((themeId: string) => {
    setSettings(prev => ({ ...prev, themeId }));
  }, []);

  const setCustomTheme = useCallback((theme: Partial<Theme>) => {
    setCustomThemeState(theme);
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.CUSTOM_THEME, JSON.stringify(theme));
    }
  }, []);

  // -------------------------------------------------------------------------
  // SETTINGS FUNCTIONS
  // -------------------------------------------------------------------------
  
  const updateSettings = useCallback((updates: Partial<UserSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    setCustomThemeState(null);
    localStorage.removeItem(STORAGE_KEYS.CUSTOM_THEME);
  }, []);

  // -------------------------------------------------------------------------
  // FAVORITES FUNCTIONS
  // -------------------------------------------------------------------------
  
  const toggleFavorite = useCallback((gameId: string) => {
    setUserData(prev => {
      const isFav = prev.favorites.includes(gameId);
      return {
        ...prev,
        favorites: isFav 
          ? prev.favorites.filter(id => id !== gameId)
          : [...prev.favorites, gameId],
      };
    });
  }, []);

  const isFavorite = useCallback((gameId: string) => {
    return userData.favorites.includes(gameId);
  }, [userData.favorites]);

  // -------------------------------------------------------------------------
  // RECENTLY PLAYED FUNCTIONS
  // -------------------------------------------------------------------------
  
  const addToRecentlyPlayed = useCallback((gameId: string) => {
    setUserData(prev => {
      // Remove existing entry if present
      const filtered = prev.recentlyPlayed.filter(r => r.gameId !== gameId);
      
      // Add new entry at the beginning
      const newEntry: RecentlyPlayed = {
        gameId,
        lastPlayed: new Date().toISOString(),
        playTime: 0,
      };
      
      // Keep only last 10
      const updated = [newEntry, ...filtered].slice(0, 10);
      
      return { ...prev, recentlyPlayed: updated };
    });
  }, []);

  // -------------------------------------------------------------------------
  // UI STATE FUNCTIONS
  // -------------------------------------------------------------------------
  
  const setSidebarOpen = useCallback((open: boolean) => {
    setUIState(prev => ({ ...prev, sidebarOpen: open }));
  }, []);

  const setSearchOpen = useCallback((open: boolean) => {
    setUIState(prev => ({ ...prev, searchOpen: open }));
  }, []);

  const setIsLoading = useCallback((loading: boolean) => {
    setUIState(prev => ({ ...prev, isLoading: loading }));
  }, []);

  const setCurrentPage = useCallback((page: UIState['currentPage']) => {
    setUIState(prev => ({ ...prev, currentPage: page }));
  }, []);

  const setHasUnsavedChanges = useCallback((unsaved: boolean) => {
    setUIState(prev => ({ ...prev, hasUnsavedChanges: unsaved }));
  }, []);

  const setIsGameActive = useCallback((active: boolean) => {
    setUIState(prev => ({ ...prev, isGameActive: active }));
  }, []);

  // -------------------------------------------------------------------------
  // UTILITY FUNCTIONS
  // -------------------------------------------------------------------------
  
  /**
   * Play a UI sound effect
   * Only plays if sound is enabled in settings
   */
  const playSound = useCallback((sound: 'click' | 'hover' | 'success' | 'error') => {
    if (!settings.soundEnabled) return;
    
    // In a real app, you'd use Howler.js here to play actual sound files
    // For now, we'll use the Web Audio API for simple beeps
    try {
      const audioContext = new (window.AudioContext || (window as Window & typeof globalThis & { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Different frequencies for different sounds
      const frequencies: Record<string, number> = {
        click: 800,
        hover: 600,
        success: 1000,
        error: 300,
      };
      
      oscillator.frequency.value = frequencies[sound];
      gainNode.gain.value = (settings.soundVolume / 100) * 0.1;
      
      oscillator.start();
      oscillator.stop(audioContext.currentTime + 0.05);
    } catch {
      // Audio might not be available
    }
  }, [settings.soundEnabled, settings.soundVolume]);

  /**
   * Toggle fullscreen mode
   */
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
  }, []);

  // -------------------------------------------------------------------------
  // CONTEXT VALUE
  // -------------------------------------------------------------------------
  
  const value: GameContextType = {
    // Theme
    currentTheme,
    setTheme,
    availableThemes: themes,
    customTheme,
    setCustomTheme,
    
    // Settings
    settings,
    updateSettings,
    resetSettings,
    
    // User data
    userData,
    toggleFavorite,
    isFavorite,
    addToRecentlyPlayed,
    
    // UI state
    uiState,
    setSidebarOpen,
    setSearchOpen,
    setIsLoading,
    setCurrentPage,
    setHasUnsavedChanges,
    setIsGameActive,
    
    // Utilities
    playSound,
    toggleFullscreen,
    isFullscreen,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}
