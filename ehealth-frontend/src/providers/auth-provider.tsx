"use client";

import { useEffect, useState } from "react";
import { setAuthToken } from "@/lib/api-client";
import { useQueryClient } from "@tanstack/react-query";
import { AUTH_TOKEN_KEY } from "@/lib/constants";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitialized, setIsInitialized] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      setAuthToken(token);
    }
    setIsInitialized(true);
  }, []);

  if (!isInitialized) {
    return null; // Or a loading spinner
  }

  return <>{children}</>;
}
