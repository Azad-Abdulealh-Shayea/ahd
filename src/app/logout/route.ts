import { type NextRequest, NextResponse } from "next/server";

import { DEMO_USER_COOKIE } from "@/server/demo-session";

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  response.cookies.delete(DEMO_USER_COOKIE);

  return response;
}
