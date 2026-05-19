/**
 * ============================================================================
 * NEONVAULT - GAMING PORTAL DOCUMENTATION
 * ============================================================================
 * 
 * This file explains how the entire gaming portal works, including:
 * - File structure and organization
 * - Frontend/backend communication
 * - Hosting and deployment
 * - Key concepts for beginners
 * 
 * ============================================================================
 * FILE STRUCTURE OVERVIEW
 * ============================================================================
 * 
 * /app                          - Next.js App Router pages
 *   /page.tsx                   - Homepage with hero and featured games
 *   /games/page.tsx             - Games library with search and filters
 *   /settings/page.tsx          - Settings with theme editor
 *   /browser/page.tsx           - Game browser (plays games via proxy)
 *   /api/proxy/route.ts         - Backend proxy API for loading external sites
 *   /layout.tsx                 - Root layout with providers and fonts
 *   /globals.css                - Global styles and theme variables
 * 
 * /components                   - Reusable React components
 *   /client-layout.tsx          - Client-side layout wrapper
 *   /sidebar.tsx                - Main navigation sidebar
 *   /header.tsx                 - Top header with search and actions
 *   /hero-section.tsx           - Homepage hero banner
 *   /game-card.tsx              - Individual game display card
 *   /search-modal.tsx           - Global search modal (Ctrl+K)
 *   /loading-screen.tsx         - Initial loading animation
 *   /close-confirmation.tsx     - Exit confirmation dialog
 *   /particle-background.tsx    - Animated particle effects
 * 
 * /lib                          - Core utilities and logic
 *   /types.ts                   - TypeScript type definitions
 *   /themes.ts                  - Theme configurations (5 built-in themes)
 *   /games-data.ts              - Mock game data
 *   /game-context.tsx           - Global state management (React Context)
 * 
 * ============================================================================
 * HOW THE FRONTEND WORKS
 * ============================================================================
 * 
 * 1. STATE MANAGEMENT (lib/game-context.tsx)
 *    - Uses React Context to share state across all components
 *    - Manages: settings, favorites, recently played, UI state
 *    - Persists data to localStorage automatically
 *    - Provides functions for sound effects, theme switching, etc.
 * 
 * 2. THEME SYSTEM (lib/themes.ts + app/globals.css)
 *    - 5 built-in themes: Cyberpunk, Retro Arcade, Minimalist, Hacker, Synthwave
 *    - Themes define: colors, fonts, glow effects, particle settings
 *    - CSS variables are updated dynamically when theme changes
 *    - Custom theme editor allows creating personalized themes
 * 
 * 3. ROUTING (Next.js App Router)
 *    - /              → Homepage
 *    - /games         → Game library with filters
 *    - /settings      → Settings and theme editor
 *    - /browser       → Game player with proxy
 * 
 * 4. COMPONENTS
 *    - All components are client-side ("use client")
 *    - Use the game context for shared state
 *    - Responsive design with Tailwind CSS
 *    - Neon glow effects via CSS box-shadow
 * 
 * ============================================================================
 * HOW THE BACKEND (PROXY) WORKS
 * ============================================================================
 * 
 * The proxy API (/app/api/proxy/route.ts) allows loading external game sites:
 * 
 * 1. CLIENT REQUEST
 *    Browser page requests: GET /api/proxy?url=https://gn-math.dev
 * 
 * 2. SERVER VALIDATION
 *    - Checks if URL is provided
 *    - Validates domain is in whitelist (security)
 *    - Currently whitelisted: gn-math.dev
 * 
 * 3. FETCH EXTERNAL CONTENT
 *    - Server fetches the external website
 *    - For HTML: rewrites relative URLs to use proxy
 *    - For other files (CSS, JS, images): passes through
 * 
 * 4. RETURN TO CLIENT
 *    - Modified HTML is sent back
 *    - Iframe displays the content
 *    - All internal links go through proxy
 * 
 * WHY USE A PROXY?
 * - Browsers block cross-origin requests (CORS)
 * - Proxy acts as middleman to fetch content
 * - Allows embedding external sites in iframes
 * 
 * ============================================================================
 * FRONTEND ↔ BACKEND COMMUNICATION
 * ============================================================================
 * 
 * This app is primarily client-side with one backend API:
 * 
 * BROWSER PAGE → PROXY API
 * ─────────────────────────
 * 
 * 1. User clicks "Play" on a game card
 * 2. GameCard navigates to: /browser?url=<game-url>&game=<id>&name=<title>
 * 3. Browser page creates: /api/proxy?url=<encoded-url>
 * 4. Proxy API fetches external content
 * 5. Browser page displays content in iframe
 * 
 * Example flow:
 *   User clicks "Neon Runner"
 *   → Navigate to /browser?url=https://gn-math.dev&game=neon-runner&name=Neon%20Runner
 *   → Iframe src = /api/proxy?url=https%3A%2F%2Fgn-math.dev
 *   → API fetches https://gn-math.dev
 *   → API returns modified HTML
 *   → User sees game in iframe
 * 
 * ============================================================================
 * LOCAL STORAGE (Data Persistence)
 * ============================================================================
 * 
 * All user data is stored in the browser's localStorage:
 * 
 * KEY: "neonvault_settings"
 *   - Theme preference
 *   - Sound settings
 *   - Display options
 *   - Keyboard shortcuts
 * 
 * KEY: "neonvault_favorites"
 *   - Array of favorited game IDs
 * 
 * KEY: "neonvault_recent"
 *   - Recently played games with timestamps
 * 
 * Note: localStorage is browser-specific. Data won't sync across devices.
 * For multi-device sync, you'd need a database backend.
 * 
 * ============================================================================
 * HOSTING & DEPLOYMENT
 * ============================================================================
 * 
 * This app can be deployed to Vercel with zero configuration:
 * 
 * 1. VERCEL (Recommended)
 *    - Push code to GitHub
 *    - Connect repo to Vercel
 *    - Deploy automatically on push
 *    - Features: Edge functions, CDN, HTTPS
 * 
 * 2. HOW VERCEL HOSTING WORKS
 *    
 *    Your Code (GitHub)
 *         ↓
 *    Vercel Build System
 *    - Installs dependencies (pnpm install)
 *    - Builds Next.js app (next build)
 *    - Optimizes for production
 *         ↓
 *    Vercel Edge Network
 *    - Static files → CDN (fast global delivery)
 *    - API routes → Serverless functions
 *    - Server components → Edge functions
 *         ↓
 *    Users Access Your Site
 *    - https://your-app.vercel.app
 * 
 * 3. STATIC VS DYNAMIC
 *    
 *    STATIC (pre-rendered at build time):
 *    - Homepage, Games page, Settings page
 *    - Served from CDN (very fast)
 *    
 *    DYNAMIC (runs on each request):
 *    - /api/proxy route (serverless function)
 *    - Runs when user loads game
 * 
 * 4. ENVIRONMENT VARIABLES
 *    - No env vars needed for basic functionality
 *    - For custom features, add in Vercel dashboard
 * 
 * ============================================================================
 * KEY CONCEPTS FOR BEGINNERS
 * ============================================================================
 * 
 * REACT CONTEXT
 * - Way to share data across components without prop drilling
 * - useGame() hook gives access to shared state anywhere
 * 
 * NEXT.JS APP ROUTER
 * - File-based routing: /app/games/page.tsx → /games URL
 * - Supports both server and client components
 * - API routes in /app/api folder
 * 
 * TAILWIND CSS
 * - Utility-first CSS framework
 * - Classes like "bg-blue-500 p-4 rounded-lg"
 * - Responsive: "md:grid-cols-2 lg:grid-cols-4"
 * 
 * CSS VARIABLES
 * - Custom properties like --primary-color
 * - Changed dynamically for theming
 * - Defined in globals.css, updated by JavaScript
 * 
 * LOCALSTORAGE
 * - Browser storage for persisting data
 * - Survives page refreshes
 * - 5-10MB limit per domain
 * 
 * CORS (Cross-Origin Resource Sharing)
 * - Security feature blocking cross-site requests
 * - Why we need a proxy for external sites
 * 
 * ============================================================================
 * ADDING NEW GAMES
 * ============================================================================
 * 
 * To add a new game, edit /lib/games-data.ts:
 * 
 * {
 *   id: 'unique-game-id',
 *   title: 'Game Title',
 *   description: 'Short description of the game',
 *   image: '/images/games/game-image.jpg',
 *   category: 'action', // action, puzzle, racing, etc.
 *   tags: ['tag1', 'tag2'],
 *   rating: 4.5,
 *   players: '1 Player',
 *   releaseYear: 2024,
 *   isFeatured: false,
 *   isNew: true,
 *   url: 'https://example.com/game', // URL to load via proxy
 * }
 * 
 * IMPORTANT: Add the domain to the whitelist in /app/api/proxy/route.ts
 * 
 * ============================================================================
 * ADDING NEW THEMES
 * ============================================================================
 * 
 * To add a new theme, edit /lib/themes.ts:
 * 
 * {
 *   id: 'theme-id',
 *   name: 'Theme Name',
 *   description: 'Description of the theme',
 *   colors: {
 *     background: '#0a0a0f',
 *     foreground: '#ffffff',
 *     primary: '#00ffff',
 *     // ... all color properties
 *   },
 *   fonts: {
 *     heading: 'Orbitron, sans-serif',
 *     body: 'Inter, sans-serif',
 *     mono: 'JetBrains Mono, monospace',
 *   },
 *   effects: {
 *     glowIntensity: 0.8,
 *     particleColor: '#00ffff',
 *     particleDensity: 0.5,
 *     animationSpeed: 1,
 *   },
 * }
 * 
 * ============================================================================
 * KEYBOARD SHORTCUTS
 * ============================================================================
 * 
 * Global shortcuts (customizable in settings):
 * - Ctrl+K      → Open search
 * - F11         → Toggle fullscreen
 * - M           → Toggle sound
 * - H           → Go to Home
 * - G           → Go to Games
 * - ,           → Go to Settings
 * - [           → Toggle sidebar
 * - Escape      → Close modals/exit fullscreen
 * 
 * Browser page shortcuts:
 * - Alt+Left    → Go back
 * - Alt+Right   → Go forward
 * - F5/Ctrl+R   → Refresh
 * - F11         → Fullscreen game
 * 
 * ============================================================================
 */

export {}; // Make this a module
