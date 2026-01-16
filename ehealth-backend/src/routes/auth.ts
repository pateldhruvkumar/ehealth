import type { FastifyInstance } from "fastify";
import * as authController from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";

export async function authRoutes(app: FastifyInstance) {
  app.post("/register/patient", authController.registerPatient);
  app.post("/register/doctor", authController.registerDoctor);

  app.get("/me", { preHandler: authenticate }, authController.getMe);
  app.delete("/me", { preHandler: authenticate }, authController.deleteMe);
}

