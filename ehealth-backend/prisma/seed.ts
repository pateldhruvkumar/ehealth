import "../src/config/env";
import { prisma } from "../src/config/database";
import bcrypt from "bcryptjs";

async function clearAll() {
  // Delete in FK-safe order
  await prisma.accessLog.deleteMany();
  await prisma.consultation.deleteMany();
  await prisma.sharedAccess.deleteMany();
  await prisma.document.deleteMany();
  await prisma.emergencyContact.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();
  await prisma.user.deleteMany();
}

async function main() {
  await clearAll();

  const hashedPassword = await bcrypt.hash("Password123!", 10);

  // Create users
  const patientUser = await prisma.user.create({
    data: {
      email: "patient@example.com",
      password: hashedPassword,
      role: "PATIENT",
      isVerified: true,
      isActive: true
    }
  });

  const doctorUser = await prisma.user.create({
    data: {
      email: "doctor@example.com",
      password: hashedPassword,
      role: "DOCTOR",
      isVerified: true,
      isActive: true
    }
  });

  const adminUser = await prisma.user.create({
    data: {
      email: "admin@example.com",
      password: hashedPassword,
      role: "ADMIN",
      isVerified: true,
      isActive: true
    }
  });

  // Create profiles
  const patient = await prisma.patient.create({
    data: {
      userId: patientUser.id,
      firstName: "Test",
      lastName: "Patient",
      dateOfBirth: new Date("1995-06-15"),
      gender: "MALE",
      phone: "+10000000001",
      address: "123 Main Street",
      city: "Springfield",
      state: "CA",
      country: "USA",
      postalCode: "90001",
      bloodGroup: "O+",
      allergies: ["Peanuts"],
      chronicConditions: ["Hypertension"],
      profileImage: "https://example.com/patient.png"
    }
  });

  const doctor = await prisma.doctor.create({
    data: {
      userId: doctorUser.id,
      firstName: "Test",
      lastName: "Doctor",
      phone: "+10000000002",
      specialization: "Cardiology",
      licenseNumber: "LIC-TEST-0001",
      hospitalName: "City Hospital",
      hospitalAddress: "456 Health Ave",
      city: "Springfield",
      state: "CA",
      country: "USA",
      profileImage: "https://example.com/doctor.png",
      isVerified: true
    }
  });

  // Emergency contact
  const emergencyContact = await prisma.emergencyContact.create({
    data: {
      patientId: patient.userId,
      name: "Jane Patient",
      relationship: "Spouse",
      phone: "+10000000003",
      email: "jane.patient@example.com",
      isPrimary: true
    }
  });

  // Documents (2-3)
  const doc1 = await prisma.document.create({
    data: {
      patientId: patient.userId,
      title: "Blood Report - CBC",
      description: "Complete blood count report",
      documentType: "BLOOD_REPORT",
      fileName: "cbc-report.pdf",
      fileSize: 123456,
      mimeType: "application/pdf",
      s3Key: `patients/${patient.userId}/documents/seed-cbc-report.pdf`,
      s3Url: "https://example-bucket.s3.amazonaws.com/seed-cbc-report.pdf",
      documentDate: new Date("2025-12-20"),
      tags: ["cbc", "lab"],
      isDeleted: false
    }
  });

  const doc2 = await prisma.document.create({
    data: {
      patientId: patient.userId,
      title: "Chest X-Ray",
      description: "Chest X-Ray image",
      documentType: "XRAY",
      fileName: "chest-xray.png",
      fileSize: 234567,
      mimeType: "image/png",
      s3Key: `patients/${patient.userId}/documents/seed-chest-xray.png`,
      s3Url: "https://example-bucket.s3.amazonaws.com/seed-chest-xray.png",
      documentDate: new Date("2025-11-10"),
      tags: ["xray", "chest"],
      isDeleted: false
    }
  });

  const doc3 = await prisma.document.create({
    data: {
      patientId: patient.userId,
      title: "Prescription",
      description: "Prescription from last visit",
      documentType: "PRESCRIPTION",
      fileName: "prescription.pdf",
      fileSize: 34567,
      mimeType: "application/pdf",
      s3Key: `patients/${patient.userId}/documents/seed-prescription.pdf`,
      s3Url: "https://example-bucket.s3.amazonaws.com/seed-prescription.pdf",
      documentDate: new Date("2025-12-05"),
      tags: ["prescription"],
      isDeleted: false
    }
  });

  // Shared access
  const sharedAccess = await prisma.sharedAccess.create({
    data: {
      patientId: patient.userId,
      doctorId: doctor.userId,
      status: "ACTIVE",
      accessCode: "AB12CD34",
      grantedAt: new Date(),
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // +7 days
    }
  });

  // Access log
  const accessLog = await prisma.accessLog.create({
    data: {
      sharedAccessId: sharedAccess.id,
      action: "VIEW_DOCUMENTS",
      ipAddress: "127.0.0.1",
      userAgent: "seed-script"
    }
  });

  // Consultation
  const consultation = await prisma.consultation.create({
    data: {
      doctorId: doctor.userId,
      patientId: patient.userId,
      notes: "Patient reports mild chest discomfort. Recommended further tests.",
      diagnosis: "Rule out cardiac causes",
      visitDate: new Date("2026-01-10")
    }
  });

  // Output credentials / IDs
  // eslint-disable-next-line no-console
  console.log("Seed complete.");
  // eslint-disable-next-line no-console
  console.log("Patient:", { email: patientUser.email, userId: patientUser.id });
  // eslint-disable-next-line no-console
  console.log("Doctor:", { email: doctorUser.email, userId: doctorUser.id });
  // eslint-disable-next-line no-console
  console.log("Admin:", { email: adminUser.email, userId: adminUser.id });
  // eslint-disable-next-line no-console
  console.log("Created:", {
    patientId: patient.userId,
    doctorId: doctor.userId,
    emergencyContactId: emergencyContact.id,
    documentIds: [doc1.id, doc2.id, doc3.id],
    sharedAccessId: sharedAccess.id,
    accessCode: sharedAccess.accessCode,
    accessLogId: accessLog.id,
    consultationId: consultation.id
  });
}

main()
  .catch((err) => {
    // eslint-disable-next-line no-console
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
