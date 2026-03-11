import { apiFetch } from "./client";
import { AgentsResponseSchema } from "@/lib/schemas";
import type { Agent } from "@/lib/schemas";

export async function getAgents(): Promise<Agent[]> {
  const raw = await apiFetch<unknown>("/api/agents");
  const parsed = AgentsResponseSchema.safeParse(raw);
  if (!parsed.success) {
    console.warn("[getAgents] schema mismatch", parsed.error.flatten());
    return [];
  }
  return parsed.data.agents;
}
