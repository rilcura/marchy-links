# Cloudflare Pages setup

Status: deployed and verified on 2026-10-25 at https://marchys-cove.pages.dev/. GitHub integration is connected to rilcura/marchy-links only. Production branch: main; build command: exit 0; output: dist. GitHub Pages remains live independently.

## Recommended: connect GitHub for automatic updates

1. Sign in at https://dash.cloudflare.com/ using a free account.
2. Open Workers & Pages and create a Pages project using Git integration.
3. Connect GitHub and grant access to only `rilcura/marchy-links`.
4. Select that repository and use these settings:

| Setting | Value |
| --- | --- |
| Project name | `marchys-cove` (deployed) |
| Production branch | `main` |
| Framework preset | None |
| Build command | `exit 0` |
| Build output directory | `dist` |
| Root directory | Leave blank (repository root) |
| Environment variables | None |

5. Save and deploy. Cloudflare will provide the actual `pages.dev` URL.
6. Check the page, both images, all five social destinations, Riot ID copy, and the bonk dialog on mobile before sharing the new URL.

No custom domain, paid plan, database, or server is required. GitHub pushes to `main` will deploy automatically once the integration is connected. GitHub Pages continues to deploy independently until intentionally disabled.

## Alternative: direct upload

A sibling archive, `marchy-links-cloudflare-upload.zip`, contains the contents of `dist` with `index.html` at its root. Choose a Pages Direct Upload project and upload it. This is a snapshot: later changes need another upload. Choose Git integration above if automatic updates are wanted; a Direct Upload project cannot later switch to Git integration.

## Analytics

Analytics setup is paused at the user's request. The seven event attributes alone do not collect statistics. Do not describe click counters as active.

## Documentation

- https://developers.cloudflare.com/pages/framework-guides/deploy-anything/
- https://developers.cloudflare.com/pages/get-started/git-integration/
- https://developers.cloudflare.com/pages/get-started/direct-upload/
