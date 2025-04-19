// middleware.js
import { withAuth } from "next-auth/middleware";

export default withAuth({
  pages: { signIn: "/auth/signin" },
});

export const config = {
  matcher: [
    /*
      protect everything except:
      - next-auth’s own API routes
      - Next.js internals and static files
    */
    "/((?!api/auth|_next/static|_next/image|favicon.ico).*)",
  ],
};
