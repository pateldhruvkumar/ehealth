"use client";

import { QRCodeDisplay } from "@/components/sharing/qr-code-display";
import { ShareLink } from "@/components/sharing/share-link";
import { ShareModal } from "@/components/sharing/share-modal";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingSpinner } from "@/components/shared/loading-spinner";
import { PageHeader } from "@/components/shared/page-header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useActiveShares, useRevokeAccess } from "@/hooks/use-sharing";
import { formatDate, getInitials } from "@/lib/utils";
import { Plus, QrCode, Share2, Trash2 } from "lucide-react";
import { useState } from "react";

export default function SharePage() {
  const { data: shares, isLoading } = useActiveShares();
  const revokeAccess = useRevokeAccess();
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [revokeId, setRevokeId] = useState<string | null>(null);

  if (isLoading) return <LoadingSpinner className="h-96" />;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Share Records"
        description="Manage active access to your medical records."
      >
        <Button onClick={() => setIsShareModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Share with New Doctor
        </Button>
      </PageHeader>

      {shares?.length === 0 ? (
        <EmptyState
          icon={Share2}
          title="No active shares"
          description="You haven't shared your records with any doctors yet."
          actionLabel="Share Records"
          onAction={() => setIsShareModalOpen(true)}
        />
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {shares?.map((share) => (
            <Card key={share.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={share.doctor?.profileImage} />
                      <AvatarFallback>
                        {getInitials(
                          `${share.doctor?.firstName} ${share.doctor?.lastName}`
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">
                        Dr. {share.doctor?.firstName} {share.doctor?.lastName}
                      </CardTitle>
                      <CardDescription>
                        {share.doctor?.specialization}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge
                    variant={
                      share.status === "ACTIVE" ? "default" : "secondary"
                    }
                  >
                    {share.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Granted</span>
                    <span>{formatDate(share.grantedAt)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Expires</span>
                    <span>{formatDate(share.expiresAt)}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-xs font-medium uppercase text-slate-500">
                    Access Link
                  </span>
                  <ShareLink accessCode={share.accessCode} />
                </div>
              </CardContent>
              <CardFooter className="flex gap-2 border-t pt-4">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1">
                      <QrCode className="mr-2 h-4 w-4" />
                      QR Code
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Access QR Code</DialogTitle>
                      <DialogDescription>
                        Scan this code to view shared records.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-6">
                      <QRCodeDisplay
                        value={`${window.location.origin}/verify/${share.accessCode}`}
                      />
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => setRevokeId(share.doctor!.userId)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      <ShareModal open={isShareModalOpen} onOpenChange={setIsShareModalOpen} />

      <ConfirmDialog
        open={!!revokeId}
        onOpenChange={(open) => !open && setRevokeId(null)}
        title="Revoke Access"
        description="Are you sure you want to revoke access for this doctor? They will no longer be able to view your records."
        onConfirm={() => {
          if (revokeId) {
            revokeAccess.mutate(revokeId);
            setRevokeId(null);
          }
        }}
        variant="destructive"
        confirmText="Revoke"
      />
    </div>
  );
}
