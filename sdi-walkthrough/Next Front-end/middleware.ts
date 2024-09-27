import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

const isProtectedAdminRoute = createRouteMatcher([
  "/(.*)/admin(.*)",
]);

const isProtectedRoute = createRouteMatcher([
  "/(.*)/walkthrough(.*)",
])

export default clerkMiddleware((auth, req) => {
  if (isProtectedAdminRoute(req)) auth().protect((has) => {
    return (
      has({role: "org:admin"})
    )
  });
  if (isProtectedRoute(req)) auth().protect();
});

export const config = {
  // Protects all routes, including api/trpc.
  // See https://clerk.com/docs/references/nextjs/auth-middleware
  // for more information about configuring your Middleware
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};
