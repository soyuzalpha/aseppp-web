import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { chmodSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { cookies } from "next/headers";
import { STORAGE_DIR } from "./db";

const PW_FILE = path.join(STORAGE_DIR, "admin.password");
const COOKIE = "aseppp_admin";

/* ponytail: one password, one HMAC cookie, no session table. Swap for
   real auth (OAuth/NextAuth) only if a second admin ever exists. */

function readPasswordFile(): string | null {
  try {
    const p = readFileSync(PW_FILE, "utf8").trim();
    return p || null;
  } catch {
    return null;
  }
}

/** Generates storage/admin.password on first use so nobody gets locked out. */
export function adminPassword(): string | null {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  const existing = readPasswordFile();
  if (existing) return existing;

  const generated = randomBytes(15).toString("base64url");
  // The database may not have been opened yet, so create the directory here
  // rather than relying on db.ts to have done it.
  mkdirSync(STORAGE_DIR, { recursive: true });
  writeFileSync(PW_FILE, generated + "\n", { mode: 0o600 });
  try {
    chmodSync(PW_FILE, 0o600);
  } catch {}
  console.log(`[admin] generated password at ${PW_FILE}`);
  return generated;
}

function token(): string | null {
  const pw = adminPassword();
  return pw ? createHmac("sha256", pw).update("aseppp-admin").digest("hex") : null;
}

export function checkPassword(input: string): boolean {
  const pw = adminPassword();
  if (!pw || !input) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(pw);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function isAdmin(): Promise<boolean> {
  const expected = token();
  if (!expected) return false;
  const got = (await cookies()).get(COOKIE)?.value;
  if (!got || got.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(got), Buffer.from(expected));
}

export async function startSession(): Promise<void> {
  const value = token();
  if (!value) return;
  (await cookies()).set(COOKIE, value, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(COOKIE);
}
