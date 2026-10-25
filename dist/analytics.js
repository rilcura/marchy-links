// Public collector addresses, never credentials. Dashboards require login;
// only the visits site permits public counter reads.
(() => {
 'use strict';
 const sites = { visits: 'bananainpajamas', events: 'marchys-cove-events' };
 if (location.hostname !== 'marchys-cove.pages.dev' || location.protocol !== 'https:' || window.marchyAnalyticsStarted) return;
 if (!sites.visits || !sites.events || sites.visits === sites.events) return;
 window.marchyAnalyticsStarted = true;

 // One library, no automatic page counts or click binding. Every request has
 // an explicit destination; click events can never use the visits collector.
 window.goatcounter = { no_onload: true, no_events: true };
 const script = document.createElement('script');
 script.src = 'https://gc.zgo.at/count.js';
 script.async = true;
 const pending = [];
 let ready = false;
 const send = (site, data) => {
  try {
   const gc = window.goatcounter;
   gc.endpoint = `https://${site}.goatcounter.com/count`;
   gc.count(data);
  } catch { /* Analytics must never interrupt a link, clipboard or dialog. */ }
  finally { delete window.goatcounter.endpoint; }
 };
 const track = (event) => {
  if (event.type === 'auxclick' && event.button !== 1) return;
  const button = event.target.closest('[data-goatcounter-click]');
  if (!button) return;
  const data = { path: button.dataset.goatcounterClick, title: button.dataset.goatcounterTitle, event: true, no_session: true, referrer: '' };
  if (ready) send(sites.events, data);
  else if (pending.length < 100) pending.push(data);
 };
 document.addEventListener('click', track);
 document.addEventListener('auxclick', track);
 script.onload = () => {
  ready = true;
  const visit = () => {
   if (document.visibilityState !== 'visible') return;
   document.removeEventListener('visibilitychange', visit);
   // A stable path prevents query strings from creating extra session visits.
   send(sites.visits, { path: '/', title: "Marchy’s cove", event: false });
  };
  if (document.visibilityState === 'visible') visit();
  else document.addEventListener('visibilitychange', visit);
  pending.splice(0).forEach(data => send(sites.events, data));
 };
 document.head.append(script);

 // Only the visits site exposes a counter. Do not query event totals here.
 fetch(`https://${sites.visits}.goatcounter.com/counter/TOTAL.json`, { credentials: 'omit', signal: AbortSignal.timeout(8000) })
  .then(response => { if (!response.ok) throw new Error('Counter unavailable'); return response.json(); })
  .then(data => {
   if (typeof data.count !== 'string' || !/^\d[\d, .\u00a0\u202f]*$/.test(data.count)) return;
   const counter = document.querySelector('#visit-counter');
   counter.querySelector('span').textContent = data.count;
   counter.hidden = false;
  })
  .catch(() => { /* Leave unavailable counts hidden, never invent zero. */ });
})();
