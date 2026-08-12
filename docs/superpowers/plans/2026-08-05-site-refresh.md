# Site Refresh Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all fictional placeholder content on augustoamaral.com with real content: photos, reordered experiences, real Liz and Arte à Mesa product pages, a real Shelf with dedicated system pages, and app screenshots.

**Architecture:** Astro 6 static site in `site/` with per-locale page duplication (`src/pages/*.astro` EN, `src/pages/pt/*.astro` PT) plus shared strings in `src/i18n/ui.ts`. New images live in `site/src/assets/` and render through `astro:assets` `<Image>`. Screenshots are captured once, before page work, from locally-run instances of the two products.

**Tech Stack:** Astro 6.1.9 (static, bun), Playwright MCP browser tools for captures, git worktree for the Arte à Mesa opus branch, docker compose + bun for the Liz stack.

**Spec:** `docs/superpowers/specs/2026-08-05-site-refresh-design.md`

## Global Constraints

- Every page change ships in BOTH locales: the EN page and its `pt/` twin, plus any `ui.ts` keys added to both `en` and `pt` maps.
- No `href="#"` may survive anywhere in `site/src`.
- No client names (the Liz clinic, its owner), no Spring Health internals, no colleague names, no VPS/infra identifiers, no vault note content anywhere on the site.
- Liz backend must ALWAYS run with `WHATSAPP_ENABLED=false` and a throwaway database — never the existing dev DB, never the production dump.
- The `~/dev/arte-a-mesa-superpowers` main checkout (qwen branch, dirty) is never touched; opus branch runs only in a temporary worktree.
- Reuse existing CSS custom properties (`--font-serif`, `--fg-muted`, `--bg-elevated`, `--border`, `--accent-warm`, `--space-*`) and existing class patterns (`.container`, `.section-border`, `.mono-label`, `.page-h1`, `.page-label`, `.inline-link`, `.index-row`).
- Commit after each task on branch `feat/site-refresh`. Commits in English, no Co-Authored-By trailer.
- Work from repo root `/Users/augustopereira/dev/augustoamaral.com`; site commands run in `site/` with bun (`bun install`, `bun run build`).
- Verification for content tasks = `cd site && bun run build` passes + rendered check via dev server. There is no JS test framework in the site and none is added.

---

### Task 1: Experience photos into site assets

**Files:**
- Create: `site/src/assets/experiences/zoolatech.jpg` (from `~/Downloads/068.jpg`)
- Create: `site/src/assets/experiences/three60.jpg` (from `~/Downloads/IMG_0258.JPG`)
- Create: `site/src/assets/experiences/ods.jpg` (from `~/Downloads/SAVE_20200312_244643.jpg`)

**Interfaces:**
- Produces: the three asset paths above, imported by Task 5 as `zoolatechPhoto`, `three60Photo`, `odsPhoto`.

- [ ] **Step 1: Copy (never move) the photos**

```bash
mkdir -p /Users/augustopereira/dev/augustoamaral.com/site/src/assets/experiences
cp ~/Downloads/068.jpg /Users/augustopereira/dev/augustoamaral.com/site/src/assets/experiences/zoolatech.jpg
cp ~/Downloads/IMG_0258.JPG /Users/augustopereira/dev/augustoamaral.com/site/src/assets/experiences/three60.jpg
cp ~/Downloads/SAVE_20200312_244643.jpg /Users/augustopereira/dev/augustoamaral.com/site/src/assets/experiences/ods.jpg
```

- [ ] **Step 2: Downscale the oversized originals in place**

`zoolatech.jpg` is 5.7MB / 5636px wide. Downscale all three to max 1600px wide with sips (macOS built-in), quality is preserved enough for a 340px-tall slot:

```bash
cd /Users/augustopereira/dev/augustoamaral.com/site/src/assets/experiences
sips --resampleWidth 1600 zoolatech.jpg three60.jpg ods.jpg
ls -la
```

Expected: each file now well under 1.5MB (Astro `<Image>` compresses further at build).

- [ ] **Step 3: Commit**

```bash
git add site/src/assets/experiences
git commit -m "Add experience photos (ODS, Three60, Zoolatech)"
```

---

### Task 2: Arte à Mesa screenshots (opus branch via worktree)

**Files:**
- Create: `site/src/assets/arte-a-mesa/catalog.png`
- Create: `site/src/assets/arte-a-mesa/rentals.png`
- Create: `site/src/assets/arte-a-mesa/new-rental.png`
- Create: `site/src/assets/arte-a-mesa/client-detail.png`

**Interfaces:**
- Produces: the four asset paths above, imported by Task 7. If a screen cannot be captured, produce the ones that can and report which are missing — Task 7 renders whatever exists in the directory.

- [ ] **Step 1: Create an isolated worktree for the opus branch**

The main checkout is on the qwen branch with uncommitted changes — do not touch it. Use the session scratchpad:

```bash
cd ~/dev/arte-a-mesa-superpowers
git worktree add "$SCRATCHPAD/arte-a-mesa-opus" feat/arte-a-mesa/claude-opus
```

(`$SCRATCHPAD` = the session scratchpad directory; any temp dir outside the repo works.)

- [ ] **Step 2: Install, migrate, seed**

```bash
cd "$SCRATCHPAD/arte-a-mesa-opus"
npm install
npm run migrate && npm run seed
```

If `migrate` fails on a missing `DATABASE_URL`: check `apps/api/.env.test` for the expected variable format and create `apps/api/.env` with `DATABASE_URL="file:./dev.db"`, then re-run.

- [ ] **Step 3: Run the stack**

```bash
npm run dev
```

Run in background. Expected: API on :3000, web on :5173. Verify with `curl -s http://localhost:5173 | head -5`.

- [ ] **Step 4: Capture the four screens with Playwright MCP**

Use the Playwright browser tools at 1440×900. Navigate the seeded app and capture full-page PNGs directly into the site assets dir (`mkdir -p site/src/assets/arte-a-mesa` first):

1. Catalog listing → `catalog.png`
2. Rentals list → `rentals.png`
3. New rental form (with the form open/filled from seed data) → `new-rental.png`
4. A client detail view → `client-detail.png`

Routes are discoverable from the app's nav; the seed provides data. Only seed data may appear — if any screen surfaces something that looks like real customer data, skip that screen and report it.

- [ ] **Step 5: Tear down**

Stop the dev processes, then remove the worktree (safe: nothing was committed in it; created in Step 1 for this purpose):

