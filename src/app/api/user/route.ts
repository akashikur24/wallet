import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../lib/auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export const GET = async () => {
//     const session = await getServerSession(authOptions);
//     if (session.user) {
//         return NextResponse.json({
//             user: session.user
//         })
//     }
//     return NextResponse.json({
//         message: "You are not logged in"
//     }, {
//         status: 403
//     })
// }

export const GET = async (request: Request) => {
  const url = new URL(request.url);
  const path = url.pathname;
  if (path === "/api/user") {
    try {
      const session = await getServerSession(authOptions);
      if (!session?.user?.id) {
        return NextResponse.json(
          { message: "You are not logged in" },
          { status: 403 }
        );
      }

      const users = await prisma.user.findMany({
        where: {
          id: {
            not: Number(session.user.id),
          },
        },
        select: {
          id: true,
          email: true,
          name: true,
          number: true,
        },
      });

      return NextResponse.json(users);
    } catch (error) {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ message: "Not Found" }, { status: 404 });
};
