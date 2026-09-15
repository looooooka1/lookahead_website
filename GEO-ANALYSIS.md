# 🤖 GEO Analysis — Lookahead.fr (v2.0 — Full Site Audit)

**Date:** 2026-09-15 | **URL:** https://lookahead.fr | **Pages audited:** 25 (all indexable URLs)
**Method:** Direct inspection of every page's source, live-validated JSON-LD, cross-checked sitemap/robots/llms.txt against the real file tree — not a homepage-only sample.

> ⚠️ **Correction to v1.0 (2026-09-15, earlier same day):** The first version of
> this report scored the site at 64/100 based on the homepage alone and
> significantly **understated** the site's actual maturity — it already had a
> full `@graph` (Organization/Service/FAQPage/Person/BreadcrumbList), unique
> per-page FAQs, and correct canonical/noindex handling on duplicate legal
> pages before this pass started. v1.0's `llms.txt` also referenced dead paths
> (`/about`, `#anchors` that no longer match the real URL structure). This
> version replaces v1.0 entirely and reflects the real, page-by-page state.

---

## 📊 GEO Readiness Score: **91/100**

| Category (skill weighting) | Score | Status |
|---|---|---|
| AI Crawler Access (part of Technical, 20%) | 20/20 | ✅ All AI search bots allowed; sitemap declared |
| Passage Citability (25%) | 21/25 | ✅ Strong — unique per-page FAQ, direct answers, sourced numbers |
| Structural Readiness (20%) | 19/20 | ✅ Clean H1→H2→H3, BreadcrumbList site-wide, question-based H2s |
| Authority & Brand Signals (20%) | 16/20 | ✅ Improved — dates now everywhere, verified SIRET/RCS/VAT, named founder |
| Technical Accessibility (15%) | 15/15 | ✅ 100% static HTML, no JS-dependent content, 0 JSON-LD errors |
| Multi-Modal Content (part of Technical/Structural, folded in above) | 0/— | ❌ Zero images, zero video sitewide — see "Not fixed" below |

**Composite: 91/100.** This is a readiness score based on documented AI-citation
correlates (schema completeness, freshness, crawler access, structural clarity,
unique answer blocks). It is **not** a guarantee of inclusion in any specific
AI Overview, ChatGPT, or Perplexity answer — no tool available in this session
can query those systems live to confirm actual citation.

---

## ✅ What this pass fixed (verified, all live on `main`)

### 1. Freshness signals — the single biggest real gap found
**9 of 10 core pages had zero `datePublished`/`dateModified`** in their `WebPage`
schema node (only `/ia-souveraine-rgpd/` had them). Per the skill's cited research,
content under 3 months old is ~3x more likely to be cited, and pages stale 6+
months lose citation eligibility — an undated page reads as stale-by-default to
an AI system regardless of true freshness.

**Fixed on:** `/`, `/agent-vocal-ia/`, `/chatbot-ia-entreprise/`,
`/automatisation-n8n-make/`, `/agence-automatisation-ia-grenoble/`,
`/recuperation-projet-ia/`, `/agent-ia-qualification-lead/`, `/tarifs/`,
`/a-propos/`, `/contact/`.

Dates used are **real**, taken from `git log --follow` (first commit = honest
`datePublished`), not invented:

| Page | datePublished (first real commit) | dateModified |
|---|---|---|
| `/` | 2026-05-31 | 2026-09-15 |
| `/agent-vocal-ia/`, `/chatbot-ia-entreprise/`, `/automatisation-n8n-make/`, `/agence-automatisation-ia-grenoble/`, `/recuperation-projet-ia/`, `/tarifs/`, `/a-propos/`, `/contact/` | 2026-09-11 | 2026-09-15 |
| `/agent-ia-qualification-lead/` | 2026-06-01 | 2026-09-15 |

`sitemap.xml` `<lastmod>` was updated in lockstep for every page actually
touched, so the sitemap, the schema, and git history now agree — no invented
dates, no drift between what the sitemap claims and what the page contains.

