# tabcleaner

chrome extension: plain-text tab rules, scheduled cleanup, graveyard restore, dev logs.

## setup

```bash
npm install
npm run build
```

manual checks: `npm run dev`. load unpacked from `dist/` in chrome: extensions → developer mode → load unpacked → choose the `dist/` folder.

iterative extension builds: `npm run watch` rebuilds `dist/` on change; reload the extension in chrome after each build.

## commands

1. run `npm run build` before loading `dist/`.
2. run `npm test` / `npm run test:ui` after logic or ui changes. 
3. run `npm run test:e2e` for end-to-end tests (headed chromium).
4. run `npm run verify` for full gate (build + unit + ui + lint + e2e).
