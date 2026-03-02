import { prisma } from "../config/database";
import type { RegisterDoctorInput, RegisterPatientInput, LoginInput } from "../validators/auth.validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export async function login(data: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  if (!user || !user.isActive) {
    throw new Error("Invalid credentials");
  }

  const isValid = await bcrypt.compare(data.password, user.password);
  if (!isValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user };
}

export async function registerPatient(data: RegisterPatientInput) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: "PATIENT",
      isVerified: false,
      isActive: true,
      patient: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          dateOfBirth: data.dateOfBirth,
          gender: data.gender,
          phone: data.phone,
          allergies: [],
          chronicConditions: []
        }
      }
    },
    include: { patient: true }
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user, patient: user.patient };
}

export async function registerDoctor(data: RegisterDoctorInput) {
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      role: "DOCTOR",
      isVerified: false,
      isActive: true,
      doctor: {
        create: {
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          specialization: data.specialization,
          licenseNumber: data.licenseNumber,
          hospitalName: data.hospitalName
        }
      }
    },
    include: { doctor: true }
  });

  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

  return { token, user, doctor: user.doctor };
}

export async function getCurrentUser(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { patient: true, doctor: true }
  });

  if (user) {
    // Exclude password
    const { password, ...rest } = user;
    return rest;
  }
  return null;
}

export async function deleteUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: { isActive: false }
  });
}
