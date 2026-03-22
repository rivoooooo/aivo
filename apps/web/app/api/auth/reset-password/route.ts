import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { token, password } = await request.json();

  if (!token || !password) {
    return Response.json({ error: "Token and password are required" }, { status: 400 });
  }

  try {
    await auth.api.resetPassword({
      body: { token, newPassword: password }
    });
    return Response.json({ message: "Password reset successfully" });
  } catch (error) {
    return Response.json({ error: "Invalid or expired token" }, { status: 400 });
  }
}