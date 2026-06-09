import { apiRequest } from "@/lib/api/client";
import type { User } from "@/lib/types";

export type RegisterPayload = {
  email: string;
  password: string;
  phone?: string;
  first_name: string;
  last_name: string;
  middle_name?: string;
  region?: string;
};

export type LoginPayload = {
  identifier: string;
  password: string;
};

export type TokenResponse = {
  access_token: string;
  token_type: string;
};

export function register(payload: RegisterPayload) {
  return apiRequest<TokenResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function login(payload: LoginPayload) {
  return apiRequest<TokenResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function logout() {
  return apiRequest<{ status: string }>("/auth/logout", { method: "POST" });
}

export function getMe() {
  return apiRequest<User>("/auth/me");
}
