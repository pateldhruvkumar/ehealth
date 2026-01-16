import type { FastifyRequest } from "fastify";
import { prisma } from "../config/database";
import { generateAccessCode, getPagination, isExpired } from "../utils/helpers";
import type { GrantAccessInput } from "../validators/sharing.validator";

function isActiveAndNotExpired(access: { status: string; expiresAt: Date | null }) {
  if (access.status !== "ACTIVE") return false;
  if (isExpired(access.expiresAt)) return false;
  return true;
}

export async function grantAccess(patientId: string, data: GrantAccessInput) {
  const doctor = await prisma.doctor.findUnique({ where: { userId: data.doctorId } });
  if (!doctor) return null;

  // Re-grant if a record exists; otherwise create.
  const accessCode = generateAccessCode();

  const existing = await prisma.sharedAccess.findUnique({
    where: { patientId_doctorId: { patientId, doctorId: data.doctorId } }
  });

  if (existing) {
    const updated = await prisma.sharedAccess.update({
      where: { id: existing.id },
      data: {
        status: "ACTIVE",
        accessCode,
        grantedAt: new Date(),
        expiresAt: data.expiresAt ?? null,
        revokedAt: null
      },
      include: { doctor: { include: { user: true } } }
    });
    return updated;
  }

  const created = await prisma.sharedAccess.create({
    data: {
      patientId,
      doctorId: data.doctorId,
      status: "ACTIVE",
      accessCode,
      grantedAt: new Date(),
      expiresAt: data.expiresAt ?? null
    },
    include: { doctor: { include: { user: true } } }
  });

  return created;
}

export async function revokeAccess(patientId: string, doctorId: string) {
  const updated = await prisma.sharedAccess.updateMany({
    where: { patientId, doctorId, status: "ACTIVE" },
    data: { status: "REVOKED", revokedAt: new Date() }
  });
  return { revoked: updated.count > 0 };
}

export async function getActiveShares(patientId: string) {
  const now = new Date();
  const shares = await prisma.sharedAccess.findMany({
    where: {
      patientId,
      status: "ACTIVE",
      OR: [{ expiresAt: null }, { expiresAt: { gt: now } }]
    },
    orderBy: { grantedAt: "desc" },
    include: { doctor: { include: { user: true } } }
  });
  return shares;
}

export async function getAccessLog(
  patientId: string,
  query: { page?: unknown; limit?: unknown }
) {
  const { page, limit, skip } = getPagination(query);

  const where = {
    sharedAccess: { patientId }
  } as const;

  const [total, items] = await Promise.all([
    prisma.accessLog.count({ where }),
    prisma.accessLog.findMany({
      where,
      orderBy: { accessedAt: "desc" },
      skip,
      take: limit,
      include: {
        sharedAccess: {
          include: { doctor: { include: { user: true } } }
        }
      }
    })
  ]);

  return { items, page, limit, total, totalPages: Math.ceil(total / limit) };
}

export async function verifyAccessCode(accessCode: string) {
  const access = await prisma.sharedAccess.findUnique({
    where: { accessCode },
    include: {
      doctor: { include: { user: true } },
      patient: { include: { user: true } }
    }
  });

  if (!access) return { valid: false as const };

  const valid = isActiveAndNotExpired(access);
  return { valid: valid as boolean, access };
}

export async function logAccess(sharedAccessId: string, action: string, request: FastifyRequest) {
  const ipAddress = request.ip;
  const userAgent = request.headers["user-agent"];

  return prisma.accessLog.create({
    data: {
      sharedAccessId,
      action,
      ipAddress,
      userAgent: typeof userAgent === "string" ? userAgent : undefined
    }
  });
}

export async function checkAccess(patientId: string, doctorId: string) {
  const access = await prisma.sharedAccess.findFirst({
    where: { patientId, doctorId, status: "ACTIVE" }
  });
  if (!access) return { allowed: false as const };
  if (isExpired(access.expiresAt)) return { allowed: false as const };
  return { allowed: true as const, access };
}

