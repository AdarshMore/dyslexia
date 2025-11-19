import { Link } from 'wouter';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Brain, BookOpen, PenTool, TrendingUp, Settings, Sparkles, Volume2, Eye } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export default function Home() {
  const { theme, toggleTheme } = useTheme();

  const activities = [
    {
      id: 'math',
      title: 'Math Games',
      description: 'Fun number activities designed for dyscalculia support',
      icon: Brain,
      color: 'bg-primary',
      link: '/math',
    },
    {
      id: 'reading',
      title: 'Reading & Phonics',
      description: 'Color-coded text with audio support for dyslexia',
      icon: BookOpen,
      color: 'bg-secondary',
      link: '/reading',
    },
    {
      id: 'writing',
      title: 'Writing Practice',
      description: 'Interactive tracing and letter formation tools',
      icon: PenTool,
      color: 'bg-accent',
      link: '/writing',
    },
    {
      id: 'sensory',
      title: 'Sensory Games',
      description: 'Auditory and visual processing exercises',
      icon: Eye,
      color: 'bg-chart-4',
      link: '/sensory',
    },
    {
      id: 'progress',
      title: 'My Progress',
      description: 'Track achievements, streaks, and learning milestones',
      icon: TrendingUp,
      color: 'bg-chart-5',
      link: '/progress',
    },
    {
      id: 'settings',
      title: 'Settings',
      description: 'Customize fonts, colors, sounds, and accessibility',
      icon: Settings,
      color: 'bg-muted',
      link: '/settings',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">NeuroLearn</h1>
              <p className="text-sm text-muted-foreground">Learning Made Easy</p>
            </div>
          </div>
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={toggleTheme}
            className="w-12 h-12 rounded-full"
            data-testid="button-theme-toggle"
          >
            {theme === 'light' ? (
              <Moon className="w-6 h-6" />
            ) : (
              <Sun className="w-6 h-6" />
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-3">
            Welcome Back!
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Choose an activity to start learning today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => {
            const Icon = activity.icon;
            return (
              <Link key={activity.id} href={activity.link}>
                <Card 
                  className="h-full hover-elevate active-elevate-2 cursor-pointer transition-all border border-card-border"
                  data-testid={`card-activity-${activity.id}`}
                >
                  <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                    <div className={`w-20 h-20 rounded-2xl ${activity.color} flex items-center justify-center shadow-lg`}>
                      <Icon className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-semibold text-card-foreground">
                        {activity.title}
                      </h3>
                      <p className="text-base text-muted-foreground leading-relaxed">
                        {activity.description}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 rounded-3xl p-8 border border-border">
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-8 h-8 text-primary-foreground" />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-2xl font-semibold text-foreground mb-2">
                Accessibility First
              </h3>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Customize text size, spacing, colors, and enable audio support in Settings
              </p>
            </div>
            <Link href="/settings">
              <Button size="lg" className="h-14 px-8 text-lg rounded-xl" data-testid="button-customize">
                Customize Now
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
