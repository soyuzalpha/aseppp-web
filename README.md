Portfolio site — Next.js 16 (App Router), React 19, Tailwind 3, GSAP.

## Development

```bash
pnpm install
pnpm dev          # http://localhost:5000
pnpm lint
pnpm exec tsc --noEmit
pnpm build
```

## Content

Posts, projects and photos live in a SQLite database at `storage/app.db`,
not in the page components. The pages are server components that read from it
and hand plain objects to client components; each is `force-dynamic`, so an
edit is live on the next request without a rebuild.

```
src/lib/db.ts     schema, queries, one-time seed of the old hardcoded content
src/lib/auth.ts   admin session
src/lib/body.ts   post body <-> markdown-ish text
src/lib/types.ts  shared shapes (no server imports — safe for client components)
storage/          app.db + uploaded photos (gitignored, mounted into the container)
```

`src/lib/db.ts` opens the database lazily and seeds it once, so a fresh
checkout or a fresh volume comes up with the original content instead of a
blank site.

## Admin

`/admin` — single password, no username.

The password comes from `ADMIN_PASSWORD` if set, otherwise it is generated
into `storage/admin.password` on first visit and printed to the server log:

```bash
cat storage/admin.password
```

From there you can:

- **photos** — upload images (multi-select), set a category, edit alt text and
  category inline, delete. Files land in `storage/photos/<category>/` and are
  served through `/media/...`, which is why they survive a redeploy while
  `public/` does not.
- **posts** — slug, title, date, read time, tags, excerpt, featured, and a body
  written as plain text:

  ```
  ## Heading
  ### Subheading
  > quote
  - bullet
  ``` fenced code ```
  blank line separates blocks
  ```

- **projects** — the list-page fields plus the detail-page ones. Stack is one
  `Layer: tool, tool` line per layer; related projects are slugs.

Uploads accept jpg/jpeg/png/webp/avif/gif up to 25 MB. Image dimensions are
read in the browser to set the grid aspect ratio.

## Checks

`scripts/check-admin.sh` exercises auth, CRUD, upload, the media guards and the
404s against a running server:

```bash
pnpm exec next start -p 5101 &
./scripts/check-admin.sh
```

## Deploy

`.github/workflows/deploy.yml` runs on push to `main` on a self-hosted runner:
lint, typecheck, build, docker build, boot a test container, health check, then
replace the production container.

Both containers bind `-v /srv/aseppp-web/storage:/app/storage`, so the database
and uploaded photos live on the host and outlive the image.
