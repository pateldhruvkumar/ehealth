export type UserRole = "PATIENT" | "DOCTOR" | "ADMIN";
export type Gender = "MALE" | "FEMALE" | "OTHER";
export type DocumentType =
  | "XRAY"
  | "MRI"
  | "CT_SCAN"
  | "BLOOD_REPORT"
  | "URINE_REPORT"
  | "PRESCRIPTION"
  | "DISCHARGE_SUMMARY"
  | "VACCINATION_RECORD"
  | "LAB_REPORT"
  | "OTHER";

export type AccessStatus = "ACTIVE" | "EXPIRED" | "REVOKED";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  error?: unknown;
}

export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface User {
  id: string;
  email: string;
  role: UserRole;
  isVerified: boolean;
  isActive: boolean;
}

export interface UserWithProfile extends User {
  patient?: Patient;
  doctor?: Doctor;
}

export interface Patient {
  userId: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string; // ISO date string
  gender: Gender;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  bloodGroup?: string;
  allergies: string[];
  chronicConditions: string[];
  profileImage?: string;
  user?: User;
}

export interface Doctor {
  userId: string;
  firstName: string;
  lastName: string;
  phone?: string;
  specialization: string;
  licenseNumber: string;
  hospitalName?: string;
  hospitalAddress?: string;
  city?: string;
  state?: string;
  country?: string;
  profileImage?: string;
  isVerified: boolean;
  user?: User;
}

export interface EmergencyContact {
  id: string;
  patientId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary: boolean;
}

export interface Document {
  id: string;
  patientId: string;
  title: string;
  description?: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  s3Url: string;
  uploadedAt: string;
  documentDate?: string;
  tags: string[];
  isDeleted: boolean;
}

export interface SharedAccess {
  id: string;
  patientId: string;
  doctorId: string;
  status: AccessStatus;
  accessCode: string;
  grantedAt: string;
  expiresAt?: string;
  revokedAt?: string;
  patient?: Patient;
  doctor?: Doctor;
}

export interface AccessLog {
  id: string;
  sharedAccessId: string;
  action: string;
  ipAddress?: string;
  userAgent?: string;
  accessedAt: string;
  sharedAccess?: SharedAccess;
}

export interface Consultation {
  id: string;
  doctorId: string;
  patientId: string;
  notes?: string;
  diagnosis?: string;
  visitDate: string;
  doctor?: Doctor;
  patient?: Patient;
}

export interface PatientDashboardStats {
  documentCount: number;
  activeShares: number;
  recentUploads: Document[];
}

export interface DoctorDashboardStats {
  activePatients: number;
  consultations: number;
  recentConsultations: Consultation[];
}

// Form Inputs
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterPatientInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  phone?: string;
}

export interface RegisterDoctorInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  specialization: string;
  licenseNumber: string;
  phone?: string;
  hospitalName?: string;
}

export interface UpdatePatientProfileInput {
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  profileImage?: string;
}

export interface UpdateMedicalInfoInput {
  bloodGroup?: string;
  allergies?: string[];
  chronicConditions?: string[];
}

export interface CreateEmergencyContactInput {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  isPrimary?: boolean;
}

export interface CreateDocumentInput {
  title: string;
  description?: string;
  documentType: DocumentType;
  fileName: string;
  fileSize: number;
  mimeType: string;
  s3Key: string;
  s3Url: string;
  documentDate?: Date;
  tags?: string[];
}

export interface GrantAccessInput {
  doctorId: string;
  expiresAt?: Date;
}

export interface CreateConsultationInput {
  patientId: string;
  notes?: string;
  diagnosis?: string;
  visitDate?: Date;
}

export interface DocumentFilters {
  documentType?: DocumentType;
  startDate?: Date;
  endDate?: Date;
  search?: string;
  page?: number;
  limit?: number;
}

export interface DoctorSearchFilters {
  query?: string;
  specialization?: string;
  city?: string;
  page?: number;
  limit?: number;
}
