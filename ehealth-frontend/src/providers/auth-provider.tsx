"use client";

import { ClerkProvider } from "@clerk/nextjs";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        layout: {
          socialButtonsPlacement: "bottom",
          socialButtonsVariant: "iconButton",
        },
        variables: {
          colorPrimary: "#2563eb", // Blue-600
        },
      }}
    >
      {children}
    </ClerkProvider>
  );
}
