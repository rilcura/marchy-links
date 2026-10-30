# Marchy's Link Page

A responsive social-links page with a custom navy and blue visual theme, clipboard interaction, and aggregate visit/button analytics.

[Live website](https://marchys-cove.pages.dev/) · [GitHub Pages mirror](https://rilcura.github.io/marchy-links/)

## Scope and implementation

This personal website brings several social destinations into one page. The implementation demonstrates static frontend delivery, accessible dialog dismissal, clipboard success/failure handling, and deployment without a build pipeline.

**Stack:** HTML, CSS, browser JavaScript, GoatCounter, Cloudflare Pages, GitHub Pages.

## Features

- Links to Discord, Instagram, Spotify, Steam, and TikTok.
- A Riot ID copy button with visible confirmation and manual-copy fallback.
- Local images, embedded SVG brand icons, and a playful local dialog.
- A public session-visits counter and separate private button-event totals.
- Production-host checks which restrict analytics to the primary domain.

The page includes personal humour and is presented as a personal project.

## Preview locally

Serve the `dist` directory with a static server. With Python installed, run from the repository root:

```sh
python -m http.server 8000 --directory dist
```

Open `http://localhost:8000`. No npm install or frontend build is required. Local previews do not send production analytics.

## Files and tests

- `dist/index.html`: page content and links.
- `dist/style.css`: layout and visual styling.
- `dist/script.js`: clipboard and dialog interactions.
- `dist/analytics.js`: visits and button-event tracking.
- `tests/analytics.test.cjs`: automated source and behavior checks.

With a Node.js version supporting its built-in test runner:

```sh
node --test tests/analytics.test.cjs
```

Existing checks include link/source assertions and mocked clipboard success/failure behavior. They do not verify every external destination or establish physical-device coverage.

## Deployment and analytics

Cloudflare Pages publishes `dist` from `main`, with `exit 0` as the configured build command. The [GitHub Pages workflow](.github/workflows/pages.yml) publishes the same directory. The previous Sites deployment is maintained separately.

Read [CLOUDFLARE-SETUP.md](CLOUDFLARE-SETUP.md) for hosting details and [ANALYTICS.md](ANALYTICS.md) for tracking semantics and recorded verification.

The existing documentation records deployment and interaction checks on October 25, 2026, and analytics checks on October 26, 2026. Those historical checks are not a new runtime test. Their verification events are included in the totals. Analytics blockers and reporting delays affect the displayed count. Private event dashboards require the owner's login.

## Customization and next steps

Update destinations and images in `dist`. If moving the project to another domain, review the production-host condition and analytics configuration together. Add current screenshots and repeat interaction checks after changing the design.

## Attribution

Brand icons use Simple Icons 16.35.0 under CC0. Brand marks belong to their respective owners. The design was informed by the supplied Carrd reference, with project-specific styling and behavior.
