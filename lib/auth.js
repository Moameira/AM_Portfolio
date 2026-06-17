import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET
    })
  ],
  callbacks: {
    async jwt({ token, profile }) {
      if (profile?.login) {
        token.githubLogin = profile.login;
      }

      token.isAdmin = token.githubLogin === process.env.ADMIN_GITHUB_LOGIN;
      return token;
    },
    async session({ session, token }) {
      session.user.githubLogin = token.githubLogin;
      session.user.isAdmin = Boolean(token.isAdmin);
      return session;
    }
  }
});
