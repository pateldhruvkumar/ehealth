import type { FastifyReply, FastifyRequest } from "fastify";
import { errors, success } from "../utils/response";
import * as documentService from "../services/document.service";
import {
  createDocumentSchema,
  documentIdParamsSchema,
  getUploadUrlSchema,
  listDocumentsSchema,
  updateDocumentSchema
} from "../validators/document.validator";

function requireUser(request: FastifyRequest, reply: FastifyReply) {
  if (!request.user) {
    errors.unauthorized(reply, "Authentication required");
    return null;
  }
  return request.user;
}

export async function getUploadUrl(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const body = getUploadUrlSchema.parse(request.body);
  const result = await documentService.generateUploadUrlForPatient(user.id, body);
  return success(reply, result, "Upload URL generated");
}

export async function createDocument(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const body = createDocumentSchema.parse(request.body);
  const created = await documentService.createDocument(user.id, body);
  return success(reply, created, "Document created", 201);
}

export async function listDocuments(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const query = listDocumentsSchema.parse(request.query);
  const result = await documentService.getDocuments(user.id, query);
  return success(reply, result, "Documents");
}

export async function getDocument(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const { id } = documentIdParamsSchema.parse(request.params);
  const doc = await documentService.getDocument(id, user.id);
  if (!doc) return errors.notFound(reply, "Document not found");

  return success(reply, doc, "Document");
}

export async function updateDocument(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const { id } = documentIdParamsSchema.parse(request.params);
  const body = updateDocumentSchema.parse(request.body);

  const updated = await documentService.updateDocument(id, user.id, body);
  if (!updated) return errors.notFound(reply, "Document not found");

  return success(reply, updated, "Document updated");
}

export async function deleteDocument(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const { id } = documentIdParamsSchema.parse(request.params);
  const deleted = await documentService.deleteDocument(id, user.id);
  if (!deleted) return errors.notFound(reply, "Document not found");

  return success(reply, deleted, "Document deleted");
}

export async function getDownloadUrl(request: FastifyRequest, reply: FastifyReply) {
  const user = requireUser(request, reply);
  if (!user) return;

  const { id } = documentIdParamsSchema.parse(request.params);
  const result = await documentService.getDownloadUrl(id, user.id, user.role);
  if (!result) return errors.forbidden(reply, "No access to this document");

  return success(reply, result, "Download URL generated");
}

