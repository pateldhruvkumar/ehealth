import type { FastifyInstance } from "fastify";
import * as doctorController from "../controllers/doctor.controller";
import { authenticate, requireDoctor } from "../middleware/auth";

export async function doctorRoutes(app: FastifyInstance) {
  const doctorOnly = { preHandler: [authenticate, requireDoctor] };
  const anyAuth = { preHandler: [authenticate] };

  app.get("/profile", doctorOnly, doctorController.getProfile);
  app.put("/profile", doctorOnly, doctorController.updateProfile);

  app.get("/patients", doctorOnly, doctorController.getPatients);
  app.get("/patients/:patientId", doctorOnly, doctorController.getPatientDetails);
  app.get("/patients/:patientId/documents", doctorOnly, doctorController.getPatientDocuments);

  app.post("/consultations", doctorOnly, doctorController.createConsultation);
  app.get("/consultations", doctorOnly, doctorController.getConsultations);
  app.get("/consultations/:id", doctorOnly, doctorController.getConsultation);

  app.get("/dashboard", doctorOnly, doctorController.getDashboard);

  // Any authenticated user can search doctors.
  app.get("/search", anyAuth, doctorController.searchDoctors);
}

