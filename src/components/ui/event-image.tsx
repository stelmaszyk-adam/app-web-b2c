"use client";

import { useState, useCallback } from "react";
import Image from "next/image";
import type { CategorySlug } from "@/lib/categories";
import { CATEGORY_MAP } from "@/lib/categories";
import { getCategoryBlurDataUrl, getCategoryColor } from "@/lib/image-utils";

interface EventImageProps {
  src: string | null | undefined;
  alt: string;
  category: CategorySlug;
  fill?: boolean;
  width?: number;
  height?: number;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

export function EventImage({
  src,
  alt,
  category,
  fill,
  width,
  height,
  sizes,
  priority,
  className,
}: EventImageProps) {
  const [hasError, setHasError] = useState(false);
  const isPlaceholder = !src || src.startsWith("placeholder:") || hasError;

  const handleError = useCallback(() => {
    setHasError(true);
  }, []);

  if (isPlaceholder) {
    return (
      <CategoryPlaceholder
        category={category}
        className={className}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      sizes={sizes}
      priority={priority}
      placeholder="blur"
      blurDataURL={getCategoryBlurDataUrl(category)}
      onError={handleError}
      className={className}
      style={fill ? { objectFit: "cover" } : undefined}
    />
  );
}

function CategoryPlaceholder({
  category,
  className,
}: {
  category: CategorySlug;
  className?: string;
}) {
  const cat = CATEGORY_MAP[category];
  const color = getCategoryColor(category);
  const Icon = cat?.icon;

  return (
    <div
      className={`flex h-full w-full items-center justify-center ${className ?? ""}`}
      style={{
        background: `linear-gradient(135deg, ${color}33, ${color}66)`,
      }}
      role="presentation"
      aria-hidden="true"
    >
      {Icon ? (
        <Icon className="h-10 w-10 opacity-40" strokeWidth={1.5} />
      ) : (
        <svg
          className="h-10 w-10 opacity-40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
          <circle cx="8.5" cy="8.5" r="1.5" />
          <polyline points="21 15 16 10 5 21" />
        </svg>
      )}
    </div>
  );
}
