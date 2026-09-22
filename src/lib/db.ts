import { DatabaseSync } from "node:sqlite";
import { mkdirSync } from "node:fs";
import path from "node:path";
import seedData from "./seed-data.json";
import type { Block, Photo, Post, Project } from "./types";

export type { Block, Photo, Post, Project };

/* ── Storage layout ───────────────────────────────────────────────
   storage/app.db            sqlite (WAL)
   storage/photos/<cat>/<f>  uploaded photos
   storage/admin.password    admin password (generated if absent)
────────────────────────────────────────────────────────────────── */
export const STORAGE_DIR = path.join(process.cwd(), "storage");
export const PHOTOS_DIR = path.join(STORAGE_DIR, "photos");

/* ponytail: one process-wide sync connection — node:sqlite is
   synchronous, so a pool buys nothing. Opened lazily on first query:
   `next build` imports every route module, and touching the database
   at import time would make the build mutate content. */
const g = globalThis as unknown as { __asepppDb?: DatabaseSync };

export function getDb(): DatabaseSync {
  return (g.__asepppDb ??= open());
}

function open(): DatabaseSync {
  mkdirSync(PHOTOS_DIR, { recursive: true });

  const db = new DatabaseSync(path.join(STORAGE_DIR, "app.db"));
  // First statement on every connection: concurrent openers then wait for the
  // lock instead of failing outright. Several server workers share this file.
  db.exec("PRAGMA busy_timeout = 15000;");
  db.exec("PRAGMA foreign_keys = ON;");

  // Steady state is a plain read, so workers starting together never contend
  // for a write lock. Only a missing or unseeded database takes one.
  if (needsInit(db)) init(db);
  return db;
}

/** Read-only probe. Also self-heals a database left half-created by an
    earlier failed init (header-only file, no tables). */
function needsInit(db: DatabaseSync): boolean {
  const hasSettings = db
    .prepare("SELECT 1 FROM sqlite_master WHERE type = 'table' AND name = 'settings'")
    .get();
  if (!hasSettings) return true;
  return !db.prepare("SELECT 1 FROM settings WHERE key = 'seeded'").get();
}

/** Runs once per database, not once per connection. WAL is a persistent
    database property, so it belongs here rather than in open(). */
function init(db: DatabaseSync) {
  const sleep = (ms: number) =>
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

  for (let attempt = 1; ; attempt++) {
    try {
      db.exec("PRAGMA journal_mode = WAL;");

      // BEGIN IMMEDIATE takes the write lock up front, so schema creation and
      // the one-time seed can't interleave with another worker doing the same.
      db.exec("BEGIN IMMEDIATE");
      try {
        db.exec(`
          CREATE TABLE IF NOT EXISTS photos (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            src        TEXT    NOT NULL,
            alt        TEXT    NOT NULL DEFAULT '',
            cat        TEXT    NOT NULL DEFAULT 'Daily',
            w          INTEGER NOT NULL DEFAULT 1,
            h          INTEGER NOT NULL DEFAULT 1,
            sort       INTEGER NOT NULL DEFAULT 0,
            created_at TEXT    NOT NULL DEFAULT (datetime('now'))
          );

          CREATE TABLE IF NOT EXISTS posts (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            slug       TEXT    NOT NULL UNIQUE,
            title      TEXT    NOT NULL,
            date       TEXT    NOT NULL DEFAULT '',
            read_time  INTEGER NOT NULL DEFAULT 1,
            tags       TEXT    NOT NULL DEFAULT '[]',
            excerpt    TEXT    NOT NULL DEFAULT '',
            body       TEXT    NOT NULL DEFAULT '[]',
            featured   INTEGER NOT NULL DEFAULT 0,
            sort       INTEGER NOT NULL DEFAULT 0,
            created_at TEXT    NOT NULL DEFAULT (datetime('now'))
          );

          CREATE TABLE IF NOT EXISTS projects (
            id         INTEGER PRIMARY KEY AUTOINCREMENT,
            slug       TEXT    NOT NULL UNIQUE,
            n          TEXT    NOT NULL DEFAULT '',
            title      TEXT    NOT NULL,
            year       TEXT    NOT NULL DEFAULT '',
            role       TEXT    NOT NULL DEFAULT '',
            status     TEXT    NOT NULL DEFAULT '',
            tags       TEXT    NOT NULL DEFAULT '[]',
            github     TEXT    NOT NULL DEFAULT '',
            live       TEXT,
            desc       TEXT    NOT NULL DEFAULT '',
            summary    TEXT    NOT NULL DEFAULT '',
            challenge  TEXT    NOT NULL DEFAULT '',
            solution   TEXT    NOT NULL DEFAULT '',
            outcome    TEXT    NOT NULL DEFAULT '',
            stack      TEXT    NOT NULL DEFAULT '[]',
            related    TEXT    NOT NULL DEFAULT '[]',
            sort       INTEGER NOT NULL DEFAULT 0,
            created_at TEXT    NOT NULL DEFAULT (datetime('now'))
          );

          CREATE TABLE IF NOT EXISTS settings (
            key   TEXT PRIMARY KEY,
            value TEXT NOT NULL
          );
        `);
        seedOnce(db);
        db.exec("COMMIT");
      } catch (err) {
        db.exec("ROLLBACK");
        throw err;
      }
      return;
    } catch (err) {
      // 5 = SQLITE_BUSY: another worker is initialising. Wait, then re-probe.
      if ((err as { errcode?: number }).errcode !== 5 || attempt >= 4) throw err;
      sleep(250 * attempt);
      if (!needsInit(db)) return;
    }
  }
}

