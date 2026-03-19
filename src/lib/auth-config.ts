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
      // Use user ID as the consistent identifier
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    jwt({ token, user }) {
      if (user) {
        // Use user.id as the primary identifier
        // Google OAuth provides user.id which is the Google user ID
        token.sub = user.id;
      }
      return token;
    },
  },
} satisfies NextAuthConfig;
