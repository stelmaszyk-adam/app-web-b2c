import type { CategorySlug } from "./categories";
import { CATEGORY_MAP } from "./categories";

/**
 * Cloudflare Images variant suffixes.
 * Maps to the three variants defined in ARCHITECTURE.md Section 20.2:
 * Small: 200x200 (map cards), Medium: 600px wide (list cards), Large: 1200px wide (detail pages)
 */
export const IMAGE_VARIANTS = {
  small: "/small",
  medium: "/medium",
  large: "/large",
} as const;

export type ImageVariant = keyof typeof IMAGE_VARIANTS;

/**
 * Build a Cloudflare Images variant URL from a base image URL.
 * In production, Cloudflare Images serves variants via URL suffixes.
 * For local/mock URLs (starting with /), returns the original URL unchanged.
 */
export function getVariantUrl(
  baseUrl: string,
  variant: ImageVariant,
): string {
  if (baseUrl.startsWith("/") || baseUrl.startsWith("data:")) {
    return baseUrl;
  }
  return `${baseUrl}${IMAGE_VARIANTS[variant]}`;
}

/**
 * Generate a tiny 1x1 SVG data URL in the category color for use as blur placeholder.
 */
export function getCategoryBlurDataUrl(category: CategorySlug): string {
  const cat = CATEGORY_MAP[category];
  const color = cat?.color ?? "#6b7280";
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"><rect width="1" height="1" fill="${color}" opacity="0.3"/></svg>`,
  )}`;
}

/**
 * Get the fallback color for a category.
 */
export function getCategoryColor(category: CategorySlug): string {
  return CATEGORY_MAP[category]?.color ?? "#6b7280";
}
