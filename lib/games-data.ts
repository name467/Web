/**
 * ============================================================================
 * SAMPLE GAMES DATA
 * ============================================================================
 * This file contains mock game data for the gaming portal.
 * In a real application, this would come from a database or API.
 * Each game has metadata used for display, filtering, and tracking.
 */

import { Game } from './types';

/**
 * Sample games collection
 * These represent the kinds of browser games you might find on a gaming portal
 */
export const games: Game[] = [
  // === ACTION GAMES ===
  {
    id: 'neon-runner',
    title: 'Neon Runner',
    description: 'Endless runner through a cyberpunk cityscape. Dodge obstacles and collect power-ups!',
    image: '/images/games/neon-runner.jpg',
    category: 'action',
    tags: ['endless', 'runner', 'cyberpunk', 'fast-paced'],
    rating: 4.5,
    players: '1 Player',
    releaseYear: 2024,
    isFeatured: true,
    isNew: true,
    url: 'https://gn-math.dev',
  },
  {
    id: 'cyber-shooter',
    title: 'Cyber Shooter',
    description: 'Fast-paced shooter with neon visuals and electronic soundtrack.',
    image: '/images/games/cyber-shooter.jpg',
    category: 'action',
    tags: ['shooter', 'arcade', 'neon', 'intense'],
    rating: 4.3,
    players: '1 Player',
    releaseYear: 2024,
    isFeatured: true,
    url: 'https://gn-math.dev',
  },
  {
    id: 'blade-dash',
    title: 'Blade Dash',
    description: 'Slice through enemies in this stylish action game with combo mechanics.',
    image: '/images/games/blade-dash.jpg',
    category: 'action',
    tags: ['combat', 'combo', 'stylish', 'ninja'],
    rating: 4.7,
    players: '1 Player',
    releaseYear: 2023,
    url: 'https://gn-math.dev',
  },

  // === PUZZLE GAMES ===
  {
    id: 'quantum-blocks',
    title: 'Quantum Blocks',
    description: 'Mind-bending puzzle game where blocks exist in multiple states.',
    image: '/images/games/quantum-blocks.jpg',
    category: 'puzzle',
    tags: ['physics', 'brain-teaser', 'quantum', 'challenging'],
    rating: 4.8,
    players: '1 Player',
    releaseYear: 2024,
    isFeatured: true,
    url: 'https://gn-math.dev',
  },
  {
    id: 'circuit-connect',
    title: 'Circuit Connect',
    description: 'Connect circuits to power up the neon city. 100+ levels!',
    image: '/images/games/circuit-connect.jpg',
    category: 'puzzle',
    tags: ['logic', 'circuits', 'relaxing', 'levels'],
    rating: 4.4,
    players: '1 Player',
    releaseYear: 2023,
    url: 'https://gn-math.dev',
  },
  {
    id: 'color-cascade',
    title: 'Color Cascade',
    description: 'Match colors in cascading patterns. Simple to learn, hard to master.',
    image: '/images/games/color-cascade.jpg',
    category: 'puzzle',
    tags: ['matching', 'colors', 'casual', 'addictive'],
    rating: 4.2,
    players: '1 Player',
    releaseYear: 2024,
    isNew: true,
    url: 'https://gn-math.dev',
  },

  // === RACING GAMES ===
  {
    id: 'neon-drift',
    title: 'Neon Drift',
    description: 'High-speed racing through glowing cityscapes. Master the drift!',
    image: '/images/games/neon-drift.jpg',
    category: 'racing',
    tags: ['racing', 'drift', 'cars', 'competitive'],
    rating: 4.6,
    players: '1-4 Players',
    releaseYear: 2024,
    isFeatured: true,
    url: 'https://gn-math.dev',
  },
  {
    id: 'hover-rush',
    title: 'Hover Rush',
    description: 'Futuristic hovercraft racing with anti-gravity mechanics.',
    image: '/images/games/hover-rush.jpg',
    category: 'racing',
    tags: ['hovercraft', 'futuristic', 'anti-gravity', 'fast'],
    rating: 4.4,
    players: '1-2 Players',
    releaseYear: 2023,
    url: 'https://gn-math.dev',
  },

  // === SPORTS GAMES ===
  {
    id: 'cyber-pong',
    title: 'Cyber Pong',
    description: 'Classic pong reimagined with power-ups and neon effects.',
    image: '/images/games/cyber-pong.jpg',
    category: 'sports',
    tags: ['pong', 'classic', 'multiplayer', 'retro'],
    rating: 4.1,
    players: '1-2 Players',
    releaseYear: 2024,
    url: 'https://gn-math.dev',
  },
  {
    id: 'neon-golf',
    title: 'Neon Golf',
    description: 'Mini golf through impossible geometric courses.',
    image: '/images/games/neon-golf.jpg',
    category: 'sports',
    tags: ['golf', 'physics', 'relaxing', 'creative'],
    rating: 4.5,
    players: '1-4 Players',
    releaseYear: 2023,
    url: 'https://gn-math.dev',
  },

  // === STRATEGY GAMES ===
  {
    id: 'grid-commander',
    title: 'Grid Commander',
    description: 'Turn-based tactical combat on a neon battlefield.',
    image: '/images/games/grid-commander.jpg',
    category: 'strategy',
    tags: ['tactical', 'turn-based', 'military', 'deep'],
    rating: 4.7,
    players: '1-2 Players',
    releaseYear: 2024,
    isFeatured: true,
    url: 'https://gn-math.dev',
  },
  {
    id: 'tower-defense-x',
    title: 'Tower Defense X',
    description: 'Defend your base against waves of cyber enemies.',
    image: '/images/games/tower-defense.jpg',
    category: 'strategy',
    tags: ['tower-defense', 'waves', 'upgrades', 'addictive'],
    rating: 4.3,
    players: '1 Player',
    releaseYear: 2023,
    url: 'https://gn-math.dev',
  },

  // === ARCADE GAMES ===
  {
    id: 'pixel-invaders',
    title: 'Pixel Invaders',
    description: 'Classic space invaders with modern power-ups and bosses.',
    image: '/images/games/pixel-invaders.jpg',
    category: 'arcade',
    tags: ['space', 'shooter', 'retro', 'classic'],
    rating: 4.4,
    players: '1 Player',
    releaseYear: 2024,
    isNew: true,
    url: 'https://gn-math.dev',
  },
  {
    id: 'pac-neon',
    title: 'Pac Neon',
    description: 'Navigate glowing mazes while avoiding ghost programs.',
    image: '/images/games/pac-neon.jpg',
    category: 'arcade',
    tags: ['maze', 'classic', 'chase', 'iconic'],
    rating: 4.6,
    players: '1 Player',
    releaseYear: 2023,
    url: 'https://gn-math.dev',
  },
  {
    id: 'brick-breaker-ultra',
    title: 'Brick Breaker Ultra',
    description: 'Satisfying brick-breaking action with explosive power-ups.',
    image: '/images/games/brick-breaker.jpg',
    category: 'arcade',
    tags: ['breakout', 'casual', 'satisfying', 'levels'],
    rating: 4.2,
    players: '1 Player',
    releaseYear: 2024,
    url: 'https://gn-math.dev',
  },

  // === ADVENTURE GAMES ===
  {
    id: 'cyber-quest',
    title: 'Cyber Quest',
    description: 'Explore a vast cyberpunk world and uncover its secrets.',
    image: '/images/games/cyber-quest.jpg',
    category: 'adventure',
    tags: ['exploration', 'story', 'open-world', 'mystery'],
    rating: 4.8,
    players: '1 Player',
    releaseYear: 2024,
    isFeatured: true,
    url: 'https://gn-math.dev',
  },
  {
    id: 'dungeon-delver',
    title: 'Dungeon Delver',
    description: 'Roguelike dungeon crawling with procedural generation.',
    image: '/images/games/dungeon-delver.jpg',
    category: 'adventure',
    tags: ['roguelike', 'dungeon', 'loot', 'procedural'],
    rating: 4.5,
    players: '1 Player',
    releaseYear: 2023,
    url: 'https://gn-math.dev',
  },

  // === SIMULATION GAMES ===
  {
    id: 'neon-city-builder',
    title: 'Neon City Builder',
    description: 'Build and manage your own cyberpunk metropolis.',
    image: '/images/games/city-builder.jpg',
    category: 'simulation',
    tags: ['building', 'management', 'creative', 'sandbox'],
    rating: 4.6,
    players: '1 Player',
    releaseYear: 2024,
    url: 'https://gn-math.dev',
  },
  {
    id: 'space-station-sim',
    title: 'Space Station Sim',
    description: 'Manage a space station and keep your crew alive.',
    image: '/images/games/space-station.jpg',
    category: 'simulation',
    tags: ['space', 'management', 'survival', 'complex'],
    rating: 4.4,
    players: '1 Player',
    releaseYear: 2023,
    url: 'https://gn-math.dev',
  },
];

/**
 * Get featured games for the homepage
 */
export function getFeaturedGames(): Game[] {
  return games.filter(game => game.isFeatured);
}

/**
 * Get new releases
 */
export function getNewGames(): Game[] {
  return games.filter(game => game.isNew);
}

/**
 * Get games by category
 */
export function getGamesByCategory(category: string): Game[] {
  return games.filter(game => game.category === category);
}

/**
 * Search games by title or tags
 */
export function searchGames(query: string): Game[] {
  const lowerQuery = query.toLowerCase();
  return games.filter(game => 
    game.title.toLowerCase().includes(lowerQuery) ||
    game.description.toLowerCase().includes(lowerQuery) ||
    game.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

/**
 * Get a game by ID
 */
export function getGameById(id: string): Game | undefined {
  return games.find(game => game.id === id);
}
