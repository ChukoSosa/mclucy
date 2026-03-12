"use client";

import { useCallback } from "react";

export const ONBOARDING_STORAGE_KEY = "mc_lucy_onboarding_seen";

export function readOnboardingSeen(): boolean {
  if (typeof window === "undefined") {
    return false;
  }
  return window.localStorage.getItem(ONBOARDING_STORAGE_KEY) === "true";
}

export function writeOnboardingSeen(seen: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(ONBOARDING_STORAGE_KEY, seen ? "true" : "false");
}

export function useOnboardingState() {
  const hasSeenOnboarding = useCallback(() => readOnboardingSeen(), []);
  const markOnboardingSeen = useCallback(() => writeOnboardingSeen(true), []);

  return {
    hasSeenOnboarding,
    markOnboardingSeen,
    key: ONBOARDING_STORAGE_KEY,
  };
}