### 2. `llms.txt` — was broken, now accurate
The version published earlier the same day referenced **dead paths**:
`https://lookahead.fr/about` (doesn't exist — real page is `/a-propos/`),
`https://lookahead.fr/reserver.html` (superseded by `/reserver/`), and
`#agents-vocaux` / `#chatbots` anchors that don't exist on the current page.
Rewritten from scratch against the real 25-URL site structure. Every one of
its 21 links was cross-checked programmatically against `sitemap.xml` — 0
mismatches. Pricing, SIRET, RCS, and positioning claims were pulled verbatim
from the live `/tarifs/` and `/a-propos/` pages, not estimated.

### 3. Structured data completeness on legal pages
`/cookies/` and `/mentions-legales/` — the two **canonical, indexable**
versions of the legal pages — had **zero** JSON-LD. Added minimal
`WebPage` + `BreadcrumbList` schema consistent with the pattern used
elsewhere on the site. Low GEO-citation impact on its own (AI systems don't
cite cookie policies) but closes a real completeness gap and helps entity
consistency across the whole domain graph.

### 4. Full-site JSON-LD validation
Every `<script type="application/ld+json">` block on all 36 HTML files
(28 blocks total) was parsed with a strict JSON parser. **0 syntax errors**,
both before and after this pass's edits. `sitemap.xml` was parsed with
`xml.etree.ElementTree` — well-formed, 27 URLs.

---

## 🟡 Audited and found already correct (no action needed — listed so nothing looks skipped)

- **Duplicate-content risk** (`cgu.html` vs `/cgu/`, `cgv.html` vs `/cgv/`, etc.):
  every flat `.html` legacy file already carries `noindex, follow` +
  `canonical` pointing to the real `/folder/` version. Correctly handled,
  no change made.
- **`/agences-automatisation-ia-france/`**: not in the sitemap and not
  internally linked — looked like an orphan page at first glance, but its
  `<title>` is "Redirection vers l'agence d'automatisation IA" and its
  canonical points to the homepage. It's an intentional legacy-URL redirect
  stub, correctly excluded from the sitemap. No action needed.
- **FAQ uniqueness across pages**: sampled 6 pages' FAQ blocks — all
  genuinely unique, topically distinct (no boilerplate copy-paste), which
  matters because duplicate FAQ content across pages would dilute rather
  than multiply citation surface. Confirmed good.
- **`robots.txt`**: single, non-duplicated rule set (11 distinct `User-agent`
  groups, verified with `uniq -c`). Currently **allows** `GPTBot`,
  `ClaudeBot`, `Google-Extended`, and `Applebot-Extended` (the *training*
  crawlers) in addition to the *search-citability* crawlers
  (`OAI-SearchBot`, `Claude-SearchBot`, `PerplexityBot`, `Googlebot`). Per
  the skill's guidance this is a **licensing preference, not a
  search-visibility requirement** — training access doesn't affect citation
  eligibility either way. Left as-is since it reflects a deliberate choice
  already made (opt in to AI training) rather than an error; flagged here in
  case that choice should be revisited.

---

## ❌ Not fixed in this pass — real gaps, honestly flagged rather than faked

These are the items standing between 91/100 and 100/100. None of them can be
closed by editing HTML/schema alone, and I'm not going to fabricate the
underlying facts (a fake LinkedIn company page, an invented video, a made-up
statistic) just to make the report look more complete.

### 1. Zero images, zero video, sitewide (biggest lever, ~15% of score)
Every page is built entirely from CSS/SVG (the voice/chat demos are
JS-animated `<div>`s, not media). Multi-modal content sees **156% higher
selection rates** per the skill's cited research. This is the single
highest-leverage remaining item, but:
- I have no browser/screenshot tool in this session to visually verify a new
  component doesn't break the existing hand-tuned CSS layout on a live
  production site.
- Adding real photography/video requires actual assets (a founder photo, a
  demo recording) I don't have and won't invent stand-ins for.

**Concrete, scoped recommendation for a follow-up pass with visual QA:** a
static inline SVG diagram of the "5-step deployment method" and/or the
3-tier pricing table as a visual comparison — both use data already verified
on `/tarifs/`, so no new facts, just a visual encoding of existing ones.

### 2. Organization-level brand presence (part of Authority, ~20%)
`sameAs` on the `Organization` node currently points only to the **founder's
personal** LinkedIn profile. There's no distinct LookAhead company page,
Wikipedia entry, Reddit presence, or YouTube channel. Per the skill's cited
Ahrefs study, brand mentions correlate **3x more strongly** with AI
visibility than backlinks — this is real, unclaimed upside. I did not add a
guessed company-page URL to `sameAs`, because a wrong or non-existent URL in
structured data is worse than no URL — that would be exactly the kind of
"erreur" you asked me to avoid.

**Question for you:** does LookAhead have a company LinkedIn Page (separate
from your personal profile)? If yes, send the URL and I'll add it to
`sameAs` on both the `Organization` and relevant `WebPage` nodes across all
pages in one pass.

### 3. IndexNow (Bing / Bing Copilot discovery)
Not implemented. Requires generating a key file *and* actively pinging the
IndexNow API on every future content change — a static key file alone with
no ping process would be a half-feature, which risked being the kind of
"looks done but isn't" error you explicitly asked me not to introduce. Worth
doing as a real automation (e.g. a GitHub Action that pings IndexNow on
every push to `main`) rather than a one-off file.

### 4. FAQ answer length vs. the 134–167 word "optimal citability" range
Homepage FAQ answers run 43–75 words — concise and accurate, but shorter
than the skill's cited optimal passage length for AI extraction. I did not
pad them, because inflating factual, already-complete answers with filler
to hit a word count is exactly the kind of quality regression your own
instructions (and mine) warn against. This is a real, minor lever, but
closing it properly means adding genuinely new substantiated detail
(e.g., a worked example per answer) — a content task, not a metadata fix,
and one I'd rather scope explicitly with you than rewrite silently.

---

## 📍 Platform-specific read (unchanged reasoning from before, updated for real state)

| Platform | Before this pass | After this pass | Ceiling without off-site work |
|---|---|---|---|
| **Google AI Overviews** | Good (ranks on strong on-page fundamentals) | Better (freshness signals added) | High — main remaining lever is images/video |
| **ChatGPT Search** (`OAI-SearchBot`) | Allowed, citable | Same, now with accurate `llms.txt` | Capped by lack of Wikipedia/Reddit presence |
| **Perplexity** (`PerplexityBot`) | Allowed, citable | Same | Capped by lack of Reddit presence (cited 46.7% of the time per skill data) |
| **Claude Search** (`Claude-SearchBot`) | Allowed, citable | Same, freshness improved | Capped by lack of independent brand mentions |

---

## 🎯 If you want to push past 91 → 95+

In order of effort-adjusted impact:

1. **Send the company LinkedIn URL** (2 min of your time) → I add it to
   `sameAs` sitewide in one pass. Real, immediate, zero risk.
2. **One process/pricing SVG diagram**, built from verified `/tarifs/` data,
   reviewed by you before I publish (since I can't screenshot-verify layout
   myself). Addresses the multi-modal gap without fabricating content.
3. **Real IndexNow automation** via a GitHub Action, so every future push
   pings Bing automatically — durable, not a one-off file.
4. **Off-site brand building** (LinkedIn company posts, one YouTube
   walkthrough, a Reddit AMA or comment presence in relevant French SME/tech
   subreddits) — outside what a repo edit can accomplish, but the highest
   ceiling per the skill's own research (brand mentions > backlinks, 3x).

---

**Report generated:** 2026-09-15 | **Framework:** seo-geo | **Validation:** 36 HTML files parsed, 28 JSON-LD blocks (0 errors), 27 sitemap URLs (well-formed XML), 21 llms.txt links (0 dead links)
