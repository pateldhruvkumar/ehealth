import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(6).optional(),
  address: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
  profileImage: z.string().url().optional()
});

export const updateMedicalInfoSchema = z.object({
  bloodGroup: z.string().min(1).optional(),
  allergies: z.array(z.string().min(1)).optional(),
  chronicConditions: z.array(z.string().min(1)).optional()
});

export const createEmergencyContactSchema = z.object({
  name: z.string().min(1),
  relationship: z.string().min(1),
  phone: z.string().min(6),
  email: z.union([z.string().email(), z.literal("")]).optional().transform(val => val === "" ? undefined : val),
  isPrimary: z.boolean().optional()
});

export const updateEmergencyContactSchema = z.object({
  name: z.string().min(1).optional(),
  relationship: z.string().min(1).optional(),
  phone: z.string().min(6).optional(),
  email: z.union([z.string().email(), z.literal("")]).optional().transform(val => val === "" ? undefined : val),
  isPrimary: z.boolean().optional()
});

export const emergencyContactIdParamsSchema = z.object({
  id: z.string().min(1)
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type UpdateMedicalInfoInput = z.infer<typeof updateMedicalInfoSchema>;
export type CreateEmergencyContactInput = z.infer<typeof createEmergencyContactSchema>;
export type UpdateEmergencyContactInput = z.infer<typeof updateEmergencyContactSchema>;

