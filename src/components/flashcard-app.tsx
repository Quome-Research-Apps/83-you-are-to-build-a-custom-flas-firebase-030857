"use client";

import { useState } from 'react';
import { BrainCircuit, BookOpen, PlusCircle } from 'lucide-react';
import { useFlashcards } from '@/hooks/use-flashcards';
import CreateCardForm from '@/components/create-card-form';
import CardList from '@/components/card-list';
import StudyMode from '@/components/study-mode';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

function AppSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      <header className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <Skeleton className="h-8 w-40" />
        </div>
        <Skeleton className="h-10 w-32" />
      </header>
      <main className="space-y-8">
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="rounded-lg border bg-card p-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Skeleton className="h-24" />
              <Skeleton className="h-24" />
            </div>
            <div className="mt-6 flex justify-end">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <Skeleton className="h-8 w-48 mb-4" />
          <div className="rounded-lg border">
            <Skeleton className="h-40 w-full" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function FlashcardApp() {
  const { cards, addCard, deleteCard, isLoaded } = useFlashcards();
  const [view, setView] = useState<'manage' | 'study'>('manage');

  if (!isLoaded) {
    return <AppSkeleton />;
  }

  if (view === 'study') {
    return <StudyMode cards={cards} onExit={() => setView('manage')} />;
  }

  return (
    <div className="container mx-auto max-w-5xl p-4 md:p-8">
      <header className="mb-8 flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-primary/20 p-2 text-primary">
            <BrainCircuit className="h-6 w-6" />
          </div>
          <h1 className="font-headline text-3xl font-bold tracking-tight text-foreground">
            FlashForge
          </h1>
        </div>
        <Button
          onClick={() => setView('study')}
          disabled={cards.length === 0}
          size="lg"
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <BookOpen className="mr-2 h-5 w-5" />
          Study Deck
        </Button>
      </header>
      <main className="space-y-12">
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-2xl font-bold">
            <PlusCircle className="text-primary" />
            Create a New Card
          </h2>
          <CreateCardForm onAddCard={addCard} />
        </section>

        <Separator />

        <section>
          <h2 className="mb-4 text-2xl font-bold">Your Deck ({cards.length})</h2>
          <CardList cards={cards} onDeleteCard={deleteCard} />
        </section>
      </main>
    </div>
  );
}
