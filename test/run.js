const { chromium } = require('playwright');
const path = require('path');
const MOCK = `
(() => {
  const K='__mockdb'; const load=()=>JSON.parse(localStorage.getItem(K)||'{}'); const save=o=>localStorage.setItem(K,JSON.stringify(o));
  const snap=(id,data)=>({id,exists:data!==undefined,data:()=>data,metadata:{fromCache:false,hasPendingWrites:false}});
  function docRef(p){return{id:p.split('/').pop(),path:p,
    get:async()=>snap(p.split('/').pop(),load()[p]),
    set:async d=>{const o=load();o[p]=JSON.parse(JSON.stringify(d));save(o);window.__writes=(window.__writes||0)+1},
    delete:async()=>{const o=load();delete o[p];save(o)},
    collection:c=>colRef(p+'/'+c)}}
  function colRef(p,ord,lim){return{path:p,doc:id=>docRef(p+'/'+id),orderBy:(f,d)=>colRef(p,[f,d],lim),limit:n=>colRef(p,ord,n),
    get:async()=>{const o=load();let docs=Object.keys(o).filter(k=>k.startsWith(p+'/')&&k.slice(p.length+1).split('/').length===1).map(k=>snap(k.split('/').pop(),o[k]));
      if(ord)docs.sort((a,b)=>(ord[1]==='desc'?-1:1)*((a.data()[ord[0]]||0)-(b.data()[ord[0]]||0)));if(lim)docs=docs.slice(0,lim);return{docs,size:docs.length,empty:!docs.length}}}}
  const db={doc:docRef,collection:colRef};
  window.claude={use:async n=>n==='db'?db:n==='user'?{id:async()=>'u_test',isOwner:async()=>true}:n==='downloads'?{save:async r=>{window.__dl=r;return{status:'saved'}}}:null};
})();`;
(async () => {
  const b = await chromium.launch();
  const ctx = await b.newContext({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true });
  await ctx.addInitScript(MOCK);
  const page = await ctx.newPage();
  const errs = []; page.on('pageerror', e => errs.push(e.message)); page.on('console', m => { if (m.type() === 'error') errs.push(m.text()); });
  const url = 'file://' + path.resolve(__dirname, '../dist/index.html');
  await page.goto(url); await page.waitForTimeout(800); await page.screenshot({path:'/home/claude/repbook/test/00-welcome.png'}); await page.click('[data-a=wz][data-k=prog][data-v="-1"]'); await page.click('[data-a=wzGo]'); await page.waitForTimeout(400);
  const shot = async n => page.screenshot({ path: `/home/claude/repbook/test/${n}.png` });
  await shot('01-home-empty');
  // add a program
  await page.click('text=Programs'); await page.waitForTimeout(200); await shot('02-programs');
  await page.click('[data-a=addProgram][data-i="0"]'); await page.waitForTimeout(300);
  await page.click('[data-a=back]'); await page.waitForTimeout(300); await shot('03-home-routines');
  // start Push
  await page.click('.hero [data-a=startRoutine]'); await page.waitForTimeout(400); await shot('04-log-push');
  // fill bench sets
  const fins = await (await page.$$('.wex'))[0].$$('input.fin');
  const vals = ['60', '8', '60', '8', '60', '7', '57.5', '8'];
  for (let i = 0; i < vals.length; i++) { await fins[i].fill(vals[i]); }
  for (let i = 0; i < 4; i++) { await (await (await page.$$('.wex'))[0].$$('[data-a=toggleDone]'))[i].click(); await page.waitForTimeout(80); }
  await page.waitForTimeout(300); await shot('05-log-done-sets');
  // second exercise: tick first set with empty -> should toast
  await (await (await page.$$('.wex'))[1].$$('[data-a=toggleDone]'))[0].click(); await page.waitForTimeout(200); await shot('06-toast-empty');
  // add exercise via picker
  await page.click('[data-a=addEx]'); await page.waitForTimeout(300);
  await page.fill('[data-in=pkQ]', 'run'); await page.waitForTimeout(200); await shot('07-picker');
  await page.click('#pklist [data-id=treadmill-run]'); await page.click('#pkbtn'); await page.waitForTimeout(400);
  const last = (await page.$$('.wex')).pop();
  const tin = await last.$$('input.fin'); await tin[0].fill('3.2'); await tin[1].fill('20');
  await (await last.$('[data-a=toggleDone]')).click(); await page.waitForTimeout(300); await shot('08-cardio');
  // finish
  await page.click('[data-a=finish]'); await page.waitForTimeout(300); await shot('09-finish-ask');
  await page.click('[data-a=askBtn][data-i="0"]'); await page.waitForTimeout(500); await shot('10-summary');
  await page.click('.sheet [data-a=closeSheet]'); await page.waitForTimeout(400);
  await page.waitForTimeout(1500);
  await shot('11-home-after');
  // second session of Push a few days later: backdate previous workout via edit to test previous/overload
  const st = await page.evaluate(() => { const w = Object.values(S.workouts)[0]; w.start -= 3 * 864e5; w.end -= 3 * 864e5; bump(); persist('w:' + w.id); render(); return { n: Object.keys(S.workouts).length, writes: window.__writes, pending: Object.keys(Sync.pending).length, status: Sync.status }; });
  console.log('state', st);
  await page.click('[data-a=tab][data-t=history]'); await page.waitForTimeout(300); await shot('12-history');
  await page.click('[data-a=histMode][data-m=cal]'); await page.waitForTimeout(200); await shot('13-calendar');
  // start Pull (up next), then go back to push to see previous
  await page.click('[data-a=tab][data-t=home]'); await page.waitForTimeout(300); await shot('14-home-next');
  await page.click('[data-a=go][data-s=routines]'); await page.waitForTimeout(300);
  await page.click('[data-a=go][data-s=routine] >> nth=0'); await page.waitForTimeout(300); await shot('15-routine-edit');
  await page.click('[data-a=startRoutine]'); await page.waitForTimeout(400); await shot('16-log-push-again');
  // edit Bench target to 6-8 already; all reps 8,8,7,8 -> not all >=8 -> no up. Check placeholder.
  const ph = await page.$$eval('.wex', a => [...a[0].querySelectorAll('input.fin')].map(x => x.placeholder+'|'+x.closest('tr').querySelector('.prev').textContent));
  console.log('placeholders', ph);
  // tick first set empty -> fills from placeholder; check PR on heavier
  const f2 = await (await page.$$('.wex'))[0].$$('input.fin'); await f2[0].fill('65'); await f2[1].fill('6');
  await (await (await page.$$('.wex'))[0].$$('[data-a=toggleDone]'))[0].click(); await page.waitForTimeout(400); await shot('17-pr');
  await (await (await page.$$('.wex'))[0].$$('[data-a=toggleDone]'))[1].click(); await page.waitForTimeout(300);
  // reload mid-workout (cloud persisted)
  await page.waitForTimeout(1600);
  await page.reload(); await page.waitForTimeout(1200); await shot('18-after-reload');
  const st2 = await page.evaluate(() => ({ active: !!S.active, done: S.active && S.active.ex[0].sets.filter(s => s.done).length, w: Object.keys(S.workouts).length, status: Sync.status }));
  console.log('after reload', st2);
  // clear local storage except mockdb -> test pure cloud load
  await page.evaluate(() => { localStorage.removeItem('repbook.v1'); }); await page.reload(); await page.waitForTimeout(1200);
  const st3 = await page.evaluate(() => ({ active: !!S.active, w: Object.keys(S.workouts).length, routines: S.routines.length, status: Sync.status }));
  console.log('cloud-only reload', st3);
  await page.click('[data-a=finish]'); await page.waitForTimeout(300); await page.click('[data-a=askBtn][data-i="0"]'); await page.waitForTimeout(600);
  await page.click('.sheet [data-a=closeSheet]'); await page.waitForTimeout(400);
  // exercise detail
  await page.click('[data-a=tab][data-t=exercises]'); await page.waitForTimeout(300); await shot('19-exercises');
  await page.fill('[data-in=exQ]', 'bench barbell'); await page.waitForTimeout(200);
  await page.click('#exlist [data-id=bench-press-barbell]'); await page.waitForTimeout(300); await shot('20-ex-detail');
  // progress
  await page.click('[data-a=tab][data-t=progress]'); await page.waitForTimeout(300); await shot('21-progress');
  await page.evaluate(() => window.scrollTo(0, 2000)); await page.waitForTimeout(200); await shot('22-progress-2');
  await page.click('[data-a=bwAdd]'); await page.waitForTimeout(300); await page.fill('[data-px=w]', '72.4'); await page.click('[data-a=bwSave]'); await page.waitForTimeout(300);
  await page.click('[data-a=toolPlates]'); await page.waitForTimeout(300); await page.fill('[data-in=plw]', '102.5'); await page.waitForTimeout(200); await shot('23-plates');
  await page.click('.scrim'); await page.waitForTimeout(300);
  await page.click('[data-a=go][data-s=settings]'); await page.waitForTimeout(300); await shot('24-settings');
  await page.click('[data-a=exportCsv]'); await page.waitForTimeout(300);
  const dl = await page.evaluate(() => window.__dl && window.__dl.filename + ' ' + window.__dl.data.split('\n').length + ' lines\n' + window.__dl.data.split('\n').slice(0, 3).join('\n'));
  console.log('download', dl);
  await page.click('[data-a=units][data-u=imperial]'); await page.waitForTimeout(200);
  await page.click('[data-a=tab][data-t=home]'); await page.waitForTimeout(300); await shot('25-home-imperial');
  console.log('ERRORS', errs);
  await b.close();
})();
