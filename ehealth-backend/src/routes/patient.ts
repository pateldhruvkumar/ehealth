import type { FastifyInstance } from "fastify";
import * as patientController from "../controllers/patient.controller";
import { authenticate, requirePatient } from "../middleware/auth";

export async function patientRoutes(app: FastifyInstance) {
  const patientOnly = { preHandler: [authenticate, requirePatient] };

  app.get("/profile", patientOnly, patientController.getProfile);
  app.put("/profile", patientOnly, patientController.updateProfile);

  app.get("/medical-info", patientOnly, patientController.getMedicalInfo);
  app.put("/medical-info", patientOnly, patientController.updateMedicalInfo);

  app.get("/emergency-contacts", patientOnly, patientController.listEmergencyContacts);
  app.post("/emergency-contacts", patientOnly, patientController.createEmergencyContact);
  app.put("/emergency-contacts/:id", patientOnly, patientController.updateEmergencyContact);
  app.delete("/emergency-contacts/:id", patientOnly, patientController.deleteEmergencyContact);

  app.get("/dashboard", patientOnly, patientController.getDashboard);
}

