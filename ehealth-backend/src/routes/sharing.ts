import type { FastifyInstance } from "fastify";
import * as sharingController from "../controllers/sharing.controller";
import { authenticate, requirePatient } from "../middleware/auth";

export async function sharingRoutes(app: FastifyInstance) {
  const patientOnly = { preHandler: [authenticate, requirePatient] };

  app.post("/grant", patientOnly, sharingController.grantAccess);
  app.post("/revoke", patientOnly, sharingController.revokeAccess);
  app.get("/active", patientOnly, sharingController.getActiveShares);
  app.get("/access-log", patientOnly, sharingController.getAccessLog);

  // Public verification endpoint
  app.get("/verify/:accessCode", sharingController.verifyAccessCode);
}

