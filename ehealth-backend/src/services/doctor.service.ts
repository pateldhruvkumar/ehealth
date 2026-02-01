import { prisma } from "../config/database";
import { getPagination, isExpired } from "../utils/helpers";
import type {
  CreateConsultationInput,
  PatientDocumentsQuery,
  SearchDoctorsQuery,
  UpdateDoctorProfileInput
} from "../validators/doctor.validator";

async function assertActiveAccess(doctorId: string, patientId: string) {
  const access = await prisma.sharedAccess.findFirst({
    where: {
      doctorId,
      patientId,
      status: "ACTIVE"
    }
  });

  if (!access) return null;
  if (isExpired(access.expiresAt)) return null;
  return access;
}

export async function getProfile(userId: string) {
  return prisma.doctor.findUnique({
    where: { userId },
    include: { user: true }
  });
}

export async function updateProfile(userId: string, data: UpdateDoctorProfileInput) {
  return prisma.doctor.update({
    where: { userId },
    data
  });
}

export async function getPatients(
  doctorId: string,
  query: { page?: unknown; limit?: unknown }
) {
  const { page, limit, skip } = getPagination(query);
  const now = new Date();

  const where = {
    doctorId,
    status: "ACTIVE" as const,
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
  };

  const [total, shares] = await Promise.all([
    prisma.sharedAccess.count({ where }),
    prisma.sharedAccess.findMany({
      where,
      orderBy: { grantedAt: "desc" },
      skip,
      take: limit,
      include: {
        patient: { include: { user: true } }
      }
    })
  ]);

  const items = shares.map((s) => ({
    sharedAccessId: s.id,
    status: s.status,
    grantedAt: s.grantedAt,
    expiresAt: s.expiresAt,
    patient: s.patient
  }));

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getPatientDetails(doctorId: string, patientId: string) {
  const access = await assertActiveAccess(doctorId, patientId);
  if (!access) return null;

  const patient = await prisma.patient.findUnique({
    where: { userId: patientId },
    include: {
      user: true,
      emergencyContacts: true
    }
  });

  if (!patient) return null;
  return { access, patient };
}

export async function getPatientDocuments(
  doctorId: string,
  patientId: string,
  query: PatientDocumentsQuery
) {
  const access = await assertActiveAccess(doctorId, patientId);
  if (!access) return null;

  const { page, limit, skip } = getPagination(query);

  const where: any = {
    patientId,
    isDeleted: false
  };

  if (query.documentType) where.documentType = query.documentType;
  if (query.search) {
    where.OR = [
      { title: { contains: query.search, mode: "insensitive" } },
      { description: { contains: query.search, mode: "insensitive" } }
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

  return {
    access,
    result: {
      items,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}

export async function createConsultation(doctorId: string, data: CreateConsultationInput) {
  const access = await assertActiveAccess(doctorId, data.patientId);
  if (!access) return null;

  return prisma.consultation.create({
    data: {
      doctorId,
      patientId: data.patientId,
      notes: data.notes,
      diagnosis: data.diagnosis,
      visitDate: data.visitDate ?? new Date()
    }
  });
}

export async function getConsultations(
  doctorId: string,
  query: { page?: unknown; limit?: unknown }
) {
  const { page, limit, skip } = getPagination(query);

  const where = { doctorId };
  const [total, items] = await Promise.all([
    prisma.consultation.count({ where }),
    prisma.consultation.findMany({
      where,
      orderBy: { visitDate: "desc" },
      skip,
      take: limit,
      include: {
        patient: { include: { user: true } }
      }
    })
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

export async function getConsultation(doctorId: string, consultationId: string) {
  return prisma.consultation.findFirst({
    where: { id: consultationId, doctorId },
    include: {
      patient: { include: { user: true } }
    }
  });
}

export async function getDashboard(doctorId: string) {
  const now = new Date();
  const whereActive = {
    doctorId,
    status: "ACTIVE" as const,
    OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
  };

  const [activePatients, consultations, recentConsultations] = await Promise.all([
    prisma.sharedAccess.count({ where: whereActive }),
    prisma.consultation.count({ where: { doctorId } }),
    prisma.consultation.findMany({
      where: { doctorId },
      orderBy: { visitDate: "desc" },
      take: 5,
      include: { patient: true }
    })
  ]);

  return { activePatients, consultations, recentConsultations };
}

export async function searchDoctors(filters: SearchDoctorsQuery) {
  const { page, limit, skip } = getPagination(filters);

  const where: any = {};
  if (filters.specialization) where.specialization = { contains: filters.specialization, mode: "insensitive" };
  if (filters.city) where.city = { contains: filters.city, mode: "insensitive" };
  if (filters.query) {
    where.OR = [
      { firstName: { contains: filters.query, mode: "insensitive" } },
      { lastName: { contains: filters.query, mode: "insensitive" } },
      { hospitalName: { contains: filters.query, mode: "insensitive" } }
    ];
  }

  const [total, items] = await Promise.all([
    prisma.doctor.count({ where }),
    prisma.doctor.findMany({
      where,
      orderBy: [{ isVerified: "desc" }, { lastName: "asc" }],
      skip,
      take: limit,
      include: { user: true }
    })
  ]);

  return {
    items,
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit)
  };
}

