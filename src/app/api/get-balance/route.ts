import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userId = Number(session.user.id);
    const balance = await prisma.balance.findFirst({
      where: { userId: userId },
    });

    if (!balance) {
      return NextResponse.json({ amount: 0, locked: 0 });
    }

    return NextResponse.json(balance);
  } catch (error) {
    console.error("Error fetching balance:", error);
    return NextResponse.json(
      { message: "Error fetching balance" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
