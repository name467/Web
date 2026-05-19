'use client';

/**
 * ============================================================================
 * GAMES LIBRARY PAGE
 * ============================================================================
 * The main game browsing page with:
 * - Search bar with real-time filtering
 * - Category filters
 * - Sort options
 * - Grid/List view toggle
 * - Favorites filter
 * - Pagination or infinite scroll
 * 
 * URL PARAMETERS:
 * - ?category=action - Filter by category
 * - ?filter=favorites - Show only favorited games
 * - ?filter=recent - Show recently played
 * - ?filter=featured - Show featured games
 * - ?search=query - Search query
 * - ?game=id - Highlight specific game (from search)
 */

import { Suspense, useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useGame } from '@/lib/game-context';
import { games } from '@/lib/games-data';
import type { Game, GameCategory } from '@/lib/types';
import { Header } from '@/components/header';
import { GameCard } from '@/components/game-card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Heart,
  Clock,
  Star,
  X,
  SlidersHorizontal,
  Gamepad2,
  Loader2
} from 'lucide-react';

/**
 * All available categories
 */
const allCategories: GameCategory[] = [
  'action', 'puzzle', 'racing', 'sports', 
  'strategy', 'arcade', 'adventure', 'simulation'
];

/**
 * Sort options
 */
type SortOption = 'title' | 'rating' | 'newest' | 'popular';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
  { value: 'newest', label: 'Newest First' },
  { value: 'title', label: 'A-Z' },
];

/**
 * Main export - wraps the page content in Suspense for useSearchParams
 */
export default function GamesPage() {
  return (
    <Suspense fallback={<GamesPageLoading />}>
      <GamesPageContent />
    </Suspense>
  );
}

/**
 * Loading state for the games page
 */
function GamesPageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary animate-spin mx-auto mb-4" />
        <p className="text-muted-foreground">Loading games...</p>
      </div>
    </div>
  );
}

/**
 * The actual games page content
 */
