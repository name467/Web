'use client';

/**
 * ============================================================================
 * HOMEPAGE
 * ============================================================================
 * The main landing page for NeonVault featuring:
 * - Hero section with CTA
 * - Featured games carousel
 * - Recently played section (if user has history)
 * - Categories preview
 * - Quick stats
 * 
 * This page uses client-side rendering because it:
 * - Reads from localStorage (recently played, favorites)
 * - Needs access to the game context
 * - Has interactive elements
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/lib/game-context';
import { games, getFeaturedGames, getGamesByCategory } from '@/lib/games-data';
import type { Game, GameCategory } from '@/lib/types';
import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { GameCard } from '@/components/game-card';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Clock, 
  Star, 
  Zap, 
  Puzzle, 
  Car, 
  Target,
  Gamepad2,
  TrendingUp
} from 'lucide-react';

/**
 * Category icons mapping
 */
const categoryIcons: Record<GameCategory, React.ReactNode> = {
  action: <Zap className="w-5 h-5" />,
  puzzle: <Puzzle className="w-5 h-5" />,
  racing: <Car className="w-5 h-5" />,
  sports: <Target className="w-5 h-5" />,
  strategy: <Star className="w-5 h-5" />,
  arcade: <Gamepad2 className="w-5 h-5" />,
  adventure: <TrendingUp className="w-5 h-5" />,
  simulation: <Target className="w-5 h-5" />,
};

/**
 * Category colors for visual distinction
 */
const categoryColors: Record<GameCategory, string> = {
  action: 'from-red-500/20 to-orange-500/20 border-red-500/30',
  puzzle: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
  racing: 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
  sports: 'from-green-500/20 to-emerald-500/20 border-green-500/30',
  strategy: 'from-amber-500/20 to-yellow-500/20 border-amber-500/30',
  arcade: 'from-pink-500/20 to-rose-500/20 border-pink-500/30',
  adventure: 'from-indigo-500/20 to-violet-500/20 border-indigo-500/30',
  simulation: 'from-teal-500/20 to-cyan-500/20 border-teal-500/30',
};

export default function HomePage() {
  const { setCurrentPage, userData, playSound } = useGame();

  // Set current page for navigation highlighting
  useEffect(() => {
    setCurrentPage('home');
  }, [setCurrentPage]);

  // Get featured games
  const featuredGames = getFeaturedGames();

  // Get recently played games
  const recentlyPlayedGames = userData.recentlyPlayed
    .slice(0, 4)
    .map(rp => games.find(g => g.id === rp.gameId))
    .filter((g): g is Game => g !== undefined);

  // Get unique categories with game counts
  const categories = Array.from(new Set(games.map(g => g.category))).map(category => ({
    name: category,
    count: getGamesByCategory(category).length,
    icon: categoryIcons[category],
    colorClass: categoryColors[category],
  }));

  /**
   * Handle game play
   * In a real app, this would launch the game
   */
  const handlePlayGame = (game: Game) => {
    // For now, just show an alert
    // In a real app, you'd open the game in a modal or new page
    alert(`Starting ${game.title}... (Demo mode - games are placeholders)`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header 
        title="NeonVault" 
        subtitle="Your Gaming Portal" 
      />

      {/* Hero Section */}
      <HeroSection />

      {/* Main Content */}
      <div className="px-4 md:px-6 pb-12 space-y-12">
        
        {/* ================================================================
            FEATURED GAMES SECTION
        ================================================================ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 
                className="text-2xl md:text-3xl font-bold text-foreground"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                Featured Games
              </h2>
              <p className="text-muted-foreground mt-1">
                Hand-picked titles for the best experience
              </p>
            </div>
            <Link href="/games?filter=featured">
              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary/80"
                onClick={() => playSound('click')}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Featured games grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {featuredGames.slice(0, 4).map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onPlay={handlePlayGame}
                size="large"
              />
            ))}
          </div>
        </section>

        {/* ================================================================
            RECENTLY PLAYED SECTION (if user has history)
        ================================================================ */}
        {recentlyPlayedGames.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h2 
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: 'Orbitron, sans-serif' }}
                  >
                    Continue Playing
                  </h2>
                  <p className="text-muted-foreground text-sm">
                    Pick up where you left off
                  </p>
                </div>
              </div>
              <Link href="/games?filter=recent">
                <Button 
                  variant="ghost" 
                  className="text-primary hover:text-primary/80"
                  onClick={() => playSound('click')}
                >
                  History
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {recentlyPlayedGames.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  onPlay={handlePlayGame}
                  size="medium"
                />
              ))}
            </div>
          </section>
        )}

        {/* ================================================================
            CATEGORIES SECTION
        ================================================================ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 
                className="text-2xl md:text-3xl font-bold text-foreground"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                Browse Categories
              </h2>
              <p className="text-muted-foreground mt-1">
                Find games by genre
              </p>
            </div>
          </div>

          {/* Categories grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {categories.map((category) => (
              <Link 
                key={category.name}
                href={`/games?category=${category.name}`}
              >
                <button
                  className={`
                    w-full p-4 rounded-xl border
                    bg-gradient-to-br ${category.colorClass}
                    transition-all duration-300
                    hover:scale-105 hover:shadow-lg
                    group
                  `}
                  onClick={() => playSound('click')}
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-background/50 text-foreground group-hover:scale-110 transition-transform">
                      {category.icon}
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-foreground capitalize">
                        {category.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {category.count} games
                      </p>
                    </div>
                  </div>
                </button>
              </Link>
            ))}
          </div>
        </section>

        {/* ================================================================
            ALL GAMES PREVIEW
        ================================================================ */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 
                className="text-2xl md:text-3xl font-bold text-foreground"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                All Games
              </h2>
              <p className="text-muted-foreground mt-1">
                {games.length} games available
              </p>
            </div>
            <Link href="/games">
              <Button 
                variant="ghost" 
                className="text-primary hover:text-primary/80"
                onClick={() => playSound('click')}
              >
                View All
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Games grid - show first 8 */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {games.slice(0, 8).map((game) => (
              <GameCard 
                key={game.id} 
                game={game} 
                onPlay={handlePlayGame}
              />
            ))}
          </div>

          {/* View all CTA */}
          <div className="text-center mt-8">
            <Link href="/games">
              <Button 
                size="lg"
                className="bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20"
                onClick={() => playSound('click')}
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                View All {games.length} Games
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
