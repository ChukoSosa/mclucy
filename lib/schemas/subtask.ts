import { z } from "zod";

export const SubtaskSchema = z.object({
  id: z.string(),
  title: z.string(),
  status: z.string().optional(),
  ownerAgent: z
    .object({ id: z.string(), name: z.string() })
    .nullable()
    .optional(),
  position: z.number().nullable().optional(),
  updatedAt: z.string().optional(),
});

export type Subtask = z.infer<typeof SubtaskSchema>;

export const SubtasksResponseSchema = z.object({
  subtasks: z.array(SubtaskSchema),
});
