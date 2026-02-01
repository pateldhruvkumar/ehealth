import type { FastifyReply, FastifyRequest } from "fastify";
import { errors, success } from "../utils/response";
import * as sharingService from "../services/sharing.service";
import {
  grantAccessSchema,
  revokeAccessSchema,
  verifyAccessCodeParamsSchema
} from "../validators/sharing.validator";

function requireUser(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    errors.unauthorized(reply, "Authentication required");
    return null;
  }
  return request.user;
}

export async function grantAccess(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const data = grantAccessSchema.parse(request.body);
  const access = await sharingService.grantAccess(user.id, data);
  if (!access) return errors.notFound(reply, "Doctor not found");

  return success(reply, access, "Access granted", 201);
}

export async function revokeAccess(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const data = revokeAccessSchema.parse(request.body);
  const result = await sharingService.revokeAccess(user.id, data.doctorId);
  if (!result.revoked) return errors.notFound(reply, "Active share not found");

  return success(reply, result, "Access revoked");
}

export async function getActiveShares(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const shares = await sharingService.getActiveShares(user.id);
  return success(reply, shares, "Active shares");
}

export async function getAccessLog(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const result = await sharingService.getAccessLog(user.id, request.query as any);
  return success(reply, result, "Access log");
}

export async function verifyAccessCode(request: FastifyRequest, reply: FastifyReply) {
  const { accessCode } = verifyAccessCodeParamsSchema.parse(request.params);
  const result = await sharingService.verifyAccessCode(accessCode);
  return success(reply, result, "Access code verification");
}

