// middleware.js
import { withAuth } from "next-auth/middleware"

export default withAuth({
  callbacks: {
    // allow any authenticated session
    authorized: ({ token }) => !!token,
  },
  pages: {
    signIn: "/auth/signin",
  },
})

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|manifest\\.json|icons|service-worker\\.js|api/auth|auth/signin).*)",
  ],
}
