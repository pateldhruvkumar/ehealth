"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useDocuments } from "@/hooks/use-documents";
import { usePatientDashboard, usePatientProfile } from "@/hooks/use-patient";
import { useActiveShares } from "@/hooks/use-sharing";
import { ROUTES } from "@/lib/constants";
import { cn, formatDate } from "@/lib/utils";
import { Document } from "@/types";
import {
  Activity,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  FileText,
  Plus,
  Share2,
  Upload,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAYS = ["S", "M", "T", "W", "T", "F", "S"];

// ── Mini Calendar ──────────────────────────────────────────────────────────────
function MiniCalendar() {
  const [current, setCurrent] = useState(new Date());
  const today = new Date();
  const year = current.getFullYear();
  const month = current.getMonth();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells: (number | null)[] = [
    ...Array<null>(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="font-semibold text-slate-800 dark:text-white text-sm">
          {MONTHS[month]} {year}
        </span>
        <div className="flex gap-1">
          <button
            onClick={() => setCurrent(new Date(year, month - 1, 1))}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5 text-slate-500" />
          </button>
          <button
            onClick={() => setCurrent(new Date(year, month + 1, 1))}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 mb-1">
        {DAYS.map((d, i) => (
          <div key={i} className="text-center text-[10px] font-medium text-slate-400 py-1">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-y-0.5">
        {cells.map((day, i) => {
          const isToday =
            day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
          return (
            <div
              key={i}
              className={cn(
                "text-center text-xs py-1.5 rounded-lg transition-colors",
                day ? "cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800" : "",
                isToday
                  ? "bg-blue-600 text-white font-bold hover:bg-blue-700"
                  : "text-slate-600 dark:text-slate-400"
              )}
            >
              {day ?? ""}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Storage Ring ───────────────────────────────────────────────────────────────
function StorageRing({ used, total }: { used: number; total: number }) {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;

  return (
    <div className="relative flex items-center justify-center flex-shrink-0">
      <svg width={72} height={72} className="-rotate-90">
        <circle cx={36} cy={36} r={r} fill="none" stroke="#e2e8f0" strokeWidth={7} />
        <circle
          cx={36} cy={36} r={r} fill="none"
          stroke="#2563eb"
          strokeWidth={7}
          strokeDasharray={`${dash} ${circ}`}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <span className="absolute text-xs font-bold text-slate-700 dark:text-white">
        {Math.round(pct)}%
      </span>
    </div>
  );
}

// ── Activity Bar Chart ─────────────────────────────────────────────────────────
function ActivityChart({ documents }: { documents: Document[] }) {
  const now = new Date();
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    return {
      label: d.toLocaleString("default", { month: "short" }),
      month: d.getMonth(),
      year: d.getFullYear(),
      count: 0,
    };
  });

  documents.forEach((doc) => {
    const d = new Date(doc.uploadedAt);
    const entry = months.find(
      (m) => m.month === d.getMonth() && m.year === d.getFullYear()
    );
    if (entry) entry.count++;
  });

  const maxCount = Math.max(...months.map((m) => m.count), 1);

  return (
    <div className="flex items-end gap-2 h-20">
      {months.map((m, i) => {
        const height = Math.max((m.count / maxCount) * 64, 4);
        const isLast = i === months.length - 1;
        return (
          <div key={i} className="flex flex-col items-center flex-1 gap-1">
            <div
              className={cn(
                "w-full rounded-t-md transition-all duration-300",
                isLast
                  ? "bg-blue-600"
                  : "bg-blue-200 dark:bg-blue-900/40"
              )}
              style={{ height }}
            />
            <span className="text-[10px] text-slate-400">{m.label}</span>
          </div>
        );
      })}
    </div>
  );
}

// ── Dashboard Page ─────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = usePatientDashboard();
  const { data: documentsData, isLoading: docsLoading } = useDocuments({ limit: 100 });
  const { data: profile, isLoading: profileLoading } = usePatientProfile();
  const { data: shares, isLoading: sharesLoading } = useActiveShares();

  const isLoading = statsLoading || docsLoading || profileLoading || sharesLoading;
  if (isLoading) return <DashboardSkeleton />;

  const allDocs = documentsData?.items || [];
  const recentDocs = allDocs.slice(0, 4);
  const activeShares = (shares || []).filter((s) => s.status === "ACTIVE");
  const firstName = profile?.firstName || "User";

  return (
    <div className="space-y-6">
      {/* ── Greeting ── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Hi, {firstName} 👋
          </h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Let&apos;s track your health today.
          </p>
        </div>
        <Link href={ROUTES.UPLOAD_DOCUMENT}>
          <Button size="sm" className="rounded-xl">
            <Plus className="h-4 w-4 mr-1" />
            Upload
          </Button>
        </Link>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Left column (2/3) ── */}
        <div className="lg:col-span-2 space-y-5">

          {/* Health Banner */}
          <div className="rounded-2xl bg-gradient-to-r from-blue-500 to-blue-700 p-6 text-white flex items-center justify-between relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-lg font-bold mb-1">Check Your Health Records</h2>
              <p className="text-blue-100 text-sm mb-4 max-w-xs">
                Review your latest documents and stay on top of your health journey.
              </p>
              <Link
                href={ROUTES.DOCUMENTS}
                className="inline-block bg-white text-blue-600 text-sm font-semibold px-5 py-2 rounded-xl hover:bg-blue-50 transition-colors"
              >
                View Records &rarr;
              </Link>
            </div>
            <div
              className="absolute right-4 text-[80px] opacity-20 select-none"
              aria-hidden
            >
              🏥
            </div>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-3 gap-4">
            {[
              {
                label: "Documents",
                value: stats?.documentCount ?? 0,
                sub: "Total stored",
                icon: FileText,
                bg: "bg-blue-100 dark:bg-blue-900/30",
                color: "text-blue-600",
              },
              {
                label: "Recent Uploads",
                value: stats?.recentUploads.length ?? 0,
                sub: "Last 7 days",
                icon: Upload,
                bg: "bg-blue-50 dark:bg-blue-900/20",
                color: "text-blue-500",
              },
              {
                label: "Shared Access",
                value: stats?.activeShares ?? 0,
                sub: "Active doctors",
                icon: Share2,
                bg: "bg-slate-100 dark:bg-slate-800",
                color: "text-slate-600 dark:text-slate-400",
              },
            ].map(({ label, value, sub, icon: Icon, bg, color }) => (
              <div
                key={label}
                className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-4 shadow-sm"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center", bg)}>
                    <Icon className={cn("h-4 w-4", color)} />
                  </div>
                  <span className="text-xs font-medium text-slate-500">{label}</span>
                </div>
                <div className="text-2xl font-bold text-slate-800 dark:text-white">
                  {value}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">{sub}</div>
              </div>
            ))}
          </div>

          {/* Document Activity */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                Document Activity
              </h3>
              <span className="text-xs text-slate-400">Last 6 months</span>
            </div>
            <ActivityChart documents={allDocs} />
          </div>

          {/* Recent Documents */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                Recent Documents
              </h3>
              <Link
                href={ROUTES.DOCUMENTS}
                className="text-xs text-blue-600 hover:text-blue-500 font-medium flex items-center gap-1"
              >
                View All <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            {recentDocs.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-sm">
                No documents yet.{" "}
                <Link
                  href={ROUTES.UPLOAD_DOCUMENT}
                  className="text-blue-600 font-medium hover:text-blue-500"
                >
                  Upload your first one &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-1">
                {recentDocs.map((doc) => (
                  <Link
                    key={doc.id}
                    href={`${ROUTES.DOCUMENTS}/${doc.id}`}
                    className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group"
                  >
                    <div className="h-9 w-9 rounded-xl bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center flex-shrink-0">
                      <FileText className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate group-hover:text-slate-900 dark:group-hover:text-white">
                        {doc.title}
                      </div>
                      <div className="text-xs text-slate-400">
                        {doc.documentType.replace(/_/g, " ")}
                      </div>
                    </div>
                    <div className="text-xs text-slate-400 flex-shrink-0">
                      {formatDate(doc.documentDate || doc.uploadedAt)}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Right column (1/3) ── */}
        <div className="space-y-5">

          {/* Calendar */}
          <MiniCalendar />

          {/* Storage */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
            <h3 className="font-semibold text-slate-800 dark:text-white text-sm mb-4">
              Storage
            </h3>
            <div className="flex items-center gap-4">
              <StorageRing used={allDocs.length} total={50} />
              <div>
                <div className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  {allDocs.length}{" "}
                  <span className="text-slate-400 font-normal">/ 50 docs</span>
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {Math.max(50 - allDocs.length, 0)} slots remaining
                </div>
                <Link
                  href={ROUTES.UPLOAD_DOCUMENT}
                  className="text-xs text-blue-600 font-medium mt-2 block hover:text-blue-500"
                >
                  + Add document
                </Link>
              </div>
            </div>
          </div>

          {/* Shared Access */}
          <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-800 dark:text-white text-sm">
                Shared Access
              </h3>
              <Link
                href={ROUTES.SHARE}
                className="text-xs text-blue-600 font-medium hover:text-blue-500"
              >
                Manage
              </Link>
            </div>

            {activeShares.length === 0 ? (
              <div className="text-center py-4 text-xs text-slate-400">
                No active shares.
                <br />
                <Link
                  href={ROUTES.SHARE}
                  className="text-blue-600 font-medium hover:text-blue-500"
                >
                  Share with a doctor &rarr;
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {activeShares.slice(0, 3).map((share) => (
                  <div key={share.id} className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-700 text-xs font-semibold">
                        {(share.doctor?.firstName?.[0] ?? "") +
                          (share.doctor?.lastName?.[0] ?? "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">
                        Dr. {share.doctor?.firstName} {share.doctor?.lastName}
                      </div>
                      <div className="text-xs text-slate-400 truncate">
                        {share.doctor?.specialization}
                      </div>
                    </div>
                    <Badge className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-50">
                      Active
                    </Badge>
                  </div>
                ))}
                {activeShares.length > 3 && (
                  <p className="text-xs text-slate-400 text-center pt-1">
                    +{activeShares.length - 3} more
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-800 p-5 text-white">
            <h3 className="font-semibold text-sm mb-4">Quick Actions</h3>
            <div className="space-y-2">
              {[
                {
                  href: ROUTES.UPLOAD_DOCUMENT,
                  icon: Upload,
                  label: "Upload Document",
                },
                {
                  href: ROUTES.SHARE,
                  icon: Share2,
                  label: "Share Records",
                },
                {
                  href: ROUTES.ACCESS_LOG,
                  icon: Activity,
                  label: "View Access Log",
                },
              ].map(({ href, icon: Icon, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors mt-1"
                >
                  <Icon className="h-4 w-4 text-blue-200" />
                  <span className="text-sm">{label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Skeleton ───────────────────────────────────────────────────────────────────
function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 rounded-xl" />
          <Skeleton className="h-4 w-64 rounded-xl" />
        </div>
        <Skeleton className="h-9 w-24 rounded-xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-5">
          <Skeleton className="h-36 rounded-2xl" />
          <div className="grid grid-cols-3 gap-4">
            {[...Array(3)].map((_, i) => (
              <Skeleton key={i} className="h-24 rounded-2xl" />
            ))}
          </div>
          <Skeleton className="h-40 rounded-2xl" />
          <Skeleton className="h-52 rounded-2xl" />
        </div>
        <div className="space-y-5">
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-44 rounded-2xl" />
          <Skeleton className="h-40 rounded-2xl" />
        </div>
      </div>
    </div>
  );
}
