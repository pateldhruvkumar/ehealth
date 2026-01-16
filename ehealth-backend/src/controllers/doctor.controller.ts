import type { FastifyReply, FastifyRequest } from "fastify";
import { errors, success } from "../utils/response";
import * as doctorService from "../services/doctor.service";
import {
  consultationIdParamsSchema,
  createConsultationSchema,
  patientDocumentsQuerySchema,
  patientIdParamsSchema,
  searchDoctorsSchema,
  updateProfileSchema
} from "../validators/doctor.validator";

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

  const profile = await doctorService.getProfile(user.id);
  if (!profile) return errors.notFound(reply, "Doctor profile not found");
  return success(reply, profile, "Doctor profile");
}

export async function updateProfile(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const data = updateProfileSchema.parse(request.body);
  try {
    const updated = await doctorService.updateProfile(user.id, data);
    return success(reply, updated, "Profile updated");
  } catch (e: any) {
    if (e?.code === "P2025") return errors.notFound(reply, "Doctor profile not found");
    throw e;
  }
}

export async function getPatients(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const result = await doctorService.getPatients(user.id, request.query as any);
  return success(reply, result, "Patients");
}

export async function getPatientDetails(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const { patientId } = patientIdParamsSchema.parse(request.params);
  const result = await doctorService.getPatientDetails(user.id, patientId);
  if (!result) return errors.forbidden(reply, "No active access to this patient");

  return success(reply, result, "Patient details");
}

export async function getPatientDocuments(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const { patientId } = patientIdParamsSchema.parse(request.params);
  const query = patientDocumentsQuerySchema.parse(request.query);

  const result = await doctorService.getPatientDocuments(user.id, patientId, query);
  if (!result) return errors.forbidden(reply, "No active access to this patient");

  return success(reply, result, "Patient documents");
}

export async function createConsultation(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const data = createConsultationSchema.parse(request.body);
  const created = await doctorService.createConsultation(user.id, data);
  if (!created) return errors.forbidden(reply, "No active access to this patient");

  return success(reply, created, "Consultation created", 201);
}

export async function getConsultations(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const result = await doctorService.getConsultations(user.id, request.query as any);
  return success(reply, result, "Consultations");
}

export async function getConsultation(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const { id } = consultationIdParamsSchema.parse(request.params);
  const consultation = await doctorService.getConsultation(user.id, id);
  if (!consultation) return errors.notFound(reply, "Consultation not found");

  return success(reply, consultation, "Consultation");
}

export async function getDashboard(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const dashboard = await doctorService.getDashboard(user.id);
  return success(reply, dashboard, "Doctor dashboard");
}

export async function searchDoctors(request: FastifyRequest, reply: FastifyReply) {
  requireUser(request, reply);
  if (!request.user) return;

  const filters = searchDoctorsSchema.parse(request.query);
  const result = await doctorService.searchDoctors(filters);
  return success(reply, result, "Doctors");
}

