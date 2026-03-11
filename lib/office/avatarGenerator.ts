import type { Agent } from "@/types";
import { apiFetch } from "@/lib/api/client";

export const AVATAR_STORAGE_KEY = "mission-control-agent-avatars";
export function buildAvatarPrompt(_agent: Agent): string {
  return `minimalist pixel art character, full body sprite, very large chunky pixels, retro 8-bit npc style, flat colors, no shading, simple geometric shapes, square pixel grid, limited palette, simple dot eyes, minimal mouth, clean outline, centered character.

character: operations manager woman wearing a yellow jacket, confident posture.

solid pastel background.

randomize hair style, hair color, clothing colors, accessories.

same pixel art style, same proportions, same scale, same pixel size.`;
}

async function callGenerateAvatarApi(prompt: string): Promise<string> {
  const res = await fetch("/api/generate-avatar", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error((err as { error?: string }).error ?? `Avatar generation failed (${res.status})`);
  }

  const { avatarUrl } = await res.json();
  return avatarUrl as string;
}

export function readAvatarMappingFromStorage(): Record<string, string> {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(AVATAR_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return {};

    return Object.entries(parsed).reduce<Record<string, string>>((acc, [key, value]) => {
      if (typeof value === "string") acc[key] = value;
      return acc;
    }, {});
  } catch {
    return {};
  }
}

export function saveAvatarMappingToStorage(mapping: Record<string, string>): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AVATAR_STORAGE_KEY, JSON.stringify(mapping));
}

export async function persistAvatar(agentId: string, avatarUrl: string, prompt: string): Promise<void> {
  try {
    await apiFetch(`/api/agents/${agentId}/avatar`, {
      method: "POST",
      body: JSON.stringify({ avatarUrl, prompt }),
    });
  } catch {
    // Optional endpoint: fallback persistence is handled in localStorage.
  }
}

export async function generateAvatar(agent: Agent): Promise<{ avatarUrl: string; prompt: string }> {
  const prompt = buildAvatarPrompt(agent);
  const avatarUrl = await callGenerateAvatarApi(prompt);
  return { avatarUrl, prompt };
}
