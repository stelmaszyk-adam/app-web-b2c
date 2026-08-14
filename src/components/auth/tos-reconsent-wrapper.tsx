"use client";

import { useAuth } from "@/lib/auth-context";
import { TosReconsentModal } from "./tos-reconsent-modal";

export function TosReconsentWrapper() {
  const { tosRequired, setTosRequired } = useAuth();
  if (!tosRequired) return null;
  return <TosReconsentModal onAccepted={() => setTosRequired(false)} />;
}
