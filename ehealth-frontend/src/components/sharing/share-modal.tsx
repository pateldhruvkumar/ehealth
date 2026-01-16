"use client";

import { DoctorSearch } from "@/components/sharing/doctor-search";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGrantAccess } from "@/hooks/use-sharing";
import { Doctor } from "@/types";
import { addDays } from "date-fns";
import { useState } from "react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ShareModal({ open, onOpenChange }: ShareModalProps) {
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [duration, setDuration] = useState("7");
  const grantAccess = useGrantAccess();

  const handleShare = async () => {
    if (!selectedDoctor) return;

    const expiresAt = addDays(new Date(), parseInt(duration));
    
    await grantAccess.mutateAsync({
      doctorId: selectedDoctor.userId,
      expiresAt,
    });

    // Reset and close
    setSelectedDoctor(null);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share Medical Records</DialogTitle>
          <DialogDescription>
            Grant a doctor temporary access to your medical records.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Select Doctor</label>
            <DoctorSearch
              onSelect={setSelectedDoctor}
              selectedDoctorId={selectedDoctor?.userId}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Access Duration</label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">1 Day</SelectItem>
                <SelectItem value="3">3 Days</SelectItem>
                <SelectItem value="7">7 Days</SelectItem>
                <SelectItem value="30">30 Days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={!selectedDoctor || grantAccess.isPending}>
            {grantAccess.isPending ? "Sharing..." : "Share Records"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
