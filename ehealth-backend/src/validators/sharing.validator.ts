import { z } from "zod";

export const grantAccessSchema = z.object({
  doctorId: z.string().min(1),
  expiresAt: z.coerce.date().optional()
});

export const revokeAccessSchema = z.object({
  doctorId: z.string().min(1)
});

export const verifyAccessCodeParamsSchema = z.object({
  accessCode: z.string().min(1)
});

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional()
});

export type GrantAccessInput = z.infer<typeof grantAccessSchema>;
export type RevokeAccessInput = z.infer<typeof revokeAccessSchema>;

