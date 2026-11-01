export type WorthItRating = 'worth-it' | 'so-so' | 'regret';

export type DraftCategory = 'to-go' | 'to-buy' | 'to-do';

export type PriorityLevel = 'high' | 'medium' | 'low';

export interface DraftItem {
  id: string;
  title: string;
  category: DraftCategory;
  tag: string;
  subtag: string;
  estimatedCost: number;
  meta: string;
  date: string;
  icon: string;
  image?: string;
  link?: string;
  googleCalendarUrl?: string;
  notes?: string;
  priority?: PriorityLevel;
  completed?: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  type: 'expense' | 'income';
  amount: number;
  category: string;
  time: string;
  rating?: WorthItRating | null;
  iconType?: string;
  reflection?: string;
  lesson?: string;
  source?: string;
}
