"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useOnboardingState } from "@/lib/utils/useOnboardingState";

export default function Home() {
  const router = useRouter();
  const { hasSeenOnboarding, isReady } = useOnboardingState();

  useEffect(() => {
    if (!isReady) return;

    const destination = hasSeenOnboarding ? "/overview" : "/welcome";
    router.replace(destination);
  }, [hasSeenOnboarding, isReady, router]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-950 text-slate-400">
      <p className="text-xs uppercase tracking-widest">Preparing Mission Control...</p>
    </div>
  );
}
