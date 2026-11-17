import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createMiddleware(routing);

export const config = {
  // Skip API routes, the embedded Sanity Studio, Next internals and files with an extension.
  matcher: "/((?!api|studio|_next|_vercel|.*opengraph-image|.*\\..*).*)",
};