/* One-time import of the content that used to be hardcoded in the page
   components, so the site is never blank before the first upload. The flag is
   written in the same transaction that checks it, and emptying a table later
   must not resurrect the seed. Takes the connection as an argument: calling
   getDb() here would re-enter open() before the cache is populated. */
function seedOnce(db: DatabaseSync) {
  if (db.prepare("SELECT 1 FROM settings WHERE key = 'seeded'").get()) return;

  const photo = db.prepare(
    "INSERT INTO photos (src, alt, cat, w, h, sort) VALUES (?, ?, ?, ?, ?, ?)"
  );
  const post = db.prepare(
    `INSERT INTO posts (slug, title, date, read_time, tags, excerpt, body, featured, sort)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const project = db.prepare(
    `INSERT INTO projects
       (slug, n, title, year, role, status, tags, github, live, desc,
        summary, challenge, solution, outcome, stack, related, sort)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );

  for (const p of seedData.photos) photo.run(p.src, p.alt, p.cat, p.w, p.h, p.sort);
  for (const p of seedData.posts)
    post.run(
      p.slug,
      p.title,
      p.date,
      p.readTime,
      JSON.stringify(p.tags),
      p.excerpt,
      JSON.stringify(p.body),
      p.featured,
      p.sort
    );
  for (const p of seedData.projects)
    project.run(
      p.slug,
      p.n,
      p.title,
      p.year,
      p.role,
      p.status,
      JSON.stringify(p.tags),
      p.github,
      p.live,
      p.desc,
      p.summary,
      p.challenge,
      p.solution,
      p.outcome,
      JSON.stringify(p.stack),
      JSON.stringify(p.related),
      p.sort
    );

  db.prepare("INSERT INTO settings (key, value) VALUES ('seeded', '1')").run();
}

/* ── JSON columns ───────────────────────────────────────────────── */
const j = (v: unknown, fallback: unknown) => {
  if (typeof v !== "string") return fallback;
  try {
    return JSON.parse(v);
  } catch {
    return fallback;
  }
};

/* ── Photos ─────────────────────────────────────────────────────── */
export function listPhotos(): Photo[] {
  // Spread: node:sqlite hands back null-prototype rows, which cannot cross
  // the server -> client component boundary.
  return (
    getDb()
      .prepare("SELECT id, src, alt, cat, w, h FROM photos ORDER BY sort, id")
      .all() as unknown as Photo[]
  ).map((r) => ({ ...r }));
}

/* ── Posts ──────────────────────────────────────────────────────── */
type PostRow = Omit<Post, "tags" | "body" | "featured"> & {
  tags: string;
  body: string;
  featured: number;
};

const toPost = (r: PostRow): Post => ({
  ...r,
  tags: j(r.tags, []),
  body: j(r.body, []),
  featured: !!r.featured,
});

const POST_COLS =
  "id, slug, title, date, read_time AS readTime, tags, excerpt, body, featured";

export function listPosts(): Post[] {
  const rows = getDb()
    .prepare(`SELECT ${POST_COLS} FROM posts ORDER BY sort, id`)
    .all() as unknown as PostRow[];
  return rows.map(toPost);
}

export function getPost(slug: string): Post | null {
  const r = getDb()
    .prepare(`SELECT ${POST_COLS} FROM posts WHERE slug = ?`)
    .get(slug) as unknown as PostRow | undefined;
  return r ? toPost(r) : null;
}

/* ── Projects ───────────────────────────────────────────────────── */
type ProjectRow = Omit<Project, "tags" | "stack" | "related"> & {
  tags: string;
  stack: string;
  related: string;
};

const PROJECT_COLS =
  "id, slug, n, title, year, role, status, tags, github, live, desc, summary, challenge, solution, outcome, stack, related";

const toProject = (r: ProjectRow): Project => ({
  ...r,
  tags: j(r.tags, []),
  stack: j(r.stack, []),
  related: j(r.related, []),
});

export function listProjects(): Project[] {
  const rows = getDb()
    .prepare(`SELECT ${PROJECT_COLS} FROM projects ORDER BY sort, id`)
    .all() as unknown as ProjectRow[];
  return rows.map(toProject);
}

export function getProject(slug: string): Project | null {
  const r = getDb()
    .prepare(`SELECT ${PROJECT_COLS} FROM projects WHERE slug = ?`)
    .get(slug) as unknown as ProjectRow | undefined;
  return r ? toProject(r) : null;
}
