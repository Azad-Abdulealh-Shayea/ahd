import { type NextRequest, NextResponse } from "next/server";

import {
  DEMO_USER_COOKIE,
  DEMO_USER_COOKIE_MAX_AGE,
} from "@/server/demo-session";
import { db } from "@/server/db";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const userId = formData.get("userId");

  if (typeof userId !== "string") {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const user = await db.demoUser.findUnique({ where: { id: userId } });
  if (!user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(DEMO_USER_COOKIE, user.id, {
    httpOnly: true,
    maxAge: DEMO_USER_COOKIE_MAX_AGE,
    path: "/",
    sameSite: "lax",
  });

  return response;
}
