import { NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, createAdminSession, safeAdminReturnPath, verifyAdminPassword } from "../../../chatgpt-auth";

export async function POST(request: Request) {
  const form = await request.formData();
  const password = String(form.get("password") ?? "");
  const returnTo = safeAdminReturnPath(String(form.get("return_to") ?? "/admin"));
  if (!await verifyAdminPassword(password)) {
    const failed = new URL("/admin/login", request.url);
    failed.searchParams.set("error", "1");
    failed.searchParams.set("return_to", returnTo);
    return NextResponse.redirect(failed, 303);
  }
  const response = NextResponse.redirect(new URL(returnTo, request.url), 303);
  response.cookies.set(ADMIN_SESSION_COOKIE, await createAdminSession(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 12 * 60 * 60,
    path: "/",
  });
  return response;
}
