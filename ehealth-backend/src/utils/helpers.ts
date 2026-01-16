import { randomInt } from "crypto";

export function getPagination(query: { page?: unknown; limit?: unknown }) {
  const pageRaw = typeof query.page === "string" ? Number(query.page) : (query.page as number);
  const limitRaw = typeof query.limit === "string" ? Number(query.limit) : (query.limit as number);

  const page = Number.isFinite(pageRaw) && pageRaw > 0 ? Math.floor(pageRaw) : 1;
  const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? Math.min(Math.floor(limitRaw), 100) : 10;
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function generateAccessCode() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < 8; i++) code += chars[randomInt(0, chars.length)];
  return code;
}

export function isExpired(date: Date | string | null | undefined) {
  if (!date) return false;
  const d = typeof date === "string" ? new Date(date) : date;
  return d.getTime() < Date.now();
}

