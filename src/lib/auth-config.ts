import Google from "next-auth/providers/google";
import type { NextAuthConfig } from "next-auth";

export const authConfig = {
  secret: process.env.AUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth;
    },
    session({ session, token }) {
      // Use email as the consistent user identifier
      // Store it in both id and ensure it's always available
      if (session.user) {
        // Use email as the primary identifier for consistency
        const userId = session.user.email || token.sub || session.user.id;
        session.user.id = userId;
        // Also store in a custom field for clarity
        (session.user as { userId?: string }).userId = userId;
      }
      return session;
    },
    jwt({ token, user, account }) {
      if (user) {
        // Use email as the primary identifier (more stable than id)
        const userId = user.email || user.id || token.sub;
        token.sub = userId;
        token.userId = userId;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
