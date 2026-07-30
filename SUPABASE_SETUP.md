# Connect Alpha Layers to Supabase (step-by-step)

## What gets stored in Supabase
- Admin users + roles/features
- Form submissions (contact / quote / newsletter)
- Blogs
- Newsletter subscribers + campaigns
- Website content (CMS)
- Attendance
- Notes
- Projects + tasks
- GA settings (OAuth tokens)

Local JSON (`data/*.json`) is still used when `STORAGE_MODE=json`.

---

## Step 1 — Create a Supabase project
1. Go to [https://supabase.com](https://supabase.com) and sign in.
2. Click **New project**.
3. Choose organization, project name (e.g. `alphalayers`), password, region.
4. Wait until the project is ready.

## Step 2 — Create all tables
1. In Supabase: **SQL Editor** → **New query**.
2. Open this file in your repo: `supabase/schema.sql`
3. Copy everything → paste into SQL Editor → click **Run**.
4. Confirm tables appear under **Table Editor**:
   - `admin_users`, `submissions`, `blogs`
   - `newsletter_subscribers`, `newsletter_campaigns`
   - `site_content`, `attendance`, `notes`, `projects`, `ga_settings`

## Step 3 — Copy API keys
1. Open **Project Settings** → **API**.
2. Copy:
   - **Project URL** → `SUPABASE_URL`
   - **service_role** key (secret!) → `SUPABASE_SERVICE_ROLE_KEY`
3. Never expose `service_role` in the browser or commit it to Git.

## Step 4 — Add keys to `.env.local`
Add/update these lines in `.env.local`:

```env
STORAGE_MODE=supabase
SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
```

Optional (keep newsletter in demo until Resend is ready):

```env
NEWSLETTER_MODE=demo
```

## Step 5 — Restart the app
```bash
# stop current dev server, then:
npm run dev
```

## Step 6 — Verify connection
1. Open `http://localhost:3000/admin` and sign in.
2. Call (while logged in) `/api/admin/storage`
   - Should show `"enabled": true`, `"mode": "supabase"`.
3. Create a test blog / subscriber / team user.
4. Check **Table Editor** in Supabase — rows should appear.

## Step 7 — First login after switch
- First request to users will auto-seed:
  - email: `admin@alphalayers.in`
  - password: your `ADMIN_PASSWORD` (default `alphalayers`)
- Or use password-only legacy super-admin login.

## Step 8 — Vercel / production
1. In Vercel project → **Settings → Environment Variables**
2. Add the same:
   - `STORAGE_MODE=supabase`
   - `SUPABASE_URL=...`
   - `SUPABASE_SERVICE_ROLE_KEY=...`
   - plus existing `ADMIN_PASSWORD`, `ADMIN_SECRET`, GA keys, `APP_URL`
3. Redeploy.

## Step 9 — (Optional) migrate old local JSON data
If you already have data in `data/*.json` and want it in Supabase:
1. Keep a backup of the `data/` folder.
2. Either re-enter important records from admin UI, or ask the agent to run a one-time import script.

## Troubleshooting
| Issue | Fix |
|--------|-----|
| `enabled: false` | `STORAGE_MODE` must be exactly `supabase` + both keys set |
| Table missing errors | Re-run `supabase/schema.sql` |
| RLS / permission errors | Use **service_role** key (not anon) on the server |
| Login fails after switch | Seeded admin uses `ADMIN_PASSWORD`; try `admin@alphalayers.in` |

## Security notes
- Use **service_role** only on the Next.js server (API routes / server libs).
- Keep RLS enabled (schema already enables it).
- Rotate keys if they were ever shared in chat or committed.
