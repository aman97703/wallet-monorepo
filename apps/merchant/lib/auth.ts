import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import Prisma from "@repo/db/client";
import { NextAuthOptions, User, Account, Profile } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.NEXT_GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.NEXT_GOOGLE_CLIENT_SECRET || "",
    }),
    GithubProvider({
      clientId: process.env.NEXT_GITHUB_CLIENT_ID || "",
      clientSecret: process.env.NEXT_GITHUB_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || "secret",
  callbacks: {
    async session({ session }) {
      try {
        if (session.user) {
          const user = await Prisma.merchant.findUnique({
            where: {
              email: session.user.email!,
            },
          });
          if (user) {
            return session;
          } else {
            throw new Error("User not found");
          }
        } else {
          throw new Error("Invalid session");
        }
      } catch (error) {
        console.log(error);
        throw new Error("Invalid session");
      }
    },
    async signIn({
      user,
      account,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile;
      email?: { verificationRequest?: boolean };
      credentials?: Record<string, unknown>;
    }) {
      console.log("hi signin");
      if (!user || !user.email) {
        return false;
      }

      await Prisma.merchant.upsert({
        select: {
          id: true,
        },
        where: {
          email: user.email,
        },
        create: {
          email: user.email,
          name: user.name,
          auth_type: account?.provider === "google" ? "Google" : "Github", // Use a prisma type here
        },
        update: {
          name: user.name,
          auth_type: account?.provider === "google" ? "Google" : "Github", // Use a prisma type here
        },
      });

      return true;
    },
  },
};
