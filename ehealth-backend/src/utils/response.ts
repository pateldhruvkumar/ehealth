import type { FastifyReply } from "fastify";
import type { ApiResponse } from "../types";

export function success<T>(
  reply: FastifyReply,
  data: T,
  message = "Success",
  code = 200
) {
  const payload: ApiResponse<T> = {
    success: true,
    message,
    data
  };

  return reply.code(code).send(payload);
}

export function error(
  reply: FastifyReply,
  code: string,
  message: string,
  status = 400
) {
  const payload: ApiResponse = {
    success: false,
    message,
    error: { code }
  };

  return reply.code(status).send(payload);
}

export const errors = {
  badRequest: (reply: FastifyReply, message = "Bad request", code = "BAD_REQUEST") =>
    error(reply, code, message, 400),
  unauthorized: (reply: FastifyReply, message = "Unauthorized", code = "UNAUTHORIZED") =>
    error(reply, code, message, 401),
  forbidden: (reply: FastifyReply, message = "Forbidden", code = "FORBIDDEN") =>
    error(reply, code, message, 403),
  notFound: (reply: FastifyReply, message = "Not found", code = "NOT_FOUND") =>
    error(reply, code, message, 404),
  conflict: (reply: FastifyReply, message = "Conflict", code = "CONFLICT") =>
    error(reply, code, message, 409),
  internal: (reply: FastifyReply, message = "Internal server error", code = "INTERNAL_ERROR") =>
    error(reply, code, message, 500)
};

