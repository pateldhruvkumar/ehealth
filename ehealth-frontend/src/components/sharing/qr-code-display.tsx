import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { QRCodeCanvas } from "qrcode.react";
import { useRef } from "react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
}

export function QRCodeDisplay({ value, size = 200 }: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (canvas) {
      const url = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = url;
      a.download = "ehealth-access-qr.png";
      a.click();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="rounded-lg border bg-white p-4 shadow-sm" ref={qrRef}>
        <QRCodeCanvas
          value={value}
          size={size}
          level="H"
          includeMargin
          imageSettings={{
            src: "/favicon.ico", // Assuming exists or will exist
            x: undefined,
            y: undefined,
            height: 24,
            width: 24,
            excavate: true,
          }}
        />
      </div>
      <Button variant="outline" size="sm" onClick={downloadQR}>
        <Download className="mr-2 h-4 w-4" />
        Download QR Code
      </Button>
    </div>
  );
}
