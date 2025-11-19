import { useRef, useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowLeft, Eraser, RotateCcw, Download, Pen } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Writing() {
  const [, setLocation] = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#0BC5EA');
  const [lineWidth, setLineWidth] = useState(8);
  const [showGuide, setShowGuide] = useState(true);
  const [currentLetter, setCurrentLetter] = useState('A');

  const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = 'touches' in e ? e.touches[0].clientX - rect.left : e.nativeEvent.offsetX;
    const y = 'touches' in e ? e.touches[0].clientY - rect.top : e.nativeEvent.offsetY;

    ctx.strokeStyle = color;
    ctx.lineWidth = lineWidth;
    ctx.lineTo(x, y);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const downloadDrawing = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `letter-${currentLetter}.png`;
    link.href = canvas.toDataURL();
    link.click();
  };

  const colors = [
    { name: 'Blue', value: '#0BC5EA' },
    { name: 'Purple', value: '#9F7AEA' },
    { name: 'Orange', value: '#F6AD55' },
    { name: 'Green', value: '#48BB78' },
    { name: 'Red', value: '#F56565' },
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
          <h1 className="text-xl font-semibold text-foreground">Writing Practice</h1>
          <div className="w-12" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-6">
          <p className="text-lg text-muted-foreground mb-4">Choose a letter to practice:</p>
          <div className="flex flex-wrap gap-3">
            {letters.map((letter) => (
              <Button
                key={letter}
                variant={currentLetter === letter ? 'default' : 'outline'}
                onClick={() => setCurrentLetter(letter)}
                className="w-14 h-14 text-xl font-bold rounded-xl"
                data-testid={`button-letter-${letter}`}
              >
                {letter}
              </Button>
            ))}
          </div>
        </div>

        <Card className="p-6 border border-card-border mb-6">
          <div className="relative">
            {showGuide && (
              <div 
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-10"
                style={{ opacity: 0.2 }}
              >
                <span 
                  className="text-[20rem] font-bold text-primary learning-content"
                >
                  {currentLetter}
                </span>
              </div>
            )}
            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseLeave={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="w-full h-96 bg-background rounded-xl border-2 border-dashed border-border cursor-crosshair touch-none"
              data-testid="canvas-writing"
            />
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border border-card-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4 flex items-center gap-2">
              <Pen className="w-5 h-5" />
              Pen Color
            </h3>
            <div className="flex gap-3 flex-wrap">
              {colors.map((c) => (
                <button
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={cn(
                    "w-14 h-14 rounded-full border-4 transition-all hover-elevate",
                    color === c.value ? 'border-foreground scale-110' : 'border-transparent'
                  )}
                  style={{ backgroundColor: c.value }}
                  data-testid={`button-color-${c.name.toLowerCase()}`}
                />
              ))}
            </div>
          </Card>

          <Card className="p-6 border border-card-border">
            <h3 className="text-lg font-semibold text-card-foreground mb-4">Tools</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={showGuide ? 'default' : 'outline'}
                onClick={() => setShowGuide(!showGuide)}
                className="h-14 rounded-xl"
                data-testid="button-toggle-guide"
              >
                {showGuide ? 'Hide' : 'Show'} Guide
              </Button>
              <Button
                variant="outline"
                onClick={clearCanvas}
                className="h-14 rounded-xl flex items-center gap-2"
                data-testid="button-clear"
              >
                <RotateCcw className="w-5 h-5" />
                Clear
              </Button>
              <Button
                variant="outline"
                onClick={downloadDrawing}
                className="h-14 rounded-xl flex items-center gap-2 col-span-2"
                data-testid="button-save"
              >
                <Download className="w-5 h-5" />
                Save Drawing
              </Button>
            </div>
          </Card>
        </div>

        <div className="mt-8 p-6 bg-muted/30 rounded-2xl border border-border">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
              <Pen className="w-6 h-6 text-accent-foreground" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Writing Tips</h3>
              <ul className="space-y-2 text-base text-muted-foreground leading-relaxed">
                <li>• Use the letter guide to trace over the shape</li>
                <li>• Take your time and focus on one stroke at a time</li>
                <li>• Practice makes progress - every attempt counts!</li>
                <li>• Try different colors to make practice fun</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
