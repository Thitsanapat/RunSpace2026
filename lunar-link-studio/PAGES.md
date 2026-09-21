# GitHub Pages deployment

Target: https://Thitsanapat.github.io/RunSpace2026/

`.github/workflows/pages.yml` runs unit tests and a fresh production build on `main`, uploads only `lunar-link-studio/dist`, and deploys it to the `github-pages` environment. Runtime is static: no backend, embedded credentials or paid hosting required. Local imports/calculations stay in the browser; GitHub serves the site assets.

Enable **Settings → Pages → Source: GitHub Actions** for this repository. Build uses Node.js 22 and the committed npm lockfile. Deployment has `pages:write` and `id-token:write`; build only needs repository read permission. Future **Push origin** in GitHub Desktop triggers a new deployment. A failed build/test must be fixed before deployment can run.

Vite uses `base:'./'` so bundled scripts, CSS, favicon and module workers resolve both at localhost and the GitHub project subpath. `node tests/pages-browser.mjs` hosts the build under `/RunSpace2026/` and checks mission/RF WebGL and a 50-trial worker. Set `LIVE_URL` to the deployed URL to run the same browser checks against the live site.

References: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Vite static deployment](https://vite.dev/guide/static-deploy.html#github-pages).

Authentication uses the user's normal Git credential manager outside the repository. No token, device code or account secret belongs in source, workflow inputs or deployment artifacts.
