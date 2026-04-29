import "server-only";

import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/server/db";

export const DEMO_USER_COOKIE = "ahd_demo_user_id";
export const DEMO_USER_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

type CookieOptions = {
  name: string;
  value: string;
};

function parseCookieHeader(cookieHeader: string | null): CookieOptions[] {
  if (!cookieHeader) return [];

  return cookieHeader
    .split(";")
    .map((part) => part.trim())
    .filter(Boolean)
    .map((part) => {
      const separatorIndex = part.indexOf("=");
      if (separatorIndex === -1) return { name: part, value: "" };

      return {
        name: decodeURIComponent(part.slice(0, separatorIndex)),
        value: decodeURIComponent(part.slice(separatorIndex + 1)),
      };
    });
}

export function getDemoUserIdFromHeaders(sourceHeaders: Headers) {
  return (
    parseCookieHeader(sourceHeaders.get("cookie")).find(
      (cookie) => cookie.name === DEMO_USER_COOKIE,
    )?.value ?? null
  );
}

export async function getCurrentDemoUserFromHeaders(sourceHeaders: Headers) {
  const userId = getDemoUserIdFromHeaders(sourceHeaders);
  if (!userId) return null;

  return db.demoUser.findUnique({ where: { id: userId } });
}

export async function getCurrentDemoUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get(DEMO_USER_COOKIE)?.value;
  if (!userId) return null;

  return db.demoUser.findUnique({ where: { id: userId } });
}

export async function requireCurrentDemoUser() {
  const user = await getCurrentDemoUser();
  if (!user) redirect("/login");

  return user;
}

export async function getRequestDemoUser() {
  const sourceHeaders = new Headers(await headers());

  return getCurrentDemoUserFromHeaders(sourceHeaders);
}
