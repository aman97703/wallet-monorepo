"use server";

import prisma from "@repo/db/client";
import { getSessionServer } from "../getSessionSession";

export async function createOnRampTransaction(
  provider: string,
  amount: number
) {
  // Ideally the token should come from the banking provider (hdfc/axis)
  const session = await getSessionServer();
  if (!session || !session?.user || !session.user?.id) {
    return {
      message: "Unauthenticated request",
    };
  }
  const token = (Math.random() * 1000).toString();
  await prisma.onRampTransaction.create({
    data: {
      provider,
      status: "Processing",
      startTime: new Date(),
      token: token,
      userId: session?.user?.id,
      amount: amount * 100, 
    },
  });

  return {
    message: "Done",
  };
}
