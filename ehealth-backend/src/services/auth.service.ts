import { prisma } from "../config/database";
import type { RegisterDoctorInput, RegisterPatientInput } from "../validators/auth.validator";

export async function registerPatient(data: RegisterPatientInput) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        role: "PATIENT",
        isVerified: false,
        isActive: true
      }
    });

    const patient = await tx.patient.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender,
        phone: data.phone,
        allergies: [],
        chronicConditions: []
      }
    });

    return { user, patient };
  });
}

export async function registerDoctor(data: RegisterDoctorInput) {
  return prisma.$transaction(async (tx) => {
    const user = await tx.user.create({
      data: {
        clerkId: data.clerkId,
        email: data.email,
        role: "DOCTOR",
        isVerified: false,
        isActive: true
      }
    });

    const doctor = await tx.doctor.create({
      data: {
        userId: user.id,
        firstName: data.firstName,
        lastName: data.lastName,
        phone: data.phone,
        specialization: data.specialization,
        licenseNumber: data.licenseNumber,
        hospitalName: data.hospitalName
      }
    });

    return { user, doctor };
  });
}

export async function getCurrentUser(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: { patient: true, doctor: true }
  });
}

export async function deleteUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: false }
  });
}

