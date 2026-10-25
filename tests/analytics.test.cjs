const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const source = fs.readFileSync('dist/analytics.js', 'utf8');
function setup({ hostname = 'marchys-cove.pages.dev', count = '1,234', fail = false, configured = true } = {}) {
 const listeners = {}, calls = [], scripts = [], requests = [];
 const counter = { hidden: true, querySelector: () => counter.number, number: {} };
 const document = {
  visibilityState: 'visible',
  addEventListener(type, fn) { (listeners[type] ||= []).push(fn); },
  removeEventListener(type, fn) { listeners[type] = (listeners[type] || []).filter(f => f !== fn); },
  createElement: () => ({}), head: { append: script => scripts.push(script) },
  querySelector: () => counter,
 };
 const window = {};
 const context = vm.createContext({ window, document, location: { hostname, protocol: 'https:' }, AbortSignal,
  fetch: async (url, options) => { requests.push({ url, options }); if (fail) throw Error('blocked'); return { ok: true, json: async () => ({ count }) }; },
 });
 const code = source.replace(/const sites = \{[^\n]+\};/, configured
  ? "const sites = { visits: 'test-visits', events: 'test-events' };"
  : "const sites = { visits: '', events: '' };");
 const run = () => vm.runInContext(code, context);
 run();
 const load = () => {
  window.goatcounter.count = data => calls.push({ endpoint: window.goatcounter.endpoint, ...data });
  scripts[0].onload();
 };
 const click = (path, type = 'click', button = 0) => (listeners[type] || []).forEach(fn => fn({ type, button,
  target: { closest: () => ({ dataset: { goatcounterClick: path, goatcounterTitle: path + ' title' } }) },
 }));
 return { window, document, listeners, calls, scripts, requests, counter, run, load, click };
}
test('production only; blank configuration remains inactive', () => {
 for (const hostname of ['localhost', 'rilcura.github.io', 'preview.marchys-cove.pages.dev', 'marchys-shark-cove.randzellcura.chatgpt.site']) {
  const s = setup({ hostname }); assert.equal(s.scripts.length, 0); assert.equal(s.requests.length, 0);
 }
 assert.equal(setup({ configured: false }).scripts.length, 0);
});
test('one session-enabled page request and repeat events go to separate collectors', () => {
 const s = setup();
 assert.equal(s.window.goatcounter.no_onload, true); assert.equal(s.window.goatcounter.no_events, true);
 s.click('click-riot'); s.load(); s.run();
 for (const name of ['tiktok','discord','instagram','spotify','steam','riot','onlyfans']) { s.click('click-' + name); s.click('click-' + name); }
 s.click('click-steam', 'auxclick', 2); // Right click is not a press.
 s.click('click-steam', 'auxclick', 1);
 assert.equal(s.scripts.length, 1); assert.equal(s.listeners.click.length, 1);
 assert.equal(s.calls.filter(c => c.endpoint.includes('test-visits')).length, 1);
 assert.equal(s.calls[0].path, '/'); assert.equal(s.calls[0].event, false); assert.equal(s.calls[0].no_session, undefined);
 const events = s.calls.slice(1); assert.equal(events.length, 16);
 assert.ok(events.every(c => c.endpoint.includes('test-events') && c.event && c.no_session));
 assert.equal(s.window.goatcounter.endpoint, undefined);
});
test('background load counts once when visible', () => {
 const s = setup(); s.document.visibilityState = 'hidden'; s.load(); assert.equal(s.calls.length, 0);
 s.document.visibilityState = 'visible'; s.listeners.visibilitychange.slice().forEach(fn => fn());
 assert.equal(s.calls.length, 1); assert.equal(s.listeners.visibilitychange.length, 0);
});
test('counter uses public visits only and stays hidden for unavailable or invalid data', async () => {
 for (const options of [{}, { fail: true }, { count: '<script>' }]) {
  const s = setup(options); await new Promise(resolve => setImmediate(resolve));
  assert.equal(s.requests.length, 1); assert.match(s.requests[0].url, /test-visits.*TOTAL.json$/);
  assert.equal(s.requests[0].options.credentials, 'omit');
  assert.equal(s.counter.hidden, Boolean(options.fail || options.count));
  if (!s.counter.hidden) assert.equal(s.counter.number.textContent, '1,234');
 }
});
test('collector exceptions cannot propagate into click behaviour', () => {
 const s = setup(); s.load(); s.window.goatcounter.count = () => { throw Error('blocked'); };
 assert.doesNotThrow(() => s.click('click-onlyfans'));
 assert.equal(s.window.goatcounter.endpoint, undefined);
});
test('seven real HTML buttons have distinct stable mappings and repeat-count attributes', () => {
 const html = fs.readFileSync('dist/index.html', 'utf8');
 const tags = [...html.matchAll(/<(?:a|button)\b[^>]*data-goatcounter-click="([^"]+)"[^>]*>/g)];
 assert.deepEqual(tags.map(m => m[1]), ['tiktok','discord','instagram','spotify','steam','riot','onlyfans'].map(n => 'click-' + n));
 assert.ok(tags.every(m => m[0].includes('data-goatcounter-no-session="1"')));
 assert.match(html, /href="https:\/\/discord.gg\/tutkx7ckST"/);
 assert.match(html, /data-brand="onlyfans"/);
 assert.ok(html.indexOf('id="visit-counter"') < html.indexOf('<footer>'));
});
test('clipboard success/failure and bonk controls remain independent of analytics', async () => {
 const elements = new Map();
 function element(selector) {
  if (!elements.has(selector)) elements.set(selector, {textContent:'', listeners:{},style:{setProperty(){}},
   addEventListener(type, fn) { this.listeners[type] = fn; }, append(){}, querySelector: name => element(selector + ' ' + name),
   showModal(){this.open = true;}, close(){this.open = false; this.listeners.close?.();}, focus(){this.focused = true;},
   getBoundingClientRect: () => ({left:10,right:100,top:10,bottom:100}),
  });
  return elements.get(selector);
 }
 for (const fail of [false,true]) {
  let copied;
  const context = vm.createContext({document:{querySelector:element,createElement:element}, navigator:{clipboard:{writeText: async value => {if(fail) throw Error('denied');copied=value;}}},clearTimeout(){},setTimeout(){}});
  vm.runInContext(fs.readFileSync('dist/script.js','utf8'), context);
  await element('#copy-riot').listeners.click();
  if (fail) assert.match(element('#copy-status').textContent, /Couldn’t copy automatically/);
  else assert.equal(copied,'march#ixora');
  element('#bonk-button').listeners.click(); assert.equal(element('#bonk-dialog').open,true);
  element('#close-bonk').listeners.click(); assert.equal(element('#bonk-dialog').open,false);
  element('#bonk-button').listeners.click();
  element('#bonk-dialog').listeners.click({target:element('#bonk-dialog'),clientX:0,clientY:0});
  assert.equal(element('#bonk-dialog').open,false); assert.equal(element('#bonk-button').focused,true);
 }
});
