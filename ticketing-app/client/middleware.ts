import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  request.headers.forEach((value, key) => response.headers.append(key, value));
  request.cookies.getAll().forEach((cookie) => response.cookies.set(cookie?.name, cookie?.value));
  if (request.nextUrl.pathname.startsWith("/auth")) {
    let splitPath = request.nextUrl.pathname.split("/");
    if (splitPath.length != 3 || !["signup", "signin", "signout"].find((path) => path == splitPath.at(-1))) return NextResponse.redirect(new URL("/", request.url));
  }
  return response;
}
