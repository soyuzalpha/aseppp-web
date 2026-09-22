import { checkPassword, endSession, startSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { password?: unknown };
  if (!checkPassword(String(body.password ?? ""))) {
    return Response.json({ error: "Wrong password" }, { status: 401 });
  }
  await startSession();
  return Response.json({ ok: true });
}

export async function DELETE() {
  await endSession();
  return Response.json({ ok: true });
}
