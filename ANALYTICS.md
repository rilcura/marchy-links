# GoatCounter setup and verification

Status on 2026-10-26: two-site configuration verified, deployment in progress.
The owner completed signup/login using the existing visits code below.
Email verification was requested from the owner; no password or API token is
stored in this repository. Only the owner's admin user exists in the account.

## Account settings

Use the free hosted service with two separate sites under the owner's account.
Sign in with the owner's GoatCounter account to access either dashboard.

| Setting | Visits site | Button events site |
| --- | --- | --- |
| Dashboard | https://bananainpajamas.goatcounter.com/ | https://marchys-cove-events.goatcounter.com/ |
| Dashboard access | Private, owner only | Private, owner only |
| Allow adding visitor counts on your website | On | Off |
| Sessions | On | On (individual events override with no_session) |
| Frontend production hostname | marchys-cove.pages.dev | marchys-cove.pages.dev |

The provider settings UI has no collector hostname allowlist. Its “Your site”
field supplies dashboard links; its embedding field controls dashboard frames,
not collection. The frontend strictly checks the hostname before loading analytics.
Collector endpoints are necessarily public and are not authentication secrets;
client checks cannot prevent a determined third party forging collector requests.
Never place API tokens or passwords in the repository.

The two distinct site codes are configured in `dist/analytics.js`.
Keep event visitor counters disabled in every format,
including JSON, HTML, SVG and PNG. Neither dashboard should be public.

## Integration

`analytics.js` loads one GoatCounter library with `no_onload` and `no_events`.
There is no `data-goatcounter` script attribute: the explicit synchronous send
helper selects the destination endpoint for each call and removes it afterwards.
The page sends only the stable `/` path to the visits site with sessions enabled.
Click and middle-click handlers route the seven existing data attributes only to
the events site with `event: true` and `no_session: true`. Right clicks are ignored.
The script guards against repeated initialization and queues up to 100 presses
while the library loads. There is no retry that could duplicate accepted hits.

The small counter above the footer fetches only the visits site's
`/counter/TOTAL.json`, without credentials. It displays a valid returned count
using textContent; failed, timed-out or invalid responses remain hidden.
Analytics exceptions do not prevent default link, clipboard or dialog actions.
Ad blockers and network failures make totals approximate. Counts begin when
enabled; no historical visits or clicks are invented. Provider sessions last
roughly eight hours, and the public counter can be cached for up to four hours.

## Verification record

`node --test tests/analytics.test.cjs`: seven mocked tests pass. These establish
frontend routing and failure behaviour, not provider session deduplication,
accepted real events, account privacy or production deployment.

Live unauthenticated HTTP checks: both dashboard roots redirect to `/user/new`
(login); events TOTAL counters in JSON/HTML/SVG/PNG and click-riot JSON return
403. The visits TOTAL JSON returns 200 with a genuine provider count. Both
settings pages show login-only access and sessions enabled; only visits has
public counters enabled. The shared Users page lists one admin and no others.

Local Brave checks: Riot displayed its successful copy confirmation; the bonk
dialog opened and closed with both the close button and Escape, returning focus
to its trigger. Desktop rendering was inspected. At a 390px viewport the card
measured 349px and document scroll width equalled its 375px client width (no
horizontal overflow). No GoatCounter library loaded on localhost and the
unconfigured counter stayed hidden. The responsive screenshot capture was
scaled unexpectedly, so final mobile visual inspection remains outstanding.

Before deployment: check desktop/mobile layout with a mocked valid counter,
seven button mappings, repeat presses, clipboard success/failure, and dialog
close button, Escape and backdrop. Use synthetic events locally so social sites
do not open and test clicks do not contaminate the real service.

After deployment through existing GitHub -> Cloudflare integration: verify the
deployed commit, real collectors and owner dashboards. Check one real visit plus
refreshes produces one session visit, and repeated intentional button presses
increase the correct private totals once each. Record any deliberate test counts.
Unauthenticated requests must not expose either dashboard or any events-site
counter (TOTAL and individual event paths, all four formats). The visits counter
must be accessible. Allow for provider processing and public cache delays; a
stale counter alone cannot establish whether a hit was accepted.

## Provider references

- https://www.goatcounter.com/help/js
- https://www.goatcounter.com/help/events
- https://www.goatcounter.com/help/sessions
- https://www.goatcounter.com/help/visitor-counter
