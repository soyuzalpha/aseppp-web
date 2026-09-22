import { getDb, listPhotos, listPosts, listProjects } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

/* One CRUD endpoint for all three content types. Table and column names are
   only ever taken from this map, never from the request — so the SQL that gets
   built below can't be steered by the caller. */
const TABLES: Record<"photos" | "posts" | "projects", { cols: string[]; json: string[] }> = {
  photos: {
    cols: ["src", "alt", "cat", "w", "h", "sort"],
    json: [],
  },
  posts: {
    cols: ["slug", "title", "date", "read_time", "tags", "excerpt", "body", "featured", "sort"],
    json: ["tags", "body"],
  },
  projects: {
    cols: [
      "slug", "n", "title", "year", "role", "status", "tags", "github", "live",
      "desc", "summary", "challenge", "solution", "outcome", "stack", "related", "sort",
    ],
    json: ["tags", "stack", "related"],
  },
};

type TableName = keyof typeof TABLES;

function spec(name: string): (typeof TABLES)[TableName] | null {
  return name in TABLES ? TABLES[name as TableName] : null;
}

/** Whitelist + coerce. node:sqlite only binds null/number/string/bigint/Uint8Array. */
function clean(name: TableName, input: Record<string, unknown>) {
  const { cols, json } = TABLES[name];
  const out: Record<string, string | number | null> = {};
  for (const col of cols) {
    if (!(col in input)) continue;
    const v = input[col];
    if (json.includes(col)) out[col] = JSON.stringify(v ?? []);
    else if (typeof v === "boolean") out[col] = v ? 1 : 0;
    else if (v === undefined || v === null || v === "") out[col] = null;
    else if (typeof v === "number") out[col] = v;
    else out[col] = String(v);
  }
  return out;
}

const unauthorized = () => Response.json({ error: "Unauthorized" }, { status: 401 });

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  if (!(await isAdmin())) return unauthorized();
  const { table } = await params;
  if (table === "photos") return Response.json(listPhotos());
  if (table === "posts") return Response.json(listPosts());
  if (table === "projects") return Response.json(listProjects());
  return Response.json({ error: "Unknown table" }, { status: 404 });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  if (!(await isAdmin())) return unauthorized();
  const { table } = await params;
  const s = spec(table);
  if (!s) return Response.json({ error: "Unknown table" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  if (!body) return Response.json({ error: "Bad JSON" }, { status: 400 });

  const row = clean(table as TableName, body);
  const cols = Object.keys(row);
  if (!cols.length) return Response.json({ error: "Nothing to insert" }, { status: 400 });

  try {
    const info = getDb()
      .prepare(
        `INSERT INTO ${table} (${cols.join(", ")}) VALUES (${cols.map(() => "?").join(", ")})`
      )
      .run(...cols.map((c) => row[c]));
    return Response.json({ id: Number(info.lastInsertRowid) });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  if (!(await isAdmin())) return unauthorized();
  const { table } = await params;
  const s = spec(table);
  if (!s) return Response.json({ error: "Unknown table" }, { status: 404 });

  const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
  const id = Number(body?.id);
  if (!body || !Number.isInteger(id)) {
    return Response.json({ error: "id required" }, { status: 400 });
  }

  const row = clean(table as TableName, body);
  const cols = Object.keys(row).filter((c) => c !== "id");
  if (!cols.length) return Response.json({ error: "Nothing to update" }, { status: 400 });

  try {
    getDb().prepare(
      `UPDATE ${table} SET ${cols.map((c) => `${c} = ?`).join(", ")} WHERE id = ?`
    ).run(...cols.map((c) => row[c]), id);
    return Response.json({ ok: true });
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ table: string }> }
) {
  if (!(await isAdmin())) return unauthorized();
  const { table } = await params;
  if (!spec(table)) return Response.json({ error: "Unknown table" }, { status: 404 });

  const id = Number(new URL(req.url).searchParams.get("id"));
  if (!Number.isInteger(id)) return Response.json({ error: "id required" }, { status: 400 });

  getDb().prepare(`DELETE FROM ${table} WHERE id = ?`).run(id);
  return Response.json({ ok: true });
}
