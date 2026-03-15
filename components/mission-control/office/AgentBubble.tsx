"use client";

import { memo, useEffect, useState } from "react";
import { motion, useAnimationControls } from "framer-motion";
import Image from "next/image";
import type { Agent, Task } from "@/types";
import type { NormalizedSceneState } from "@/lib/office/sceneStateNormalizer";
import { cn } from "@/lib/utils/cn";

interface AgentBubbleProps {
  agent: Agent;
  task: Task | null;
  x: number;
  y: number;
  offsetX?: number;
  offsetY?: number;
  avatarUrl?: string;
  state: NormalizedSceneState;
  onSelectAgent: (agentId: string) => void;
  onReachedPosition: (agentId: string) => void;
}

function AgentBubbleComponent({
  agent,
  task,
  x,
  y,
  offsetX = 0,
  offsetY = 0,
  avatarUrl,
  state,
  onSelectAgent,
  onReachedPosition,
}: AgentBubbleProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const bubbleControls = useAnimationControls();

  const triggerBounce = () => {
    bubbleControls.stop();
    bubbleControls.set({ y: 0, scale: 1 });
    void bubbleControls.start({
      y: [0, -8, 0, -3, 0],
      scale: [1, 1.04, 0.98, 1.01, 1],
      transition: {
        duration: 0.42,
        times: [0, 0.24, 0.56, 0.78, 1],
        ease: "easeOut",
      },
    });
  };

  useEffect(() => {
    setImageFailed(false);
  }, [avatarUrl, agent.id]);

  return (
    <motion.button
      type="button"
      className="group absolute z-20"
      style={{ transform: `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px))` }}
      animate={{ left: `${x}%`, top: `${y}%` }}
      transition={{ type: "spring", stiffness: 120, damping: 18, mass: 0.8 }}
      onAnimationComplete={() => onReachedPosition(agent.id)}
      onClick={() => {
        triggerBounce();
        onSelectAgent(agent.id);
      }}
      aria-label={`Open inspector for ${agent.name}`}
    >
      <motion.div
        initial={{ y: 0, scale: 1 }}
        animate={bubbleControls}
        className={cn(
          "relative h-14 w-14 overflow-hidden rounded-full border-2 border-surface-700 bg-surface-900/95",
          state.ringClassName,
          state.pulse && "animate-pulse-slow",
        )}
      >
        {avatarUrl && !imageFailed ? (
          <Image
            src={avatarUrl}
            alt={`${agent.name} avatar`}
            width={56}
            height={112}
            unoptimized
            onError={() => setImageFailed(true)}
            className="h-full w-full object-cover object-[50%_50%] scale-150 image-rendering-pixelated"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-full bg-surface-800 text-xs font-bold text-cyan-300">
            {agent.name.slice(0, 2).toUpperCase()}
          </div>
        )}
      </motion.div>

      <div className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-64 -translate-x-1/2 rounded border border-surface-700 bg-surface-900/95 p-2 text-left text-[11px] text-slate-200 shadow-2xl group-hover:block">
        <p className="font-semibold text-cyan-200">{agent.name}</p>
        <p className="text-slate-400">{agent.role ?? "Unknown role"}</p>
        <p className="mt-1 text-slate-300">Status: {state.label}</p>
        <p className="text-slate-300">Current task: {task?.title ?? "No active task"}</p>
        <p className="text-slate-400">Heartbeat: {agent.heartbeat ?? "n/a"}</p>
      </div>
    </motion.button>
  );
}

export const AgentBubble = memo(AgentBubbleComponent);
