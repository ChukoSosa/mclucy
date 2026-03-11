import { z } from "zod";

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string().optional(),
  status: z.string().optional(),
  statusMessage: z.string().nullable().optional(),
  heartbeat: z.string().nullable().optional(),
});

export type Agent = z.infer<typeof AgentSchema>;

export const AgentsResponseSchema = z.object({
  agents: z.array(AgentSchema),
});
