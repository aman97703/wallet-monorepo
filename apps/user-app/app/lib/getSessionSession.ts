"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export async function getSessionServer() {
  // Ideally the token should come from the banking provider (hdfc/axis)
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
    return null
  }
  return session;
}
