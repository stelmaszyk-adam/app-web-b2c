"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { posthog, isPostHogInitialized } from "@/lib/posthog";

export function Track404() {
  const pathname = usePathname();

  useEffect(() => {
    if (!isPostHogInitialized()) return;
    posthog.capture("page_not_found", { path: pathname });
  }, [pathname]);

  return null;
}
