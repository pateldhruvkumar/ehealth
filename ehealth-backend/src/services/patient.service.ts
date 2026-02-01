import { prisma } from "../config/database";
import type {
  CreateEmergencyContactInput,
  UpdateMedicalInfoInput,
  UpdateProfileInput,
  UpdateEmergencyContactInput,
} from "../validators/patient.validator";

export async function getProfile(userId: string) {
  const patient = await prisma.patient.findUnique({
    where: { userId },
    include: { user: true, emergencyContacts: true },
  });
  
  // Convert Dates to strings to avoid serialization issues
  if (patient) {
    return {
      ...patient,
      dateOfBirth: patient.dateOfBirth.toISOString(),
      user: {
        ...patient.user,
        // Ensure user fields are safe too if needed
      }
    };
  }
  return patient;
}

export async function updateProfile(userId: string, data: UpdateProfileInput) {
  return prisma.patient.update({
    where: { userId },
    data,
  });
}

export async function getMedicalInfo(userId: string) {
  return prisma.patient.findUnique({
    where: { userId },
    select: { bloodGroup: true, allergies: true, chronicConditions: true },
  });
}

export async function updateMedicalInfo(
  userId: string,
  data: UpdateMedicalInfoInput
) {
  return prisma.patient.update({
    where: { userId },
    data,
  });
}

export async function getEmergencyContacts(patientId: string) {
  return prisma.emergencyContact.findMany({
    where: { patientId },
    orderBy: [{ isPrimary: "desc" }, { name: "asc" }],
  });
}

export async function createEmergencyContact(
  patientId: string,
  data: CreateEmergencyContactInput
) {
  return prisma.$transaction(async tx => {
    if (data.isPrimary) {
      await tx.emergencyContact.updateMany({
        where: { patientId },
        data: { isPrimary: false },
      });
    }

    return tx.emergencyContact.create({
      data: {
        patientId,
        name: data.name,
        relationship: data.relationship,
        phone: data.phone,
        email: data.email,
        isPrimary: data.isPrimary ?? false,
      },
    });
  });
}

export async function updateEmergencyContact(
  contactId: string,
  patientId: string,
  data: UpdateEmergencyContactInput
) {
  return prisma.$transaction(async tx => {
    const existing = await tx.emergencyContact.findFirst({
      where: { id: contactId, patientId },
    });
    if (!existing) return null;

    if (data.isPrimary) {
      await tx.emergencyContact.updateMany({
        where: { patientId },
        data: { isPrimary: false },
      });
    }

    return tx.emergencyContact.update({
      where: { id: contactId },
      data,
    });
  });
}

export async function deleteEmergencyContact(
  contactId: string,
  patientId: string
) {
  const res = await prisma.emergencyContact.deleteMany({
    where: { id: contactId, patientId },
  });
  return { deleted: res.count > 0 };
}

export async function getDashboard(patientId: string) {
  const [documentCount, recentUploads, activeShares] = await Promise.all([
    prisma.document.count({
      where: { patientId, isDeleted: false },
    }),
    prisma.document.findMany({
      where: { patientId, isDeleted: false },
      orderBy: { uploadedAt: "desc" },
      take: 5,
    }),
    prisma.sharedAccess.count({
      where: { patientId, status: "ACTIVE" },
    }),
  ]);

  return {
    documentCount,
    activeShares,
    recentUploads,
  };
}
