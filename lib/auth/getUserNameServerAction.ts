"use server";

import { auth } from "@/lib/auth/authConfig";

export const getUserName = async () => {
  const session = await auth();
  if (session) {
   // return session?.user?.name;
  }
};
