"use client";

import Image from "next/image";
import { Card } from "@/components/ui/Card";
import type { Agent, Task } from "@/types";
import type { ZoneId } from "@/lib/office/zones";
import type { NormalizedSceneState } from "@/lib/office/sceneStateNormalizer";

interface AgentInspectorProps {
  agent: Agent | null;
  task: Task | null;
  assignedTasks: Task[];
  zone: ZoneId | null;
  state: NormalizedSceneState | null;
  avatarUrl?: string;
  generating: boolean;
  avatarError?: string | null;
  onGenerateAvatar: () => void;
}

export function AgentInspector({
  agent,
  task,
  assignedTasks,
  zone,
  state,
  avatarUrl,
  generating,
  avatarError,
  onGenerateAvatar,
}: AgentInspectorProps) {
  if (!agent) {
    return (
      <Card title="Agent Inspector" className="h-full" bodyClassName="text-sm text-slate-400">
        Select an agent bubble to inspect role, status, task, heartbeat, and avatar controls.
      </Card>
    );
  }

  return (
    <Card title="Agent Inspector" className="h-full" bodyClassName="space-y-3 text-xs">
      {/* Avatar — full width, prominent */}
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt={`${agent.name} avatar`}
          width={320}
          height={320}
          unoptimized
          className="w-full h-56 rounded border border-surface-700 bg-surface-800 object-contain object-bottom image-rendering-pixelated"
        />
      ) : (
        <div className="flex h-56 w-full items-center justify-center rounded border border-surface-700 bg-surface-800 text-2xl font-bold text-slate-500">
          {agent.name.slice(0, 2).toUpperCase()}
        </div>
      )}

      {/* Name + role */}
      <div>
        <p className="text-sm font-semibold text-slate-100">{agent.name}</p>
        <p className="text-slate-400">{agent.role ?? "Unknown role"}</p>
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-0.5 text-slate-300">
        <span>Status: <span className="text-slate-100">{state?.label ?? "Unknown"}</span></span>
        <span>Zone: <span className="text-slate-100">{zone ?? "n/a"}</span></span>
      </div>

      <div className="grid grid-cols-2 gap-x-3 gap-y-1 text-slate-300">
        <p>Current task</p>
        <p className="text-right text-slate-100">{task?.title ?? "None"}</p>
        <p>Priority</p>
        <p className="text-right text-slate-100">{task?.priority ?? "n/a"}</p>
        <p>Heartbeat</p>
        <p className="text-right text-slate-100">{agent.heartbeat ?? "n/a"}</p>
      </div>

      <button
        type="button"
        onClick={onGenerateAvatar}
        disabled={generating}
        className="rounded border border-cyan-400/50 bg-cyan-500/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide text-cyan-200 transition hover:bg-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {generating ? "Generating... (may take ~15s)" : "Generate Avatar"}
      </button>
      {avatarError && (
        <p className="rounded border border-red-500/30 bg-red-500/10 px-2 py-1 text-[10px] text-red-400">{avatarError}</p>
      )}

      <div className="space-y-1 border-t border-surface-700 pt-2">
        <p className="text-[10px] uppercase tracking-widest text-slate-400">Assigned tasks</p>
        {assignedTasks.length === 0 && <p className="text-slate-500">No assigned tasks.</p>}
        {assignedTasks.slice(0, 6).map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-2 rounded border border-surface-700 bg-surface-800/70 px-2 py-1">
            <p className="truncate text-slate-300">{item.title}</p>
            <span className="shrink-0 rounded bg-surface-700 px-1.5 py-0.5 text-[10px] uppercase tracking-wide text-slate-200">
              {item.status ?? "Unknown"}
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
}
