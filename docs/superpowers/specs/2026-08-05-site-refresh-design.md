# Site Refresh — Design Spec

**Date:** 2026-08-05
**Goal:** Make augustoamaral.com presentable and genuinely usable as an entry point: who Augusto is, what he has built, and how he works. Replace all fictional placeholder content with real content.

## Context

The site (Astro, `site/`, EN + PT via `pt/` page variants and `src/i18n/ui.ts`) shipped with placeholder content: fake Shelf items, a fictional description of Liz ("personal digest tool"), photo placeholders on Experiences, fake YouTube episode cards, and dead `href="#"` links. The privacy page already describes the real Liz; the rest of the site does not.

## Information Architecture

Pages after the refresh (each with a `/pt/` variant):

| Route | Status | Content |
|---|---|---|
| `/` | updated | Hero unchanged; Now list, Channel card, and section index updated |
| `/experiences` | updated | Reordered newest-first, real photos |
| `/liz` | rewritten | Real product page |
| `/arte-a-mesa` | **new** | Real product page |
| `/shelf` | rewritten | Index of systems + snippets table |
| `/shelf/claude` | **new** | How I use Claude |
| `/shelf/second-brain` | **new** | Brainz + work-brain systems |
| `/shelf/clean-branches` | **new** | Snippet page |
| `/channel` | updated | Fake episode cards removed |
| `/principles`, `/privacy` | unchanged | — |

Header nav gains `arte à mesa` (after `liz`). Home section index becomes 6 sections and its descriptions update to match real content.

## Experiences

- Reorder chapters newest-first: Spring Health → Procore (via Zoolatech) → Three60 → ODS. Renumber I–IV top to bottom.
- Real photos in the `FIG.` slots, imported via Astro `<Image>` (resized/compressed at build):
  - Procore/Zoolatech ← `068.jpg` (team photo, zoolatech shirts)
  - Three60 ← `IMG_0258.JPG` (pub, 8 people)
  - ODS ← `SAVE_20200312_244643.jpg` (pub, 4 people, Mar 2020)
  - Spring Health keeps the styled placeholder ("photo pending") until a photo exists.
- Source photos are copied into `site/src/assets/experiences/` with descriptive names (`zoolatech.jpg`, `three60.jpg`, `ods.jpg`).
- Fix the resume link (`href="#"` → `https://resume.augustoamaral.com`).

## Liz — real product page

Rewrite `/liz` describing the real product, **without naming the client or the clinic**:

- What it is: WhatsApp virtual assistant for a pediatric gastroenterology practice, **in production**.
- What it does: answers patient messages, transcribes audio and replies to it, provides clinic info, detects scheduling intent and collects preferences, escalates to a human when needed.
- Stack (from the project README): Bun, Hono, PostgreSQL + Prisma, whatsapp-web.js, Claude API (replies), OpenAI Whisper (audio), Google Calendar API, Chrome extension (MV3) injecting a management panel into WhatsApp Web, React dashboard + simulator, Docker Compose on Oracle Cloud ARM.
- Screenshots: simulator conversation view and dashboard flow view (see Screenshot Pipeline).
- Badge changes BETA → IN PRODUCTION (home Now list too).
- Data table stays, kept consistent with `/privacy#liz`. The "Request beta access" CTA is removed — a client product has no public signup.

## Arte à Mesa — real product page

New `/arte-a-mesa` page. Framing: **real product first, origin story second.**

- What it is: rental management system for a tableware/party rental shop (clients, catalog, rentals), in production.
- Stack: React + Vite (Radix, react-hook-form, TanStack Query), Hono API, Prisma + SQLite, monorepo workspaces.
- Origin section: the codebase was born from an LLM benchmark — one spec + three Superpowers plans executed by several models (Claude Opus as reference, GLM, Qwen, Gemma), one branch and one draft PR per model. The production system is the Opus run. This section links to `/shelf/claude` for the broader workflow story.
- Screenshots from the Opus branch build (catalog, rentals list, new rental, client detail).

## Shelf — index + snippets

`/shelf` becomes two zones:

