'use client';

/**
 * ============================================================================
 * SETTINGS PAGE
 * ============================================================================
 * Comprehensive settings page organized into categories:
 * 1. Appearance - Themes, fonts, particles
 * 2. Audio - Sound effects, music volume
 * 3. Display - Fullscreen, FPS counter
 * 4. Accessibility - Reduced motion, high contrast, text size
 * 5. Keyboard Shortcuts - Customize hotkeys
 * 
 * All settings are saved to localStorage and apply instantly.
 * The page includes a theme editor for creating custom themes.
 */

import { useEffect, useState } from 'react';
import { useGame } from '@/lib/game-context';
import { themes } from '@/lib/themes';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CloseConfirmation, useCloseWarning } from '@/components/close-confirmation';
import {
  Palette,
  Volume2,
  Monitor,
  Accessibility,
  Keyboard,
  Check,
  RotateCcw,
  Sparkles,
  Paintbrush,
  Eye,
  Type,
  Shield,
  EyeOff,
  ExternalLink,
  AlertTriangle,
} from 'lucide-react';

/**
 * Font options for customization
 */
const fontOptions = [
  { value: 'orbitron', label: 'Orbitron (Futuristic)', family: 'Orbitron, sans-serif' },
  { value: 'rajdhani', label: 'Rajdhani (Tech)', family: 'Rajdhani, sans-serif' },
  { value: 'press-start', label: 'Press Start 2P (Retro)', family: '"Press Start 2P", monospace' },
  { value: 'vt323', label: 'VT323 (Terminal)', family: 'VT323, monospace' },
  { value: 'share-tech', label: 'Share Tech Mono (Hacker)', family: '"Share Tech Mono", monospace' },
  { value: 'audiowide', label: 'Audiowide (Bold)', family: 'Audiowide, sans-serif' },
  { value: 'exo-2', label: 'Exo 2 (Clean)', family: '"Exo 2", sans-serif' },
  { value: 'inter', label: 'Inter (Modern)', family: 'Inter, sans-serif' },
];

/**
 * Preset accent colors for quick selection
 */
