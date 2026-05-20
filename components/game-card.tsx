'use client';

/**
 * ============================================================================
 * GAME CARD COMPONENT
 * ============================================================================
 * Displays a single game in a card format with hover effects.
 * 
 * FEATURES:
 * - Hover animation with glow effect
 * - Favorite button with heart animation
 * - Rating display
 * - Category badge
 * - "NEW" badge for new releases
 * - Responsive sizing
 * - Links to browser page with proxy for actual gameplay
 * 
 * This component is used in:
 * - Homepage featured section
 * - Games library grid
 * - Search results
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGame } from '@/lib/game-context';
import type { Game } from '@/lib/types';
import { Heart, Star, Play, Users, Gamepad2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface GameCardProps {
  game: Game;
  onPlay?: (game: Game) => void;
  size?: 'small' | 'medium' | 'large';
}

export function GameCard({ game, onPlay, size = 'medium' }: GameCardProps) {
  const router = useRouter();
  const { isFavorite, toggleFavorite, playSound, addToRecentlyPlayed } = useGame();
  const [isHovered, setIsHovered] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const favorite = isFavorite(game.id);

  /**
   * Handle favorite toggle
   */
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering card click
    playSound(favorite ? 'click' : 'success');
    toggleFavorite(game.id);
  };

  /**
   * Handle play button click
   * Opens gn-math.dev through the browser proxy in the same tab
   */
  const handlePlayClick = () => {
    playSound('success');
    addToRecentlyPlayed(game.id);
    
    // Open gn-math.dev through our proxy in the browser page
    const browserUrl = `/browser?url=${encodeURIComponent('https://gn-math.dev')}&game=${game.id}&name=${encodeURIComponent(game.title)}`;
    router.push(browserUrl);
    
    onPlay?.(game);
  };

  // Size-based classes
  const sizeClasses = {
    small: 'h-48',
    medium: 'h-64',
    large: 'h-80',
  };

  return (
    <article
      className={`
        group relative rounded-xl overflow-hidden
        bg-card border border-border
        transition-all duration-300 ease-out
        hover:border-primary/50 hover:shadow-lg
        ${isHovered ? 'box-glow scale-[1.02]' : ''}
        ${sizeClasses[size]}
      `}
      onMouseEnter={() => {
        setIsHovered(true);
        playSound('hover');
      }}
      onMouseLeave={() => setIsHovered(false)}
      role="article"
      aria-label={`${game.title} game card`}
    >
      {/* Background image or gradient placeholder */}
      <div className="absolute inset-0">
        {!imageError ? (
          <div 
            className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20"
          >
            {/* Placeholder game visual with icon */}
            <div className="absolute inset-0 flex items-center justify-center opacity-30">
              <Gamepad2 className="w-20 h-20" />
            </div>
          </div>
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-accent/20" />
        )}
        
        {/* Gradient overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
      </div>

      {/* Badges (top left) */}
      <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
        {game.isNew && (
          <Badge className="bg-accent text-accent-foreground border-0 animate-pulse">
            NEW
          </Badge>
        )}
        <Badge variant="secondary" className="bg-black/50 backdrop-blur-sm border-0">
          {game.category}
        </Badge>
      </div>

      {/* Favorite button (top right) */}
      <Button
        variant="ghost"
        size="icon"
        className={`
          absolute top-3 right-3 z-10
          w-9 h-9 rounded-full
          bg-black/50 backdrop-blur-sm
          transition-all duration-200
          ${favorite ? 'text-red-500' : 'text-white/70 hover:text-white'}
        `}
        onClick={handleFavoriteClick}
        aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
      >
        <Heart 
          className={`w-5 h-5 transition-transform duration-200 ${favorite ? 'fill-current scale-110' : ''}`} 
        />
      </Button>

      {/* Content (bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        {/* Title */}
        <h3 
          className="text-lg font-bold text-white mb-1 line-clamp-1"
          style={{ fontFamily: 'Orbitron, sans-serif' }}
        >
          {game.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-white/70 line-clamp-2 mb-3">
          {game.description}
        </p>

        {/* Meta info row */}
        <div className="flex items-center justify-between">
          {/* Rating and players */}
          <div className="flex items-center gap-3 text-sm text-white/80">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span>{game.rating}</span>
            </div>
            
            {/* Players */}
            <div className="flex items-center gap-1">
              <Users className="w-4 h-4" />
              <span>{game.players}</span>
            </div>
          </div>

          {/* Play button - appears on hover */}
          <Button
            size="sm"
            className={`
              bg-primary text-primary-foreground
              transition-all duration-300
              ${isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'}
            `}
            onClick={handlePlayClick}
          >
            <Play className="w-4 h-4 mr-1 fill-current" />
            Play
          </Button>
        </div>
      </div>

      {/* Hover glow effect */}
      {isHovered && (
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 100%, var(--neon-primary) 0%, transparent 60%)`,
            opacity: 0.2,
          }}
        />
      )}
    </article>
  );
}
