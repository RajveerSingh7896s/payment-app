import GoogleProvider from "next-auth/providers/google";
import db from "@repo/db/client";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || ""
        })
    ],
    callbacks: {
      async signIn({ user, account }) {
        const email = user?.email
        if (!email) return false

        const authType = account?.provider === "google" ? "Google" : "Github"
        const name = user?.name ?? null

        await db.merchant.upsert({
          where: { email },
          create: {
            email,
            name,
            auth_type: authType,
          },
          update: {
            name,
            auth_type: authType,
          },
        })

        return true
      }
    },
    secret: process.env.NEXTAUTH_SECRET || "secret"
  }