"use server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth";
import { Prisma, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function p2pTransfer(to: string, amount: number) {
  const session = await getServerSession(authOptions);
  const from = session?.user?.id;
  if (!from) {
    return {
      message: "Error while sending",
    };
  }
  const toUser = await prisma.user.findFirst({
    where: {
      number: to,
    },
  });

  if (!toUser) {
    return {
      message: "User not found",
    };
  }
  await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    await tx.$queryRaw`SELECT * FROM "Balance" WHERE "userId" = ${Number(
      from
    )} FOR UPDATE`;

    const fromBalance = await tx.balance.findUnique({
      where: { userId: Number(from) },
    });
    if (!fromBalance || fromBalance.amount < amount) {
      throw new Error("Insufficient funds");
    }
    let toUserBalance = await tx.balance.findUnique({
      where: { userId: toUser.id },
    });

    if (!toUserBalance) {
      toUserBalance = await tx.balance.create({
        data: { userId: toUser.id, amount: 0, locked: 0 },
      });
    }

    await tx.balance.update({
      where: { userId: Number(from) },
      data: { amount: { decrement: amount } },
    });

    await tx.balance.update({
      where: { userId: toUser.id },
      data: { amount: { increment: amount } },
    });

    await tx.p2pTransfer.create({
      data: {
        fromUserId: Number(from),
        toUserId: toUser.id,
        amount,
        timestamp: new Date(),
      },
    });
  });
}
