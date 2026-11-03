# Release verification

Verified locally on 2026-11-03 with Node 22.23.1 / npm 10.9.8.

A clean `npm ci` also passed with project `legacy-peer-deps=false`, followed by lint/format/type/unit checks. The lockfile required no rewrite; local installs no longer inherit a conflicting global peer policy.

- ESLint and Prettier checks: pass, no findings.
- Nuxt strict TypeScript check: pass.
- Vitest: 5 files, 12 passing tests.
- Playwright: 7 scenarios × desktop Chromium, mobile Chromium and WebKit = 21 passing cases.
- Rapid search/sort events are dispatched in the same turn to guard against dropped URL parameters. The affected WebKit journey also passed 10 repeated runs with retries disabled; the release configuration allows no test retries.
- Static generation: homepage, collection, story, checkout, eight product routes and framework fallback documents.
- All eight product routes contain their actual product heading in prerendered HTML. Unknown routes return a deliberate 404.
- Keyboard-only discovery-to-confirmation journey: pass. Dialog Escape/focus restoration and rapid reopen: pass.
- Contact data remains outside storage; confirmation remains unchanged after bag clearing.
- Vue/Nuxt hydration-mismatch warning assertions: zero across browser journeys, including product and checkout reload behavior.
- Actual screenshot capture: eight cases, no runtime console errors, hydration-mismatch warnings, failed images or horizontal overflow.
- Long unbroken valid names/emails wrap inside narrow review and confirmation layouts. A failing mobile regression was reproduced before the focused fix. Overflow checks use the fixed layout clientWidth rather than mobile innerWidth expansion.
- Reflow: 390, 768 and 1440px. Automated WCAG A/AA scan: no findings on the tested main routes.

## Dependency audit

Under the standard peer policy, the installed stable lockfile's `npm audit` reports 26 transitive findings: 4 low and 22 moderate, with zero high or critical. The root advisories involve `deepmerge`, `glob` and `minimatch`, inherited through Nuxt's build tooling and ESLint. The audit's forced suggestions downgrade current major tooling, so they were not applied.

The published output is static HTML/CSS/JavaScript/images/fonts. No Node/Nitro server or public build service is deployed, and storefront input is not used as filesystem/glob configuration. Re-check the advisory state before changing the hosting model or upgrading tooling. Do not describe this lockfile as vulnerability-free.

## Limits

This is a finite fixture shop with local state. It does not implement payments, real inventory, fulfillment, accounts, email delivery or real commerce policies. Automated checks support manual inspection; no Lighthouse score, screen-reader certification or real commercial performance claim is made.

## Public deployment

Verified on 2026-11-03 at https://khalilbenali1.github.io/atelier-no8-nuxt/ after the passing [Pages release workflow](https://github.com/khalilBenAli1/atelier-no8-nuxt/actions/runs/41569965587).

Anonymous HTTP returned 200. All 7 Chromium browser scenarios passed against the actual public site with retries disabled, covering all 8 product HTML routes, deliberate 404 behavior, rapid URL filters, persistent bag, checkout reload/privacy, long-text wrapping, gallery/menu keyboard behavior, a complete keyboard-only checkout and automated accessibility checks. All 8 actual public-site capture cases report zero runtime errors, hydration-mismatch warnings, failed images and horizontal overflow.
