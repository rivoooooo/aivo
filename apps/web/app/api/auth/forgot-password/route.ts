import { auth } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    await auth.api.requestPasswordReset({
      body: { email, redirectTo: "http://localhost:3000/reset-password" }
    });
    return Response.json({ message: "Password reset email sent" });
  } catch (error) {
    return Response.json({ message: "If an account exists, a reset email has been sent" });
  }
}