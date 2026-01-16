import { z } from "zod";

export const registerPatientSchema = z.object({
  clerkId: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  dateOfBirth: z.coerce.date(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]),
  phone: z.string().min(6).optional()
});

export const registerDoctorSchema = z.object({
  clerkId: z.string().min(1),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  specialization: z.string().min(1),
  licenseNumber: z.string().min(1),
  phone: z.string().min(6).optional(),
  hospitalName: z.string().min(1).optional()
});

export type RegisterPatientInput = z.infer<typeof registerPatientSchema>;
export type RegisterDoctorInput = z.infer<typeof registerDoctorSchema>;

