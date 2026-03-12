import { apiFetch } from "./client";

export interface PipelineTask {
  id: string;
  title: string;
  status: string;
  priority?: number | null;
  assignedAgent?: { id: string; name: string } | null;
  updatedAt?: string;
}

export interface PipelineStage {
  id: string;
  name: string;
  position: number;
  tasks: PipelineTask[];
}

export interface Pipeline {
  id: string;
  name: string;
  type: string;
  description?: string | null;
  stages: PipelineStage[];
}

export async function getPipelines(): Promise<Pipeline[]> {
  const raw = await apiFetch<{ pipelines: Pipeline[] }>("/api/pipelines");
  return raw?.pipelines ?? [];
}
