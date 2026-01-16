import type { FastifyReply, FastifyRequest } from "fastify";
import { errors, success } from "../utils/response";
import {
  registerDoctorSchema,
  registerPatientSchema
} from "../validators/auth.validator";
import * as authService from "../services/auth.service";

export async function registerPatient(request: FastifyRequest, reply: FastifyReply) {
  const parsed = registerPatientSchema.parse(request.body);

  try {
    const result = await authService.registerPatient(parsed);
    return success(reply, result, "Patient registered", 201);
  } catch (e: any) {
    if (e?.code === "P2002") return errors.conflict(reply, "User already exists");
    throw e;
  }
}

export async function registerDoctor(request: FastifyRequest, reply: FastifyReply) {
  const parsed = registerDoctorSchema.parse(request.body);

  try {
    const result = await authService.registerDoctor(parsed);
    return success(reply, result, "Doctor registered", 201);
  } catch (e: any) {
    if (e?.code === "P2002") return errors.conflict(reply, "User already exists");
    throw e;
  }
}

export async function getMe(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) return errors.unauthorized(reply, "Authentication required");

  const user = await authService.getCurrentUser(request.user.id);
  if (!user) return errors.notFound(reply, "User not found");

  return success(reply, user, "Current user");
}

export async function deleteMe(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) return errors.unauthorized(reply, "Authentication required");

  await authService.deleteUser(request.user.id);
  return success(reply, { deleted: true }, "Account deactivated");
}

