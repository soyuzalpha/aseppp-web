import { randomBytes } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { getDb, PHOTOS_DIR } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

const EXT: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
};

const MAX_BYTES = 25 * 1024 * 1024;

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await req.formData().catch(() => null);
  if (!form) return Response.json({ error: "Expected multipart form" }, { status: 400 });

  const cat = String(form.get("cat") ?? "").trim();
  if (!/^[A-Za-z0-9 _-]{1,32}$/.test(cat)) {
    return Response.json({ error: "Invalid category" }, { status: 400 });
  }

  const file = form.get("file");
  if (!(file instanceof File)) {
    return Response.json({ error: "No file" }, { status: 400 });
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: "File larger than 25 MB" }, { status: 400 });
  }

  const ext = path.extname(file.name).toLowerCase();
  if (!EXT[ext]) {
    return Response.json({ error: `Unsupported file type ${ext || "(none)"}` }, { status: 400 });
  }

  const name = `${Date.now().toString(36)}-${randomBytes(4).toString("hex")}${ext}`;
  const dir = path.join(PHOTOS_DIR, cat);
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, name), Buffer.from(await file.arrayBuffer()));

  const src = `/media/photos/${cat}/${name}`;
  const alt = String(form.get("alt") ?? "").trim() || path.parse(file.name).name;
  const w = Number(form.get("w")) || 1;
  const h = Number(form.get("h")) || 1;

  const info = getDb()
    .prepare(
      `INSERT INTO photos (src, alt, cat, w, h, sort)
       VALUES (?, ?, ?, ?, ?, (SELECT COALESCE(MAX(sort), 0) + 1 FROM photos))`
    )
    .run(src, alt, cat, w, h);

  return Response.json({ id: Number(info.lastInsertRowid), src, alt, cat, w, h });
}