function GamesPageContent() {
  const searchParams = useSearchParams();
  const { setCurrentPage, userData, playSound, isFavorite } = useGame();

  // -------------------------------------------------------------------------
  // STATE
  // -------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState<GameCategory | 'all'>(
    (searchParams.get('category') as GameCategory) || 'all'
  );
  const [activeFilter, setActiveFilter] = useState<'all' | 'favorites' | 'recent' | 'featured'>(
    (searchParams.get('filter') as 'favorites' | 'recent' | 'featured') || 'all'
  );
  const [sortBy, setSortBy] = useState<SortOption>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  // Set current page for navigation highlighting
  useEffect(() => {
    setCurrentPage('games');
  }, [setCurrentPage]);

  // -------------------------------------------------------------------------
  // FILTERED & SORTED GAMES
  // -------------------------------------------------------------------------
  const filteredGames = useMemo(() => {
    let result = [...games];

    // Apply quick filter (favorites, recent, featured)
    if (activeFilter === 'favorites') {
      result = result.filter(game => userData.favorites.includes(game.id));
    } else if (activeFilter === 'recent') {
      const recentIds = userData.recentlyPlayed.map(rp => rp.gameId);
      result = result.filter(game => recentIds.includes(game.id));
      // Sort by recently played order
      result.sort((a, b) => recentIds.indexOf(a.id) - recentIds.indexOf(b.id));
    } else if (activeFilter === 'featured') {
      result = result.filter(game => game.isFeatured);
    }

    // Apply category filter
    if (selectedCategory !== 'all') {
      result = result.filter(game => game.category === selectedCategory);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(game =>
        game.title.toLowerCase().includes(query) ||
        game.description.toLowerCase().includes(query) ||
        game.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Apply sorting (unless viewing recent - already sorted)
    if (activeFilter !== 'recent') {
      switch (sortBy) {
        case 'title':
          result.sort((a, b) => a.title.localeCompare(b.title));
          break;
        case 'rating':
          result.sort((a, b) => b.rating - a.rating);
          break;
        case 'newest':
          result.sort((a, b) => b.releaseYear - a.releaseYear);
          break;
        case 'popular':
        default:
          // Keep original order (assumed to be by popularity)
          break;
      }
    }

    return result;
  }, [games, searchQuery, selectedCategory, activeFilter, sortBy, userData]);

  // -------------------------------------------------------------------------
  // HANDLERS
  // -------------------------------------------------------------------------
  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setActiveFilter('all');
    setSortBy('popular');
    playSound('click');
  };

  const handlePlayGame = (game: Game) => {
    alert(`Starting ${game.title}... (Demo mode - games are placeholders)`);
  };

  // Check if any filters are active
  const hasActiveFilters = searchQuery || selectedCategory !== 'all' || activeFilter !== 'all';

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header 
        title="Game Library" 
        subtitle={`${filteredGames.length} games available`}
      />

      {/* Filters Section */}
      <div className="sticky top-16 z-20 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="px-4 md:px-6 py-4">
          {/* Main filter row */}
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search input */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-muted/50 border-border"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                  onClick={() => {
                    setSearchQuery('');
                    playSound('click');
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {/* Quick filters */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveFilter('all');
                  playSound('click');
                }}
                className={activeFilter === 'all' ? 'bg-primary text-primary-foreground' : ''}
              >
                <Gamepad2 className="w-4 h-4 mr-1" />
                All
              </Button>
              <Button
                variant={activeFilter === 'favorites' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveFilter('favorites');
                  playSound('click');
                }}
                className={activeFilter === 'favorites' ? 'bg-red-500 text-white border-red-500' : ''}
              >
                <Heart className="w-4 h-4 mr-1" />
                Favorites
                {userData.favorites.length > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0">
                    {userData.favorites.length}
                  </Badge>
                )}
              </Button>
              <Button
                variant={activeFilter === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveFilter('recent');
                  playSound('click');
                }}
                className={activeFilter === 'recent' ? 'bg-primary text-primary-foreground' : ''}
              >
                <Clock className="w-4 h-4 mr-1" />
                Recent
              </Button>
              <Button
                variant={activeFilter === 'featured' ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setActiveFilter('featured');
                  playSound('click');
                }}
                className={activeFilter === 'featured' ? 'bg-accent text-accent-foreground' : ''}
              >
                <Star className="w-4 h-4 mr-1" />
                Featured
              </Button>
            </div>

            {/* View mode & more filters toggle */}
            <div className="flex items-center gap-2">
              {/* Sort select */}
              <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                <SelectTrigger className="w-40 bg-muted/50">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* View mode toggle */}
              <div className="hidden sm:flex items-center border border-border rounded-lg overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-none ${viewMode === 'grid' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setViewMode('grid')}
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`rounded-none ${viewMode === 'list' ? 'bg-primary text-primary-foreground' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>

              {/* More filters toggle (mobile) */}
              <Button
                variant="outline"
                size="icon"
                className="md:hidden"
                onClick={() => setShowFilters(!showFilters)}
              >
                <SlidersHorizontal className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Category filters - collapsible on mobile */}
          <div className={`mt-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-sm text-muted-foreground flex-shrink-0">
                <Filter className="w-4 h-4 inline mr-1" />
                Category:
              </span>
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => {
                  setSelectedCategory('all');
                  playSound('click');
                }}
                className={selectedCategory === 'all' ? 'bg-primary/20 text-primary' : ''}
              >
                All
              </Button>
              {allCategories.map(category => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => {
                    setSelectedCategory(category);
                    playSound('click');
                  }}
                  className={`capitalize ${selectedCategory === category ? 'bg-primary/20 text-primary' : ''}`}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>

          {/* Active filters summary & clear button */}
          {hasActiveFilters && (
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <Badge variant="secondary" className="gap-1">
                  Search: {searchQuery}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setSearchQuery('')}
                  />
                </Badge>
              )}
              {selectedCategory !== 'all' && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  {selectedCategory}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setSelectedCategory('all')}
                  />
                </Badge>
              )}
              {activeFilter !== 'all' && (
                <Badge variant="secondary" className="gap-1 capitalize">
                  {activeFilter}
                  <X 
                    className="w-3 h-3 cursor-pointer" 
                    onClick={() => setActiveFilter('all')}
                  />
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-destructive hover:text-destructive"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Games Grid/List */}
      <div className="px-4 md:px-6 py-8">
        {filteredGames.length > 0 ? (
          <>
            {/* Grid view */}
            {viewMode === 'grid' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredGames.map((game) => (
                  <GameCard 
                    key={game.id} 
                    game={game} 
                    onPlay={handlePlayGame}
                  />
                ))}
              </div>
            )}

            {/* List view */}
            {viewMode === 'list' && (
              <div className="space-y-4">
                {filteredGames.map((game) => (
                  <GameListItem 
                    key={game.id} 
                    game={game}
                    isFavorite={isFavorite(game.id)}
                    onPlay={() => handlePlayGame(game)}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          // Empty state
          <div className="text-center py-16">
            <Gamepad2 className="w-16 h-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 
              className="text-xl font-bold text-foreground mb-2"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
            >
              No Games Found
            </h3>
            <p className="text-muted-foreground mb-6">
              {activeFilter === 'favorites' 
                ? "You haven't favorited any games yet. Browse games and click the heart to add favorites!"
                : activeFilter === 'recent'
                ? "You haven't played any games yet. Start playing to see your history!"
                : "Try adjusting your search or filters to find what you're looking for."
              }
            </p>
            <Button onClick={handleClearFilters}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Game List Item Component (for list view)
 */
function GameListItem({ 
  game, 
  isFavorite, 
  onPlay 
}: { 
  game: Game; 
  isFavorite: boolean;
  onPlay: () => void;
}) {
  const { toggleFavorite, playSound } = useGame();

  return (
    <div className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:shadow-lg transition-all duration-200 group">
      {/* Game icon placeholder */}
      <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center flex-shrink-0">
        <Gamepad2 className="w-8 h-8 text-primary" />
      </div>

      {/* Game info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 
            className="font-bold text-foreground truncate"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            {game.title}
          </h3>
          {game.isNew && (
            <Badge className="bg-accent text-accent-foreground">NEW</Badge>
          )}
        </div>
        <p className="text-sm text-muted-foreground truncate mb-2">
          {game.description}
        </p>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span className="capitalize">{game.category}</span>
          <span className="flex items-center gap-1">
            <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
            {game.rating}
          </span>
          <span>{game.players}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => {
            toggleFavorite(game.id);
            playSound(isFavorite ? 'click' : 'success');
          }}
          className={isFavorite ? 'text-red-500' : 'text-muted-foreground'}
        >
          <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        </Button>
        <Button onClick={onPlay} className="bg-primary text-primary-foreground">
          Play
        </Button>
      </div>
    </div>
  );
}
