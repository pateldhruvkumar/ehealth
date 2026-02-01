import type { FastifyInstance } from "fastify";
import * as documentController from "../controllers/document.controller";
import { authenticate, requirePatient } from "../middleware/auth";

export async function documentRoutes(app: FastifyInstance) {
  const anyAuth = { preHandler: [authenticate] };
  const patientOnly = { preHandler: [authenticate, requirePatient] };

  // Patient only
  app.get("/", patientOnly, documentController.listDocuments);
  app.get("/:id", patientOnly, documentController.getDocument);
  app.post("/upload-url", patientOnly, documentController.getUploadUrl);
  app.post("/", patientOnly, documentController.createDocument);
  app.put("/:id", patientOnly, documentController.updateDocument);
  app.delete("/:id", patientOnly, documentController.deleteDocument);

  // Patient or Doctor (any authenticated); service checks access.
  app.get("/:id/download-url", anyAuth, documentController.getDownloadUrl);
}

