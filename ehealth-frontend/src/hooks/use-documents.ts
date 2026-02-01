import { documentService } from "@/services/document.service";
import { CreateDocumentInput, DocumentFilters } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export function useDocuments(filters: DocumentFilters) {
  return useQuery({
    queryKey: ["documents", filters],
    queryFn: async () => {
      const response = await documentService.getDocuments(filters);
      return response.data;
    },
  });
}

export function useDocument(id: string) {
  return useQuery({
    queryKey: ["document", id],
    queryFn: async () => {
      const response = await documentService.getDocument(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateDocumentInput) =>
      documentService.createDocument(data),
    onSuccess: () => {
      toast.success("Document created");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["patient-dashboard"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create document");
    },
  });
}

export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => documentService.deleteDocument(id),
    onSuccess: () => {
      toast.success("Document deleted");
      queryClient.invalidateQueries({ queryKey: ["documents"] });
      queryClient.invalidateQueries({ queryKey: ["patient-dashboard"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to delete document");
    },
  });
}

export function useUploadUrl() {
  return useMutation({
    mutationFn: (data: {
      fileName: string;
      contentType: string;
      documentType: string;
    }) => documentService.getUploadUrl(data),
    onError: (error: any) => {
      toast.error(error.message || "Failed to get upload URL");
    },
  });
}

export function useDownloadUrl(id: string) {
  return useQuery({
    queryKey: ["download-url", id],
    queryFn: async () => {
      const response = await documentService.getDownloadUrl(id);
      return response.data;
    },
    enabled: !!id,
    staleTime: 15 * 60 * 1000, // 15 mins (URLs expire in 60 mins)
  });
}