const accentColors = [
  { name: 'Cyan', value: '#00f0ff' },
  { name: 'Magenta', value: '#ff00aa' },
  { name: 'Green', value: '#00ff88' },
  { name: 'Orange', value: '#ff6b00' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Red', value: '#ff3333' },
  { name: 'Yellow', value: '#ffcc00' },
  { name: 'Pink', value: '#ff2d6a' },
];

export default function SettingsPage() {
  const { 
    setCurrentPage,
    settings, 
    updateSettings, 
    resetSettings,
    currentTheme,
    setTheme,
    availableThemes,
    playSound,
  } = useGame();

  // Track unsaved changes for close confirmation
  const [hasChanges, setHasChanges] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [customAccent, setCustomAccent] = useState(currentTheme.colors.neonPrimary);

  // Set current page for navigation
  useEffect(() => {
    setCurrentPage('settings');
  }, [setCurrentPage]);

  // Use close warning when there are unsaved changes
  useCloseWarning(hasChanges);

  /**
   * Handle theme change
   * Applies instantly to the UI
   */
  const handleThemeChange = (themeId: string) => {
    setTheme(themeId);
    playSound('success');
    setHasChanges(true);
  };

  /**
   * Handle settings update
   * All changes apply instantly
   */
  const handleSettingChange = <K extends keyof typeof settings>(
    key: K, 
    value: typeof settings[K]
  ) => {
    updateSettings({ [key]: value });
    playSound('click');
    setHasChanges(true);
  };

  /**
   * Handle reset confirmation
   */
  const handleReset = () => {
    resetSettings();
    playSound('success');
    setHasChanges(false);
    setShowResetConfirm(false);
  };

  /**
   * Apply custom accent color
   */
  const applyCustomAccent = (color: string) => {
    setCustomAccent(color);
    // Update CSS variables directly for instant preview
    document.documentElement.style.setProperty('--neon-primary', color);
    document.documentElement.style.setProperty('--primary', color);
    document.documentElement.style.setProperty('--ring', color);
    playSound('click');
    setHasChanges(true);
  };

  return (
    <div className="min-h-screen pb-12">
      {/* Header */}
      <Header 
        title="Settings" 
        subtitle="Customize your experience"
      />

      {/* Settings Content */}
      <div className="px-4 md:px-6 py-8 max-w-4xl mx-auto">
        {/* Tabs for different setting categories */}
        <Tabs defaultValue="appearance" className="space-y-6">
          {/* Tab list */}
          <TabsList className="grid grid-cols-3 md:grid-cols-6 gap-2 h-auto p-1 bg-muted/50">
            <TabsTrigger value="appearance" className="flex items-center gap-2 py-2">
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline">Appearance</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2 py-2">
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Privacy</span>
            </TabsTrigger>
            <TabsTrigger value="audio" className="flex items-center gap-2 py-2">
              <Volume2 className="w-4 h-4" />
              <span className="hidden sm:inline">Audio</span>
            </TabsTrigger>
            <TabsTrigger value="display" className="flex items-center gap-2 py-2">
              <Monitor className="w-4 h-4" />
              <span className="hidden sm:inline">Display</span>
            </TabsTrigger>
            <TabsTrigger value="accessibility" className="flex items-center gap-2 py-2">
              <Accessibility className="w-4 h-4" />
              <span className="hidden sm:inline">Access</span>
            </TabsTrigger>
            <TabsTrigger value="shortcuts" className="flex items-center gap-2 py-2">
              <Keyboard className="w-4 h-4" />
              <span className="hidden sm:inline">Shortcuts</span>
            </TabsTrigger>
          </TabsList>

          {/* =================================================================
              APPEARANCE TAB
          ================================================================= */}
          <TabsContent value="appearance" className="space-y-6">
            {/* Theme Selection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Theme Selection
                </CardTitle>
                <CardDescription>
                  Choose from pre-built themes or customize your own
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {themes.map((theme) => (
                    <button
                      key={theme.id}
                      onClick={() => handleThemeChange(theme.id)}
                      className={`
                        relative p-4 rounded-xl border-2 text-left
                        transition-all duration-200
                        ${settings.themeId === theme.id 
                          ? 'border-primary box-glow' 
                          : 'border-border hover:border-primary/50'
                        }
                      `}
                      style={{ background: theme.colors.background }}
                    >
                      {/* Theme preview colors */}
                      <div className="flex items-center gap-2 mb-3">
                        <div 
                          className="w-6 h-6 rounded-full border border-white/20"
                          style={{ background: theme.colors.primary }}
                        />
                        <div 
                          className="w-6 h-6 rounded-full border border-white/20"
                          style={{ background: theme.colors.accent }}
                        />
                        <div 
                          className="w-6 h-6 rounded-full border border-white/20"
                          style={{ background: theme.colors.secondary }}
                        />
                      </div>
                      
                      {/* Theme name */}
                      <p 
                        className="font-bold mb-1"
                        style={{ color: theme.colors.foreground }}
                      >
                        {theme.name}
                      </p>
                      <p 
                        className="text-sm"
                        style={{ color: theme.colors.mutedForeground }}
                      >
                        {theme.description}
                      </p>
                      
                      {/* Selected indicator */}
                      {settings.themeId === theme.id && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                            <Check className="w-4 h-4 text-primary-foreground" />
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Accent Color Customization */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Paintbrush className="w-5 h-5 text-primary" />
                  Accent Color
                </CardTitle>
                <CardDescription>
                  Customize the primary accent color
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Preset colors */}
                <div className="flex flex-wrap gap-3">
                  {accentColors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => applyCustomAccent(color.value)}
                      className={`
                        w-10 h-10 rounded-full border-2 transition-transform
                        hover:scale-110
                        ${customAccent === color.value ? 'border-white scale-110' : 'border-transparent'}
                      `}
                      style={{ background: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
                
                {/* Custom color picker */}
                <div className="flex items-center gap-4">
                  <Label>Custom Color:</Label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={customAccent}
                      onChange={(e) => applyCustomAccent(e.target.value)}
                      className="w-10 h-10 rounded cursor-pointer"
                    />
                    <Input
                      value={customAccent}
                      onChange={(e) => applyCustomAccent(e.target.value)}
                      className="w-28 font-mono text-sm"
                      placeholder="#00f0ff"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Font Selection */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Type className="w-5 h-5 text-primary" />
                  Typography
                </CardTitle>
                <CardDescription>
                  Choose your preferred font style
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Heading Font</Label>
                  <Select defaultValue="orbitron">
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {fontOptions.map(font => (
                        <SelectItem key={font.value} value={font.value}>
                          <span style={{ fontFamily: font.family }}>
                            {font.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label>Text Size</Label>
                  <Select 
                    value={settings.fontSize}
                    onValueChange={(v) => handleSettingChange('fontSize', v as 'small' | 'medium' | 'large')}
                  >
                    <SelectTrigger className="w-48">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="small">Small</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="large">Large</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Particle Effects */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-primary" />
                  Visual Effects
                </CardTitle>
                <CardDescription>
                  Configure background animations and effects
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Background Particles</Label>
                    <p className="text-sm text-muted-foreground">
                      Animated particles in the background
                    </p>
                  </div>
                  <Switch
                    checked={settings.particlesEnabled}
                    onCheckedChange={(v) => handleSettingChange('particlesEnabled', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* =================================================================
              PRIVACY TAB - Tab Cloaking & Security
          ================================================================= */}
          <TabsContent value="privacy" className="space-y-6">
            {/* Tab Cloaking */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <EyeOff className="w-5 h-5 text-primary" />
                  Tab Cloaking
                </CardTitle>
                <CardDescription>
                  Disguise this site to look like another website
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Enable tab cloak */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Tab Cloaking</Label>
                    <p className="text-sm text-muted-foreground">
                      Change the tab title and favicon to disguise this site
                    </p>
                  </div>
                  <Switch
                    checked={settings.tabCloakEnabled}
                    onCheckedChange={(v) => handleSettingChange('tabCloakEnabled', v)}
                  />
                </div>

                {/* Custom title */}
                <div className="space-y-2">
                  <Label>Tab Title</Label>
                  <Input
                    value={settings.tabCloakTitle}
                    onChange={(e) => handleSettingChange('tabCloakTitle', e.target.value)}
                    placeholder="Google"
                    disabled={!settings.tabCloakEnabled}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    The title that will appear in the browser tab
                  </p>
                </div>

                {/* Custom favicon */}
                <div className="space-y-2">
                  <Label>Favicon URL</Label>
                  <Input
                    value={settings.tabCloakFavicon}
                    onChange={(e) => handleSettingChange('tabCloakFavicon', e.target.value)}
                    placeholder="https://www.google.com/favicon.ico"
                    disabled={!settings.tabCloakEnabled}
                    className="bg-background/50"
                  />
                  <p className="text-xs text-muted-foreground">
                    The icon that will appear in the browser tab
                  </p>
                </div>

                {/* Preset cloaks */}
                <div className="space-y-2">
                  <Label>Quick Presets</Label>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { name: 'Google', title: 'Google', favicon: 'https://www.google.com/favicon.ico' },
                      { name: 'Google Drive', title: 'My Drive - Google Drive', favicon: 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png' },
                      { name: 'Google Docs', title: 'Google Docs', favicon: 'https://ssl.gstatic.com/docs/documents/images/kix-favicon7.ico' },
                      { name: 'Canvas', title: 'Dashboard', favicon: 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico' },
                      { name: 'Schoology', title: 'Home | Schoology', favicon: 'https://asset-cdn.schoology.com/sites/all/themes/flavor/favicon.ico' },
                    ].map((preset) => (
                      <Button
                        key={preset.name}
                        variant="outline"
                        size="sm"
                        disabled={!settings.tabCloakEnabled}
                        onClick={() => {
                          handleSettingChange('tabCloakTitle', preset.title);
                          handleSettingChange('tabCloakFavicon', preset.favicon);
                        }}
                      >
                        {preset.name}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* About:Blank Cloak */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-primary" />
                  About:Blank Cloak
                </CardTitle>
                <CardDescription>
                  Open the site in a new about:blank window for extra privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Open in About:Blank</Label>
                    <p className="text-sm text-muted-foreground">
                      Opens NeonVault inside an about:blank tab for better privacy
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => {
                      const win = window.open('about:blank', '_blank');
                      if (win) {
                        win.document.body.style.margin = '0';
                        win.document.body.style.height = '100vh';
                        const iframe = win.document.createElement('iframe');
                        iframe.style.border = 'none';
                        iframe.style.width = '100%';
                        iframe.style.height = '100%';
                        iframe.style.margin = '0';
                        iframe.src = window.location.href;
                        win.document.body.appendChild(iframe);
                      }
                    }}
                  >
                    Open Now
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  This will open a new tab with a blank URL. The site runs inside an iframe, 
                  making it harder to see what you&apos;re viewing from the URL bar.
                </p>
              </CardContent>
            </Card>

            {/* Close Tab Confirmation */}
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  Close Tab Protection
                </CardTitle>
                <CardDescription>
                  Get a warning before accidentally closing the tab
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Close Tab Confirmation</Label>
                    <p className="text-sm text-muted-foreground">
                      Show a confirmation dialog when trying to close the tab
                    </p>
                  </div>
                  <Switch
                    checked={settings.closeTabConfirmation}
                    onCheckedChange={(v) => handleSettingChange('closeTabConfirmation', v)}
                  />
                </div>
                <p className="text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                  When enabled, the browser will ask for confirmation before closing or 
                  refreshing the page to prevent accidental loss of your session.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* =================================================================
              AUDIO TAB
          ================================================================= */}
          <TabsContent value="audio" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Volume2 className="w-5 h-5 text-primary" />
                  Sound Settings
                </CardTitle>
                <CardDescription>
                  Control sound effects and music
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Master sound toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sound Effects</Label>
                    <p className="text-sm text-muted-foreground">
                      UI clicks, notifications, and feedback
                    </p>
                  </div>
                  <Switch
                    checked={settings.soundEnabled}
                    onCheckedChange={(v) => handleSettingChange('soundEnabled', v)}
                  />
                </div>

                {/* Sound volume */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Sound Volume</Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.soundVolume}%
                    </span>
                  </div>
                  <Slider
                    value={[settings.soundVolume]}
                    onValueChange={([v]) => handleSettingChange('soundVolume', v)}
                    max={100}
                    step={5}
                    disabled={!settings.soundEnabled}
                    className="w-full"
                  />
                </div>

                {/* Music toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Background Music</Label>
                    <p className="text-sm text-muted-foreground">
                      Ambient music during gameplay
                    </p>
                  </div>
                  <Switch
                    checked={settings.musicEnabled}
                    onCheckedChange={(v) => handleSettingChange('musicEnabled', v)}
                  />
                </div>

                {/* Music volume */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Music Volume</Label>
                    <span className="text-sm text-muted-foreground">
                      {settings.musicVolume}%
                    </span>
                  </div>
                  <Slider
                    value={[settings.musicVolume]}
                    onValueChange={([v]) => handleSettingChange('musicVolume', v)}
                    max={100}
                    step={5}
                    disabled={!settings.musicEnabled}
                    className="w-full"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* =================================================================
              DISPLAY TAB
          ================================================================= */}
          <TabsContent value="display" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5 text-primary" />
                  Display Settings
                </CardTitle>
                <CardDescription>
                  Configure display and performance options
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Auto fullscreen */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Fullscreen on Play</Label>
                    <p className="text-sm text-muted-foreground">
                      Automatically enter fullscreen when starting a game
                    </p>
                  </div>
                  <Switch
                    checked={settings.fullscreenOnPlay}
                    onCheckedChange={(v) => handleSettingChange('fullscreenOnPlay', v)}
                  />
                </div>

                {/* Show FPS */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Show FPS Counter</Label>
                    <p className="text-sm text-muted-foreground">
                      Display frames per second during gameplay
                    </p>
                  </div>
                  <Switch
                    checked={settings.showFPS}
                    onCheckedChange={(v) => handleSettingChange('showFPS', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* =================================================================
              ACCESSIBILITY TAB
          ================================================================= */}
          <TabsContent value="accessibility" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Accessibility className="w-5 h-5 text-primary" />
                  Accessibility Options
                </CardTitle>
                <CardDescription>
                  Make the experience comfortable for everyone
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Reduced motion */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Reduced Motion</Label>
                    <p className="text-sm text-muted-foreground">
                      Disable animations and transitions
                    </p>
                  </div>
                  <Switch
                    checked={settings.reducedMotion}
                    onCheckedChange={(v) => handleSettingChange('reducedMotion', v)}
                  />
                </div>

                {/* High contrast */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>High Contrast</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase color contrast for better visibility
                    </p>
                  </div>
                  <Switch
                    checked={settings.highContrast}
                    onCheckedChange={(v) => handleSettingChange('highContrast', v)}
                  />
                </div>

                {/* Large text */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Large Text</Label>
                    <p className="text-sm text-muted-foreground">
                      Increase text size throughout the app
                    </p>
                  </div>
                  <Switch
                    checked={settings.largeText}
                    onCheckedChange={(v) => handleSettingChange('largeText', v)}
                  />
                </div>

                {/* Screen reader optimization */}
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Screen Reader Optimized</Label>
                    <p className="text-sm text-muted-foreground">
                      Improve compatibility with screen readers
                    </p>
                  </div>
                  <Switch
                    checked={settings.screenReaderOptimized}
                    onCheckedChange={(v) => handleSettingChange('screenReaderOptimized', v)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* =================================================================
              KEYBOARD SHORTCUTS TAB
          ================================================================= */}
          <TabsContent value="shortcuts" className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Keyboard className="w-5 h-5 text-primary" />
                  Keyboard Shortcuts
                </CardTitle>
                <CardDescription>
                  Customize your keyboard shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(settings.shortcuts).map(([action, shortcut]) => (
                  <div key={action} className="flex items-center justify-between">
                    <Label className="capitalize">
                      {action.replace(/([A-Z])/g, ' $1').trim()}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono px-3 py-1">
                        {shortcut}
                      </Badge>
                      <Button variant="ghost" size="sm" disabled>
                        Edit
                      </Button>
                    </div>
                  </div>
                ))}
                <p className="text-sm text-muted-foreground mt-4">
                  Shortcut customization coming soon. Default shortcuts are shown above.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Reset button */}
        <div className="mt-8 flex justify-end">
          <Button
            variant="destructive"
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Reset All Settings
          </Button>
        </div>

        {/* Reset confirmation dialog */}
        <CloseConfirmation
          open={showResetConfirm}
          onOpenChange={setShowResetConfirm}
          onConfirm={handleReset}
          title="Reset All Settings?"
          description="This will reset all settings to their default values. This action cannot be undone."
        />
      </div>
    </div>
  );
}
