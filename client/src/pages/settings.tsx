import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ArrowLeft, Type, Palette, Volume2, Vibrate, Sparkles, Eye } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { useTheme } from '@/contexts/ThemeContext';

export default function Settings() {
  const [, setLocation] = useLocation();
  const { settings, updateSettings } = useSettings();
  const { theme, toggleTheme } = useTheme();

  const fontSizes = [
    { value: 'default', label: 'Default', size: 'text-base' },
    { value: 'large', label: 'Large', size: 'text-lg' },
    { value: 'extraLarge', label: 'Extra Large', size: 'text-xl' },
  ];

  const lineSpacings = [
    { value: 'normal', label: 'Normal' },
    { value: 'relaxed', label: 'Relaxed' },
    { value: 'loose', label: 'Loose' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setLocation('/')}
            className="w-12 h-12 rounded-full"
            data-testid="button-back"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">Settings</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-6">
          <Card className="border border-card-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
                <Type className="w-6 h-6 text-primary" />
                Text Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-base font-semibold text-card-foreground mb-4 block">
                  Font Size
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  {fontSizes.map((size) => (
                    <Button
                      key={size.value}
                      variant={settings.fontSize === size.value ? 'default' : 'outline'}
                      onClick={() => updateSettings({ fontSize: size.value as any })}
                      className="h-14 rounded-xl"
                      data-testid={`button-font-${size.value}`}
                    >
                      <span className={size.size}>{size.label}</span>
                    </Button>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-semibold text-card-foreground mb-4 block">
                  Line Spacing
                </Label>
                <div className="grid grid-cols-3 gap-4">
                  {lineSpacings.map((spacing) => (
                    <Button
                      key={spacing.value}
                      variant={settings.lineSpacing === spacing.value ? 'default' : 'outline'}
                      onClick={() => updateSettings({ lineSpacing: spacing.value as any })}
                      className="h-14 rounded-xl"
                      data-testid={`button-spacing-${spacing.value}`}
                    >
                      {spacing.label}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-card-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
                <Palette className="w-6 h-6 text-secondary" />
                Display Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Eye className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="high-contrast" className="text-base font-semibold text-card-foreground">
                      High Contrast Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Increase contrast for better visibility
                    </p>
                  </div>
                </div>
                <Switch
                  id="high-contrast"
                  checked={settings.highContrast}
                  onCheckedChange={(checked) => updateSettings({ highContrast: checked })}
                  data-testid="switch-high-contrast"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    {theme === 'light' ? '☀️' : '🌙'}
                  </div>
                  <div>
                    <Label htmlFor="dark-mode" className="text-base font-semibold text-card-foreground">
                      Dark Mode
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Switch to {theme === 'light' ? 'dark' : 'light'} theme
                    </p>
                  </div>
                </div>
                <Switch
                  id="dark-mode"
                  checked={theme === 'dark'}
                  onCheckedChange={toggleTheme}
                  data-testid="switch-dark-mode"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border border-card-border">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
                <Volume2 className="w-6 h-6 text-accent" />
                Audio & Interaction
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Volume2 className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="audio" className="text-base font-semibold text-card-foreground">
                      Audio Support
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable text-to-speech and sound effects
                    </p>
                  </div>
                </div>
                <Switch
                  id="audio"
                  checked={settings.audioEnabled}
                  onCheckedChange={(checked) => updateSettings({ audioEnabled: checked })}
                  data-testid="switch-audio"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="animations" className="text-base font-semibold text-card-foreground">
                      Animations
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Enable smooth transitions and effects
                    </p>
                  </div>
                </div>
                <Switch
                  id="animations"
                  checked={settings.animationsEnabled}
                  onCheckedChange={(checked) => updateSettings({ animationsEnabled: checked })}
                  data-testid="switch-animations"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-xl border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                    <Vibrate className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <Label htmlFor="haptic" className="text-base font-semibold text-card-foreground">
                      Haptic Feedback
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      Feel gentle vibrations on interactions
                    </p>
                  </div>
                </div>
                <Switch
                  id="haptic"
                  checked={settings.hapticEnabled}
                  onCheckedChange={(checked) => updateSettings({ hapticEnabled: checked })}
                  data-testid="switch-haptic"
                />
              </div>
            </CardContent>
          </Card>

          <div className="p-6 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-2xl border border-border">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Personalized for You
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed">
                  These settings are saved automatically and will be applied across all activities.
                  Customize your learning experience to work best for you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
