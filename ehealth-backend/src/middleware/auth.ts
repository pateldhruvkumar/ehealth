import type { FastifyReply, FastifyRequest } from "fastify";
import { getAuth } from "@clerk/fastify";
import { prisma } from "../config/database";
import { errors } from "../utils/response";
import type { AuthUser, UserRole } from "../types";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const auth = getAuth(request, { acceptsToken: "session_token" });

  if (!auth.isAuthenticated || !auth.userId) {
    return errors.unauthorized(reply, "Authentication required");
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: auth.userId }
  });

  if (!dbUser || !dbUser.isActive) {
    return errors.unauthorized(reply, "User not found or inactive");
  }

  const user: AuthUser = {
    id: dbUser.id,
    clerkId: dbUser.clerkId,
    email: dbUser.email,
    role: dbUser.role as unknown as UserRole
  };

  request.user = user;
}

export function authorize(...roles: UserRole[]) {
  return async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.user) return errors.unauthorized(reply, "Authentication required");
    if (!roles.includes(request.user.role)) return errors.forbidden(reply, "Insufficient permissions");
  };
}

export const requirePatient = authorize("PATIENT", "ADMIN");
export const requireDoctor = authorize("DOCTOR", "ADMIN");
export const requireAdmin = authorize("ADMIN");

