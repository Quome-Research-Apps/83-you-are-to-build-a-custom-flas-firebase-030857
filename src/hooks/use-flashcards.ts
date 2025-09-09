"use client";

import { useState, useEffect, useCallback } from 'react';
import type { Flashcard } from '@/types';

const STORAGE_KEY = 'flashforge-deck';

export function useFlashcards() {
  const [cards, setCards] = useState<Flashcard[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedCards = localStorage.getItem(STORAGE_KEY);
      if (savedCards) {
        setCards(JSON.parse(savedCards));
      }
    } catch (error) {
      console.error('Failed to load flashcards from local storage:', error);
    }
    setIsLoaded(true);
  }, []);

  const updateLocalStorage = (updatedCards: Flashcard[]) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedCards));
    } catch (error) {
      console.error('Failed to save flashcards to local storage:', error);
    }
  };

  const addCard = useCallback(
    (frontText: string, backText: string) => {
      const newCard: Flashcard = {
        id: crypto.randomUUID(),
        frontText,
        backText,
      };
      setCards((prevCards) => {
        const updatedCards = [...prevCards, newCard];
        updateLocalStorage(updatedCards);
        return updatedCards;
      });
    },
    []
  );

  const deleteCard = useCallback(
    (id: string) => {
      setCards((prevCards) => {
        const updatedCards = prevCards.filter((card) => card.id !== id);
        updateLocalStorage(updatedCards);
        return updatedCards;
      });
    },
    []
  );

  return { cards, addCard, deleteCard, isLoaded };
}
