import { apiRequest } from "@/lib/api/client";
import type { UserProfile } from "@/lib/types";

export type UserProfilePayload = Partial<Omit<UserProfile, "id">>;

export function getMyProfile() {
  return apiRequest<UserProfile>("/users/me/profile");
}

export function updateMyProfile(payload: UserProfilePayload) {
  return apiRequest<UserProfile>("/users/me/profile", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}
