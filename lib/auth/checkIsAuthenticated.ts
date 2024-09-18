"use server";

import { auth } from "@/lib/auth/authConfig";

export const asyncheckIsAuthenticated = async () => {
  const session = await auth();
  if (session) {
    return true;
  }
  return false;
};
