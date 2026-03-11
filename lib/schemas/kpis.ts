import { z } from "zod";

// Intentionally a flexible record — kpis shape may evolve
export const SupervisorKpisSchema = z.record(z.unknown());

export type SupervisorKpis = z.infer<typeof SupervisorKpisSchema>;
