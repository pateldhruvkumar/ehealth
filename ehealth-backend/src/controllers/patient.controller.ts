import type { FastifyReply, FastifyRequest } from "fastify";
import { errors, success } from "../utils/response";
import * as patientService from "../services/patient.service";
import {
  createEmergencyContactSchema,
  emergencyContactIdParamsSchema,
  updateEmergencyContactSchema,
  updateMedicalInfoSchema,
  updateProfileSchema
} from "../validators/patient.validator";

function requireUser(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    errors.unauthorized(reply, "Authentication required");
    return null;
  }
  return request.user;
}

export async function getProfile(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const profile = await patientService.getProfile(user.id);
  if (!profile) return errors.notFound(reply, "Patient profile not found");

  return success(reply, profile, "Patient profile");
}

export async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const data = updateProfileSchema.parse(request.body);

  try {
    const updated = await patientService.updateProfile(user.id, data);
    return success(reply, updated, "Profile updated");
  } catch (e: any) {
    if (e?.code === "P2025") return errors.notFound(reply, "Patient profile not found");
    throw e;
  }
}

export async function getMedicalInfo(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const info = await patientService.getMedicalInfo(user.id);
  if (!info) return errors.notFound(reply, "Patient profile not found");

  return success(reply, info, "Medical info");
}

export async function updateMedicalInfo(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const data = updateMedicalInfoSchema.parse(request.body);

  try {
    const updated = await patientService.updateMedicalInfo(user.id, data);
    return success(reply, updated, "Medical info updated");
  } catch (e: any) {
    if (e?.code === "P2025") return errors.notFound(reply, "Patient profile not found");
    throw e;
  }
}

export async function listEmergencyContacts(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const contacts = await patientService.getEmergencyContacts(user.id);
  return success(reply, contacts, "Emergency contacts");
}

export async function createEmergencyContact(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const data = createEmergencyContactSchema.parse(request.body);
  const created = await patientService.createEmergencyContact(user.id, data);
  return success(reply, created, "Emergency contact created", 201);
}

export async function updateEmergencyContact(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const { id } = emergencyContactIdParamsSchema.parse(request.params);
  const data = updateEmergencyContactSchema.parse(request.body);

  const updated = await patientService.updateEmergencyContact(id, user.id, data);
  if (!updated) return errors.notFound(reply, "Emergency contact not found");

  return success(reply, updated, "Emergency contact updated");
}

export async function deleteEmergencyContact(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const { id } = emergencyContactIdParamsSchema.parse(request.params);
  const result = await patientService.deleteEmergencyContact(id, user.id);
  if (!result.deleted) return errors.notFound(reply, "Emergency contact not found");

  return success(reply, result, "Emergency contact deleted");
}

export async function getDashboard(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const dashboard = await patientService.getDashboard(user.id);
  return success(reply, dashboard, "Patient dashboard");
}

