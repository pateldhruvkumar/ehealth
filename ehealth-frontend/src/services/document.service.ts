import { apiClient } from "@/lib/api-client";
import {
  ApiResponse,
  CreateDocumentInput,
  Document,
  DocumentFilters,
  PaginatedResponse,
} from "@/types";

export const documentService = {
  getDocuments: async (filters: DocumentFilters) => {
    const params = new URLSearchParams();
    if (filters.documentType) params.append("documentType", filters.documentType);
    if (filters.search) params.append("search", filters.search);
    if (filters.startDate)
      params.append("startDate", filters.startDate.toISOString());
    if (filters.endDate)
      params.append("endDate", filters.endDate.toISOString());
    if (filters.page) params.append("page", filters.page.toString());
    if (filters.limit) params.append("limit", filters.limit.toString());

    return apiClient.get<any, ApiResponse<PaginatedResponse<Document>>>(
      `/documents?${params.toString()}`
    );
  },

  getDocument: async (id: string) => {
    return apiClient.get<any, ApiResponse<Document>>(`/documents/${id}`);
  },

  getUploadUrl: async (data: {
    fileName: string;
    contentType: string;
    documentType: string;
  }) => {
    return apiClient.post<
      any,
      ApiResponse<{ key: string; url: string; s3Url: string }>
    >("/documents/upload-url", data);
  },

  createDocument: async (data: CreateDocumentInput) => {
    return apiClient.post<any, ApiResponse<Document>>("/documents", data);
  },

  updateDocument: async (id: string, data: Partial<CreateDocumentInput>) => {
    return apiClient.put<any, ApiResponse<Document>>(`/documents/${id}`, data);
  },

  deleteDocument: async (id: string) => {
    return apiClient.delete<any, ApiResponse<{ deleted: boolean }>>(
      `/documents/${id}`
    );
  },

  getDownloadUrl: async (id: string) => {
    return apiClient.get<any, ApiResponse<{ url: string; document: Document }>>(
      `/documents/${id}/download-url`
    );
  },
};
