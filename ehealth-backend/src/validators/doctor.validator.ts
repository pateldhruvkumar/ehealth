import { z } from "zod";

export const updateProfileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().min(6).optional(),
  specialization: z.string().min(1).optional(),
  hospitalName: z.string().min(1).optional(),
  hospitalAddress: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  state: z.string().min(1).optional(),
  country: z.string().min(1).optional(),
  profileImage: z.string().url().optional()
});

export const createConsultationSchema = z.object({
  patientId: z.string().min(1),
  notes: z.string().min(1).optional(),
  diagnosis: z.string().min(1).optional(),
  visitDate: z.coerce.date().optional()
});

export const searchDoctorsSchema = z.object({
  query: z.string().min(1).optional(),
  specialization: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional()
});

export const patientIdParamsSchema = z.object({
  patientId: z.string().min(1)
});

export const consultationIdParamsSchema = z.object({
  id: z.string().min(1)
});

export const patientDocumentsQuerySchema = z.object({
  documentType: z
    .enum(["XRAY", "MRI", "BLOOD_REPORT", "PRESCRIPTION", "LAB_REPORT", "OTHER"])
    .optional(),
  search: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional()
});

export type UpdateDoctorProfileInput = z.infer<typeof updateProfileSchema>;
export type CreateConsultationInput = z.infer<typeof createConsultationSchema>;
export type SearchDoctorsQuery = z.infer<typeof searchDoctorsSchema>;
export type PatientDocumentsQuery = z.infer<typeof patientDocumentsQuerySchema>;

