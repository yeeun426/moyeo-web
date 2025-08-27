import { z } from "zod";

export const challengeSchema = z.object({
  title: z.string().min(1),
  startDate: z.string().date("YYYY-MM-DD 형태"),
  endDate: z.string().date("YYYY-MM-DD 형태"),
  maxParticipants: z.coerce.number().int().positive(),
  rule: z.coerce.number().int().positive(), // 주간 참여 횟수
  fee: z.coerce.number().nonnegative(),
  type: z.enum(["TIME", "ATTENDANCE", "CONTENT"]),
  option: z.union([
    z.object({ time: z.coerce.number().int().positive() }), // TIME
    z.object({ start: z.string(), end: z.string() }), // ATTENDANCE/CONTENT
  ]),
  description: z.string().optional(),
});

export type ChallengePayload = z.infer<typeof challengeSchema>;
