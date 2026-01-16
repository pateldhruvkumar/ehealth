import type { FastifyError, FastifyReply, FastifyRequest } from "fastify";
import { ZodError } from "zod";
import { error as sendError } from "../utils/response";

export function errorHandler(
  err: FastifyError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  request.log.error({ err }, "Request failed");

  if (err instanceof ZodError) {
    return sendError(reply, "VALIDATION_ERROR", err.message, 400);
  }

  const anyErr = err as FastifyError & { status?: number };
  const status = anyErr.statusCode ?? anyErr.status ?? 500;
  const message = status >= 500 ? "Internal server error" : anyErr.message;

  const code =
    status === 400
      ? "BAD_REQUEST"
      : status === 401
        ? "UNAUTHORIZED"
        : status === 403
          ? "FORBIDDEN"
          : status === 404
            ? "NOT_FOUND"
            : status === 409
              ? "CONFLICT"
              : status >= 500
                ? "INTERNAL_ERROR"
                : "ERROR";

  return sendError(reply, code, message, status);
}

