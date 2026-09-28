import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, safeAdminReturnPath } from "../../../chatgpt-auth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const returnTo = safeAdminReturnPath(url.searchParams.get("return_to") ?? "/");
  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set(ADMIN_SESSION_COOKIE, "", { httpOnly: true, maxAge: 0, path: "/", sameSite: "lax" });
  return response;
}
