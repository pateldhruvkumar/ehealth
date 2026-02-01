import { z } from "zod";

const documentTypeEnum = z.enum([
  "XRAY",
  "MRI",
  "BLOOD_REPORT",
  "PRESCRIPTION",
  "LAB_REPORT",
  "OTHER"
]);

export const getUploadUrlSchema = z.object({
  fileName: z.string().min(1),
  contentType: z.string().min(1),
  documentType: documentTypeEnum
});

export const createDocumentSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1).optional(),
  documentType: documentTypeEnum,
  fileName: z.string().min(1),
  fileSize: z.coerce.number().int().nonnegative(),
  mimeType: z.string().min(1),
  s3Key: z.string().min(1),
  s3Url: z.string().min(1),
  documentDate: z.coerce.date().optional(),
  tags: z.array(z.string().min(1)).optional()
});

export const updateDocumentSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  documentType: documentTypeEnum.optional(),
  documentDate: z.coerce.date().optional(),
  tags: z.array(z.string().min(1)).optional()
});

export const listDocumentsSchema = z.object({
  documentType: documentTypeEnum.optional(),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
  search: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional()
});

export const documentIdParamsSchema = z.object({
  id: z.string().min(1)
});

export type GetUploadUrlInput = z.infer<typeof getUploadUrlSchema>;
export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type ListDocumentsQuery = z.infer<typeof listDocumentsSchema>;

