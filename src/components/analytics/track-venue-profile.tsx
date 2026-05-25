"use client";

import { useEffect } from "react";
import { trackVenueProfileView } from "@/lib/analytics";

export function TrackVenueProfileView({
  venueId,
  venueName,
}: {
  venueId: string;
  venueName: string;
}) {
  useEffect(() => {
    trackVenueProfileView(venueId, venueName);
  }, [venueId, venueName]);

  return null;
}
