"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getSSEUrl } from "@/lib/api/client";
import type { SSEEventData } from "@/lib/schemas";

export type SSEStatus = "connecting" | "connected" | "disconnected" | "error";

const MAX_EVENTS = 25;

export function useSSE() {
  const [status, setStatus] = useState<SSEStatus>("connecting");
  const [events, setEvents] = useState<SSEEventData[]>([]);
  const queryClient = useQueryClient();

  const appendEvent = useCallback((event: string, rawData: unknown) => {
    let data: unknown = rawData;
    if (typeof rawData === "string") {
      try {
        data = JSON.parse(rawData);
      } catch {
        // keep as string
      }
    }
    const entry: SSEEventData = { event, data, receivedAt: new Date().toISOString() };
    setEvents((prev) => [entry, ...prev.slice(0, MAX_EVENTS - 1)]);
  }, []);

  useEffect(() => {
    let es: EventSource;

    try {
      es = new EventSource(getSSEUrl());
    } catch {
      setStatus("error");
      return;
    }

    setStatus("connecting");

    es.addEventListener("open", () => setStatus("connected"));
    es.addEventListener("error", () => {
      es.close();
      setStatus("error");
    });

    const trackedEvents = ["activity.logged", "task.updated", "run.updated", "supervisor.kpis"];

    const handlers = trackedEvents.map((name) => {
      const handler = (e: MessageEvent) => {
        appendEvent(name, e.data);
        if (name === "task.updated" || name === "run.updated") {
          void queryClient.invalidateQueries({ queryKey: ["tasks"] });
        }
        if (name === "activity.logged") {
          void queryClient.invalidateQueries({ queryKey: ["activity"] });
        }
        if (name === "supervisor.kpis") {
          void queryClient.invalidateQueries({ queryKey: ["kpis"] });
        }
      };
      es.addEventListener(name, handler);
      return { name, handler };
    });

    const onMessage = (e: MessageEvent) => appendEvent("message", e.data);
    es.addEventListener("message", onMessage);

    return () => {
      handlers.forEach(({ name, handler }) => es.removeEventListener(name, handler));
      es.removeEventListener("message", onMessage);
      es.close();
      setStatus("disconnected");
    };
  }, [appendEvent, queryClient]);

  return { status, events };
}
