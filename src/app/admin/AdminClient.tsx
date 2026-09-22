"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { parseBody, serializeBody } from "@/lib/body";

type Row = Record<string, unknown> & { id: number };
type Tab = "photos" | "posts" | "projects";

type FieldDef = {
  k: string;
  label?: string;
  type?: "text" | "number" | "textarea" | "body" | "stack" | "list" | "checkbox";
  hint?: string;
};

/* Form layout is data, not three bespoke forms: one renderer covers posts
   and projects, and adding a column means adding one line here. */
const FIELDS: Record<"posts" | "projects", FieldDef[]> = {
  posts: [
    { k: "slug", hint: "url slug, must be unique" },
    { k: "title" },
    { k: "date", hint: "e.g. Aug 15, 2024" },
    { k: "read_time", label: "Read time (min)", type: "number" },
    { k: "tags", label: "Tags", type: "list", hint: "comma separated" },
    { k: "excerpt", type: "textarea" },
    { k: "body", type: "body", hint: "## heading · ### sub · > quote · - bullet · ``` code ```" },
    { k: "featured", type: "checkbox" },
    { k: "sort", type: "number", hint: "lower shows first" },
  ],
  projects: [
    { k: "slug", hint: "url slug, must be unique" },
    { k: "n", label: "Number", hint: "e.g. 01" },
    { k: "title" },
    { k: "year" },
    { k: "role", hint: "used as filter, e.g. Fullstack" },
    { k: "status", hint: "e.g. Live, WIP" },
    { k: "tags", label: "Tags", type: "list" },
    { k: "github", label: "GitHub URL" },
    { k: "live", label: "Live URL" },
    { k: "desc", label: "Short description (list page)", type: "textarea" },
    { k: "summary", label: "Summary (detail page)", type: "textarea" },
    { k: "challenge", type: "textarea" },
    { k: "solution", type: "textarea" },
    { k: "outcome", type: "textarea" },
    { k: "stack", label: "Stack", type: "stack", hint: "one per line — Layer: tool, tool" },
    { k: "related", label: "Related slugs", type: "list" },
    { k: "sort", type: "number" },
  ],
};

const parseStack = (text: string) =>
  text
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [layer, rest = ""] = line.split(":");
      return {
        layer: layer.trim(),
        tools: rest.split(",").map((t) => t.trim()).filter(Boolean),
      };
    });

const formatStack = (value: unknown) =>
  (Array.isArray(value) ? value : [])
    .map((s) => `${s.layer}: ${s.tools.join(", ")}`)
    .join("\n");

function toForm(table: Tab, row: Row | null): Record<string, string | boolean> {
  const out: Record<string, string | boolean> = {};
  for (const f of FIELDS[table as "posts" | "projects"]) {
    const v = row?.[f.k];
    if (f.type === "checkbox") out[f.k] = Boolean(v);
    else if (f.type === "list") out[f.k] = Array.isArray(v) ? v.join(", ") : String(v ?? "");
    else if (f.type === "stack") out[f.k] = formatStack(v);
    else if (f.type === "body") out[f.k] = serializeBody(Array.isArray(v) ? v : []);
    else out[f.k] = v === null || v === undefined ? "" : String(v);
  }
  return out;
}

function toPayload(table: Tab, form: Record<string, string | boolean>) {
  const out: Record<string, unknown> = {};
  for (const f of FIELDS[table as "posts" | "projects"]) {
    const v = form[f.k];
    if (f.type === "list")
      out[f.k] = String(v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
    else if (f.type === "stack") out[f.k] = parseStack(String(v ?? ""));
    else if (f.type === "body") out[f.k] = parseBody(String(v ?? ""));
    else if (f.type === "number") out[f.k] = Number(v) || 0;
    else if (f.type === "checkbox") out[f.k] = Boolean(v);
    else out[f.k] = String(v ?? "");
  }
  return out;
}

/** Aspect hint the pics grid needs; read from the file in the browser
    rather than pulling an image-decoding dependency into the server. */
function orientation(file: File): Promise<[number, number]> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const ratio = img.naturalWidth / img.naturalHeight;
      URL.revokeObjectURL(url);
      resolve(ratio > 1.2 ? [2, 1] : ratio < 0.8 ? [1, 2] : [1, 1]);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      resolve([1, 1]);
    };
    img.src = url;
  });
}

const box: React.CSSProperties = {
  background: "none",
  border: "1px solid var(--color-border)",
  padding: "0.5rem 0.6rem",
  fontFamily: "var(--font-mono)",
  fontSize: "0.8125rem",
  color: "var(--color-foreground)",
  width: "100%",
};

