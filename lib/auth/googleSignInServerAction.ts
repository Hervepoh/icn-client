"use server";

// import { signIn } from "@/lib/auth/authConfig";
import { DEFAULT_LOGIN_REDIRECT_URI } from "@/config/route.config";

export const handleGoogleSignIn = async () => {
  try {
    // await signIn("google", { redirectTo: DEFAULT_LOGIN_REDIRECT_URI });
  } catch (error) {
    throw error;
  }
};
