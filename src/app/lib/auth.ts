import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

interface Session {
  user: {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        phone: {
          label: "Phone number",
          type: "text",
          placeholder: "1231231231",
          required: true,
        },
        password: { label: "Password", type: "password", required: true },
      },
      async authorize(credentials: any) {
        const existingUser = await prisma.user.findFirst({
          where: {
            number: credentials.phone,
          },
        });

        if (existingUser) {
          const passwordValidation = await bcrypt.compare(
            credentials.password,
            existingUser.password
          );
          if (passwordValidation) {
            return {
              id: existingUser.id.toString(),
              name: existingUser.name,
              phone: existingUser.number,
            };
          }
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/signin",
    signOut: "/signin",
  },
  secret: process.env.JWT_SECRET || "secret",
  callbacks: {
    async session({ session, token, user }: any) {
      if (session?.user) {
        session.user.id = token.sub || user?.id;
      }
      return session;
    },
    async jwt({ token, user }: any) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
};
