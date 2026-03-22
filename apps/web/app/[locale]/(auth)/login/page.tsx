"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    await signIn.email(
      { email, password },
      {
        onRequest: () => setLoading(true),
        onSuccess: () => {
          window.location.href = "/";
        },
        onError: (ctx) => {
          setError(ctx.error.message);
          setLoading(false);
        },
      }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="border border-border bg-card">
          <div className="border-b border-border px-6 py-4">
            <h1 className="font-mono text-sm font-medium tracking-wider text-foreground uppercase">
              [ SYSTEM LOGIN ]
            </h1>
          </div>

          <div className="p-6">
            <div className="mb-6 text-muted-foreground font-mono text-xs">
              <p className="mb-2">$ authenticating user credentials...</p>
              <p className="text-info">$ enter email and password to proceed</p>
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
                  htmlFor="email"
                  className="font-mono text-xs text-muted-foreground uppercase tracking-wider"
                >
                  email
                </label>
                <div className="flex items-center border border-input bg-background">
                  <span className="px-3 font-mono text-xs text-muted-foreground">
                    user@
                  </span>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                    className="flex-1 bg-transparent px-2 py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                    placeholder="example@domain.com"
                  />
                  <span className="pr-3 font-mono text-xs text-muted-foreground">
                    :~$
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="font-mono text-xs text-muted-foreground uppercase tracking-wider"
                >
                  password
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
                    className="flex-1 bg-transparent px-2 py-3 font-mono text-sm text-foreground outline-none placeholder:text-muted-foreground/50"
                    placeholder="********"
                  />
                  <span className="pr-3 font-mono text-xs text-muted-foreground">
                    :~$
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Link
                  href="/sign-up"
                  className="font-mono text-xs text-primary hover:text-primary/80 transition-colors uppercase tracking-wider"
                >
                  [ sign-up ]
                </Link>
                <Link
                  href="/forgot-password"
                  className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider"
                >
                  [ forgot pass ]
                </Link>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full border border-primary bg-primary px-6 py-3 font-mono text-sm uppercase tracking-wider text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-blink">█</span>
                    authenticating...
                  </span>
                ) : (
                  "[ INITIATE LOGIN ]"
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
