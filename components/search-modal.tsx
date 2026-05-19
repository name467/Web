'use client';

/**
 * ============================================================================
 * SEARCH MODAL COMPONENT
 * ============================================================================
 * A command-palette style search modal for finding games quickly.
 * 
 * FEATURES:
 * - Opens with Ctrl+K keyboard shortcut
 * - Real-time search as you type
 * - Shows game results with images
 * - Keyboard navigation (arrow keys, enter)
 * - Recent searches
 * - Escape to close
 * 
 * This uses a modal overlay pattern with focus trapping for accessibility.
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/game-context';
import { games, searchGames } from '@/lib/games-data';
import type { Game } from '@/lib/types';
import { Search, X, Clock, Star, ArrowRight, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function SearchModal() {
  const router = useRouter();
  const { uiState, setSearchOpen, playSound, userData, addToRecentlyPlayed } = useGame();
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Search state
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Game[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Get recent games for suggestions
  const recentGames = userData.recentlyPlayed
    .slice(0, 3)
    .map(rp => games.find(g => g.id === rp.gameId))
    .filter((g): g is Game => g !== undefined);

  /**
   * Search games when query changes
   */
  useEffect(() => {
    if (query.trim()) {
      const searchResults = searchGames(query);
      setResults(searchResults.slice(0, 6));
      setSelectedIndex(0);
    } else {
      setResults([]);
    }
  }, [query]);

  /**
   * Focus input when modal opens
   */
  useEffect(() => {
    if (uiState.searchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [uiState.searchOpen]);

  /**
   * Handle keyboard navigation
   */
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    const itemCount = results.length || recentGames.length;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % itemCount);
        playSound('hover');
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + itemCount) % itemCount);
        playSound('hover');
        break;
      case 'Enter':
        e.preventDefault();
        const selectedGame = results.length > 0 ? results[selectedIndex] : recentGames[selectedIndex];
        if (selectedGame) {
          handleSelectGame(selectedGame);
        }
        break;
      case 'Escape':
        setSearchOpen(false);
        break;
    }
  }, [results, recentGames, selectedIndex, playSound, setSearchOpen]);

  /**
   * Handle game selection
   */
  const handleSelectGame = (game: Game) => {
    playSound('click');
    addToRecentlyPlayed(game.id);
    setSearchOpen(false);
    setQuery('');
    // Navigate to games page with the game selected
    router.push(`/games?game=${game.id}`);
  };

  /**
   * Close modal
   */
  const handleClose = () => {
    playSound('click');
    setSearchOpen(false);
    setQuery('');
  };

  // Don't render if not open
  if (!uiState.searchOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
        onClick={handleClose}
        aria-hidden="true"
      />
      
      {/* Modal */}
      <div 
        className="fixed top-[10%] left-1/2 -translate-x-1/2 w-full max-w-xl z-50 p-4"
        role="dialog"
        aria-modal="true"
        aria-label="Search games"
      >
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden animate-scale-in">
          {/* Search input */}
          <div className="flex items-center gap-3 p-4 border-b border-border">
            <Search className="w-5 h-5 text-primary" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for games..."
              className="flex-1 bg-transparent text-foreground text-lg outline-none placeholder:text-muted-foreground"
              aria-label="Search games"
            />
            <Button
              variant="ghost"
              size="icon"
              onClick={handleClose}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {/* Show search results if query exists */}
            {query.trim() && results.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-2">
                  Results
                </p>
                <ul>
                  {results.map((game, index) => (
                    <li key={game.id}>
                      <button
                        onClick={() => handleSelectGame(game)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`
                          w-full flex items-center gap-3 p-3 rounded-lg
                          transition-all duration-150
                          ${index === selectedIndex 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'hover:bg-muted'
                          }
                        `}
                      >
                        {/* Game image placeholder */}
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                          <Gamepad2 className="w-6 h-6 text-primary" />
                        </div>
                        
                        {/* Game info */}
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {game.title}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {game.category} • {game.players}
                          </p>
                        </div>
                        
                        {/* Rating */}
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span>{game.rating}</span>
                        </div>
                        
                        {/* Arrow indicator when selected */}
                        {index === selectedIndex && (
                          <ArrowRight className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* No results message */}
            {query.trim() && results.length === 0 && (
              <div className="p-8 text-center">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  No games found for &quot;{query}&quot;
                </p>
              </div>
            )}

            {/* Show recent games if no query */}
            {!query.trim() && recentGames.length > 0 && (
              <div className="p-2">
                <p className="text-xs text-muted-foreground uppercase tracking-wider px-3 py-2 flex items-center gap-2">
                  <Clock className="w-3 h-3" />
                  Recently Played
                </p>
                <ul>
                  {recentGames.map((game, index) => (
                    <li key={game.id}>
                      <button
                        onClick={() => handleSelectGame(game)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`
                          w-full flex items-center gap-3 p-3 rounded-lg
                          transition-all duration-150
                          ${index === selectedIndex 
                            ? 'bg-primary/10 border border-primary/30' 
                            : 'hover:bg-muted'
                          }
                        `}
                      >
                        <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
                          <Gamepad2 className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p className="font-semibold text-foreground truncate">
                            {game.title}
                          </p>
                          <p className="text-sm text-muted-foreground truncate">
                            {game.category} • {game.players}
                          </p>
                        </div>
                        {index === selectedIndex && (
                          <ArrowRight className="w-4 h-4 text-primary" />
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Empty state when no recent games */}
            {!query.trim() && recentGames.length === 0 && (
              <div className="p-8 text-center">
                <Gamepad2 className="w-12 h-12 text-muted-foreground mx-auto mb-3 opacity-50" />
                <p className="text-muted-foreground">
                  Start typing to search games
                </p>
              </div>
            )}
          </div>

          {/* Footer with keyboard hints */}
          <div className="p-3 border-t border-border bg-muted/30">
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">↑↓</kbd>
                Navigate
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">Enter</kbd>
                Select
              </span>
              <span className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-muted rounded font-mono">Esc</kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
