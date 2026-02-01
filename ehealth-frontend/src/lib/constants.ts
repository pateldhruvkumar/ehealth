export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
export const APP_NAME = "E-Health Records";
export const AUTH_TOKEN_KEY = "auth_token";

export const DOCUMENT_TYPES = [
  "XRAY",
  "MRI",
  "CT_SCAN",
  "BLOOD_REPORT",
  "URINE_REPORT",
  "PRESCRIPTION",
  "DISCHARGE_SUMMARY",
  "VACCINATION_RECORD",
  "LAB_REPORT",
  "OTHER",
] as const;

export const BLOOD_GROUPS = [
  "A+",
  "A-",
  "B+",
  "B-",
  "AB+",
  "AB-",
  "O+",
  "O-",
] as const;

export const GENDERS = ["MALE", "FEMALE", "OTHER"] as const;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  REGISTER_PATIENT: "/auth/register/patient",
  REGISTER_DOCTOR: "/auth/register/doctor",
  DASHBOARD: "/patient/dashboard",
  DOCUMENTS: "/patient/documents",
  UPLOAD_DOCUMENT: "/patient/documents/upload",
  PROFILE: "/patient/profile",
  SHARE: "/patient/share",
  ACCESS_LOG: "/patient/access-log",
  DOCTOR_DASHBOARD: "/doctor/doctor-dashboard",
  DOCTOR_PATIENTS: "/doctor/patients",
  DOCTOR_CONSULTATIONS: "/doctor/consultations",
  DOCTOR_PROFILE: "/doctor/doctor-profile",
} as const;
