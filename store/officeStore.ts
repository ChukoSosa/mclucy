import { create } from "zustand";
import type { ZoneId } from "@/lib/office/zones";

export interface AgentPositionState {
  currentZone: ZoneId;
  targetZone: ZoneId;
  waypointZone: ZoneId | null;
  isMoving: boolean;
}

interface OfficeStoreState {
  selectedAgentId: string | null;
  agentPositions: Record<string, AgentPositionState>;
  avatarMapping: Record<string, string>;
  setSelectedAgentId: (agentId: string | null) => void;
  setAvatar: (agentId: string, avatarUrl: string) => void;
  hydrateAvatarMapping: (mapping: Record<string, string>) => void;
  syncAgentTargets: (targets: Record<string, ZoneId>) => void;
  advanceAgentTransition: (agentId: string) => void;
}

export const useOfficeStore = create<OfficeStoreState>((set) => ({
  selectedAgentId: null,
  agentPositions: {},
  avatarMapping: {},

  setSelectedAgentId: (agentId) => set({ selectedAgentId: agentId }),

  setAvatar: (agentId, avatarUrl) =>
    set((state) => ({
      avatarMapping: {
        ...state.avatarMapping,
        [agentId]: avatarUrl,
      },
    })),

  hydrateAvatarMapping: (mapping) => set({ avatarMapping: mapping }),

  syncAgentTargets: (targets) =>
    set((state) => {
      const next: Record<string, AgentPositionState> = { ...state.agentPositions };
      let changed = false;

      Object.entries(targets).forEach(([agentId, targetZone]) => {
        const existing = next[agentId];

        if (!existing) {
          next[agentId] = {
            currentZone: targetZone,
            targetZone,
            waypointZone: null,
            isMoving: false,
          };
          changed = true;
          return;
        }

        if (existing.isMoving) {
          if (existing.targetZone !== targetZone) {
            next[agentId] = {
              ...existing,
              targetZone,
            };
            changed = true;
          }
          return;
        }

        if (existing.currentZone !== targetZone) {
          next[agentId] = {
            currentZone: existing.currentZone,
            targetZone,
            waypointZone: "hallway",
            isMoving: true,
          };
          changed = true;
        }
      });

      Object.keys(next).forEach((agentId) => {
        if (!targets[agentId]) {
          delete next[agentId];
          changed = true;
        }
      });

      if (!changed) return state;

      return { agentPositions: next };
    }),

  advanceAgentTransition: (agentId) =>
    set((state) => {
      const existing = state.agentPositions[agentId];
      if (!existing || !existing.isMoving) return state;

      const next = { ...state.agentPositions };

      if (existing.waypointZone === "hallway") {
        next[agentId] = {
          ...existing,
          currentZone: "hallway",
          waypointZone: null,
        };
      } else {
        next[agentId] = {
          currentZone: existing.targetZone,
          targetZone: existing.targetZone,
          waypointZone: null,
          isMoving: false,
        };
      }

      return { agentPositions: next };
    }),
}));
