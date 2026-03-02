import { authService } from "@/services/auth.service";
import { LoginInput, RegisterDoctorInput, RegisterPatientInput } from "@/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function useCurrentUser() {
  return useQuery({
    queryKey: ["current-user"],
    queryFn: async () => {
      try {
        const response = await authService.getMe();
        return response.data;
      } catch (error) {
        return null;
      }
    },
    retry: false,
  });
}

import { AUTH_TOKEN_KEY, ROUTES } from "@/lib/constants";

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: LoginInput) => authService.login(data),
    onSuccess: (response) => {
      if (response.data?.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        document.cookie = `${AUTH_TOKEN_KEY}=${response.data.token}; path=/; SameSite=Lax; max-age=604800`;
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        toast.success("Login successful!");
        // Redirect based on role
        if (response.data.user.role === "PATIENT") {
          router.push(ROUTES.DASHBOARD);
        } else if (response.data.user.role === "DOCTOR") {
          router.push(ROUTES.DOCTOR_DASHBOARD);
        } else {
          router.push(ROUTES.DASHBOARD);
        }
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Login failed");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return () => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    document.cookie = `${AUTH_TOKEN_KEY}=; path=/; max-age=0`;
    queryClient.setQueryData(["current-user"], null);
    queryClient.clear();
    router.push(ROUTES.LOGIN);
    toast.success("Logged out successfully");
  };
}

export function useRegisterPatient() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterPatientInput) => authService.registerPatient(data),
    onSuccess: (response) => {
      if (response.data?.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        document.cookie = `${AUTH_TOKEN_KEY}=${response.data.token}; path=/; SameSite=Lax; max-age=604800`;
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        toast.success("Registration successful!");
        router.push(ROUTES.DASHBOARD); // Or dashboard
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration failed");
    },
  });
}

export function useRegisterDoctor() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: RegisterDoctorInput) => authService.registerDoctor(data),
    onSuccess: (response) => {
       if (response.data?.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, response.data.token);
        document.cookie = `${AUTH_TOKEN_KEY}=${response.data.token}; path=/; SameSite=Lax; max-age=604800`;
        queryClient.invalidateQueries({ queryKey: ["current-user"] });
        toast.success("Registration successful!");
        router.push(ROUTES.DOCTOR_DASHBOARD); // Or onboarding
      }
    },
    onError: (error: any) => {
      toast.error(error.message || "Registration failed");
    },
  });
}
