import { useState } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { ArrowLeft, Volume2, Play, Pause, Type, Palette } from 'lucide-react';
import { useSettings } from '@/contexts/SettingsContext';
import { cn } from '@/lib/utils';

export default function Reading() {
  const [, setLocation] = useLocation();
  const { settings } = useSettings();
  const [isReading, setIsReading] = useState(false);
  const [currentWord, setCurrentWord] = useState(0);
  const [colorMode, setColorMode] = useState<'default' | 'syllables'>('default');
  
  const story = {
    title: "The Friendly Dragon",
    paragraphs: [
      { text: "Once upon a time, there lived a friendly dragon named Spark.", syllables: [["Once"], ["up", "on"], ["a"], ["time,"], ["there"], ["lived"], ["a"], ["friend", "ly"], ["dra", "gon"], ["named"], ["Spark."]] },
      { text: "Spark loved to help children learn new things every day.", syllables: [["Spark"], ["loved"], ["to"], ["help"], ["chil", "dren"], ["learn"], ["new"], ["things"], ["ev", "ry"], ["day."]] },
      { text: "He was kind, patient, and always ready to encourage everyone.", syllables: [["He"], ["was"], ["kind,"], ["pa", "tient,"], ["and"], ["al", "ways"], ["rea", "dy"], ["to"], ["en", "cour", "age"], ["ev", "ry", "one."]] },
    ]
  };

  const readAloud = () => {
    if (!settings.audioEnabled || !('speechSynthesis' in window)) return;
    
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
      return;
    }

    setIsReading(true);
    const fullText = story.paragraphs.map(p => p.text).join(' ');
    const utterance = new SpeechSynthesisUtterance(fullText);
    utterance.rate = 0.8;
    utterance.pitch = 1.0;
    
    utterance.onend = () => {
      setIsReading(false);
      setCurrentWord(0);
    };
    
    window.speechSynthesis.speak(utterance);
  };

  const colors = ['#0BC5EA', '#9F7AEA', '#F6AD55', '#48BB78'];

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
          <h1 className="text-xl font-semibold text-foreground">Reading Practice</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="p-8 mb-6 border border-card-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-card-foreground">{story.title}</h2>
            <div className="flex gap-2">
              <Button
                variant={colorMode === 'default' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setColorMode('default')}
                className="w-12 h-12 rounded-full"
                data-testid="button-color-default"
              >
                <Type className="w-5 h-5" />
              </Button>
              <Button
                variant={colorMode === 'syllables' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setColorMode('syllables')}
                className="w-12 h-12 rounded-full"
                data-testid="button-color-syllables"
              >
                <Palette className="w-5 h-5" />
              </Button>
            </div>
          </div>

          <div 
            className="space-y-6 text-lg leading-loose tracking-wide learning-content"
            data-testid="text-reading-content"
          >
            {story.paragraphs.map((paragraph, pIndex) => (
              <p key={pIndex} className="text-card-foreground">
                {colorMode === 'syllables' ? (
                  paragraph.syllables.map((word, wIndex) => (
                    <span key={wIndex} className="inline-block mr-2">
                      {word.map((syllable, sIndex) => (
                        <span
                          key={sIndex}
                          style={{ color: colors[sIndex % colors.length] }}
                          className="font-semibold"
                        >
                          {syllable}
                        </span>
                      ))}
                    </span>
                  ))
                ) : (
                  paragraph.text
                )}
              </p>
            ))}
          </div>
        </Card>

        <Card className="p-6 border border-card-border">
          <div className="flex items-center gap-4">
            <Button
              size="lg"
              onClick={readAloud}
              className="h-14 px-8 text-lg rounded-xl flex items-center gap-3"
              data-testid="button-read-aloud"
            >
              {isReading ? (
                <>
                  <Pause className="w-5 h-5" />
                  Pause Reading
                </>
              ) : (
                <>
                  <Play className="w-5 h-5" />
                  Read Aloud
                </>
              )}
            </Button>
            <div className="flex-1">
              <p className="text-sm text-muted-foreground mb-2">Reading Speed</p>
              <Slider
                defaultValue={[80]}
                max={100}
                min={60}
                step={10}
                className="w-full"
                data-testid="slider-speed"
              />
            </div>
          </div>
        </Card>

        <div className="mt-8 p-6 bg-muted/30 rounded-2xl border border-border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
              <Volume2 className="w-6 h-6 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Reading Tips</h3>
              <ul className="space-y-2 text-base text-muted-foreground leading-relaxed">
                <li>• Use color-coded syllables to break down words</li>
                <li>• Follow along with audio at your own pace</li>
                <li>• Take breaks whenever you need to</li>
                <li>• Practice makes progress, not perfection</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
