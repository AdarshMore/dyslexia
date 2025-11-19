import { useLocation } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { ArrowLeft, Trophy, Flame, Clock, Target, Award, Star } from 'lucide-react';
import type { ProgressStats } from '@shared/schema';

export default function Progress() {
  const [, setLocation] = useLocation();
  
  const { data: stats, isLoading } = useQuery<ProgressStats>({
    queryKey: ['/api/progress'],
  });

  const badges = [
    { id: 'first-session', name: 'First Steps', icon: Star, earned: true },
    { id: 'streak-3', name: '3 Day Streak', icon: Flame, earned: true },
    { id: 'math-master', name: 'Math Master', icon: Trophy, earned: false },
    { id: 'reading-star', name: 'Reading Star', icon: Award, earned: true },
    { id: 'perfect-score', name: 'Perfect Score', icon: Target, earned: false },
    { id: 'dedicated', name: 'Dedicated Learner', icon: Clock, earned: true },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border bg-card">
          <div className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Skeleton className="w-12 h-12 rounded-full" />
            <Skeleton className="w-32 h-6" />
            <div className="w-12" />
          </div>
        </header>
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  const displayStats = stats || {
    totalSessions: 12,
    currentStreak: 5,
    longestStreak: 7,
    totalTimeSpent: 180,
    accuracy: 85,
    badgeCount: 4,
    recentActivities: [],
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
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
          <h1 className="text-xl font-semibold text-foreground">My Progress</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 text-center">
          <h2 className="text-4xl font-bold text-foreground mb-3">
            You're Doing Amazing!
          </h2>
          <p className="text-lg text-muted-foreground leading-relaxed">
            Keep up the great work and watch your progress grow
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="border border-card-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                Total Sessions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground" data-testid="text-sessions">
                {displayStats.totalSessions}
              </div>
              <p className="text-xs text-muted-foreground mt-1">activities completed</p>
            </CardContent>
          </Card>

          <Card className="border border-card-border bg-gradient-to-br from-chart-5/10 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Flame className="w-4 h-4 text-chart-5" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground" data-testid="text-streak">
                {displayStats.currentStreak}
              </div>
              <p className="text-xs text-muted-foreground mt-1">days in a row</p>
            </CardContent>
          </Card>

          <Card className="border border-card-border">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Time Spent
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground" data-testid="text-time">
                {displayStats.totalTimeSpent}
              </div>
              <p className="text-xs text-muted-foreground mt-1">minutes learning</p>
            </CardContent>
          </Card>

          <Card className="border border-card-border bg-gradient-to-br from-chart-4/10 to-transparent">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Target className="w-4 h-4 text-chart-4" />
                Accuracy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-card-foreground" data-testid="text-accuracy">
                {displayStats.accuracy}%
              </div>
              <p className="text-xs text-muted-foreground mt-1">correct answers</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 border border-card-border">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-card-foreground flex items-center gap-2">
              <Award className="w-6 h-6 text-accent" />
              Achievement Badges
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {badges.map((badge) => {
                const Icon = badge.icon;
                return (
                  <div
                    key={badge.id}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all ${
                      badge.earned
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-muted/20 opacity-50'
                    }`}
                  >
                    <div
                      className={`w-16 h-16 rounded-full flex items-center justify-center ${
                        badge.earned ? 'bg-accent' : 'bg-muted'
                      }`}
                    >
                      <Icon
                        className={`w-8 h-8 ${
                          badge.earned ? 'text-accent-foreground' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    <span className="text-sm font-medium text-center text-card-foreground">
                      {badge.name}
                    </span>
                    {badge.earned && (
                      <Badge variant="secondary" className="text-xs">
                        Earned
                      </Badge>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border border-card-border bg-gradient-to-br from-primary/5 via-secondary/5 to-accent/5">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-primary mx-auto mb-6 flex items-center justify-center">
              <Star className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-2xl font-bold text-card-foreground mb-3">
              You're on Fire! 🔥
            </h3>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6 max-w-2xl mx-auto">
              You're making incredible progress! Every session brings you closer to mastering new skills.
              Keep practicing and you'll achieve amazing things!
            </p>
            <Button
              size="lg"
              onClick={() => setLocation('/')}
              className="h-14 px-8 text-lg rounded-xl"
              data-testid="button-continue"
            >
              Continue Learning
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
