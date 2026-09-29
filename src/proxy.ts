import { NextResponse, type NextRequest } from "next/server";

/* Temporary probe: prove whether Googlebot (or any crawler) actually reaches
   the origin, and what path/status it gets. Reads `docker logs aseppp-web`.
   Remove once Search Console shows the sitemap as fetched. */
const CRAWLER = /googlebot|google-|bingbot|yandex|duckduck|applebot|slurp|crawler|spider|inspectiontool|facebookexternalhit|ahrefs|semrush/i;

export function proxy(req: NextRequest) {
  const ua = req.headers.get("user-agent") ?? "";
  if (CRAWLER.test(ua)) {
    console.log(
      `[crawler] ${req.method} ${req.nextUrl.pathname} ua="${ua}" ip=${
        req.headers.get("cf-connecting-ip") ?? req.headers.get("x-forwarded-for") ?? "-"
      }`
    );
  }
  return NextResponse.next();
}

export const config = { matcher: "/:path*" };