```bash
cd ~/dev/arte-a-mesa-superpowers
git worktree remove "$SCRATCHPAD/arte-a-mesa-opus" --force
```

- [ ] **Step 6: Commit**

```bash
cd /Users/augustopereira/dev/augustoamaral.com
git add site/src/assets/arte-a-mesa
git commit -m "Add Arte à Mesa screenshots from the Opus build"
```

---

### Task 3: Liz screenshots (throwaway DB, WhatsApp OFF)

**Files:**
- Create: `site/src/assets/liz/simulator.png`
- Create: `site/src/assets/liz/dashboard.png`

**Interfaces:**
- Produces: the two asset paths above, imported by Task 6. Partial capture is acceptable — Task 6 renders whatever exists; report gaps honestly.

**Hard safety rules for this task:**
- `WHATSAPP_ENABLED=false` on every backend launch (a stored session must never connect — it would knock the production bot offline).
- Fresh database `falaliz_screenshots`, never `falaliz_db` (the dev volume may hold the production dump). Never load `dump_prod_*.sql`.
- No real patient/client data in any capture.

- [ ] **Step 1: Start postgres and create a throwaway DB**

```bash
cd ~/dev/projeto-liz
docker compose up -d postgres
docker compose exec postgres psql -U falaliz -d postgres -c "DROP DATABASE IF EXISTS falaliz_screenshots;" -c "CREATE DATABASE falaliz_screenshots;"
```

- [ ] **Step 2: Migrate and (if available) seed demo data**

```bash
cd ~/dev/projeto-liz/backend
DATABASE_URL="postgresql://falaliz:falaliz_password@localhost:5432/falaliz_screenshots" bunx prisma migrate deploy
```

Then check `package.json` for a seed script (`grep -n '"seed"' package.json prisma/schema.prisma`). If one exists, run it with the same `DATABASE_URL` override. If not, continue — empty-state screens are still real.

- [ ] **Step 3: Run the backend with WhatsApp disabled**

```bash
cd ~/dev/projeto-liz/backend
DATABASE_URL="postgresql://falaliz:falaliz_password@localhost:5432/falaliz_screenshots" WHATSAPP_ENABLED=false bun run dev
```

Run in background. Verify it is up: `curl -s http://localhost:3000/health || curl -s http://localhost:3000 | head -3`.

- [ ] **Step 4: Run simulator and dashboard against it**

```bash
cd ~/dev/projeto-liz/simulator && VITE_API_URL=http://localhost:3000 bun run dev --port 5174
cd ~/dev/projeto-liz/dashboard && VITE_API_URL=http://localhost:3000 bun run dev --port 5175
```

Both in background.

- [ ] **Step 5: Capture with Playwright MCP (1440×900)**

- Simulator (`http://localhost:5174`): drive a short demo conversation if the UI allows (greeting → clinic-info question) and capture the chat view → `site/src/assets/liz/simulator.png`.
- Dashboard (`http://localhost:5175`): if it requires login, look for a seeded/registerable user (check `backend/prisma/seed*` and auth routes); if login is possible, capture the most visual screen — the conversation-flow graph view — → `site/src/assets/liz/dashboard.png`. If login is not achievable with demo credentials, capture nothing for the dashboard and report the gap. Do not fabricate.

- [ ] **Step 6: Tear down**

Stop the three dev processes (they were started by this task). Drop the throwaway DB and leave postgres as found:

```bash
cd ~/dev/projeto-liz
docker compose exec postgres psql -U falaliz -d postgres -c "DROP DATABASE IF EXISTS falaliz_screenshots;"
```

If postgres was NOT running before Step 1, also `docker compose stop postgres`.

- [ ] **Step 7: Commit**

```bash
cd /Users/augustopereira/dev/augustoamaral.com
git add site/src/assets/liz
git commit -m "Add Liz simulator/dashboard screenshots (demo data)"
```

---

### Task 4: i18n keys for all new content

**Files:**
- Modify: `site/src/i18n/ui.ts`

**Interfaces:**
- Produces: translation keys consumed by Tasks 5–12: `nav.arteamesa`, `arteamesa.label`, `principles.label` (changed), `shelf.intro` (changed), `liz.statusBadge`, plus the keys listed below. Later tasks reference these exact key names via `t('...')`.

- [ ] **Step 1: Add/adjust keys in BOTH locale maps**

In the `en` map:

```ts
'nav.arteamesa': 'arte à mesa',
'arteamesa.label': 'V — ARTE À MESA',
'liz.statusBadge': 'IN PRODUCTION',
'shelf.systemsTitle': 'SYSTEMS',
'shelf.snippetsTitle': 'SNIPPETS',
```

Change existing keys in `en`:

```ts
'principles.label': 'VI — PRINCIPLES',
'shelf.intro': 'Two systems I actually run, and a drawer of small scripts.',
'liz.ctaLink' // DELETE this key (both locales) — the CTA is removed in Task 6
```

In the `pt` map:

```ts
'nav.arteamesa': 'arte à mesa',
'arteamesa.label': 'V — ARTE À MESA',
'liz.statusBadge': 'EM PRODUÇÃO',
'shelf.systemsTitle': 'SISTEMAS',
'shelf.snippetsTitle': 'SNIPPETS',
'principles.label': 'VI — PRINCÍPIOS',
'shelf.intro': 'Dois sistemas que eu realmente uso, e uma gaveta de scripts pequenos.',
```

- [ ] **Step 2: Verify build**

Run: `cd site && bun run build`
Expected: fails only if a page still references `liz.ctaLink` — the EN+PT liz pages use it. If so, leave the key in place with a `// removed in Task 6` note and delete it in Task 6 instead. Build must pass before committing.

- [ ] **Step 3: Commit**

```bash
git add site/src/i18n/ui.ts
git commit -m "Add i18n keys for arte-a-mesa, shelf sections, liz status"
```

---

### Task 5: Experiences — reorder newest-first, real photos

**Files:**
- Modify: `site/src/pages/experiences.astro`
- Modify: `site/src/pages/pt/experiences.astro`

**Interfaces:**
- Consumes: Task 1 assets.

- [ ] **Step 1: Rewrite the `chapters` array (EN), newest first, with photo imports**

In the frontmatter:

