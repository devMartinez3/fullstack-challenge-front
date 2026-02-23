import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const response = intlMiddleware(request);

  if (response) {
    return response;
  }

  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const locale = pathname.split("/")[1] as "en" | "es";
  const isLocalePrefixed = routing.locales.includes(locale);

  const basePath = isLocalePrefixed ? `/${locale}` : "";
  const isAuthPage = pathname.startsWith(`${basePath}/login`);

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL(`${basePath}/login`, request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(`${basePath}/`, request.url));
  }

  return NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/(es|en)/:path*",
    "/((?!api|_next|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
