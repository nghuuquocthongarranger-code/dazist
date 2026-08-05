import { TAROT_DECK, type TarotCard } from "../data/tarotDeck";

export interface DrawnCard {
  card: TarotCard;
  reversed: boolean;
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function drawCards(count: number): DrawnCard[] {
  const shuffled = shuffle(TAROT_DECK);
  return shuffled.slice(0, count).map((card) => ({ card, reversed: Math.random() < 0.35 }));
}
