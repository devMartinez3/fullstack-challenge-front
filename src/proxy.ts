import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request);

  if (intlResponse && intlResponse.status >= 300 && intlResponse.status < 400) {
    return intlResponse;
  }

  const token = request.cookies.get("auth_token")?.value;
  const { pathname } = request.nextUrl;

  const locale = pathname.split("/")[1];
  const hasLocale = routing.locales.includes(locale as any);

  const loginPath = hasLocale ? `/${locale}/login` : "/login";
  const homePath = hasLocale ? `/${locale}` : "/";

  const isAuthPage = pathname.startsWith(loginPath);

  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL(loginPath, request.url));
  }
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL(homePath, request.url));
  }

  return intlResponse ?? NextResponse.next();
}
export const config = {
  matcher: [
    "/",
    "/(es|en)/:path*",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
