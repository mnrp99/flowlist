import {
  PlanCategory,
  WorthItRating as PrismaWorthItRating,
} from "@prisma/client";
import { DraftCategory, WorthItRating } from "@/types";

export function mapCategoryToPrisma(cat: DraftCategory): PlanCategory {
  switch (cat) {
    case "to-go":
      return PlanCategory.TO_GO;
    case "to-buy":
      return PlanCategory.TO_BUY;
    case "to-do":
      return PlanCategory.TO_DO;
    default:
      return PlanCategory.TO_GO;
  }
}

export function mapCategoryFromPrisma(cat: PlanCategory): DraftCategory {
  switch (cat) {
    case PlanCategory.TO_GO:
      return "to-go";
    case PlanCategory.TO_BUY:
      return "to-buy";
    case PlanCategory.TO_DO:
      return "to-do";
  }
}

export function mapRatingToPrisma(rating?: WorthItRating | null): PrismaWorthItRating | null {
  if (!rating) return null;
  switch (rating) {
    case "worth-it":
      return PrismaWorthItRating.AGAIN;
    case "so-so":
      return PrismaWorthItRating.SOMETIMES;
    case "regret":
      return PrismaWorthItRating.NEVER;
  }
}

export function mapRatingFromPrisma(rating?: PrismaWorthItRating | null): WorthItRating | null {
  if (!rating) return null;
  switch (rating) {
    case PrismaWorthItRating.AGAIN:
      return "worth-it";
    case PrismaWorthItRating.SOMETIMES:
      return "so-so";
    case PrismaWorthItRating.NEVER:
      return "regret";
  }
}
