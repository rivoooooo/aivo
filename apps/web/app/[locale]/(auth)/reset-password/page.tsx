"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const tokenParam = searchParams.get("token");
    setToken(tokenParam);
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
      setTimeout(() => {
        router.push("/login");
      }, 2000);
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h1 className="font-mono text-sm font-medium tracking-wider text-foreground uppercase">
                [ PASSWORD RESET ]
              </h1>
            </div>

            <div className="p-6">
              <div className="mb-6 p-3 border border-destructive bg-destructive/10">
                <p className="font-mono text-xs text-destructive uppercase">
                  [ERR] Invalid or expired reset link
                </p>
              </div>

              <p className="font-mono text-xs text-muted-foreground mb-6">
                Please request a new password reset email.
              </p>

              <Link
                href="/forgot-password"
                className="block w-full border border-primary bg-primary px-6 py-3 font-mono text-sm uppercase tracking-wider text-primary-foreground text-center transition-all hover:bg-primary/90"
              >
                [ REQUEST NEW LINK ]
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="border border-border bg-card">
            <div className="border-b border-border px-6 py-4">
              <h1 className="font-mono text-sm font-medium tracking-wider text-foreground uppercase">
                [ PASSWORD RESET ]
              </h1>
            </div>

            <div className="p-6">
              <div className="mb-6 p-3 border border-emerald-500 bg-emerald-500/10">
                <p className="font-mono text-xs text-emerald-500 uppercase">
                  [SUCCESS] Password reset successfully
                </p>
              </div>

              <p className="font-mono text-xs text-muted-foreground mb-6">
                Redirecting to login page...
              </p>

              <div className="flex items-center justify-center">
                <span className="animate-blink font-mono text-xs text-muted-foreground">
                  █
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h1 className="font-mono text-sm font-medium tracking-wider text-foreground uppercase">
              [ PASSWORD RESET ]
            </h1>
          </div>

          <div className="p-6">
            <div className="mb-6 text-muted-foreground font-mono text-xs">
              <p className="mb-2">$ resetting user credentials...</p>
              <p className="text-info">$ enter new password to proceed</p>
            </div>

            {error && (
              <div className="mb-6 p-3 border border-destructive bg-destructive/10">
                <p className="font-mono text-xs text-destructive uppercase">
                  [ERR] {error}
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="font-mono text-xs text-muted-foreground uppercase tracking-wider"
                >
                  new password
                </label>
                <div className="flex items-center border border-input bg-background">
                  <span className="px-3 font-mono text-xs text-muted-foreground">
                    pass
                  </span>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={8}
                    className="flex-1 bg-transparent px-2 py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                    placeholder="********"
                  />
                  <span className="pr-3 font-mono text-xs text-muted-foreground">
                    :~$
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="confirmPassword"
                  className="font-mono text-xs text-muted-foreground uppercase tracking-wider"
                >
                  confirm password
                </label>
                <div className="flex items-center border border-input bg-background">
                  <span className="px-3 font-mono text-xs text-muted-foreground">
                    pass
                  </span>
                  <input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                    minLength={8}
                    className="flex-1 bg-transparent px-2 py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                    placeholder="********"
                  />
                  <span className="pr-3 font-mono text-xs text-muted-foreground">
                    :~$
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full border border-primary bg-primary px-6 py-3 font-mono text-sm uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-blink">█</span>
                    resetting...
                  </span>
                ) : (
                  "[ RESET PASSWORD ]"
                )}
              </button>
            </form>
          </div>

          <div className="border-t border-border px-6 py-3">
            <p className="font-mono text-xs text-muted-foreground text-center">
              {">"} secure connection established {"<"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}