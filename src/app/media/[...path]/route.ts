import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import { STORAGE_DIR } from "@/lib/db";

export const dynamic = "force-dynamic";

const TYPES: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".avif": "image/avif",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
};

/** Serves anything under storage/ — uploaded photos are not in public/,
    which is baked into the image at build time and would not survive a redeploy. */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: segments } = await params;

  const target = path.resolve(STORAGE_DIR, ...segments);
  // Containment check: reject anything that escapes storage/ via "..".
  if (target !== STORAGE_DIR && !target.startsWith(STORAGE_DIR + path.sep)) {
    return new Response("Forbidden", { status: 403 });
  }

  const ext = path.extname(target).toLowerCase();
  const type = TYPES[ext];
  if (!type) return new Response("Not found", { status: 404 });

  try {
    const info = await stat(target);
    if (!info.isFile()) return new Response("Not found", { status: 404 });
    const body = await readFile(target);
    return new Response(new Uint8Array(body), {
      headers: {
        "Content-Type": type,
        "Content-Length": String(info.size),
        // Filenames carry a random suffix, so a URL's bytes never change.
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new Response("Not found", { status: 404 });
  }
}
