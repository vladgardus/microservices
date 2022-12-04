import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const cookie = request.cookies.get("session");
  console.log({ cookie });
  console.log({ request });
  const response = NextResponse.next();
  if (cookie) response.cookies.set(cookie?.name, cookie?.value);
  return response;
}