```astro
import { Image } from 'astro:assets';
import zoolatechPhoto from '../assets/experiences/zoolatech.jpg';
import three60Photo from '../assets/experiences/three60.jpg';
import odsPhoto from '../assets/experiences/ods.jpg';

const chapters = [
  {
    num: 'I',
    years: '2024 — now',
    company: 'Spring Health',
    role: 'Senior Software Engineer',
    body: 'Mental health, software-shaped. Building care team experience surfaces in React/TypeScript, with the weight that comes from working on something that matters to the person on the other side of the screen.',
    fig: 'FIG. I.1 — PHOTO PENDING',
    photo: null,
  },
  {
    num: 'II',
    years: '2021 — 2024',
    company: 'Procore (via Zoolatech)',
    role: 'Senior Software Engineer',
    body: 'Construction software, used by people who actually wear hard hats. Where I learned how a design system survives — or doesn\'t — contact with a real org.',
    fig: 'FIG. II.1 — ZOOLATECH TEAM',
    photo: zoolatechPhoto,
  },
  {
    num: 'III',
    years: '2020 — 2021',
    company: 'Three60',
    role: 'Software Engineer',
    body: 'Smaller team, more ownership, more chances to ship something and watch it break in production. The lesson: most of building software is the conversation around it, occasionally interrupted by typing.',
    fig: 'FIG. III.1 — 2020',
    photo: three60Photo,
  },
  {
    num: 'IV',
    years: '2018 — 2020',
    company: 'ODS',
    role: 'Junior → Mid Software Engineer',
    body: 'Where I learned what good code review actually looks like — not as a gate, but as a conversation between two people about how a system should behave.',
    fig: 'FIG. IV.1 — 2020',
    photo: odsPhoto,
  },
];
```

- [ ] **Step 2: Render photos in the chapter template (EN)**

Replace the `.ch-photo-placeholder` block inside the `chapters.map` with a conditional:

```astro
<div class="chapter-right">
  {ch.photo ? (
    <figure class="ch-photo">
      <Image src={ch.photo} alt={`${ch.company} — team photo`} width={800} class="ch-photo-img" />
      <figcaption class="ch-photo-label mono-label">{ch.fig}</figcaption>
    </figure>
  ) : (
    <div class="ch-photo-placeholder">
      <span class="ch-photo-label mono-label">{ch.fig}</span>
    </div>
  )}
</div>
```

Add styles next to the existing `.ch-photo-placeholder` rules:

```css
.ch-photo {
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.ch-photo-img {
  width: 100%;
  height: 340px;
  object-fit: cover;
  display: block;
}
```

- [ ] **Step 3: Fix the resume link (EN)**

`<a href="#" class="inline-link">resume.augustoamaral.com ↗</a>` becomes `<a href="https://resume.augustoamaral.com" class="inline-link" target="_blank" rel="noopener">resume.augustoamaral.com ↗</a>`.

- [ ] **Step 4: Mirror in PT**

Apply Steps 1–3 to `site/src/pages/pt/experiences.astro` (import paths use `../../assets/...`). Same order/photos/fig labels; PT body texts already exist in the file — keep them, only reorder and renumber (Spring Health `num: 'I'`, years `'2024 — agora'`; Zoolatech `II`; Three60 `III`; ODS `IV`). PT alt text: `` `${ch.company} — foto do time` ``. PT fig for Spring Health: `'FIG. I.1 — FOTO EM BREVE'`.

- [ ] **Step 5: Verify**

Run: `cd site && bun run build`
Expected: PASS. If the image service complains about sharp, run `cd site && bun add sharp` and rebuild.
Then `bun run dev`, open `/experiences` and `/pt/experiences`: Spring Health first with placeholder, three real photos below, resume link works.

- [ ] **Step 6: Commit**

```bash
git add site/src/pages/experiences.astro site/src/pages/pt/experiences.astro
git commit -m "Reorder experiences newest-first with real photos"
```

---

### Task 6: Liz — real product page

**Files:**
- Modify: `site/src/pages/liz.astro`
- Modify: `site/src/pages/pt/liz.astro`
- Modify: `site/src/i18n/ui.ts` (delete `liz.ctaLink` if deferred from Task 4)

**Interfaces:**
- Consumes: Task 3 assets (`site/src/assets/liz/*.png` — import only the files that exist).

- [ ] **Step 1: Rewrite EN page content**

Keep the layout skeleton (label row, h1, two-col, data table, styles). Changes:

- Badge: `<span class="beta-tag">BETA</span>` → `<span class="beta-tag">{t('liz.statusBadge')}</span>` (keep the class/styling).
- Tagline: `A WhatsApp assistant that answers a medical practice's patients — <em>in production, every day</em>.`
- "What it is" body: `Liz is the virtual assistant of a pediatric gastroenterology practice. Patients message the clinic on WhatsApp; Liz answers — clinic info, scheduling, general questions — and hands the conversation to a human whenever it should.`
- "How it works" body: `Text messages get answered directly. Audio gets transcribed and answered. Scheduling intent is detected and preferences are collected against a real calendar. Behind it: Bun, Hono, PostgreSQL, whatsapp-web.js, Claude for replies, Whisper for audio, Google Calendar for scheduling — plus a Chrome extension that puts a management panel inside WhatsApp Web, and a React dashboard for the clinic team. Runs on Docker, on an ARM box.`
- Add a screenshots section between the two-col section and the data table:

```astro
<section class="liz-shots section-border">
  <div class="container">
    <h2 class="data-title">In practice</h2>
    <div class="shots-grid">
      {shots.map((s) => (
        <figure class="shot">
          <Image src={s.img} alt={s.alt} width={900} class="shot-img" />
          <figcaption class="mono-label">{s.caption}</figcaption>
        </figure>
      ))}
    </div>
  </div>
</section>
```

with frontmatter (import only files that Task 3 produced):

```astro
import { Image } from 'astro:assets';
import simulatorShot from '../assets/liz/simulator.png';
import dashboardShot from '../assets/liz/dashboard.png';

const shots = [
  { img: simulatorShot, alt: 'Liz conversation simulator', caption: 'FIG. 1 — CONVERSATION SIMULATOR' },
  { img: dashboardShot, alt: 'Liz clinic dashboard', caption: 'FIG. 2 — CLINIC DASHBOARD' },
];
```

and styles:

```css
.liz-shots { padding: 80px 0; }
.shots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 32px;
  margin-top: 32px;
}
.shot { margin: 0; display: flex; flex-direction: column; gap: 12px; }
.shot-img { width: 100%; height: auto; display: block; border: 1px solid var(--border); }
```

