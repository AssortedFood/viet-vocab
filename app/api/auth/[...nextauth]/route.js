// app/api/auth/[...nextauth]/route.js
import NextAuthImport from "next-auth/next";
import GoogleImport    from "next-auth/providers/google";

const NextAuth       = NextAuthImport.default ?? NextAuthImport;
const GoogleProvider = GoogleImport.default    ?? GoogleImport;

if (
  !process.env.GOOGLE_CLIENT_ID ||
  !process.env.GOOGLE_CLIENT_SECRET ||
  !process.env.NEXTAUTH_SECRET
) {
  throw new Error(
    "Missing one of: GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, NEXTAUTH_SECRET"
  );
}

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  pages: {
    signIn: "/auth/signin", // <-- point to your new page
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