export default function AdminClient() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>("photos");
  const [items, setItems] = useState<Row[]>([]);
  const [form, setForm] = useState<Record<string, string | boolean>>({});
  const [editing, setEditing] = useState<number | null>(null);
  const [cat, setCat] = useState("");
  const [msg, setMsg] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(
    async (which: Tab) => {
      const res = await fetch(`/api/admin/${which}`);
      if (res.status === 401) return router.refresh();
      setItems((await res.json()) as Row[]);
    },
    [router]
  );

  useEffect(() => {
    setForm({});
    setEditing(null);
    setMsg("");
    load(tab);
  }, [tab, load]);

  async function send(method: string, url: string, body?: unknown) {
    setBusy(true);
    const res = await fetch(url, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    setBusy(false);
    if (!res.ok) {
      const detail = (await res.json().catch(() => ({}))) as { error?: string };
      setMsg(detail.error ?? `Request failed (${res.status})`);
      return false;
    }
    await load(tab);
    return true;
  }

  async function save() {
    const payload = toPayload(tab, form);
    const ok =
      editing === null
        ? await send("POST", `/api/admin/${tab}`, payload)
        : await send("PATCH", `/api/admin/${tab}`, { ...payload, id: editing });
    if (ok) {
      setMsg(editing === null ? "Created" : "Saved");
      setForm({});
      setEditing(null);
    }
  }

  async function remove(id: number) {
    if (!confirm(`Delete ${tab} #${id}?`)) return;
    if (await send("DELETE", `/api/admin/${tab}?id=${id}`)) {
      setMsg("Deleted");
      if (editing === id) {
        setEditing(null);
        setForm({});
      }
    }
  }

  async function upload(files: FileList) {
    if (!cat.trim()) {
      setMsg("Enter a category first");
      return;
    }
    setBusy(true);
    for (const file of Array.from(files)) {
      const [w, h] = await orientation(file);
      const fd = new FormData();
      fd.append("file", file);
      fd.append("cat", cat.trim());
      fd.append("alt", file.name.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " "));
      fd.append("w", String(w));
      fd.append("h", String(h));
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
      if (!res.ok) {
        const detail = (await res.json().catch(() => ({}))) as { error?: string };
        setMsg(`${file.name}: ${detail.error ?? "upload failed"}`);
        setBusy(false);
        return;
      }
    }
    setBusy(false);
    setMsg(`Uploaded ${files.length} file(s)`);
    await load("photos");
  }

  const cats = Array.from(new Set(items.map((r) => String(r.cat)))).filter(Boolean);
  const editable = tab !== "photos";

  return (
    <main style={{ paddingTop: "6rem", paddingBottom: "5rem", maxWidth: "60rem" }} className="col">
      <div className="flex items-center justify-between flex-wrap gap-3 mb-6">
        <p className="type-label" style={{ color: "var(--color-accent)" }}>Admin</p>
        <button
          className="type-index tap-target"
          style={{ cursor: "default", color: "var(--color-mutedForeground)" }}
          onClick={async () => {
            await fetch("/api/admin/login", { method: "DELETE" });
            router.refresh();
          }}
        >
          Sign out
        </button>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2" style={{ borderBottom: "1px solid var(--color-border)", paddingBottom: "1rem" }}>
        {(["photos", "posts", "projects"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className="type-label tap-target"
            style={{
              cursor: "default",
              background: "none",
              border: "none",
              padding: 0,
              color: t === tab ? "var(--color-foreground)" : "var(--color-mutedForeground)",
              borderBottom: t === tab ? "1px solid var(--color-accent)" : "1px solid transparent",
            }}
          >
            {t}
          </button>
        ))}
      </div>

      {msg && (
        <p className="type-index" style={{ color: "var(--color-accent)", paddingBlock: "0.75rem" }}>
          {msg}
        </p>
      )}

      {/* ── Photos ── */}
      {tab === "photos" && (
        <>
          <div style={{ paddingBlock: "1.5rem", display: "flex", flexWrap: "wrap", gap: "0.75rem", alignItems: "center" }}>
            <input
              list="photo-cats"
              placeholder="Category (e.g. Nature)"
              value={cat}
              onChange={(e) => setCat(e.target.value)}
              className="tap-input"
              style={{ ...box, maxWidth: "16rem" }}
            />
            <datalist id="photo-cats">
              {cats.map((c) => (
                <option key={c} value={c} />
              ))}
            </datalist>
            <input
              type="file"
              accept="image/*"
              multiple
              disabled={busy}
              onChange={(e) => {
                if (e.target.files?.length) upload(e.target.files);
                e.target.value = "";
              }}
              className="type-index tap-input"
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(13rem, 1fr))",
              gap: "1rem",
            }}
          >
            {items.map((p) => (
              <div key={p.id} style={{ border: "1px solid var(--color-border)" }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={String(p.src)}
                  alt={String(p.alt)}
                  style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }}
                />
                <div style={{ padding: "0.5rem", display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                  <input
                    defaultValue={String(p.alt)}
                    aria-label="Alt text"
                    className="tap-input"
                    onBlur={(e) =>
                      e.target.value !== p.alt &&
                      send("PATCH", "/api/admin/photos", { id: p.id, alt: e.target.value })
                    }
                    style={box}
                  />
                  <div className="flex gap-2 items-center">
                    <input
                      defaultValue={String(p.cat)}
                      aria-label="Category"
                      className="tap-input"
                      onBlur={(e) =>
                        e.target.value !== p.cat &&
                        send("PATCH", "/api/admin/photos", { id: p.id, cat: e.target.value })
                      }
                      style={box}
                    />
                    <button
                      onClick={() => remove(p.id)}
                      className="type-index tap-target"
                      style={{ cursor: "default", color: "var(--color-accent)", flexShrink: 0 }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* ── Posts / Projects ── */}
      {editable && (
        <div
          className="split"
          style={{
            paddingBlock: "1.5rem",
            ["--split-a" as string]: "minmax(0, 22rem)",
            ["--split-gap" as string]: "2rem",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <div className="flex items-center justify-between">
              <p className="type-index">{items.length} rows</p>
              <button
                className="type-index tap-target"
                style={{ cursor: "default", color: "var(--color-accent)" }}
                onClick={() => {
                  setEditing(null);
                  setForm({});
                  setMsg("");
                }}
              >
                + New
              </button>
            </div>
            <div style={{ borderTop: "1px solid var(--color-border)" }}>
              {items.map((r) => (
                <div
                  key={r.id}
                  style={{
                    borderBottom: "1px solid var(--color-border)",
                    padding: "0.5rem 0",
                    display: "flex",
                    gap: "0.5rem",
                    alignItems: "baseline",
                  }}
                >
                  <button
                    onClick={() => {
                      setEditing(r.id);
                      setForm(toForm(tab, r));
                      setMsg("");
                    }}
                    className="type-index tap-target"
                    style={{
                      cursor: "default",
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      padding: 0,
                      flex: 1,
                      color: r.id === editing ? "var(--color-accent)" : "var(--color-foreground)",
                    }}
                  >
                    {String(r.slug)}
                  </button>
                  <button
                    onClick={() => remove(r.id)}
                    className="type-index tap-target"
                    style={{ cursor: "default", background: "none", border: "none", padding: 0, color: "var(--color-mutedForeground)" }}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <p className="type-index">
              {editing === null ? `New ${tab.replace(/s$/, "")}` : `Editing #${editing}`}
            </p>
            {FIELDS[tab as "posts" | "projects"].map((f) => (
              <label key={f.k} style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
                <span className="type-index">
                  {f.label ?? f.k}
                  {f.hint ? ` — ${f.hint}` : ""}
                </span>
                {f.type === "checkbox" ? (
                  <input
                    type="checkbox"
                    checked={Boolean(form[f.k])}
                    onChange={(e) => setForm({ ...form, [f.k]: e.target.checked })}
                  />
                ) : f.type === "textarea" || f.type === "body" || f.type === "stack" ? (
                  <textarea
                    rows={f.type === "body" ? 14 : f.type === "stack" ? 4 : 3}
                    value={String(form[f.k] ?? "")}
                    onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                    className="tap-input"
                    style={{ ...box, fontFamily: f.type === "body" ? "var(--font-mono)" : "var(--font-body)" }}
                  />
                ) : (
                  <input
                    type={f.type === "number" ? "number" : "text"}
                    value={String(form[f.k] ?? "")}
                    onChange={(e) => setForm({ ...form, [f.k]: e.target.value })}
                    className="tap-input"
                    style={box}
                  />
                )}
              </label>
            ))}
            <button
              onClick={save}
              disabled={busy}
              className="type-label tap-target"
              style={{ cursor: "default", alignSelf: "flex-start", marginTop: "0.5rem" }}
            >
              {busy ? "Saving…" : editing === null ? "Create" : "Save changes"}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
