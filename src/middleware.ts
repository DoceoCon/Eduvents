import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const host = request.headers.get("host") || "";

  // Redirect www to non-www
  if (host.startsWith("www.")) {
    const newHost = host.replace("www.", "");
    const url = new URL(request.url);
    url.host = newHost;
    url.port = "";
    return NextResponse.redirect(url.toString(), 301);
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/((?!_next/static|_next/image|favicon.ico|icon.png).*)",
};
