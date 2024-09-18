"use server";

// import { signIn } from "@/lib/auth/authConfig";
import { DEFAULT_LOGIN_REDIRECT_URI } from "@/config/route.config";

export const handleGithubSignIn = async () => {
  try {
    // await signIn("github", { redirectTo: DEFAULT_LOGIN_REDIRECT_URI });
  } catch (error) {
    throw error;
  }
};
