'use client';

/**
 * ============================================================================
 * HOMEPAGE - Welcome Screen
 * ============================================================================
 * A simple landing page that introduces the website and provides
 * quick navigation to the main features.
 */

import { useEffect } from 'react';
import Link from 'next/link';
import { useGame } from '@/lib/game-context';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { 
  Gamepad2, 
  Globe, 
  Settings, 
  Sparkles,
  Shield,
  Zap
} from 'lucide-react';

export default function HomePage() {
  const { setCurrentPage, playSound } = useGame();

  useEffect(() => {
    setCurrentPage('home');
  }, [setCurrentPage]);

  return (
    <div className="min-h-screen">
      <Header 
        title="NeonVault" 
        subtitle="Your Gaming Portal" 
      />

      {/* Hero Section */}
      <div className="px-4 md:px-6 py-12 md:py-20">
        <div className="max-w-4xl mx-auto text-center">
          {/* Logo */}
          <div className="relative inline-flex items-center justify-center mb-8">
            <div className="absolute inset-0 blur-3xl bg-primary/30 rounded-full" />
            <div className="relative p-6 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30">
              <Gamepad2 className="w-16 h-16 md:w-20 md:h-20 text-primary" />
            </div>
          </div>

          {/* Title */}
          <h1 
            className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Welcome to NeonVault
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Your ultimate destination for unblocked games and secure browsing. 
            Play your favorite games, browse the web freely, and customize your experience.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link href="/browser?url=https://gn-math.dev">
              <Button 
                size="lg" 
                className="bg-primary text-primary-foreground hover:bg-primary/90 text-lg px-8 py-6"
                onClick={() => playSound('click')}
              >
                <Gamepad2 className="w-5 h-5 mr-2" />
                Play Games
              </Button>
            </Link>
            <Link href="/browser">
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary/50 text-primary hover:bg-primary/10 text-lg px-8 py-6"
                onClick={() => playSound('click')}
              >
                <Globe className="w-5 h-5 mr-2" />
                Open Browser
              </Button>
            </Link>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <FeatureCard 
              icon={<Gamepad2 className="w-8 h-8" />}
              title="Unblocked Games"
              description="Access your favorite games through our secure proxy"
            />
            <FeatureCard 
              icon={<Shield className="w-8 h-8" />}
              title="Tab Cloaking"
              description="Hide your activity with customizable tab disguises"
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8" />}
              title="Fast & Secure"
              description="Enjoy smooth performance with built-in privacy features"
            />
          </div>
        </div>
      </div>

      {/* Quick Links Section */}
      <div className="px-4 md:px-6 py-12 bg-card/30 border-t border-border">
        <div className="max-w-4xl mx-auto">
          <h2 
            className="text-2xl font-bold text-center mb-8 text-foreground"
            style={{ fontFamily: 'Orbitron, sans-serif' }}
          >
            Quick Start
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <QuickLink 
              href="/browser?url=https://gn-math.dev"
              icon={<Gamepad2 className="w-6 h-6" />}
              title="Games"
              description="Browse and play games"
            />
            <QuickLink 
              href="/browser"
              icon={<Globe className="w-6 h-6" />}
              title="Browser"
              description="Browse the web freely"
            />
            <QuickLink 
              href="/settings"
              icon={<Settings className="w-6 h-6" />}
              title="Settings"
              description="Customize your experience"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ 
  icon, 
  title, 
  description 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  return (
    <div className="p-6 rounded-xl bg-card/50 border border-border hover:border-primary/50 transition-all duration-300">
      <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 mx-auto">
        {icon}
      </div>
      <h3 
        className="text-lg font-bold text-foreground mb-2"
        style={{ fontFamily: 'Orbitron, sans-serif' }}
      >
        {title}
      </h3>
      <p className="text-sm text-muted-foreground">
        {description}
      </p>
    </div>
  );
}

function QuickLink({ 
  href, 
  icon, 
  title, 
  description 
}: { 
  href: string; 
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) {
  const { playSound } = useGame();
  
  return (
    <Link href={href}>
      <div 
        className="flex items-center gap-4 p-4 rounded-xl bg-card border border-border hover:border-primary/50 hover:bg-card/80 transition-all duration-300 group cursor-pointer"
        onClick={() => playSound('click')}
      >
        <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  );
}
