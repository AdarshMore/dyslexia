import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Volume2, Eye, Ear, Star } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';

type GameType = 'visual' | 'auditory' | null;

export default function Sensory() {
  const [, setLocation] = useLocation();
  const { settings } = useSettings();
  const [gameType, setGameType] = useState<GameType>(null);
  const [currentRound, setCurrentRound] = useState(0);
  const [score, setScore] = useState(0);
  const [showPattern, setShowPattern] = useState(false);
  const [pattern, setPattern] = useState<number[]>([]);
  const [userPattern, setUserPattern] = useState<number[]>([]);

  const startVisualGame = () => {
    setGameType('visual');
    setCurrentRound(0);
    setScore(0);
    generatePattern(3);
  };

  const startAuditoryGame = () => {
    setGameType('auditory');
    setCurrentRound(0);
    setScore(0);
    generatePattern(3);
  };

  const generatePattern = (length: number) => {
    const newPattern = Array.from({ length }, () => Math.floor(Math.random() * 4));
    setPattern(newPattern);
    setUserPattern([]);
    
    if (gameType === 'visual') {
      showVisualPattern(newPattern);
    } else if (gameType === 'auditory') {
      playAuditoryPattern(newPattern);
    }
  };

  const showVisualPattern = async (pat: number[]) => {
    setShowPattern(true);
    for (let i = 0; i < pat.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    setShowPattern(false);
  };

  const playAuditoryPattern = async (pat: number[]) => {
    if (!settings.audioEnabled) return;
    
    const frequencies = [261.63, 329.63, 392.00, 523.25]; // C, E, G, C
    
    for (const note of pat) {
      await playTone(frequencies[note], 500);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
  };

  const playTone = (frequency: number, duration: number) => {
    return new Promise<void>((resolve) => {
      const context = new AudioContext();
      const oscillator = context.createOscillator();
      const gainNode = context.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(context.destination);
      
      oscillator.frequency.value = frequency;
      gainNode.gain.value = 0.1;
      
      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        resolve();
      }, duration);
    });
  };

  const handleColorClick = (index: number) => {
    const newUserPattern = [...userPattern, index];
    setUserPattern(newUserPattern);
    
    if (settings.audioEnabled && gameType === 'auditory') {
      const frequencies = [261.63, 329.63, 392.00, 523.25];
      playTone(frequencies[index], 300);
    }
    
    if (newUserPattern.length === pattern.length) {
      checkAnswer(newUserPattern);
    }
  };

  const checkAnswer = (userPat: number[]) => {
    const isCorrect = userPat.every((val, idx) => val === pattern[idx]);
    
    if (isCorrect) {
      setScore(score + 1);
      if (settings.hapticEnabled && 'vibrate' in navigator) {
        navigator.vibrate(100);
      }
      setTimeout(() => {
        setCurrentRound(currentRound + 1);
        generatePattern(3 + Math.floor((currentRound + 1) / 2));
      }, 1000);
    } else {
      setTimeout(() => {
        setGameType(null);
      }, 1500);
    }
  };

  const colors = [
    { name: 'Blue', bg: 'bg-primary', border: 'border-primary' },
    { name: 'Purple', bg: 'bg-secondary', border: 'border-secondary' },
    { name: 'Orange', bg: 'bg-accent', border: 'border-accent' },
    { name: 'Green', bg: 'bg-chart-4', border: 'border-chart-4' },
  ];

  if (!gameType) {
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
            <h1 className="text-xl font-semibold text-foreground">Sensory Games</h1>
            <div className="w-12" />
          </div>
        </header>

        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-3">
              Choose a Game
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Practice visual and auditory processing skills
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card 
              className="hover-elevate active-elevate-2 cursor-pointer transition-all border border-card-border" 
              onClick={startVisualGame}
              data-testid="card-visual-game"
            >
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-primary mx-auto mb-6 flex items-center justify-center">
                  <Eye className="w-10 h-10 text-primary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">
                  Visual Pattern
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">
                  Watch the pattern and repeat it back
                </p>
                <Button size="lg" className="w-full h-14 text-lg rounded-xl" data-testid="button-start-visual">
                  Start Game
                </Button>
              </CardContent>
            </Card>

            <Card 
              className="hover-elevate active-elevate-2 cursor-pointer transition-all border border-card-border" 
              onClick={startAuditoryGame}
              data-testid="card-auditory-game"
            >
              <CardContent className="p-8 text-center">
                <div className="w-20 h-20 rounded-2xl bg-secondary mx-auto mb-6 flex items-center justify-center">
                  <Ear className="w-10 h-10 text-secondary-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-card-foreground mb-3">
                  Sound Pattern
                </h3>
                <p className="text-base text-muted-foreground leading-relaxed mb-6">
                  Listen to the sounds and repeat them
                </p>
                <Button size="lg" className="w-full h-14 text-lg rounded-xl" data-testid="button-start-auditory">
                  Start Game
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setGameType(null)}
            className="w-12 h-12 rounded-full"
            data-testid="button-back-game"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <div className="flex items-center gap-3">
            <Star className="w-5 h-5 text-accent" />
            <span className="text-lg font-semibold text-foreground">
              Round {currentRound + 1} | Score: {score}
            </span>
          </div>
          <div className="w-12" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl flex items-center justify-center min-h-[80vh]">
        <Card className="w-full p-8 border border-card-border">
          <h2 className="text-2xl font-bold text-card-foreground text-center mb-8">
            {showPattern ? 'Watch the pattern...' : 'Repeat the pattern'}
          </h2>
          
          <div className="grid grid-cols-2 gap-6 mb-8">
            {colors.map((color, index) => (
              <button
                key={index}
                onClick={() => !showPattern && handleColorClick(index)}
                disabled={showPattern}
                className={cn(
                  "h-32 rounded-2xl transition-all border-4",
                  color.bg,
                  color.border,
                  showPattern && pattern[userPattern.length] === index && "scale-95 shadow-2xl",
                  !showPattern && "hover-elevate active-elevate-2 cursor-pointer"
                )}
                data-testid={`button-pattern-${index}`}
              />
            ))}
          </div>

          <div className="flex justify-center gap-2 mb-6">
            {pattern.map((_, index) => (
              <div
                key={index}
                className={cn(
                  "w-3 h-3 rounded-full transition-all",
                  index < userPattern.length ? "bg-primary" : "bg-muted"
                )}
              />
            ))}
          </div>

          {gameType === 'auditory' && !showPattern && (
            <Button
              variant="outline"
              size="lg"
              onClick={() => playAuditoryPattern(pattern)}
              className="w-full h-14 text-lg rounded-xl flex items-center gap-3"
              data-testid="button-replay"
            >
              <Volume2 className="w-5 h-5" />
              Replay Sound
            </Button>
          )}
        </Card>
      </main>
    </div>
  );
}
