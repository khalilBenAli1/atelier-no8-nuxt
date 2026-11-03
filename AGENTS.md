# Atelier No.8

Independent original fictional accessories shop. Do not copy private client work.

- Node 22.23.1, npm 10.9.8. `npm ci` installs from the lockfile.
- Commands: `npm run dev`, `npm run lint`, `npm run format:check`, `npm run typecheck`, `npm test`, `npm run test:e2e`, `npm run build`, `npm run preview`.
- Nuxt 4 pages/components live in `app/`; pure product/cart/validation rules in `lib/`; product fixtures in `data/`.
- Money is integer euro cents. Cart identity includes product and size variant; never exceed variant stock.
- Persist validated cart items only. Checkout details remain in component memory and are never transmitted or persisted.
- Static generation and links must work at `/atelier-no8-nuxt/` on GitHub Pages, including direct product URLs.
- Preserve other agents' changes. Verify root before staging. Use intent-first Lore commits and push coherent tested milestones.
