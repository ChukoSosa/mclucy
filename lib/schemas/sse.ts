import { z } from "zod";

export const SSEEventPayloadSchema = z.record(z.unknown()).optional();

export const SSEEventSchema = z.object({
  event: z.string().optional(),
  data: z.unknown().optional(),
  receivedAt: z.string(),
});

export type SSEEventData = z.infer<typeof SSEEventSchema>;
