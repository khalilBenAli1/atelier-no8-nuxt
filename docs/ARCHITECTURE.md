# Architecture and state boundaries

Nuxt statically generates the homepage, collection, story, checkout and all eight product routes. Real product HTML is served at the GitHub Pages repository subpath. The application has no runtime server, API key, analytics or payment integration.

- `app/pages` composes route content. Product and checkout pages delegate their interactive features to focused components.
- `app/components` separates gallery, purchase controls, quantity control, bag line/drawer, checkout details/review/summary and order confirmation. The same CSS classes preserve the approved composition.
- `app/composables` bridges framework state to behavior: URL filters, product selection, checkout transitions and a scoped drawer trigger.
- `lib` contains pure catalog, cart, pricing and validation rules. It has no browser storage or Vue dependency.
- `data/products.ts` is the finite typed fixture catalogue. Prices are integer euro cents; stock belongs to each product/size pair.
- `adapters/cartStorage.ts` alone reads/writes the versioned bag schema, with size limits, identifier validation, duplicate merging, stock clamping and corruption/blocked-storage recovery.
- `app/stores/cart.ts` contains genuinely shared bag items and derives lines, counts and totals. The store instance is scoped by Nuxt/Pinia; no mutable customer state exists at module scope.

Drawer visibility belongs to the application component, provided through a typed injection for its triggers. Gallery visibility, size/quantity choices and form values remain local to their feature. Contact fields are never stored or transmitted.

The client-only persistence plugin hydrates the bag after the app has mounted. Server output and the initial client render therefore agree; stored items update only after hydration. Without storage access, the shop remains usable in memory.

Checkout validates before review and again before completion. Confirmation snapshots line quantities, product/variant details and totals before clearing the bag and contact form. Later bag edits cannot change the displayed confirmation. Reloading intentionally forgets the confirmation and personal details.

The initial complete journey was protected by domain tests and browser tests before extracting feature boundaries. The release suite covers Chromium, mobile Chromium and WebKit, plus direct static routes, focus restoration, URL persistence, stock bounds and an automated WCAG scan. Automated scans are evidence, not an accessibility certification.
