/**
 * ============================================
 * BROWSER PAGE - WEB BROWSER
 * ============================================
 * 
 * A full web browser that uses DuckDuckGo for search
 * and loads all pages through our proxy.
 * 
 * FEATURES:
 * - URL bar for direct navigation
 * - DuckDuckGo search integration
 * - Back/Forward/Refresh controls
 * - Fullscreen mode
 * - History tracking
 * - Bookmarks
 * 
 * HOW IT WORKS:
 * 1. User enters a URL or search query
 * 2. If it's a search, we redirect to DuckDuckGo
 * 3. All URLs are loaded through our proxy API
 * 4. Links within pages also go through the proxy
 * ============================================
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  ArrowRight, 
  RotateCw, 
  Home, 
  Maximize2, 
  Minimize2,
  X,
  Search,
  Globe,
  Star,
  StarOff,
  Bookmark,
  Clock,
  ExternalLink,
  Shield
} from 'lucide-react'
import { useGame } from '@/lib/game-context'
import Link from 'next/link'
import { Suspense } from 'react'
import { Button } from '@/components/ui/button'

// ============================================
// BROWSER CONTROLS COMPONENT
// ============================================
interface BrowserControlsProps {
  url: string
  displayUrl: string
  onNavigate: (url: string) => void
  onBack: () => void
  onForward: () => void
  onRefresh: () => void
  onHome: () => void
  onFullscreen: () => void
  isFullscreen: boolean
  canGoBack: boolean
  canGoForward: boolean
  isLoading: boolean
}

function BrowserControls({
  url,
  displayUrl,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  onHome,
  onFullscreen,
  isFullscreen,
  canGoBack,
  canGoForward,
  isLoading,
}: BrowserControlsProps) {
  const [inputValue, setInputValue] = useState(displayUrl)

  // Update input when display URL changes
  useEffect(() => {
    setInputValue(displayUrl)
  }, [displayUrl])

  /**
   * Determine if input is a URL or search query
   */
  const processInput = (input: string): string => {
    const trimmed = input.trim()
    
    // If empty, go to DuckDuckGo homepage
    if (!trimmed) {
      return 'https://duckduckgo.com'
    }
    
    // Check if it looks like a URL
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}(\/.*)?$/
    const hasProtocol = trimmed.startsWith('http://') || trimmed.startsWith('https://')
    const looksLikeUrl = urlPattern.test(trimmed) || trimmed.includes('localhost')
    
    if (hasProtocol) {
      // Already has protocol, use as-is
      return trimmed
    } else if (looksLikeUrl) {
      // Looks like a URL, add https://
      return `https://${trimmed}`
    } else {
      // Treat as a search query - use DuckDuckGo
      return `https://duckduckgo.com/?q=${encodeURIComponent(trimmed)}`
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const finalUrl = processInput(inputValue)
    onNavigate(finalUrl)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInputValue(displayUrl)
    }
  }

  return (
    <div className="flex items-center gap-2 p-3 bg-card/90 backdrop-blur-md border-b border-border">
      {/* Navigation buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="p-2 rounded-lg hover:bg-accent/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Go Back (Alt+Left)"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>
        
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className="p-2 rounded-lg hover:bg-accent/20 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          title="Go Forward (Alt+Right)"
        >
          <ArrowRight className="w-4 h-4" />
        </button>
        
        <button
          onClick={onRefresh}
          className={`p-2 rounded-lg hover:bg-accent/20 transition-colors ${isLoading ? 'animate-spin' : ''}`}
          title="Refresh (F5)"
        >
          <RotateCw className="w-4 h-4" />
        </button>
        
        <button
          onClick={onHome}
          className="p-2 rounded-lg hover:bg-accent/20 transition-colors"
          title="Home - DuckDuckGo"
        >
          <Home className="w-4 h-4" />
        </button>
      </div>

      {/* URL/Search bar */}
      <form onSubmit={handleSubmit} className="flex-1 mx-2">
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {displayUrl.includes('duckduckgo.com') ? (
              <Search className="w-4 h-4 text-muted-foreground" />
            ) : (
              <Globe className="w-4 h-4 text-muted-foreground" />
            )}
          </div>
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search with DuckDuckGo or enter URL..."
            className="w-full pl-10 pr-4 py-2.5 bg-background/50 border border-border rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all placeholder:text-muted-foreground/60"
          />
          {isLoading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
        </div>
      </form>

      {/* Action buttons */}
      <div className="flex items-center gap-1">
        <button
          onClick={onFullscreen}
          className="p-2 rounded-lg hover:bg-accent/20 transition-colors"
          title={isFullscreen ? 'Exit Fullscreen (F11)' : 'Fullscreen (F11)'}
        >
          {isFullscreen ? (
            <Minimize2 className="w-4 h-4" />
          ) : (
            <Maximize2 className="w-4 h-4" />
          )}
        </button>
        
        <Link
          href="/"
          className="p-2 rounded-lg hover:bg-destructive/20 text-destructive transition-colors"
          title="Close Browser"
        >
          <X className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}

// ============================================
// QUICK LINKS COMPONENT - Shown on home
// ============================================
function QuickLinks({ onNavigate }: { onNavigate: (url: string, direct?: boolean) => void }) {
  const quickLinks = [
    { name: 'DuckDuckGo', url: 'https://duckduckgo.com', icon: '🦆', direct: false },
    { name: 'Wikipedia', url: 'https://wikipedia.org', icon: '📚', direct: false },
    { name: 'GN Math', url: 'https://gn-math.dev', icon: '🎮', direct: true },
    { name: 'GitHub', url: 'https://github.com', icon: '💻', direct: false },
  ]

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto p-4">
      {quickLinks.map((link) => (
        <button
          key={link.url}
          onClick={() => onNavigate(link.url, link.direct)}
          className="flex flex-col items-center gap-2 p-4 rounded-xl bg-card/50 border border-border hover:border-primary/50 hover:bg-card transition-all"
        >
          <span className="text-2xl">{link.icon}</span>
          <span className="text-sm font-medium">{link.name}</span>
        </button>
      ))}
    </div>
  )
}

