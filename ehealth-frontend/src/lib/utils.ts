import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date | undefined | null) {
  if (!date) return "N/A";
  return format(new Date(date), "PPP"); // e.g. "Apr 29, 2023"
}

export function formatDateTime(date: string | Date | undefined | null) {
  if (!date) return "N/A";
  return format(new Date(date), "PPP p"); // e.g. "Apr 29, 2023 2:00 PM"
}

export function formatRelativeTime(date: string | Date | undefined | null) {
  if (!date) return "N/A";
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export function getInitials(name: string) {
  if (!name) return "";
  const parts = name.split(" ");
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function truncate(str: string, length: number) {
  if (!str) return "";
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
