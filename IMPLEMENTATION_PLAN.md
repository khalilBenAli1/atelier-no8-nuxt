# Atelier No.8 delivery plan

Started 2026-11-03. Original fictional retail app, based on the approved ivory/mocha Atelier visual direction.

1. Foundation: Nuxt/Vue/Pinia, strict TS, local fonts, build and documented commands. Commit/push a passing baseline.
2. Product discovery: original photography for eight distinct fictional products, editorial homepage, collection with URL filters/sort/empty reset, prerendered product pages, accessible gallery, size/quantity/stock feedback. Commit/push.
3. Cart and checkout: product+variant identity, integer totals, bounded quantity, versioned validated persistence, empty/remove/reset states, local checkout validation/review/confirmation. Commit/push.
4. Verification: domain/store and browser journeys, direct static routes, accessibility/keyboard/reflow, actual screenshots and payload findings; docs/assets/licenses; passing CI/PR.
5. Publish: merge preserving milestone history, deploy the new repo with GitHub Pages Actions, verify public pages/assets/core add-to-cart interaction, set verified homepage.

## Decisions and acceptance checks

- Nuxt static generation produces real product HTML. Pinia owns shared cart state; client-only persistence initializes after hydration to avoid SSR mismatch.
- Eight products have dedicated original photographs. Size variants share an illustrative silhouette and clearly disclosed dimensions; no unrelated image is passed off as another product.
- No backend, payment, delivery service, analytics, or account is needed. Checkout is a clearly labeled simulation; no real contact details are required.
- Domain tests cover merged quantities, separate variants, stock/quantity bounds, exact cents totals, malformed/old/oversized storage and checkout validation.
- Browser evidence covers filters after reload, add twice, separate sizes, quantity/remove/reload, empty/sold-out states, complete demo order, Escape/focus restoration, mobile navigation, 390/768/1440px reflow, automated accessibility scans.
- Exact package versions are locked. CI installs with npm ci and runs lint/format/type/unit/build/browser checks before Pages deployment.

## Bounded architecture pass (after working milestone c508578)

Behavior is protected by 7 domain tests and 5 passing Chromium journeys before this pass. Preserve approved CSS and actual screenshots. Extract product gallery/purchase, checkout details/review/summary/confirmation, and bag rows around responsibilities; move route-to-domain bridges into typed composables. Keep the Pinia store focused on bag data, local drawer/form state outside it, and persistence in an adapter. Rerun all existing journeys plus cross-engine tests after extraction. No unrelated redesign or new framework.
