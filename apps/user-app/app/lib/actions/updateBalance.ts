"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import prisma from "@repo/db/client";
import axios from "axios";

export async function updateBalance() {
  const server = await getServerSession(authOptions);
  const userId = server.user.id;
  // const token = Math.random().toString() ;
  if (!userId) {
    return {
      message: "User not logged in",
    };
  }

  try {
    const transaction = await prisma.onRampTransaction.findFirst({
      where: {
        userId: Number(userId),
        status: "Processing",
      },
    });
    await axios.post("http://localhost:3003/hdfcWebhook", {
      token: transaction?.token,
      user_identifier: transaction?.userId,
      amount: transaction?.amount,
    });
  } catch (e) {
    console.log(e);
  }
}