- Remove the entire `liz-cta` section (and its styles). If `liz.ctaLink` still exists in `ui.ts`, delete it from both locales now.
- Update `<BaseLayout>` `description` to: `Liz — a WhatsApp assistant for a medical practice, in production. Bun, Hono, Claude, Whisper.`
- Keep the data table and the `/privacy#liz` link untouched.

**Not allowed on this page:** clinic name, owner name, city, patient anything.

- [ ] **Step 2: Mirror in PT**

Same structure in `site/src/pages/pt/liz.astro` (asset imports via `../../assets/liz/`). PT copy:

- Tagline: `Uma assistente de WhatsApp que atende os pacientes de um consultório médico — <em>em produção, todo dia</em>.`
- "O que é": `Liz é a assistente virtual de um consultório de gastropediatria. Pacientes mandam mensagem no WhatsApp do consultório; a Liz responde — informações da clínica, agendamento, dúvidas gerais — e passa a conversa para um humano sempre que deveria.`
- "Como funciona": `Mensagens de texto são respondidas direto. Áudios são transcritos e respondidos. Intenção de agendamento é detectada e as preferências são coletadas contra um calendário real. Por trás: Bun, Hono, PostgreSQL, whatsapp-web.js, Claude nas respostas, Whisper no áudio, Google Calendar no agendamento — mais uma extensão Chrome que coloca um painel de gestão dentro do WhatsApp Web, e um dashboard React para a equipe da clínica. Roda em Docker, numa máquina ARM.`
- Section title `In practice` → `Na prática`; captions `FIG. 1 — SIMULADOR DE CONVERSA`, `FIG. 2 — DASHBOARD DA CLÍNICA`; alts `Simulador de conversa da Liz`, `Dashboard da clínica`.
- Description: `Liz — assistente de WhatsApp para um consultório médico, em produção. Bun, Hono, Claude, Whisper.`

- [ ] **Step 3: Verify**

Run: `cd site && bun run build` → PASS. Dev-server check of `/liz` and `/pt/liz`: badge reads IN PRODUCTION / EM PRODUÇÃO, screenshots render, no CTA, no dead links.

- [ ] **Step 4: Commit**

```bash
git add site/src/pages/liz.astro site/src/pages/pt/liz.astro site/src/i18n/ui.ts
git commit -m "Rewrite Liz page with the real product"
```

---

### Task 7: Arte à Mesa — new product page + nav

**Files:**
- Create: `site/src/pages/arte-a-mesa.astro`
- Create: `site/src/pages/pt/arte-a-mesa.astro`
- Modify: `site/src/components/Header.astro` (nav item)

**Interfaces:**
- Consumes: Task 2 assets; `nav.arteamesa` / `arteamesa.label` keys from Task 4.
- Produces: routes `/arte-a-mesa` and `/pt/arte-a-mesa`; nav key `arteamesa` used by both pages via `activeNav="arteamesa"`.

- [ ] **Step 1: Add the nav item**

In `Header.astro`, insert after the `liz` entry:

```ts
{ key: 'arteamesa', label: t('nav.arteamesa'), href: locale === 'pt' ? '/pt/arte-a-mesa' : '/arte-a-mesa' },
```

- [ ] **Step 2: Create the EN page**