1. **Systems index** — two prominent entries (card/row style consistent with the site's index-row pattern) linking to the dedicated pages:
   - `/shelf/claude` — How I use Claude
   - `/shelf/second-brain` — The two-vault knowledge system
2. **Snippets table** — the existing table layout, real items only. Initial content: `git-clean-branches` → `/shelf/clean-branches`. The structure stays extensible for future snippets.

All eight fake items are deleted.

### `/shelf/claude` — How I use Claude

Curated narrative version of the global CLAUDE.md plus tooling. Sections:

- **Second Head philosophy** — "decisions you make, missing information you ask for"; the code/git/logs vs. user's-head criterion for asking.
- **Inverted safety posture** — running with harness confirmations off means the agent is the safety layer; policy therefore lives in config (declarative deny list for external writes) rather than in memory. Presented as a pattern, without operational security detail.
- **Aliases** — `sonnet`, `opus`, `claudio`, `fable` (model/effort presets), `clamma`/`gemma`/`oclaud` (other models through ollama), `clb`.
- **Dotfiles as config-as-code** — one repo syncing CLAUDE.md, settings, skills, and rules across three environments; transcripts never versioned.
- **Beyond Claude** — testing other harnesses and models: OMP (Pi) with Kimi K3, `ollama launch claude` with cloud models; links to the Arte à Mesa benchmark origin.

Excluded: machine usernames, Spring Health context, any operational security specifics.

### `/shelf/second-brain` — the two-vault system

- **Brainz (personal):** the thesis — "a vault written by agents, for agents"; the human never reads raw files, they talk to an agent that reads and writes on their behalf. Highlight the named rules: capture-first ("never ask where to file it"), "human view is a verb, not a noun" (briefings generated on demand, never stored), "live state lives in one place". Two-layer architecture (state per life-front + LLM wiki) with an immutable `raw/` layer. Nightly consolidation by an always-on Claude Code on a VPS (systemd + tmux + respawn loop + Remote Control from the phone + cron) — presented as a pattern, no addresses or infra identifiers.
- **Work-brain (professional):** described abstractly — PARA-structured Obsidian vault driven by a three-skill cycle: daily radar (parallel collection + temporal diff vs. yesterday's snapshot) → context assembly (session context or two-zone handoff notes with mtime-based expiry) → journaling (routing + impact tags as an evidence trail for 1:1s and review cycles). The governing principle: **"guide, not executor"** — the agent says what can be done, never offers to do it.
- **Evolution story:** flat Obsidian vault (abandoned) → work-brain (learned: duplicated state rots) → brainz (LLM-first). Self-improvement loop: friction logged silently, patterns detected, the skill proposes edits to its own spec — a human reviews and commits.
- A flow diagram (capture → consolidation → work → retrieval) rendered in the site's visual language.

Excluded: VPS address/user/credentials, any note content, colleague names, ticket keys/prefixes, Slack channels, team/product names, personal entities, client names, the promotion framing.

### `/shelf/clean-branches`

Short snippet page: the `git-clean-branches` zsh function + `clb` alias, verbatim, with a two-paragraph explanation of what it does (prune remotes, delete local branches whose upstream is gone) and its limits (`-d`, not `-D` — refuses unmerged branches).

## Home + Channel cleanup

- Home Now list: Liz badge → IN PRODUCTION; add Arte à Mesa (IN PRODUCTION).
- Home Channel card: remove the fabricated latest-video title/duration; replace the placeholder thumb block with a simple card linking to `youtube.com/@odevguto`. No YouTube API/RSS integration (YAGNI).
- `/channel`: remove fake episode cards (`href="#"`); keep the editorial copy, link to the channel.
- Sweep for remaining `href="#"` across pages; none may survive.

## Screenshot Pipeline

- **Arte à Mesa:** `git worktree add` for `feat/arte-a-mesa/claude-opus` under the session scratchpad (the main checkout, on the qwen branch with uncommitted changes, is never touched). Install, `prisma db push` + seed (SQLite), run API + web, capture with Playwright. Worktree removed afterwards.
- **Liz:** backend via the repo's docker-compose (dev) + dashboard/simulator with `VITE_API_URL` pointing at localhost. **Demo data only — the production dump in the repo is never loaded.** If the stack won't come up cleanly (WhatsApp session, missing envs), capture what renders and report the gap instead of faking it.
- Screenshots are cropped/resized and stored in `site/src/assets/` next to the photos, served through Astro `<Image>`.
- No real patient or client data may appear in any capture.

## i18n

Every new or changed page ships EN + PT following the existing pattern: a `pt/` page variant plus shared strings in `src/i18n/ui.ts`. New nav keys, page labels, and section strings are added to both locales.

## Testing / verification

- `astro build` passes; no dead internal links (manual sweep of `href` values).
- Visual check of every changed page in both locales via local dev server (Playwright screenshots double as verification).
- Images: confirm build-time optimization output sizes are sane (< ~300KB per image).

## Out of scope

- Spring Health photo (pending — placeholder stays).
- YouTube data integration.
- Principles page content.
- Resume subdomain (`resume/`) — untouched.
- Any change to the Liz or Arte à Mesa codebases themselves.
