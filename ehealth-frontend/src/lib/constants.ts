export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";
export const APP_NAME = "E-Health Records";

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
  LOGIN: "/login",
  REGISTER: "/register",
  REGISTER_PATIENT: "/register/patient",
  REGISTER_DOCTOR: "/register/doctor",
  DASHBOARD: "/dashboard",
  DOCUMENTS: "/documents",
  UPLOAD_DOCUMENT: "/documents/upload",
  PROFILE: "/profile",
  SHARE: "/share",
  ACCESS_LOG: "/access-log",
  DOCTOR_DASHBOARD: "/doctor-dashboard",
  DOCTOR_PATIENTS: "/patients",
  DOCTOR_CONSULTATIONS: "/consultations",
  DOCTOR_PROFILE: "/doctor-profile",
} as const;
