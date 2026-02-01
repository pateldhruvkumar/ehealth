import type { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken";
import { prisma } from "../config/database";
import { JWT_SECRET } from "../config/env";
import { errors } from "../utils/response";
import type { AuthUser, UserRole } from "../types";

export async function authenticate(request: FastifyRequest, reply: FastifyReply) {
  const authHeader = request.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return errors.unauthorized(reply, "Authentication required");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    const dbUser = await prisma.user.findUnique({
      where: { id: decoded.id }
    });

    if (!dbUser || !dbUser.isActive) {
      return errors.unauthorized(reply, "User not found or inactive");
    }

    const user: AuthUser = {
      id: dbUser.id,
      email: dbUser.email,
      role: dbUser.role as unknown as UserRole
    };

    request.user = user;
  } catch (err) {
    return errors.unauthorized(reply, "Invalid or expired token");
  }
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
