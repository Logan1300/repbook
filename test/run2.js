const { chromium } = require('playwright'); const path = require('path');
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  await page.goto('file://' + path.resolve(__dirname, '../dist/index.html')); await page.waitForTimeout(500); await page.click('.sheet [data-a=closeSheet]'); await page.waitForTimeout(400);
  const shot = n => page.screenshot({ path: `/home/claude/repbook/test/${n}.png` });
  // local-only mode: log past workout with custom exercise + calisthenics
  await page.click('[data-a=navLog]'); await page.waitForTimeout(300);
  await page.click('.sheet [data-a=logPast]'); await page.waitForTimeout(300);
  await page.fill('[data-px=dur]', '45'); await page.click('[data-a=pastGo]'); await page.waitForTimeout(400);
  await page.click('[data-a=addEx]'); await page.waitForTimeout(300);
  await page.fill('[data-in=pkQ]', 'pull'); await page.waitForTimeout(200); await shot('30-picker-pull');
  await page.click('#pklist [data-id=pull-up]'); await page.fill('[data-in=pkQ]', 'plank'); await page.waitForTimeout(150); await page.click('#pklist [data-id=plank]');
  await page.fill('[data-in=pkQ]', 'Zercher Squat'); await page.waitForTimeout(200);
  await page.click('#pklist [data-a=newCustom]'); await page.waitForTimeout(300); await shot('31-custom');
  await page.selectOption('[data-cx=muscle]', 'Quads'); await page.selectOption('[data-cx=equip]', 'Barbell');
  await page.click('[data-a=saveCustom]'); await page.waitForTimeout(400);
  const n = await page.$$eval('.wex', a => a.map(x => x.querySelector('.nm').textContent)); console.log('exercises', n);
  // fill pull-ups: reps only
  let w = await page.$$('.wex');
  let ins = await w[0].$$('input.fin'); await ins[1].fill('10'); await ins[3].fill('8'); await ins[5].fill('7');
  ins = await w[1].$$('input.fin'); await ins[0].fill('60'); await ins[1].fill('45');
  ins = await w[2].$$('input.fin'); await ins[0].fill('40'); await ins[1].fill('5');
  // superset pull-ups with plank
  await (await w[0].$('[data-a=exMenu]')).click(); await page.waitForTimeout(250); await page.click('[data-a=exSS]'); await page.waitForTimeout(250);
  await shot('32-log-past');
  await page.click('[data-a=finish]'); await page.waitForTimeout(300); await shot('33-ask'); await page.click('[data-a=askBtn][data-i="0"]'); await page.waitForTimeout(500);
  await shot('34-summary');
  await page.click('.sheet [data-a=saveAsRoutine]'); await page.waitForTimeout(400);
  const st = await page.evaluate(() => { const w = Object.values(S.workouts)[0]; return { name: w.name, dur: Math.round((w.end - w.start) / 60000), day: new Date(w.start).toDateString(), ex: w.ex.map(e => e.exId + ':' + e.sets.length), routines: S.routines.map(r => r.name + ':' + r.ex.map(x => x.reps || x.time).join('/')), status: Sync.status, ls: !!localStorage.getItem('repbook.v1') }; });
  console.log(st);
  // edit workout: open history, edit, change a value, save
  await page.click('[data-a=tab][data-t=history]'); await page.waitForTimeout(300);
  await page.click('.card.tap'); await page.waitForTimeout(300); await shot('35-detail');
  await page.click('.btns [data-a=editW]'); await page.waitForTimeout(300);
  w = await page.$$('.wex'); ins = await w[0].$$('input.fin'); await ins[1].fill('12');
  await page.click('[data-a=saveEdit]'); await page.waitForTimeout(300); await shot('36-after-edit');
  console.log('edited reps', await page.evaluate(() => Object.values(S.workouts)[0].ex[0].sets[0].r));
  // reload — local persistence
  await page.reload(); await page.waitForTimeout(500);
  console.log('after reload', await page.evaluate(() => ({ w: Object.keys(S.workouts).length, r: S.routines.length, c: S.custom.length })));
  // export JSON fallback (no downloads) -> copy sheet
  await page.click('[data-a=tab][data-t=home]'); await page.click('[data-a=go][data-s=settings]'); await page.waitForTimeout(200);
  await page.click('[data-a=exportJson]'); await page.waitForTimeout(400); await shot('37-export-fallback');
  const json = await page.$eval('.sheet textarea', t => t.value);
  await page.click('.sheet [data-a=closeSheet]'); await page.waitForTimeout(300);
  // erase + import
  await page.click('[data-a=eraseAll]'); await page.waitForTimeout(300); await page.click('[data-a=askBtn][data-i="0"]'); await page.waitForTimeout(300);
  console.log('after erase', await page.evaluate(() => Object.keys(S.workouts).length));
  require('fs').writeFileSync('/tmp/bk.json', json);
  await page.click('[data-a=go][data-s=settings]'); await page.waitForTimeout(200);
  await page.setInputFiles('[data-in=importFile]', '/tmp/bk.json'); await page.waitForTimeout(500);
  console.log('after import', await page.evaluate(() => ({ w: Object.keys(S.workouts).length, r: S.routines.length, c: S.custom.length })));
  await page.click('[data-a=tab][data-t=home]'); await page.waitForTimeout(300); await shot('38-home-local');
  // 1RM tool
  await page.click('[data-a=tab][data-t=progress]'); await page.click('[data-a=tool1rm]'); await page.waitForTimeout(300);
  await page.fill('[data-in=c1w]', '100'); await page.fill('[data-in=c1r]', '5'); await page.waitForTimeout(200); await shot('39-1rm');
  console.log('ERRORS', errs); await b.close();
})();
