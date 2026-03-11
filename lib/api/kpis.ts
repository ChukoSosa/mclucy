import { apiFetch } from "./client";
import { SupervisorKpisSchema } from "@/lib/schemas";
import type { SupervisorKpis } from "@/lib/schemas";

export async function getSupervisorKpis(): Promise<SupervisorKpis> {
  const raw = await apiFetch<unknown>("/api/supervisor/kpis");
  const parsed = SupervisorKpisSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn("[getSupervisorKpis] schema mismatch", parsed.error.flatten());
    return {};
  }
  return parsed.data;
}
