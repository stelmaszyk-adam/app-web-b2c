"use client";

import type { ReactNode, MouseEvent } from "react";
import {
  trackNavigateTap,
  trackTicketLinkTap,
  trackSmartBannerClick,
} from "@/lib/analytics";

interface TrackedAnchorProps {
  href: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

export function TrackedTicketLink({
  eventId,
  ...props
}: TrackedAnchorProps & { eventId: string }) {
  const handleClick = (e: MouseEvent) => {
    void e;
    trackTicketLinkTap(eventId, props.href);
  };
  return <a onClick={handleClick} {...props} />;
}

export function TrackedNavigateLink(props: TrackedAnchorProps) {
  const handleClick = (e: MouseEvent) => {
    void e;
    trackNavigateTap(props.href);
  };
  return <a onClick={handleClick} {...props} />;
}

export function TrackedSmartBannerLink({
  context,
  ...props
}: TrackedAnchorProps & { context: string }) {
  const handleClick = (e: MouseEvent) => {
    void e;
    trackSmartBannerClick(context);
  };
  return <a onClick={handleClick} {...props} />;
}
