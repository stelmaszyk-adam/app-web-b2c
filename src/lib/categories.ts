import type { LucideIcon } from "lucide-react";
import {
  Music,
  Moon,
  Drama,
  Palette,
  Dumbbell,
  Utensils,
  GraduationCap,
  Briefcase,
  Baby,
  Sparkles,
  Leaf,
  MoreHorizontal,
} from "lucide-react";

export type CategorySlug =
  | "music"
  | "nightlife"
  | "performing_arts"
  | "arts_culture"
  | "sport_fitness"
  | "food_drink"
  | "education"
  | "business"
  | "family"
  | "festival"
  | "wellness"
  | "other";

export interface Category {
  slug: CategorySlug;
  labelPl: string;
  labelEn: string;
  icon: LucideIcon;
  color: string;
}

export const CATEGORIES: Category[] = [
  {
    slug: "music",
    labelPl: "Muzyka",
    labelEn: "Music",
    icon: Music,
    color: "#6c3feb",
  },
  {
    slug: "nightlife",
    labelPl: "Życie nocne",
    labelEn: "Nightlife",
    icon: Moon,
    color: "#ec4899",
  },
  {
    slug: "performing_arts",
    labelPl: "Sztuki sceniczne",
    labelEn: "Performing Arts",
    icon: Drama,
    color: "#2563eb",
  },
  {
    slug: "arts_culture",
    labelPl: "Sztuka i kultura",
    labelEn: "Arts & Culture",
    icon: Palette,
    color: "#16a34a",
  },
  {
    slug: "sport_fitness",
    labelPl: "Sport i fitness",
    labelEn: "Sport & Fitness",
    icon: Dumbbell,
    color: "#0ea5e9",
  },
  {
    slug: "food_drink",
    labelPl: "Jedzenie i picie",
    labelEn: "Food & Drink",
    icon: Utensils,
    color: "#e5484d",
  },
  {
    slug: "education",
    labelPl: "Edukacja",
    labelEn: "Education",
    icon: GraduationCap,
    color: "#475569",
  },
  {
    slug: "business",
    labelPl: "Biznes",
    labelEn: "Business",
    icon: Briefcase,
    color: "#7c3aed",
  },
  {
    slug: "family",
    labelPl: "Rodzina i dzieci",
    labelEn: "Family & Kids",
    icon: Baby,
    color: "#eab308",
  },
  {
    slug: "festival",
    labelPl: "Festiwal",
    labelEn: "Festival",
    icon: Sparkles,
    color: "#f97316",
  },
  {
    slug: "wellness",
    labelPl: "Wellness",
    labelEn: "Wellness",
    icon: Leaf,
    color: "#14b8a6",
  },
  {
    slug: "other",
    labelPl: "Inne",
    labelEn: "Other",
    icon: MoreHorizontal,
    color: "#6b7280",
  },
];

export const CATEGORY_MAP = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
) as Record<CategorySlug, Category>;
