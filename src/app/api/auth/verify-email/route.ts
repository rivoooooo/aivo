import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  if (!token) {
    return Response.json({ error: "Missing verification token" }, { status: 400 });
  }

  try {
    await auth.api.verifyEmail({
      query: { token }
    });
    return Response.json({ message: "Email verified successfully" });
  } catch (error) {
    return Response.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}