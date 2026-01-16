import { randomUUID } from "crypto";
import { prisma } from "../config/database";
import { AWS_S3_BUCKET, AWS_REGION } from "../config/env";
import { deleteFile, generateDownloadUrl, generateUploadUrl } from "../config/s3";
import { getPagination, isExpired } from "../utils/helpers";
import type { UserRole } from "../types";
import type {
  CreateDocumentInput,
  GetUploadUrlInput,
  ListDocumentsQuery,
  UpdateDocumentInput
} from "../validators/document.validator";

function buildPublicS3Url(key: string) {
  // Public URL shape (works if bucket/object is public, or just for metadata).
  return `https://${AWS_S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${encodeURIComponent(key)}`;
}

async function doctorHasAccess(doctorId: string, patientId: string) {
  const access = await prisma.sharedAccess.findFirst({
    where: { doctorId, patientId, status: "ACTIVE" }
  });
  if (!access) return false;
  if (isExpired(access.expiresAt)) return false;
  return true;
}

export async function generateUploadUrlForPatient(patientId: string, data: GetUploadUrlInput) {
  const key = `patients/${patientId}/documents/${Date.now()}-${randomUUID()}-${data.fileName}`;
  const url = await generateUploadUrl(key, data.contentType);
  const s3Url = buildPublicS3Url(key);

  return { key, url, s3Url };
}

export async function createDocument(patientId: string, data: CreateDocumentInput) {
  return prisma.document.create({
    data: {
      patientId,
      title: data.title,
      description: data.description,
      documentType: data.documentType,
      fileName: data.fileName,
      fileSize: data.fileSize,
      mimeType: data.mimeType,
      s3Key: data.s3Key,
      s3Url: data.s3Url,
      documentDate: data.documentDate,
      tags: data.tags ?? [],
      isDeleted: false
    }
  });
}

export async function getDocuments(patientId: string, filters: ListDocumentsQuery) {
  const { page, limit, skip } = getPagination(filters);

  const where: any = { patientId, isDeleted: false };

  if (filters.documentType) where.documentType = filters.documentType;

  if (filters.startDate || filters.endDate) {
    where.uploadedAt = {};
    if (filters.startDate) where.uploadedAt.gte = filters.startDate;
    if (filters.endDate) where.uploadedAt.lte = filters.endDate;
  }

  if (filters.search) {
    where.OR = [
      { title: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { fileName: { contains: filters.search, mode: "insensitive" } }
    ];
  }

  const [total, items] = await Promise.all([
    prisma.document.count({ where }),
    prisma.document.findMany({
      where,
      orderBy: { uploadedAt: "desc" },
      skip,
      take: limit
    })
  ]);

  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

export async function getDocument(documentId: string, patientId: string) {
  return prisma.document.findFirst({
    where: { id: documentId, patientId, isDeleted: false }
  });
}

export async function updateDocument(documentId: string, patientId: string, data: UpdateDocumentInput) {
  const updated = await prisma.document.updateMany({
    where: { id: documentId, patientId, isDeleted: false },
    data: {
      ...data,
      tags: data.tags
    }
  });

  if (updated.count === 0) return null;
  return prisma.document.findFirst({ where: { id: documentId, patientId } });
}

export async function deleteDocument(documentId: string, patientId: string) {
  const doc = await prisma.document.findFirst({
    where: { id: documentId, patientId, isDeleted: false }
  });
  if (!doc) return null;

  const updated = await prisma.document.update({
    where: { id: doc.id },
    data: { isDeleted: true, deletedAt: new Date() }
  });

  // Best-effort physical delete (optional). If it fails, keep DB soft-delete.
  try {
    await deleteFile(doc.s3Key);
  } catch {
    // ignore
  }

  return updated;
}

export async function getDownloadUrl(documentId: string, userId: string, userRole: UserRole) {
  const doc = await prisma.document.findFirst({
    where: { id: documentId, isDeleted: false }
  });
  if (!doc) return null;

  if (userRole === "PATIENT") {
    if (doc.patientId !== userId) return null;
  } else if (userRole === "DOCTOR") {
    const ok = await doctorHasAccess(userId, doc.patientId);
    if (!ok) return null;
  } else if (userRole === "ADMIN") {
    // Admin can access any document.
  } else {
    return null;
  }

  const url = await generateDownloadUrl(doc.s3Key);
  return { url, document: doc };
}

