const { chromium } = require('playwright'); const path = require('path');
const MOCK = `(() => {
  window.__log = []; const L = (n, m, a) => { window.__log.push(n + '.' + m + ' ' + JSON.stringify(a || {}).slice(0, 160)); };
  const pref = { get: async ({ key }) => ({ value: localStorage.getItem('__pref_' + key) }), set: async ({ key, value }) => { localStorage.setItem('__pref_' + key, value); L('pref', 'set', { len: value.length }); } };
  const mk = n => new Proxy({}, { get: (_, m) => async (a, cb) => { L(n, m, a); if (n === 'App' && m === 'addListener') { window.__listeners = window.__listeners || {}; window.__listeners[a] = cb; } if (m === 'checkPermissions' || m === 'requestPermissions') return { display: 'granted' }; if (m === 'writeFile') return { uri: 'file:///cache/' + a.path }; return {}; } });
  window.Capacitor = { isNativePlatform: () => true, registerPlugin: n => n === 'Preferences' ? pref : mk(n) };
})();`;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  await ctx.addInitScript(MOCK);
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error' && !/capacitor\.js|ERR_FILE_NOT_FOUND/.test(m.text())) errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '../www/index.html')); await page.waitForTimeout(600);
  const shot = n => page.screenshot({ path: `/home/claude/repbook/test/${n}.png` });
  await shot('n0-welcome');
  await page.click('[data-a=wz][data-k=goal][data-v="3"]'); await page.click('[data-a=wz][data-k=prog][data-v="0"]'); await page.waitForTimeout(150); await shot('n1-welcome-picked');
  await page.click('[data-a=wzGo]'); await page.waitForTimeout(400); await shot('n2-home');
  await page.click('.hero [data-a=startRoutine]'); await page.waitForTimeout(400);
  const w = await page.$$('.wex'); const ins = await w[0].$$('input.fin'); await ins[0].fill('60'); await ins[1].fill('8');
  await (await w[0].$('[data-a=toggleDone]')).click(); await page.waitForTimeout(400); await shot('n3-log');
  await page.click('[data-a=restSkip]'); await page.waitForTimeout(200);
  // back button closes nothing then goes home
  await page.evaluate(() => window.__listeners.backButton()); await page.waitForTimeout(200);
  console.log('after back tab', await page.evaluate(() => nav.tab));
  await page.click('[data-a=go][data-s=settings]'); await page.waitForTimeout(200);
  await page.click('[data-a=remTog]'); await page.waitForTimeout(500); await shot('n4-settings');
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.click('[data-a=exportJson]'); await page.waitForTimeout(400);
  // persistence: wipe webview storage except prefs, reload
  console.log('BEFORE', (await page.evaluate(() => window.__log.filter(x => !x.startsWith('pref')).map(x=>x.slice(0,110)))).join('\n'));
  await page.evaluate(() => localStorage.removeItem('repbook.v1')); await page.reload(); await page.waitForTimeout(700);
  console.log('after reload from prefs', await page.evaluate(() => ({ active: !!S.active, routines: S.routines.length, goal: S.settings.weeklyGoal, onboarded: S.settings.onboarded, tab: nav.tab, sheet: !!document.querySelector('#layer').innerHTML })));
  await shot('n5-reload');
  const log = await page.evaluate(() => window.__log.filter(x => !x.startsWith('pref')));
  console.log(log.join('\n'));
  console.log('ERRORS', errs); await b.close();
})();
