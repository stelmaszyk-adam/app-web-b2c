"use client";

import { useEffect } from "react";
import { trackEventDetailView } from "@/lib/analytics";

export function TrackEventDetailView({
  eventId,
  eventTitle,
}: {
  eventId: string;
  eventTitle: string;
}) {
  useEffect(() => {
    trackEventDetailView(eventId, eventTitle);
  }, [eventId, eventTitle]);

  return null;
}
