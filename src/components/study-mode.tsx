"use client";

import { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, RotateCw, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Flashcard } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface StudyModeProps {
  cards: Flashcard[];
  onExit: () => void;
}

export default function StudyMode({ cards, onExit }: StudyModeProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [direction, setDirection] = useState<'next' | 'prev' | 'none'>('none');

  const currentCard = cards[currentIndex];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === ' ') {
        e.preventDefault();
        handleFlip();
      }
      if (e.key === 'Escape') onExit();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentIndex, cards.length]);

  const handleFlip = () => {
    setIsFlipped((f) => !f);
    setDirection('none');
  };

  const handleNext = () => {
    if (currentIndex < cards.length - 1) {
      setDirection('next');
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setDirection('none');
      }, 150);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setDirection('prev');
      setIsFlipped(false);
      setTimeout(() => {
        setCurrentIndex((i) => i - 1);
        setDirection('none');
      }, 150);
    }
  };

  const getAnimationClass = () => {
    if (direction === 'next') return 'animate-slide-out-left';
    if (direction === 'prev') return 'animate-slide-out-right';
    return 'animate-fade-in';
  };

  if (cards.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-2xl font-bold">No Cards to Study</h2>
        <p className="text-muted-foreground">
          Please add some cards to your deck first.
        </p>
        <Button onClick={onExit}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Deck
        </Button>
      </div>
    );
  }

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-4 top-4"
        onClick={onExit}
        aria-label="Exit study mode"
      >
        <X className="h-6 w-6" />
      </Button>

      <div className="w-full max-w-2xl">
        <div className="mb-4 text-center text-sm text-muted-foreground">
          Card {currentIndex + 1} of {cards.length}
        </div>
        <Progress value={((currentIndex + 1) / cards.length) * 100} className="mb-8" />
        
        <div className={cn("w-full", getAnimationClass())}>
          <div
            className="relative h-80 w-full cursor-pointer [perspective:1000px]"
            onClick={handleFlip}
          >
            <div
              className="relative h-full w-full transition-transform duration-700 [transform-style:preserve-3d]"
              style={{ transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)' }}
            >
              {/* Front of Card */}
              <Card className="absolute h-full w-full [backface-visibility:hidden]">
                <CardContent className="flex h-full items-center justify-center p-6 text-center">
                  <p className="text-2xl font-semibold md:text-3xl">
                    {currentCard.frontText}
                  </p>
                </CardContent>
              </Card>
              {/* Back of Card */}
              <Card className="absolute h-full w-full [backface-visibility:hidden] [transform:rotateY(180deg)]">
                <CardContent className="flex h-full items-center justify-center p-6 text-center">
                  <p className="text-xl md:text-2xl">{currentCard.backText}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-center space-x-4">
          <Button
            variant="outline"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            aria-label="Previous card"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <Button
            onClick={handleFlip}
            className="min-w-[120px]"
            aria-label="Flip card"
          >
            <RotateCw className="mr-2 h-4 w-4" />
            Flip
          </Button>
          <Button
            variant="outline"
            onClick={handleNext}
            disabled={currentIndex === cards.length - 1}
            aria-label="Next card"
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          Tip: Use spacebar to flip, and left/right arrow keys to navigate.
        </div>
      </div>
    </div>
  );
}
