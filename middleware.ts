import { withAuth } from "next-auth/middleware";

const SECRET = process.env.NEXTAUTH_SECRET ?? "b0842e95caa859a2fdcc0da3f8b57101e35442942f34f5a8d371995aeac8db09";

export default withAuth({
  secret: SECRET,
  pages: {
    signIn: "/login",
  },
});

export const config = {
  // Only the admin area requires authentication via middleware.
  // Destination pages handle their own soft gate (teaser vs full content).
  matcher: ["/admin/:path*"],
};
