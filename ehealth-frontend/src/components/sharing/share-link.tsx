"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface ShareLinkProps {
  accessCode: string;
}

export function ShareLink({ accessCode }: ShareLinkProps) {
  const [copied, setCopied] = useState(false);
  const link = `${window.location.origin}/verify/${accessCode}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex w-full items-center gap-2">
      <Input value={link} readOnly className="bg-slate-50 font-mono text-xs" />
      <Button size="icon" variant="outline" onClick={copyToClipboard}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </Button>
    </div>
  );
}
