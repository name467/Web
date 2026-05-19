/**
 * ============================================================================
 * ROOT LAYOUT
 * ============================================================================
 * This is the root layout for the entire NeonVault application.
 * It sets up:
 * - Global providers (GameProvider for state management)
 * - Font loading
 * - Metadata for SEO
 * - Global components (Sidebar, SearchModal, LoadingScreen)
 * 
 * HOW NEXT.JS LAYOUTS WORK:
 * - This layout wraps ALL pages in the app
 * - The {children} prop receives the current page content
 * - Layouts persist across page navigation (no remounting)
 * - This is perfect for sidebars and global state
 */

import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

import { GameProvider } from '@/lib/game-context';
import { ClientLayout } from '@/components/client-layout';

// ============================================================================
// FONT CONFIGURATION
// ============================================================================
// Next.js automatically optimizes fonts and eliminates layout shift

const geistSans = Geist({ 
  subsets: ['latin'],
  variable: '--font-geist-sans',
});

const geistMono = Geist_Mono({ 
  subsets: ['latin'],
  variable: '--font-geist-mono',
});

// ============================================================================
// METADATA CONFIGURATION
// ============================================================================
// This metadata appears in search results, browser tabs, and social shares

export const metadata: Metadata = {
  title: {
    default: 'NeonVault - Modern Gaming Portal',
    template: '%s | NeonVault',
  },
  description: 'A futuristic browser gaming portal with stunning neon aesthetics, customizable themes, and an immersive gaming experience.',
  keywords: ['games', 'gaming', 'browser games', 'neon', 'cyberpunk', 'arcade'],
  authors: [{ name: 'NeonVault' }],
  creator: 'NeonVault',
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    apple: '/apple-icon.png',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'NeonVault',
    title: 'NeonVault - Modern Gaming Portal',
    description: 'A futuristic browser gaming portal with stunning neon aesthetics.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'NeonVault - Modern Gaming Portal',
    description: 'A futuristic browser gaming portal with stunning neon aesthetics.',
  },
};

// ============================================================================
// VIEWPORT CONFIGURATION
// ============================================================================
// Optimized for mobile gaming experience

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1, // Prevents unwanted zoom on mobile during gameplay
  userScalable: false, // Better for gaming controls
};

// ============================================================================
// ROOT LAYOUT COMPONENT
// ============================================================================

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html 
      lang="en" 
      className={`${geistSans.variable} ${geistMono.variable} dark bg-background`}
      suppressHydrationWarning
    >
      <body className="font-sans antialiased">
        {/* 
          GameProvider wraps everything to provide global state.
          All components inside can access theme, settings, etc.
        */}
        <GameProvider>
          <ClientLayout>
            {children}
          </ClientLayout>
        </GameProvider>
        
        {/* Vercel Analytics - only in production */}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  );
}
