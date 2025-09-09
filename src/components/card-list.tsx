"use client";

import { useState } from 'react';
import { Trash2 } from 'lucide-react';
import type { Flashcard } from '@/types';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Card } from './ui/card';
import { useToast } from '@/hooks/use-toast';

interface CardListProps {
  cards: Flashcard[];
  onDeleteCard: (id: string) => void;
}

export default function CardList({ cards, onDeleteCard }: CardListProps) {
  const [cardToDelete, setCardToDelete] = useState<Flashcard | null>(null);
  const { toast } = useToast();

  const handleDelete = () => {
    if (cardToDelete) {
      onDeleteCard(cardToDelete.id);
      setCardToDelete(null);
      toast({
        title: 'Card Deleted',
        description: 'The flashcard has been removed from your deck.',
      });
    }
  };

  if (cards.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center">
        <h3 className="text-lg font-semibold text-muted-foreground">
          Your deck is empty.
        </h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new card using the form above to get started!
        </p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Front (Term)</TableHead>
              <TableHead className="w-[40%]">Back (Definition)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cards.map((card) => (
              <TableRow key={card.id}>
                <TableCell className="align-top font-medium">
                  {card.frontText}
                </TableCell>
                <TableCell className="align-top">{card.backText}</TableCell>
                <TableCell className="text-right align-top">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCardToDelete(card)}
                    aria-label="Delete card"
                  >
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <AlertDialog
        open={!!cardToDelete}
        onOpenChange={(open) => !open && setCardToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              flashcard from your deck.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
