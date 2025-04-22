// app/api/auth/[...nextauth]/options.js
import NextAuthImport from "next-auth/next";
import GoogleImport    from "next-auth/providers/google";

export const authOptions = {
  providers: [
    GoogleImport.default?.({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }) ?? GoogleImport(/* fallback if .default missing */),
  ],
  pages: {
    signIn: "/auth/signin",    // ← must match middleware
  },
  secret: process.env.NEXTAUTH_SECRET,
  useSecureCookies: process.env.NODE_ENV === 'production',
  debug: true,                // helpful for seeing what’s happening
};

const NextAuth = NextAuthImport.default ?? NextAuthImport;
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