// ============================================
// BROWSER CONTENT - The main component
// ============================================
function BrowserContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { settings, addToRecentlyPlayed } = useGame()
  
  // Get initial URL from query params (for game links) or default to DuckDuckGo
  const initialUrl = searchParams.get('url') || ''
  const gameId = searchParams.get('game')
  const gameName = searchParams.get('name')
  const directMode = searchParams.get('direct') === 'true' // Load directly without proxy
  
  // State
  const [currentUrl, setCurrentUrl] = useState(initialUrl)
  const [displayUrl, setDisplayUrl] = useState(initialUrl || 'https://duckduckgo.com')
  const [history, setHistory] = useState<string[]>(initialUrl ? [initialUrl] : [])
  const [historyIndex, setHistoryIndex] = useState(initialUrl ? 0 : -1)
  const [isLoading, setIsLoading] = useState(!!initialUrl)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showHome, setShowHome] = useState(!initialUrl)
  const [isDirect, setIsDirect] = useState(directMode)
  
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // Track recently played if this is a game
  useEffect(() => {
    if (gameId) {
      addToRecentlyPlayed(gameId)
    }
  }, [gameId, addToRecentlyPlayed])

  // Generate proxy URL
  const getProxyUrl = useCallback((url: string) => {
    if (!url) return ''
    return `/api/proxy?url=${encodeURIComponent(url)}`
  }, [])

  // Navigate to a URL
  const navigateTo = useCallback((url: string, direct: boolean = false) => {
    setIsLoading(true)
    setShowHome(false)
    setCurrentUrl(url)
    setDisplayUrl(url)
    setIsDirect(direct)
    
    // Update URL in browser bar without full page reload
    const newSearchParams = new URLSearchParams()
    newSearchParams.set('url', url)
    if (direct) {
      newSearchParams.set('direct', 'true')
    }
    window.history.replaceState(null, '', `/browser?${newSearchParams.toString()}`)
    
    // Add to history
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(url)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }, [history, historyIndex])

  // Navigation functions
  const goBack = useCallback(() => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      const url = history[newIndex]
      setIsLoading(true)
      setHistoryIndex(newIndex)
      setCurrentUrl(url)
      setDisplayUrl(url)
      setShowHome(false)
    }
  }, [history, historyIndex])

  const goForward = useCallback(() => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1
      const url = history[newIndex]
      setIsLoading(true)
      setHistoryIndex(newIndex)
      setCurrentUrl(url)
      setDisplayUrl(url)
      setShowHome(false)
    }
  }, [history, historyIndex])

  const refresh = useCallback(() => {
    if (currentUrl) {
      setIsLoading(true)
      if (iframeRef.current) {
        iframeRef.current.src = isDirect ? currentUrl : getProxyUrl(currentUrl)
      }
    }
  }, [currentUrl, getProxyUrl, isDirect])

  const goHome = useCallback(() => {
    setShowHome(true)
    setCurrentUrl('')
    setDisplayUrl('https://duckduckgo.com')
  }, [])

  // Fullscreen handling
  const toggleFullscreen = useCallback(() => {
    if (!containerRef.current) return

    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  // Handle iframe load
  const handleIframeLoad = () => {
    setIsLoading(false)
  }

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Alt + Left = Back
      if (e.altKey && e.key === 'ArrowLeft') {
        e.preventDefault()
        goBack()
      }
      // Alt + Right = Forward
      if (e.altKey && e.key === 'ArrowRight') {
        e.preventDefault()
        goForward()
      }
      // F5 or Ctrl + R = Refresh
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'r')) {
        e.preventDefault()
        refresh()
      }
      // F11 = Fullscreen
      if (e.key === 'F11') {
        e.preventDefault()
        toggleFullscreen()
      }
      // Ctrl + L = Focus URL bar
      if (e.ctrlKey && e.key === 'l') {
        e.preventDefault()
        const urlInput = document.querySelector('input[type="text"]') as HTMLInputElement
        if (urlInput) {
          urlInput.focus()
          urlInput.select()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [goBack, goForward, refresh, toggleFullscreen])

  return (
    <div 
      ref={containerRef}
      className="flex flex-col h-screen bg-background"
    >
      {/* Browser controls */}
      <BrowserControls
        url={currentUrl}
        displayUrl={displayUrl}
        onNavigate={navigateTo}
        onBack={goBack}
        onForward={goForward}
        onRefresh={refresh}
        onHome={goHome}
        onFullscreen={toggleFullscreen}
        isFullscreen={isFullscreen}
        canGoBack={historyIndex > 0}
        canGoForward={historyIndex < history.length - 1}
        isLoading={isLoading}
      />

      {/* Game name banner if playing a game */}
      {gameName && (
        <div className="flex items-center justify-center gap-2 py-2 px-4 bg-primary/10 border-b border-primary/20">
          <span className="text-sm font-medium text-primary">Now Playing: {gameName}</span>
        </div>
      )}

      {/* Content area */}
      <div className="flex-1 relative">
        {showHome ? (
          // Home page with search and quick links
          <div className="h-full flex flex-col items-center justify-center p-8 bg-gradient-to-b from-background to-card/30">
            <div className="text-center mb-8">
              <h1 
                className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
                style={{ fontFamily: 'Orbitron, sans-serif' }}
              >
                NeonVault Browser
              </h1>
              <p className="text-muted-foreground">
                Search the web with DuckDuckGo or enter a URL
              </p>
            </div>

            {/* Search box */}
            <form 
              onSubmit={(e) => {
                e.preventDefault()
                const input = e.currentTarget.querySelector('input') as HTMLInputElement
                const value = input.value.trim()
                if (value) {
                  // Check if URL or search
                  const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/
                  if (urlPattern.test(value)) {
                    const url = value.startsWith('http') ? value : `https://${value}`
                    navigateTo(url)
                  } else {
                    navigateTo(`https://duckduckgo.com/?q=${encodeURIComponent(value)}`)
                  }
                }
              }}
              className="w-full max-w-xl mb-8"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search with DuckDuckGo or enter URL..."
                  className="w-full pl-12 pr-4 py-4 bg-card border border-border rounded-2xl text-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  autoFocus
                />
              </div>
            </form>

            {/* Quick links */}
            <QuickLinks onNavigate={navigateTo} />

            {/* Keyboard shortcuts hint */}
            <div className="mt-8 text-sm text-muted-foreground/60">
              <span className="inline-flex items-center gap-1">
                <kbd className="px-2 py-1 bg-card rounded border border-border text-xs">Ctrl+L</kbd>
                <span>Focus URL bar</span>
              </span>
              <span className="mx-3">|</span>
              <span className="inline-flex items-center gap-1">
                <kbd className="px-2 py-1 bg-card rounded border border-border text-xs">F11</kbd>
                <span>Fullscreen</span>
              </span>
            </div>
          </div>
        ) : (
          // Iframe with loaded page
          <>
            {/* Loading overlay */}
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10">
                <div className="flex flex-col items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
                    <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p className="text-muted-foreground animate-pulse">Loading...</p>
                </div>
              </div>
            )}

            {/* The iframe */}
            <iframe
              ref={iframeRef}
              src={isDirect ? currentUrl : getProxyUrl(currentUrl)}
              onLoad={handleIframeLoad}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-pointer-lock"
              allow="fullscreen; autoplay; clipboard-write"
              title="Web Browser"
            />
          </>
        )}
      </div>
    </div>
  )
}

// ============================================
// MAIN PAGE COMPONENT
// ============================================
export default function BrowserPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-primary/20 rounded-full" />
            <div className="absolute inset-0 w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
          <p className="text-muted-foreground">Initializing browser...</p>
        </div>
      </div>
    }>
      <BrowserContent />
    </Suspense>
  )
}