Model the structure on `liz.astro` (top section with label + h1 + tagline, a two-col section, screenshots grid, styles copied from liz's page-level styles). Content:

- Frontmatter: `activeNav="arteamesa"`, pathname `/arte-a-mesa`, label via `t('arteamesa.label')`, screenshot imports:

```astro
import { Image } from 'astro:assets';
import catalogShot from '../assets/arte-a-mesa/catalog.png';
import rentalsShot from '../assets/arte-a-mesa/rentals.png';
import newRentalShot from '../assets/arte-a-mesa/new-rental.png';
import clientShot from '../assets/arte-a-mesa/client-detail.png';

const shots = [
  { img: catalogShot, alt: 'Catalog with per-item inventory', caption: 'FIG. 1 — CATALOG' },
  { img: rentalsShot, alt: 'Rentals list', caption: 'FIG. 2 — RENTALS' },
  { img: newRentalShot, alt: 'New rental form', caption: 'FIG. 3 — NEW RENTAL' },
  { img: clientShot, alt: 'Client detail view', caption: 'FIG. 4 — CLIENT' },
];
```

(Import only files Task 2 actually produced; drop missing entries.)

- h1: `Arte à Mesa.` Tagline: `Rental management for a dishware rental shop — clients, catalog, rentals. <em>Running in production, in the store.</em>`
- Two-col section:
  - "What it is": `A dishware and party-rental shop needed to stop managing rentals on paper: which items exist, which are out, who has them, when they come back. Arte à Mesa is the system the store runs — catalog with per-item inventory, clients, rentals with date ranges and returns. It runs on the store's own machine, reachable from a tablet at the counter.`
  - "How it's built": `TypeScript monorepo: a pure domain core, a Hono API with Prisma over SQLite, and a React front end (Vite, Radix, TanStack Query). Small by design — a store doesn't need microservices, it needs software that works every day.`
- Origin section (its own `section-border` block, after the screenshots):
  - Title: `Born as a benchmark`
  - Body: `This codebase started as an experiment: the same spec and the same three implementation plans, executed independently by several coding models — Claude Opus as the reference, plus GLM, Qwen and Gemma — one branch and one draft PR per model, all agent-driven. The store runs the Opus build. The experiment became part of how I evaluate models for real work; the workflow behind it is on <a href="/shelf/claude" class="inline-link">how I use Claude</a>.`
- Screenshots section (`section-border` block titled `In practice`, between the two-col and origin sections):

```astro
<section class="atm-shots section-border">
  <div class="container">
    <h2 class="data-title">In practice</h2>
    <div class="shots-grid">
      {shots.map((s) => (
        <figure class="shot">
          <Image src={s.img} alt={s.alt} width={900} class="shot-img" />
          <figcaption class="mono-label">{s.caption}</figcaption>
        </figure>
      ))}
    </div>
  </div>
</section>
```

```css
.atm-shots { padding: 80px 0; }
.data-title { font-family: var(--font-serif); font-size: 2rem; font-weight: 400; margin: 0; }
.shots-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(360px, 1fr));
  gap: 32px;
  margin-top: 32px;
}
.shot { margin: 0; display: flex; flex-direction: column; gap: 12px; }
.shot-img { width: 100%; height: auto; display: block; border: 1px solid var(--border); }
```
- `<BaseLayout>` title `Arte à Mesa — Augusto Amaral`, description `Rental management for a dishware shop, in production. Born as an LLM benchmark; the store runs the Opus build.`

- [ ] **Step 3: Create the PT page**

`site/src/pages/pt/arte-a-mesa.astro`, pathname `/pt/arte-a-mesa`, imports via `../../assets/arte-a-mesa/`. PT copy:

- Tagline: `Gestão de locações para uma loja de aluguel de louças — clientes, catálogo, locações. <em>Rodando em produção, na loja.</em>`
- "O que é": `Uma loja de aluguel de louças e artigos para festa precisava parar de gerenciar locações no papel: quais itens existem, quais estão fora, com quem estão, quando voltam. Arte à Mesa é o sistema que a loja usa — catálogo com estoque por item, clientes, locações com períodos e devoluções. Roda na máquina da própria loja, acessível de um tablet no balcão.`
- "Como é feito": `Monorepo TypeScript: um core de domínio puro, uma API Hono com Prisma sobre SQLite, e um front React (Vite, Radix, TanStack Query). Pequeno de propósito — uma loja não precisa de microsserviços, precisa de software que funciona todo dia.`
- Origem — título `Nasceu como benchmark`, corpo: `Esse código começou como experimento: a mesma spec e os mesmos três planos de implementação, executados de forma independente por vários modelos — Claude Opus como referência, mais GLM, Qwen e Gemma — um branch e um draft PR por modelo, tudo agent-driven. A loja roda o build do Opus. O experimento virou parte de como eu avalio modelos pra trabalho de verdade; o workflow por trás está em <a href="/pt/shelf/claude" class="inline-link">como eu uso Claude</a>.`
- Captions: `FIG. 1 — CATÁLOGO`, `FIG. 2 — LOCAÇÕES`, `FIG. 3 — NOVA LOCAÇÃO`, `FIG. 4 — CLIENTE`. Section title: `Na prática` (EN: `In practice`).
- Title `Arte à Mesa — Augusto Amaral`, description: `Gestão de locações para uma loja de louças, em produção. Nasceu como benchmark de LLMs; a loja roda o build do Opus.`

- [ ] **Step 4: Verify**

`cd site && bun run build` → PASS. Dev check `/arte-a-mesa` + `/pt/arte-a-mesa`: nav shows `arte à mesa` highlighted, screenshots render, `/shelf/claude` link 404s for now (created in Task 9 — acceptable until Task 13's sweep, which must pass only after Task 9 exists).

- [ ] **Step 5: Commit**

```bash
git add site/src/pages/arte-a-mesa.astro site/src/pages/pt/arte-a-mesa.astro site/src/components/Header.astro
git commit -m "Add Arte à Mesa product page"
```

---

### Task 8: Shelf — systems index + snippets table

**Files:**
- Modify: `site/src/pages/shelf.astro`
- Modify: `site/src/pages/pt/shelf.astro`

**Interfaces:**
- Consumes: `shelf.systemsTitle`, `shelf.snippetsTitle`, `shelf.intro` keys (Task 4).
- Produces: links to `/shelf/claude`, `/shelf/second-brain`, `/shelf/clean-branches` (pages created in Tasks 9–11).

- [ ] **Step 1: Rewrite EN shelf**

Delete the 8 fake items. New structure after the `shelf-top` section:

1. A systems section using the home page's `.index-row` pattern (copy those styles into this page):

```astro
<section class="shelf-systems">
  <div class="container">
    <h2 class="zone-title mono-label">{t('shelf.systemsTitle')}</h2>
  </div>
  <div class="index-list">
    <a href="/shelf/claude" class="index-row">
      <div class="container index-row-inner">
        <span class="idx-num mono-label">I</span>
        <span class="idx-title">How I use Claude</span>
        <span class="idx-desc">The rules, the aliases, the safety posture, the other models.</span>
        <span class="idx-arrow">→</span>
      </div>
    </a>
    <a href="/shelf/second-brain" class="index-row">
      <div class="container index-row-inner">
        <span class="idx-num mono-label">II</span>
        <span class="idx-title">Second brain</span>
        <span class="idx-desc">Two vaults written by agents, for agents. One runs itself at night.</span>
        <span class="idx-arrow">→</span>
      </div>
    </a>
  </div>
</section>
```

2. A snippets section reusing the existing table styles (keep `.shelf-table` / `.table-row` styles):

```astro
const snippets = [
  { kind: 'snippet', name: 'git-clean-branches', about: 'Deletes local branches whose remote is gone. One alias: clb.', date: '2026 · 08', href: '/shelf/clean-branches' },
];
```

```astro
<section class="shelf-table">
  <div class="container">
    <h2 class="zone-title mono-label">{t('shelf.snippetsTitle')}</h2>
  </div>
  <div class="table-header"> ... (existing header row unchanged) ... </div>
  {snippets.map((item) => (
    <a href={item.href} class="table-row"> ... (existing row markup, arrow `→` instead of `↗`) ... </a>
  ))}
</section>
```

Add style: `.zone-title { margin: 48px 0 16px; letter-spacing: 0.12em; }`

- The h1 stays `A public bookshelf of <em>small things I made</em>.`; the intro now comes from the updated `shelf.intro` key.

- [ ] **Step 2: Mirror in PT**

`pt/shelf.astro`: same structure, hrefs prefixed `/pt/...`. PT titles/descs: `Como eu uso Claude` / `As regras, os aliases, a postura de segurança, os outros modelos.`; `Segundo cérebro` / `Dois vaults escritos por agentes, para agentes. Um roda sozinho de madrugada.`; snippet about: `Apaga branches locais cujo remoto já era. Um alias: clb.`

- [ ] **Step 3: Verify + commit**

`cd site && bun run build` → PASS (links 404 until Tasks 9–11; fine for now).

```bash
git add site/src/pages/shelf.astro site/src/pages/pt/shelf.astro
git commit -m "Rewrite shelf as systems index plus snippets table"
```

---

### Task 9: /shelf/claude — How I use Claude

**Files:**
- Create: `site/src/pages/shelf/claude.astro`
- Create: `site/src/pages/pt/shelf/claude.astro`

**Interfaces:**
- Consumes: nothing new. `activeNav="shelf"`.
- Produces: routes `/shelf/claude`, `/pt/shelf/claude` (linked from Tasks 7 and 8).

- [ ] **Step 1: Create the EN page**

Layout: `page-label` (`SHELF / SYSTEM I`), `page-h1` (`How I use <em>Claude</em>.`), then alternating `section-border` blocks. Use `.sub-h2`/`.sub-body` patterns from liz.astro and `<pre class="code-block">` for code. Style for code blocks:

```css
.code-block {
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  line-height: 1.6;
  background: var(--bg-elevated);
  border: 1px solid var(--border);
  padding: 20px 24px;
  overflow-x: auto;
  margin: 0;
}
```

Sections and copy (verbatim):

1. **Second head** — `Claude Code is my daily driver, and the contract is written down: it acts as a second head, not a service provider working through tickets. The rule that carries the whole thing: if the answer is in the code, git, logs, or docs, the agent finds it itself — it never asks me something it can verify. If the answer is in my head — intent, scope, the "why is it like this" — it asks early, with its own reading attached. Decisions it makes; missing information it asks for.`
2. **The safety layer is inverted** — `I run with harness confirmations off. No "allow this command?" prompts — which means the agent itself is the only safety layer. So the policy doesn't live in the agent's goodwill: destructive actions require fresh, explicit confirmation every time, scoped to exactly what was asked. Writes to external systems — Slack, issue trackers, anything other people see — are treated as destructive even when nothing is deleted. And whatever can be enforced by config is enforced by config: a declarative deny list in settings, so the harness blocks what memory might forget.`
3. **Aliases** — intro line `Model presets I actually type:` + code block:

```
alias sonnet='claude --model "claude-sonnet-5[1m]" --effort xhigh --dangerously-skip-permissions'
alias opus='claude --model "claude-opus-5[1m]" --effort xhigh --dangerously-skip-permissions'
alias fable='claude --model fable --dangerously-skip-permissions --effort xhigh'

# other models through the same harness
alias clamma='OLLAMA_HOST="<homelab>" ollama launch claude'
alias oclaud='ollama launch claude --model glm-5.2:cloud -- --dangerously-skip-permissions'
```

4. **One config, three machines** — `The whole setup — global rules, settings, skills, code-style rules — lives in a dotfiles repo; ~/.claude is a symlink into it. Personal Mac, work Mac, and a cloud devbox all run the same brain. Transcripts and history never get committed: they may contain secrets.`
5. **Beyond Claude** — `The same workflow runs other models for comparison: OMP (a Pi-based harness) with Kimi K3, and cloud models through ollama. That habit turned into a real benchmark — the same spec executed independently by four models, and a store now runs the winner. That story is on <a href="/arte-a-mesa" class="inline-link">Arte à Mesa</a>.`

BaseLayout: title `How I use Claude — Augusto Amaral`, description `The contract with my daily-driver agent: second head, inverted safety layer, one config across three machines.`, pathname `/shelf/claude`, `activeNav="shelf"`.

- [ ] **Step 2: Create the PT page**

Same structure, pathname `/pt/shelf/claude`. PT copy (verbatim):

1. **Segunda cabeça** — `Claude Code é meu daily driver, e o contrato está escrito: ele age como uma segunda cabeça, não como um prestador de serviço processando tickets. A regra que sustenta tudo: se a resposta está no código, no git, nos logs ou na doc, o agente acha sozinho — nunca me pergunta o que pode verificar. Se a resposta está na minha cabeça — intenção, escopo, o "por que isso é assim" — ele pergunta cedo, junto com a leitura dele. Decisões ele toma; informação que falta ele pergunta.`
2. **A camada de segurança é invertida** — `Eu rodo com as confirmações do harness desligadas. Nenhum prompt de "permitir esse comando?" — o que significa que o próprio agente é a única camada de segurança. Então a política não mora na boa vontade do agente: ações destrutivas exigem confirmação explícita e fresca, toda vez, no escopo exato do que foi pedido. Escritas em sistemas externos — Slack, issue trackers, qualquer coisa que outras pessoas veem — são tratadas como destrutivas mesmo quando nada é apagado. E o que dá pra garantir por config, é garantido por config: uma deny list declarativa nos settings, pro harness bloquear o que a memória poderia esquecer.`
3. **Aliases** — intro `Presets de modelo que eu realmente digito:` + same code block as EN.
4. **Uma config, três máquinas** — `O setup inteiro — regras globais, settings, skills, regras de estilo de código — vive num repo de dotfiles; ~/.claude é um symlink pra dentro dele. Mac pessoal, Mac do trabalho e um devbox na nuvem rodam o mesmo cérebro. Transcripts e histórico nunca são commitados: podem conter segredos.`
5. **Além do Claude** — `O mesmo workflow roda outros modelos pra comparação: OMP (um harness baseado no Pi) com Kimi K3, e modelos de nuvem via ollama. Esse hábito virou um benchmark de verdade — a mesma spec executada de forma independente por quatro modelos, e uma loja hoje roda o vencedor. Essa história está em <a href="/pt/arte-a-mesa" class="inline-link">Arte à Mesa</a>.`

Título `Como eu uso Claude — Augusto Amaral`, description `O contrato com meu agente de uso diário: segunda cabeça, camada de segurança invertida, uma config em três máquinas.`

**Not allowed:** machine usernames, employer workflow details, homelab IPs (note the alias block replaces the real host with `<homelab>`).

- [ ] **Step 3: Verify + commit**

`cd site && bun run build` → PASS; dev check both routes.

```bash
git add site/src/pages/shelf/claude.astro site/src/pages/pt/shelf/claude.astro
git commit -m "Add How I use Claude page"
```

---

### Task 10: /shelf/second-brain — the two-vault system

**Files:**
- Create: `site/src/pages/shelf/second-brain.astro`
- Create: `site/src/pages/pt/shelf/second-brain.astro`

**Interfaces:**
- Consumes: nothing new. `activeNav="shelf"`.
- Produces: routes `/shelf/second-brain`, `/pt/shelf/second-brain`.

- [ ] **Step 1: Create the EN page**

Same page skeleton as Task 9 (`SHELF / SYSTEM II`, h1 `A vault written <em>by agents, for agents</em>.`). Sections:

1. **The thesis** — `I don't read my notes. I talk to an agent that reads and writes them for me. Every formatting decision in the vault optimizes for agent retrieval, never for a human reading linearly — that single inversion reshapes everything downstream.`
2. **The rules with names** — three short blocks (use a `.rule` list, mono label + body):
   - `CAPTURE-FIRST` — `Capturing costs seconds and never asks where something should be filed. Routing is the nightly routine's job, not mine. The vault that made me decide-at-capture-time is the vault that died.`
   - `HUMAN VIEW IS A VERB` — `Briefings and reports are generated on demand and thrown away. A stored summary is a copy, and copies rot.`
   - `LIVE STATE LIVES IN ONE PLACE` — `Each front of life has exactly one status file: where it stopped, next step, recent decisions, blockers. Lesson paid for in duplicated-state cleanup.`
3. **It runs itself at night** — `An always-on Claude Code instance lives on a small server: a systemd unit keeps a respawn loop alive, remote control lets me capture from my phone, and a nightly cron drains the inbox — routing captures into the wiki, linting the graph, logging what it did, committing. I wake up to a consolidated vault and an audit trail.`
4. **The work twin** — `Work gets its own vault, PARA-structured, driven by a three-skill cycle: a morning radar that collects everything in parallel and diffs it against yesterday's snapshot; a context assembler that builds briefings for a unit of work — or hands them off as notes any agent can consume, with an expiry date renewed by touch; and a journal that routes what happened and tags evidence of impact for 1:1s and review cycles. Its governing principle: the agent is a guide, not an executor — it says what I can do next, it never offers to do it for me.`
5. **Evolution, honestly** — `Vault one: a flat folder of notes. Abandoned. Vault two: learned from that — structure, but state still got duplicated, and duplicated state rots. Vault three is the current one, LLM-first from day zero. The system also improves itself: friction gets logged silently, and periodically a skill reads its own feedback and proposes edits to its own spec — a human reviews and commits.`
6. A flow strip rendered as styled HTML (no images):

```astro
<div class="flow">
  <span class="flow-step mono-label">CAPTURE</span>
  <span class="flow-arrow">→</span>
  <span class="flow-step mono-label">CONSOLIDATE (NIGHTLY)</span>
  <span class="flow-arrow">→</span>
  <span class="flow-step mono-label">WORK</span>
  <span class="flow-arrow">→</span>
  <span class="flow-step mono-label">RETRIEVE ON DEMAND</span>
</div>
```

```css
.flow { display: flex; flex-wrap: wrap; align-items: center; gap: 16px; padding: 32px 0; }
.flow-step { border: 1px solid var(--border); padding: 10px 16px; letter-spacing: 0.1em; }
.flow-arrow { color: var(--fg-muted); font-family: var(--font-mono); }
.rule { display: flex; flex-direction: column; gap: 8px; margin-bottom: 32px; }
```

BaseLayout: title `Second brain — Augusto Amaral`, description `Two vaults written by agents, for agents. Capture-first, nightly self-consolidation, and a guide-not-executor work twin.`

**Not allowed:** VPS host/user/IP, vault note content, colleague/ticket/channel names, employer name in this page's body, the promotion framing (impact tags are "evidence for 1:1s and review cycles" — exactly that phrase).

- [ ] **Step 2: Create the PT page**

PT copy (verbatim):

1. **A tese** — `Eu não leio minhas notas. Eu converso com um agente que lê e escreve por mim. Toda decisão de formato do vault otimiza retrieval por agente, nunca leitura linear humana — essa única inversão remodela todo o resto.`
2. Rules: `CAPTURE-FIRST` — `Capturar custa segundos e nunca pergunta onde arquivar. Rotear é trabalho da rotina noturna, não meu. O vault que me fazia decidir na hora da captura é o vault que morreu.` · `VISÃO HUMANA É VERBO` — `Briefings e relatórios são gerados sob demanda e jogados fora. Resumo guardado é cópia, e cópia apodrece.` · `ESTADO VIVO MORA NUM LUGAR SÓ` — `Cada frente da vida tem exatamente um arquivo de status: onde parou, próximo passo, decisões recentes, bloqueios. Lição paga em limpeza de estado duplicado.`
3. **Ele roda sozinho de madrugada** — `Uma instância always-on do Claude Code vive num servidor pequeno: uma unit do systemd mantém um loop de respawn vivo, remote control me deixa capturar do celular, e um cron noturno drena o inbox — roteando capturas pra wiki, lintando o grafo, registrando o que fez, commitando. Eu acordo com o vault consolidado e uma trilha de auditoria.`
4. **O gêmeo de trabalho** — `Trabalho tem um vault próprio, estruturado em PARA, guiado por um ciclo de três skills: um radar matinal que coleta tudo em paralelo e compara com o snapshot de ontem; um montador de contexto que prepara briefings de uma unidade de trabalho — ou os entrega como notas que qualquer agente consome, com validade renovada pelo toque; e um journal que roteia o que aconteceu e marca evidências de impacto pra 1:1s e ciclos de review. O princípio que governa: o agente é guia, não executor — ele diz o que eu posso fazer, nunca se oferece pra fazer por mim.`
5. **Evolução, com honestidade** — `Vault um: uma pasta plana de notas. Abandonado. Vault dois: aprendeu com isso — estrutura, mas o estado ainda duplicava, e estado duplicado apodrece. O vault três é o atual, LLM-first desde o dia zero. O sistema também melhora a si mesmo: fricção é registrada em silêncio, e periodicamente uma skill lê o próprio feedback e propõe edits na própria spec — um humano revisa e commita.`
6. Flow steps: `CAPTURAR → CONSOLIDAR (MADRUGADA) → TRABALHAR → RECUPERAR SOB DEMANDA`.

Título `Segundo cérebro — Augusto Amaral`, description `Dois vaults escritos por agentes, para agentes. Capture-first, autoconsolidação noturna, e um gêmeo de trabalho guia-não-executor.`

- [ ] **Step 3: Verify + commit**

`cd site && bun run build` → PASS; dev check both routes.

```bash
git add site/src/pages/shelf/second-brain.astro site/src/pages/pt/shelf/second-brain.astro
git commit -m "Add second brain page"
```

---

### Task 11: /shelf/clean-branches — snippet page

**Files:**
- Create: `site/src/pages/shelf/clean-branches.astro`
- Create: `site/src/pages/pt/shelf/clean-branches.astro`

**Interfaces:**
- Consumes: `.code-block` style pattern (defined per-page; copy from Task 9).
- Produces: routes `/shelf/clean-branches`, `/pt/shelf/clean-branches`.

- [ ] **Step 1: Create the EN page**

Skeleton: `SHELF / SNIPPET`, h1 `git-clean-branches.`, one section with the code and two paragraphs.

Code block (verbatim from the zshrc):

```
git-clean-branches() {
    git fetch -p && git branch -r | awk '{print $1}' | egrep -v -f /dev/fd/0 <(git branch -vv | grep origin) | awk '{print $1}' | xargs git branch -d
}

alias clb="git-clean-branches"
```

Paragraph 1: `After a merged PR, the remote branch dies but the local one lingers. This prunes remote-tracking refs (fetch -p), finds local branches whose upstream is gone, and deletes them. Typed as three letters: clb.`

Paragraph 2: `The safety is in the lowercase -d — git refuses to delete anything unmerged. The worst case is a "branch not fully merged" warning, which is exactly when you want to be interrupted.`

Title `git-clean-branches — Augusto Amaral`, description `A zsh one-liner that deletes local branches whose remote is gone.`, `activeNav="shelf"`.

- [ ] **Step 2: Create the PT page**

Same code block. PT paragraphs:

1. `Depois de um PR mergeado, o branch remoto morre mas o local fica. Isso limpa as refs de tracking (fetch -p), acha os branches locais cujo upstream sumiu, e apaga. Digitado em três letras: clb.`
2. `A segurança está no -d minúsculo — o git se recusa a apagar qualquer coisa não mergeada. O pior caso é um aviso de "branch not fully merged", que é exatamente a hora em que você quer ser interrompido.`

Título `git-clean-branches — Augusto Amaral`, description `Um one-liner de zsh que apaga branches locais cujo remoto já era.`

- [ ] **Step 3: Verify + commit**

`cd site && bun run build` → PASS.

```bash
git add site/src/pages/shelf/clean-branches.astro site/src/pages/pt/shelf/clean-branches.astro
git commit -m "Add git-clean-branches snippet page"
```

---

### Task 12: Home + Channel cleanup

**Files:**
- Modify: `site/src/pages/index.astro`
- Modify: `site/src/pages/pt/index.astro`
- Modify: `site/src/pages/channel.astro`
- Modify: `site/src/pages/pt/channel.astro`

- [ ] **Step 1: Home (EN) — Now list**

In the `work-now` block: Liz badge `BETA` → `IN PRODUCTION` (keep class `warm`), and add after the Liz item:

```astro
<li class="now-item">
  <span class="now-name">Arte à Mesa (side)</span>
  <span class="now-badge warm">IN PRODUCTION</span>
</li>
```

- [ ] **Step 2: Home (EN) — Channel card de-faked**

In `channel-thumb-col`, replace the placeholder + fake meta with a link card:

```astro
<a href="https://www.youtube.com/@odevguto" class="thumb-placeholder thumb-link" target="_blank" rel="noopener">
  <span class="thumb-label mono-label">WATCH ON YOUTUBE ↗</span>
</a>
```

Delete the `.thumb-meta` block (fake title `Por que eu não uso useEffect pra fetch` and `14:32 · 2 wks`). Add style `.thumb-link { text-decoration: none; transition: opacity 0.15s; } .thumb-link:hover { opacity: 0.8; }`.

- [ ] **Step 3: Home (EN) — section index**

Update the count to `06 SECTIONS`, renumber rows I–VI inserting Arte à Mesa after Liz, and update the Shelf and Liz descriptions:

- Shelf desc: `Systems I run, scripts I keep.`
- Liz desc: `A WhatsApp assistant for a medical practice. In production.`
- New row V: title `Arte à Mesa`, href `/arte-a-mesa`, desc `Rental management for a dishware shop. In production.`
- Principles becomes `VI`.

- [ ] **Step 4: Home (PT) — mirror Steps 1–3**

PT strings: badge `EM PRODUÇÃO`; card `ASSISTIR NO YOUTUBE ↗`; index descs — Shelf: `Sistemas que eu uso, scripts que eu guardo.`; Liz: `Uma assistente de WhatsApp para um consultório médico. Em produção.`; Arte à Mesa: `Gestão de locações para uma loja de louças. Em produção.` Check `pt/index.astro` for equivalents of every EN change (its structure mirrors index.astro).

- [ ] **Step 5: Channel pages — remove fake episodes**

In `channel.astro` and `pt/channel.astro`: delete the `episodes` array and the whole `channel-episodes` section + its styles. Add, after the two-col section, a simple link:

```astro
<section class="channel-link-out">
  <div class="container">
    <a href="https://www.youtube.com/@odevguto" class="inline-link" target="_blank" rel="noopener">youtube.com/@odevguto ↗</a>
  </div>
</section>
```

with `.channel-link-out { padding: 0 0 80px; }`. (Add `.inline-link` styles to the page if not present — copy from experiences.astro.)

- [ ] **Step 6: Verify + commit**

`cd site && bun run build` → PASS. Dev check `/` and `/pt/`: 6 sections, no fake video title anywhere.

```bash
git add site/src/pages/index.astro site/src/pages/pt/index.astro site/src/pages/channel.astro site/src/pages/pt/channel.astro
git commit -m "Update home and channel with real content"
```

---

### Task 13: Final sweep + full verification

**Files:**
- Possibly modify: any page with a leftover dead link.

- [ ] **Step 1: Dead-link sweep**

```bash
grep -rn 'href="#"' site/src
```

Expected: no results. Fix any survivors.

- [ ] **Step 2: Full build + type check**

```bash
cd site && bun run check && bun run build
```

Expected: both PASS.

- [ ] **Step 3: Visual pass, both locales**

`bun run dev`, then with Playwright MCP visit and eyeball: `/`, `/experiences`, `/shelf`, `/shelf/claude`, `/shelf/second-brain`, `/shelf/clean-branches`, `/channel`, `/liz`, `/arte-a-mesa`, and each `/pt/` twin. Check: photos render, screenshots render, nav highlights, no placeholder text (`FIG.` placeholders only on Spring Health), internal links resolve (the Task 7 → Task 9 link now exists).

- [ ] **Step 4: Content-safety sweep**

```bash
grep -rni 'juliana\|corrêa\|correa\|clinica-juliana\|spring health\|springcare' site/src --include='*.astro' | grep -v 'Spring Health'
```

Manually confirm: the only "Spring Health" hits are the experiences chapter + home/hero (employer name is fine there); zero hits for the clinic/client names.

- [ ] **Step 5: Commit any fixes**

```bash
git add -A site/src && git commit -m "Fix final sweep findings" || echo "nothing to fix"
```
