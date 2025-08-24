import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { verifyPassword } from "./auth"
import type { AuthUser } from "./auth"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          console.log("[v0] Auth attempt for email:", credentials?.email)

          if (!credentials?.email || !credentials?.password) {
            console.log("[v0] Missing credentials")
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
          })

          if (!user) {
            console.log("[v0] User not found:", credentials.email)
            return null
          }

          console.log("[v0] User found, verifying password")
          const isPasswordValid = await verifyPassword(credentials.password, user.passwordHash)

          if (!isPasswordValid) {
            console.log("[v0] Invalid password for user:", credentials.email)
            return null
          }

          console.log("[v0] Authentication successful for:", credentials.email)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("[v0] Auth error:", error)
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as AuthUser).role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
}
