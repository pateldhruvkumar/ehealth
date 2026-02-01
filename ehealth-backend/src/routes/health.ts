import type { FastifyInstance } from "fastify";
import { prisma } from "../config/database";
import { success } from "../utils/response";

export async function healthRoutes(app: FastifyInstance) {
  app.get("/", async (_request, reply) => {
    return success(reply, { name: "ehealth-backend", status: "ok" }, "API info");
  });

  app.get("/health", async (_request, reply) => {
    let db = "down";
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const _result = await prisma.$queryRaw`SELECT 1`;
      db = "up";
    } catch {
      db = "down";
    }

    const overall = db === "up" ? "ok" : "degraded";
    return success(reply, { status: overall, db }, "Health check");
  });
}

