import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Volume2, Star, Trophy, PartyPopper } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { apiRequest } from '@/lib/queryClient';
import type { MathQuestion } from '@shared/schema';
import { cn } from '@/lib/utils';

export default function MathGame() {
  const [, setLocation] = useLocation();
  const { settings } = useSettings();
  const [difficulty, setDifficulty] = useState(1);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [questions, setQuestions] = useState<MathQuestion[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());

  const saveActivityMutation = useMutation({
    mutationFn: async (data: any) => {
      return await apiRequest('POST', '/api/activities', data);
    },
  });

  useEffect(() => {
    generateQuestions();
    setStartTime(Date.now());
  }, [difficulty]);

  const generateQuestions = () => {
    const newQuestions: MathQuestion[] = [];
    for (let i = 0; i < 5; i++) {
      if (difficulty === 1) {
        const num = Math.floor(Math.random() * 10) + 1;
        const correctAnswer = num.toString();
        const options = [
          correctAnswer,
          (num + 1).toString(),
          (num - 1 > 0 ? num - 1 : num + 2).toString(),
          (num + 2).toString(),
        ].sort(() => Math.random() - 0.5);
        
        newQuestions.push({
          id: `q${i}`,
          type: 'number_recognition',
          question: `How many dots do you see?`,
          options,
          correctAnswer,
          difficulty: 1,
          visualAid: num.toString(),
        });
      } else if (difficulty === 2) {
        const a = Math.floor(Math.random() * 5) + 1;
        const b = Math.floor(Math.random() * 5) + 1;
        const correctAnswer = (a + b).toString();
        const options = [
          correctAnswer,
          (a + b + 1).toString(),
          (a + b - 1 > 0 ? a + b - 1 : a + b + 2).toString(),
          (a + b + 2).toString(),
        ].sort(() => Math.random() - 0.5);
        
        newQuestions.push({
          id: `q${i}`,
          type: 'addition',
          question: `${a} + ${b} = ?`,
          options,
          correctAnswer,
          difficulty: 2,
        });
      } else {
        const a = Math.floor(Math.random() * 10) + 5;
        const b = Math.floor(Math.random() * 5) + 1;
        const correctAnswer = (a - b).toString();
        const options = [
          correctAnswer,
          (a - b + 1).toString(),
          (a - b - 1 > 0 ? a - b - 1 : a - b + 2).toString(),
          (a - b + 2).toString(),
        ].sort(() => Math.random() - 0.5);
        
        newQuestions.push({
          id: `q${i}`,
          type: 'subtraction',
          question: `${a} - ${b} = ?`,
          options,
          correctAnswer,
          difficulty: 3,
        });
      }
    }
    setQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setShowFeedback(false);
    setSelectedAnswer(null);
  };

  const handleAnswer = (answer: string) => {
    if (showFeedback) return;
    
    setSelectedAnswer(answer);
    const correct = answer === questions[currentQuestion].correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
      if (settings.audioEnabled) {
        playSuccessSound();
      }
      if (settings.hapticEnabled && 'vibrate' in navigator) {
        navigator.vibrate(100);
      }
    }
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setShowFeedback(false);
      setSelectedAnswer(null);
    } else {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      
      saveActivityMutation.mutate({
        activityType: 'math',
        difficulty,
        score,
        timeSpent,
        completed: true,
        data: { questions: questions.length },
      });
      
      setLocation('/progress');
    }
  };

  const playSuccessSound = () => {
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.frequency.value = 523.25;
    gainNode.gain.value = 0.1;
    
    oscillator.start();
    setTimeout(() => oscillator.stop(), 200);
  };

  const speak = (text: string) => {
    if (settings.audioEnabled && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      window.speechSynthesis.speak(utterance);
    }
  };

  if (questions.length === 0) {
    return <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-lg text-muted-foreground">Loading...</div>
    </div>;
  }

  const question = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
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
          <div className="flex-1 mx-6">
            <Progress value={progress} className="h-3" />
            <p className="text-sm text-muted-foreground text-center mt-2">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => speak(question.question)}
            className="w-12 h-12 rounded-full"
            data-testid="button-audio"
          >
            <Volume2 className="w-6 h-6" />
          </Button>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl flex flex-col justify-center">
        <Card className="p-8 mb-8 border border-card-border">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-card-foreground mb-6 tracking-wide">
              {question.question}
            </h2>
            
            {question.visualAid && (
              <div className="flex justify-center gap-2 flex-wrap mb-6">
                {Array.from({ length: parseInt(question.visualAid) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-12 h-12 rounded-full bg-primary shadow-lg"
                  />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {question.options.map((option, index) => (
              <Button
                key={index}
                variant={selectedAnswer === option ? (isCorrect ? "default" : "destructive") : "outline"}
                size="lg"
                onClick={() => handleAnswer(option)}
                disabled={showFeedback}
                className={cn(
                  "h-20 text-2xl font-bold rounded-xl transition-all",
                  selectedAnswer === option && isCorrect && "bg-chart-4 hover:bg-chart-4",
                  selectedAnswer === option && !isCorrect && "bg-destructive hover:bg-destructive"
                )}
                data-testid={`button-answer-${index}`}
              >
                {option}
              </Button>
            ))}
          </div>
        </Card>

        {showFeedback && (
          <Card className={cn(
            "p-6 border-2 animate-in slide-in-from-bottom-4",
            isCorrect ? "border-chart-4 bg-chart-4/10" : "border-destructive bg-destructive/10"
          )}>
            <div className="flex items-center gap-4">
              <div className={cn(
                "w-16 h-16 rounded-full flex items-center justify-center",
                isCorrect ? "bg-chart-4" : "bg-destructive"
              )}>
                {isCorrect ? (
                  <Star className="w-8 h-8 text-white" />
                ) : (
                  <PartyPopper className="w-8 h-8 text-white" />
                )}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold text-foreground mb-1">
                  {isCorrect ? "Amazing!" : "Good Try!"}
                </h3>
                <p className="text-base text-muted-foreground">
                  {isCorrect 
                    ? "You got it right! Keep up the great work!" 
                    : `The answer is ${question.correctAnswer}. Let's try the next one!`}
                </p>
              </div>
              <Button
                size="lg"
                onClick={handleNext}
                className="h-14 px-8 text-lg rounded-xl"
                data-testid="button-next"
              >
                {currentQuestion < questions.length - 1 ? "Next" : "Finish"}
              </Button>
            </div>
          </Card>
        )}

        <div className="mt-6 flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-accent" />
            <span className="text-lg font-semibold text-foreground">
              Score: {score}/{questions.length}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
