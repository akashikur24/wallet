"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import axios from "axios";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function createOnRampTransaction(
  provider: string,
  amount: number
) {
  const session = await getServerSession(authOptions);
  if (!session?.user || !session.user?.id) {
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
      userId: Number(session?.user?.id),
      amount: amount * 100,
    },
  });
  await axios
    .post("http://localhost:3003/hdfcWebhook", {
      token: token,
      user_identifier: Number(session?.user?.id),
      amount: amount * 100,
    })
    .then((res) => res.data == "Captured")
    .catch((err) => console.log(err));

  return {
    message: "Done",
  };
}
