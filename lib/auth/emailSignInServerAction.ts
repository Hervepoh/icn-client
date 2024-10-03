"use server";

// import { signIn } from "@/lib/auth/authConfig";
import { DEFAULT_LOGIN_REDIRECT_URI } from "@/config/route.config";

export const handleEmailSignIn = async (email: string) => {
  try {
    // await signIn("nodemailer", { email, callbackUrl: DEFAULT_LOGIN_REDIRECT_URI });
  } catch (error) {
    throw error;
  }
};
