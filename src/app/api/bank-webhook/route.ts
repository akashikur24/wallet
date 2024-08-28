import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type PaymentInfo = {
  token: string;
  user_identifier: string;
  amount: number;
};

export const POST = async (req: NextRequest) => {
  try {
    const body: PaymentInfo = await req.json();
    const { token, user_identifier, amount } = body;

    if (!token || !user_identifier || typeof amount !== "number") {
      return NextResponse.json({ message: "Invalid input" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: {
        id: Number(user_identifier),
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const userBalance = await prisma.balance.findUnique({
      where: {
        userId: Number(user_identifier),
      },
    });

    if (!userBalance) {
      await prisma.balance.create({
        data: {
          userId: Number(user_identifier),
          amount: Number(amount),
          locked: 0,
        },
      });
    } else {
      await prisma.$transaction([
        prisma.balance.update({
          where: {
            userId: Number(user_identifier),
          },
          data: {
            amount: {
              increment: Number(amount),
            },
          },
        }),
        prisma.onRampTransaction.update({
          where: {
            token: token,
          },
          data: {
            status: "Success",
          },
        }),
      ]);
    }

    return NextResponse.json({ message: "Captured" });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      {
        message: "Error while processing webhook",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
};
