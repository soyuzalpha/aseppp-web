"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError("");
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setBusy(false);
    if (res.ok) router.refresh();
    else setError("Wrong password");
  }

  return (
    <main style={{ paddingTop: "8rem", maxWidth: "26rem" }} className="col">
      <p className="type-label mb-4" style={{ color: "var(--color-accent)" }}>
        Admin
      </p>
      <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          autoFocus
          aria-label="Password"
          style={{
            background: "none",
            border: "1px solid var(--color-border)",
            padding: "0.6rem 0.75rem",
            fontFamily: "var(--font-mono)",
            fontSize: "0.875rem",
            color: "var(--color-foreground)",
          }}
        />
        <button type="submit" disabled={busy} className="type-label" style={{ cursor: "default" }}>
          {busy ? "Checking…" : "Sign in"}
        </button>
        {error && <p className="type-index" style={{ color: "var(--color-accent)" }}>{error}</p>}
      </form>
    </main>
  );
}
