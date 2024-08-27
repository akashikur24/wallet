import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const POST = async (req: NextRequest) => {
  const body = await req.json();
  const { name, phone, password, email } = body;
  console.log(name);
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        number: phone,
      },
    });
    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        number: phone,
        email,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created", user: newUser },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
};
