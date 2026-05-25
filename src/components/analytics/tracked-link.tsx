"use client";

import type { MouseEvent, ReactNode } from "react";

interface TrackedLinkProps {
  href: string;
  onClick?: () => void;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export function TrackedLink({
  href,
  onClick,
  children,
  ...props
}: TrackedLinkProps) {
  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.();
    // Don't prevent default — let the link navigate normally
    void e;
  };

  return (
    <a href={href} onClick={handleClick} {...props}>
      {children}
    </a>
  );
}
