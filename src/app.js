'use strict';
/* =========================================================
   RepBook — workout tracker
   ========================================================= */

// ---------- utils ----------
const $ = (s, r = document) => r.querySelector(s);
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const clone = o => JSON.parse(JSON.stringify(o));
const r1 = n => Math.round(n * 10) / 10;
const r2 = n => Math.round(n * 100) / 100;
const fmtN = n => (n == null || isNaN(n)) ? '' : String(+(+n).toFixed(2));
const DAY = 864e5;
const KG_LB = 2.20462, KM_MI = 0.621371;
const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONL = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const P = {
  home: '<path d="M3 10.5 12 3l9 7.5V20a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z"/>',
  cal: '<rect x="3" y="4.5" width="18" height="16.5" rx="2.5"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4"/>',
  dumb: '<path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/>',
  list: '<path d="M8 6h13M8 12h13M8 18h13M3.5 6h.01M3.5 12h.01M3.5 18h.01"/>',
  chart: '<path d="M3 3v18h18"/><path d="m7 15 4-4 3 3 6-7"/>',
  gear: '<path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  check: '<path d="m5 12.5 4.5 4.5L19 7.5"/>',
  more: '<circle cx="5" cy="12" r="1.2"/><circle cx="12" cy="12" r="1.2"/><circle cx="19" cy="12" r="1.2"/>',
  back: '<path d="M15 5l-7 7 7 7"/>',
  chev: '<path d="m9 5 7 7-7 7"/>',
  timer: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9.5 2.5h5"/>',
  trash: '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  trophy: '<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H4.5a3 3 0 0 0 3.5 4M16 6h3.5a3 3 0 0 1-3.5 4M12 13v4M8 21h8M9.5 17h5"/>',
  edit: '<path d="M4 20h4L19 9l-4-4L4 16z"/>',
  copy: '<rect x="8" y="8" width="12" height="12" rx="2"/><path d="M16 8V5a1 1 0 0 0-1-1H5a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h3"/>',
  play: '<path d="M7 4.5v15l12-7.5z"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  repeat: '<path d="M4 12a8 8 0 0 1 14-5.3L20 9M20 4v5h-5M20 12a8 8 0 0 1-14 5.3L4 15M4 20v-5h5"/>',
  x: '<path d="M6 6l12 12M18 6 6 18"/>',
  up: '<path d="M12 19V5M6 11l6-6 6 6"/>',
  down: '<path d="M12 5v14M6 13l6 6 6-6"/>',
  flame: '<path d="M12 3s5 4.5 5 10a5 5 0 0 1-10 0c0-2.5 1.5-4 1.5-4s.5 2 2 2C10.5 8 12 3 12 3z"/>',
  download: '<path d="M12 4v12M7 11l5 5 5-5M5 20h14"/>',
  upload: '<path d="M12 20V8M7 13l5-5 5 5M5 4h14"/>',
  note: '<path d="M5 4h14v16H5zM9 9h6M9 13h6M9 17h3"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.6 0l3-3a4 4 0 0 0-5.6-5.6l-1 1M14 10a4 4 0 0 0-5.6 0l-3 3a4 4 0 0 0 5.6 5.6l1-1"/>',
  swap: '<path d="M7 4 3 8l4 4M3 8h14M17 20l4-4-4-4M21 16H7"/>',
  scale: '<rect x="3" y="4" width="18" height="16" rx="3"/><path d="M8.5 9.5a5 5 0 0 1 7 0L12 13"/>',
  calc: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 7h8M8 11h.01M12 11h.01M16 11h.01M8 15h.01M12 15h.01M16 15h.01M8 18h.01M12 18h.01M16 18h.01"/>',
  book: '<path d="M4 19.5V5a2 2 0 0 1 2-2h14v16H6a2 2 0 0 0-2 2 2 2 0 0 0 2 2h14"/>',
  cloud: '<path d="M7 18h10a4 4 0 0 0 .5-7.97A6 6 0 0 0 6 9.5 4.3 4.3 0 0 0 7 18z"/>',
  clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  plates: '<path d="M2 12h20"/><rect x="5" y="6" width="3" height="12" rx="1"/><rect x="16" y="6" width="3" height="12" rx="1"/><rect x="9" y="8" width="2" height="8" rx="1"/><rect x="13" y="8" width="2" height="8" rx="1"/>'
};
const ic = (n, cls = '') => `<svg class="${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${P[n] || ''}</svg>`;

// ---------- native (Android app) ----------
const NATIVE = !!(window.Capacitor && typeof window.Capacitor.isNativePlatform === 'function' && window.Capacitor.isNativePlatform() && window.Capacitor.registerPlugin);
const Nat = NATIVE ? (() => { const reg = n => window.Capacitor.registerPlugin(n); return { pref: reg('Preferences'), ln: reg('LocalNotifications'), share: reg('Share'), fs: reg('Filesystem'), app: reg('App'), awake: reg('KeepAwake') }; })() : null;
const APP_VERSION = window.REPBOOK_VERSION || '1.0';
const REST_ID = 1001, REMIND_BASE = 2100;
async function notifReady(ask = true) {
  if (!NATIVE) return false;
  try {
    let p = await Nat.ln.checkPermissions();
    if (p.display !== 'granted' && ask) p = await Nat.ln.requestPermissions();
    return p.display === 'granted';
  } catch (e) { return false; }
}
async function setupChannels() {
  if (!NATIVE) return;
  try {
    await Nat.ln.createChannel({ id: 'rest', name: 'Rest timer', description: 'Tells you when your rest is over', importance: 5, visibility: 1, vibration: true });
    await Nat.ln.createChannel({ id: 'remind', name: 'Workout reminders', description: 'Reminders on your training days', importance: 4, visibility: 1, vibration: true });
  } catch (e) { }
}
async function scheduleRestNote() {
  if (!NATIVE || !RT) return;
  try {
    await Nat.ln.cancel({ notifications: [{ id: REST_ID }] });
    if (!(await notifReady(true))) return;
    await Nat.ln.schedule({ notifications: [{ id: REST_ID, title: 'Rest over 💪', body: 'Time for your next set', channelId: 'rest', autoCancel: true, schedule: { at: new Date(RT.end), allowWhileIdle: true } }] });
  } catch (e) { }
}
async function cancelRestNote() { if (!NATIVE) return; try { await Nat.ln.cancel({ notifications: [{ id: REST_ID }] }); } catch (e) { } }
async function scheduleReminders(ask = false) {
  if (!NATIVE) return;
  try {
    await Nat.ln.cancel({ notifications: [0, 1, 2, 3, 4, 5, 6].map(d => ({ id: REMIND_BASE + d })) });
    const r = S.settings.remind;
    if (!r || !r.on || !r.days.length) return;
    if (!(await notifReady(ask))) { if (ask) toast('Allow notifications to get reminders'); return; }
    const [hh, mm] = (r.time || '18:00').split(':').map(Number);
    const nx = nextRoutine();
    const body = nx ? `Up next: ${nx.r.name}. Let's go!` : 'Time to train. Open RepBook and log it.';
    await Nat.ln.schedule({ notifications: r.days.map(d => ({ id: REMIND_BASE + d, title: 'Workout time 🏋️', body, channelId: 'remind', autoCancel: true, schedule: { on: { weekday: d + 1, hour: hh, minute: mm }, allowWhileIdle: true } })) });
  } catch (e) { }
}
let awakeOn = null;
function syncAwake() {
  if (!NATIVE) return;
  const want = !!S.active && S.settings.keepAwake !== false;
  if (want === awakeOn) return; awakeOn = want;
  try { want ? Nat.awake.keepAwake() : Nat.awake.allowSleep(); } catch (e) { }
}
const buzz = ms => { try { navigator.vibrate && navigator.vibrate(ms); } catch (e) { } };

// ---------- state ----------
const DEFAULT_SETTINGS = { units: 'metric', rest: 90, autoRest: true, sound: true, vibrate: true, weeklyGoal: 4, weekStart: 1, inc: 2.5, bar: 20, keepAwake: true, remind: { on: false, days: [1, 3, 5], time: '18:00' }, lastExport: null, onboarded: false };
let S = { settings: { ...DEFAULT_SETTINGS }, custom: [], routines: [], bw: [], workouts: {}, active: null };
let nav = { tab: 'home', stack: [] };
let EDIT = null;          // working copy when editing a finished workout
let RD = null;            // routine draft
let UI = { histMode: 'list', calMonth: null, calSel: null, exCat: 'All', exQ: '', chartMetric: {} };

// ---------- persistence & cloud sync ----------
const LSK = 'repbook.v1';
const Sync = { db: null, uid: null, mode: 'local', pending: {}, flushing: false, t: null, status: 'local', retry: null };

let prefT = null;
function saveLocal() {
  const blob = JSON.stringify({ v: 1, at: Date.now(), S, pending: Sync.pending });
  try { localStorage.setItem(LSK, blob); } catch (e) { }
  if (NATIVE) { clearTimeout(prefT); prefT = setTimeout(() => savePref(blob), 400); }
}
function savePref(blob) { clearTimeout(prefT); try { Nat.pref.set({ key: LSK, value: blob || JSON.stringify({ v: 1, at: Date.now(), S, pending: {} }) }); } catch (e) { } }
function loadLocal() {
  try {
    const raw = localStorage.getItem(LSK);
    if (!raw) return;
    const o = JSON.parse(raw);
    if (o && o.S) { S = normalize(o.S); Sync.pending = o.pending || {}; loadLocal.at = o.at || 0; }
  } catch (e) { }
}
async function loadNative() {
  // Android: the app's private storage is the source of truth (WebView storage is only a fast cache)
  try {
    const r = await Nat.pref.get({ key: LSK });
    if (r && r.value) {
      const o = JSON.parse(r.value);
      if (o && o.S && (o.at || 0) >= (loadLocal.at || 0)) { S = normalize(o.S); bump(); try { localStorage.setItem(LSK, r.value); } catch (e) { } }
      else savePref();
    } else if (loadLocal.at) savePref();
  } catch (e) { }
}
function normalize(s) {
  s = s || {};
  return {
    settings: { ...DEFAULT_SETTINGS, ...(s.settings || {}), remind: { ...DEFAULT_SETTINGS.remind, ...((s.settings || {}).remind || {}) } },
    custom: Array.isArray(s.custom) ? s.custom : [],
    routines: Array.isArray(s.routines) ? s.routines : [],
    bw: Array.isArray(s.bw) ? s.bw : [],
    workouts: s.workouts && typeof s.workouts === 'object' ? s.workouts : {},
    active: s.active || null
  };
}
function persist(key) {
  Sync.pending[key] = (Sync.pending[key] || 0) + 1;
  bump();
  saveLocal();
  if (NATIVE) { Sync.pending = {}; return; }
  clearTimeout(Sync.t);
  Sync.t = setTimeout(flush, key === 'active' ? 1200 : 300);
}
let softT = null;
function persistSoon(key) { clearTimeout(softT); softT = setTimeout(() => persist(key), 700); }

const refs = {
  profile: () => Sync.db.doc(`data/users/${Sync.uid}/profile`),
  active: () => Sync.db.doc(`data/users/${Sync.uid}/active`),
  wcol: () => Sync.db.doc(`data/users/${Sync.uid}/profile`).collection('workouts')
};
async function writeKey(key) {
  if (key === 'profile') {
    await refs.profile().set(clone({ settings: S.settings, custom: S.custom, routines: S.routines, bw: S.bw, updated: Date.now(), v: 1 }));
  } else if (key === 'active') {
    if (S.active) await refs.active().set(clone({ w: S.active, updated: Date.now() }));
    else await refs.active().delete();
  } else if (key.startsWith('w:')) {
    const id = key.slice(2), w = S.workouts[id];
    if (w) await refs.wcol().doc(id).set(clone(w));
    else await refs.wcol().doc(id).delete();
  }
}
async function flush() {
  if (!Sync.db || Sync.flushing || Sync.mode !== 'cloud') return;
  const keys = Object.keys(Sync.pending);
  if (!keys.length) { setStatus('ok'); return; }
  Sync.flushing = true; setStatus('busy');
  let failed = null;
  for (const key of keys) {
    const ver = Sync.pending[key];
    try { await writeKey(key); if (Sync.pending[key] === ver) delete Sync.pending[key]; }
    catch (e) {
      if (e && e.code === 'unavailable') { await new Promise(r => setTimeout(r, 600 + Math.random() * 800)); try { await writeKey(key); if (Sync.pending[key] === ver) delete Sync.pending[key]; continue; } catch (e2) { failed = e2; } }
      else failed = e;
      break;
    }
  }
  Sync.flushing = false; saveLocal();
  if (failed) {
    setStatus(failed.code === 'quota_exceeded' ? 'full' : 'err');
    clearTimeout(Sync.retry); Sync.retry = setTimeout(flush, 20000);
  } else if (Object.keys(Sync.pending).length) { flush(); }
  else setStatus('ok');
}
function setStatus(st) {
  Sync.status = st;
  document.querySelectorAll('[data-sync]').forEach(el => { el.className = 'sync ' + st; el.innerHTML = '<i></i>' + statusText(); });
}
function statusText() {
  return { device: 'Saved on this phone', ok: 'Synced to your Claude account', busy: 'Saving…', err: 'Offline — saved on phone, will sync', local: 'Saved on this device only', full: 'Cloud storage full — export a backup', connecting: 'Connecting…' }[Sync.status] || '';
}
const syncBadge = () => `<span data-sync class="sync ${Sync.status}"><i></i>${statusText()}</span>`;
const withTimeout = (p, ms) => Promise.race([p, new Promise((_, rej) => setTimeout(() => rej({ code: 'timeout' }), ms))]);

async function connect() {
  if (NATIVE) { setStatus('device'); return; }
  if (!window.claude || typeof window.claude.use !== 'function') { setStatus('local'); return; }
  setStatus('connecting');
  let db = null, user = null;
  try { [db, user] = await Promise.all([window.claude.use('db'), window.claude.use('user')]); } catch (e) { }
  const id = user ? await user.id() : null;
  if (!db || !id) { Sync.mode = 'local'; setStatus('local'); maybeWelcome(); return; }
  Sync.db = db; Sync.uid = id;
  try {
    const [p, a, ws] = await withTimeout(Promise.all([
      refs.profile().get(), refs.active().get(), refs.wcol().orderBy('start', 'desc').limit(1000).get()
    ]), 12000);
    const remoteHas = p.exists || ws.size > 0 || a.exists;
    if (!remoteHas) {
      // first time in the cloud: upload everything stored on this device
      Sync.pending.profile = 1; Sync.pending.active = 1;
      Object.keys(S.workouts).forEach(k => Sync.pending['w:' + k] = 1);
    } else {
      const pend = Sync.pending;
      const pd = p.exists ? clone(p.data()) : {};
      const merged = normalize({
        settings: pend.profile ? S.settings : pd.settings,
        custom: pend.profile ? S.custom : pd.custom,
        routines: pend.profile ? S.routines : pd.routines,
        bw: pend.profile ? S.bw : pd.bw,
        workouts: {},
        active: pend.active ? S.active : (a.exists ? clone(a.data()).w || null : null)
      });
      ws.docs.forEach(d => { merged.workouts[d.id] = clone(d.data()); });
      Object.keys(pend).forEach(k => {
        if (!k.startsWith('w:')) return;
        const wid = k.slice(2);
        if (S.workouts[wid]) merged.workouts[wid] = S.workouts[wid]; else delete merged.workouts[wid];
      });
      S = merged;
    }
    Sync.mode = 'cloud';
    if (S.active && !connect._done && nav.tab === 'home' && !nav.stack.length) nav.tab = 'log';
    connect._done = true;
    bump(); saveLocal(); render(); flush();
    if (!Object.keys(Sync.pending).length) setStatus('ok');
    maybeWelcome();
  } catch (e) {
    setStatus('err');
    setTimeout(connect, 20000);
  }
}
document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'hidden') { clearTimeout(Sync.t); flush(); } });

// ---------- units & formatting ----------
const metric = () => S.settings.units !== 'imperial';
const wU = () => metric() ? 'kg' : 'lb';
const dU = () => metric() ? 'km' : 'mi';
const wOut = kg => kg == null ? null : r1(metric() ? kg : kg * KG_LB);
const wIn = v => metric() ? v : v / KG_LB;
const dOut = km => km == null ? null : r2(metric() ? km : km * KM_MI);
const dIn = v => metric() ? v : v / KM_MI;
function fmtSec(s) { s = Math.round(s || 0); if (s < 60) return s + 's'; const m = Math.floor(s / 60), x = s % 60; return m + ':' + String(x).padStart(2, '0'); }
function fmtMin(sec) { const m = Math.round((sec || 0) / 60); if (m < 60) return m + ' min'; return Math.floor(m / 60) + 'h ' + String(m % 60).padStart(2, '0') + 'm'; }
function fmtDur(ms) { const m = Math.max(0, Math.round(ms / 60000)); if (m < 60) return m + 'm'; return Math.floor(m / 60) + 'h ' + String(m % 60).padStart(2, '0') + 'm'; }
function fmtClock(ms) { const s = Math.max(0, Math.floor(ms / 1000)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return (h ? h + ':' + String(m).padStart(2, '0') : m) + ':' + String(x).padStart(2, '0'); }
function fmtVol(kg) { const v = metric() ? kg : kg * KG_LB; return v >= 10000 ? r1(v / 1000) + 'k' : Math.round(v).toLocaleString('en-IN'); }
const dstr = ts => { const d = new Date(ts); return `${WD[d.getDay()]}, ${d.getDate()} ${MON[d.getMonth()]}`; };
const dstrY = ts => { const d = new Date(ts); return `${d.getDate()} ${MON[d.getMonth()]} ${d.getFullYear()}`; };
const tstr = ts => { const d = new Date(ts); let h = d.getHours(); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${String(d.getMinutes()).padStart(2, '0')} ${ap}`; };
const ymd = ts => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
const startOfDay = ts => { const d = new Date(ts); d.setHours(0, 0, 0, 0); return d.getTime(); };
function weekStartOf(ts) { const d = new Date(startOfDay(ts)); const diff = (d.getDay() - S.settings.weekStart + 7) % 7; d.setDate(d.getDate() - diff); return d.getTime(); }
function ago(ts) {
  const days = Math.round((startOfDay(Date.now()) - startOfDay(ts)) / DAY);
  if (days <= 0) return 'Today'; if (days === 1) return 'Yesterday';
  if (days < 7) return days + ' days ago'; if (days < 30) { const w = Math.round(days / 7); return w + (w === 1 ? ' week ago' : ' weeks ago'); }
  return dstrY(ts);
}

// ---------- exercises ----------
let EXMAP = {};
function rebuildEx() { EXMAP = {}; LIBRARY.forEach(e => EXMAP[e.id] = e); S.custom.forEach(e => EXMAP[e.id] = { ...e, custom: true }); }
const getEx = id => EXMAP[id] || { id, name: 'Unknown exercise', cat: 'Strength', muscle: 'Other', equip: 'Other', type: 'wr' };
const allEx = () => [...LIBRARY, ...S.custom.filter(e => !e.hidden).map(e => ({ ...e, custom: true }))];

function fieldsFor(type) {
  return {
    wr: [{ f: 'w', l: wU() }, { f: 'r', l: 'reps' }],
    bw: [{ f: 'w', l: '+' + wU() }, { f: 'r', l: 'reps' }],
    as: [{ f: 'w', l: '−' + wU() }, { f: 'r', l: 'reps' }],
    ts: [{ f: 't', l: 'sec', tu: 's' }],
    tm: [{ f: 't', l: 'min', tu: 'm' }],
    dt: [{ f: 'd', l: dU() }, { f: 't', l: 'min', tu: 'm' }],
    wt: [{ f: 'w', l: wU() }, { f: 't', l: 'sec', tu: 's' }]
  }[type] || [{ f: 'w', l: wU() }, { f: 'r', l: 'reps' }];
}
function outVal(f, v, tu) {
  if (v == null || v === '') return '';
  if (f === 'w') return fmtN(wOut(v));
  if (f === 'd') return fmtN(dOut(v));
  if (f === 't') return tu === 'm' ? fmtN(r1(v / 60)) : fmtN(Math.round(v));
  return fmtN(v);
}
function inVal(f, str, tu) {
  const n = parseFloat(String(str).replace(',', '.'));
  if (isNaN(n)) return null;
  if (f === 'w') return wIn(n);
  if (f === 'd') return dIn(n);
  if (f === 't') return tu === 'm' ? Math.round(n * 60) : Math.round(n);
  if (f === 'r') return Math.round(n);
  return n;
}
function setStr(type, s, short) {
  const w = s.w != null ? fmtN(wOut(s.w)) : null, u = wU();
  switch (type) {
    case 'wr': return short ? `${w ?? '–'}×${s.r ?? '–'}` : `${w ?? 0} ${u} × ${s.r ?? 0}`;
    case 'bw': return s.w ? (short ? `+${w}×${s.r ?? '–'}` : `+${w} ${u} × ${s.r ?? 0}`) : `${s.r ?? 0}${short ? '' : ' reps'}`;
    case 'as': return short ? `−${w ?? 0}×${s.r ?? '–'}` : `−${w ?? 0} ${u} × ${s.r ?? 0}`;
    case 'ts': return fmtSec(s.t);
    case 'tm': return fmtMin(s.t);
    case 'dt': return `${fmtN(dOut(s.d || 0))}${short ? '' : ' '}${dU()}${short ? ' ' : ' · '}${short ? Math.round((s.t || 0) / 60) + 'm' : fmtMin(s.t)}`;
    case 'wt': return short ? `${w ?? 0}·${fmtSec(s.t)}` : `${w ?? 0} ${u} · ${fmtSec(s.t)}`;
  }
  return '';
}
function targetStr(type, t) {
  if (!t) return '';
  if (['wr', 'bw', 'as'].includes(type)) return t.reps ? `${t.reps} reps` : '';
  if (type === 'ts' || type === 'wt') return t.time ? fmtSec(t.time) : '';
  if (type === 'tm') return t.time ? fmtMin(t.time) : '';
  if (type === 'dt') return [t.dist ? fmtN(dOut(t.dist)) + ' ' + dU() : '', t.time ? fmtMin(t.time) : ''].filter(Boolean).join(' · ');
  return '';
}
function parseRange(str) {
  if (!str) return null;
  const m = String(str).match(/(\d+)\s*(?:-|–|to)\s*(\d+)/);
  if (m) return { lo: +m[1], hi: +m[2] };
  const n = parseInt(str, 10); return isNaN(n) ? null : { lo: n, hi: n };
}

// ---------- analytics ----------
let VER = 0, cache = {};
function bump() { VER++; cache = {}; }
function memo(key, fn) { if (!(key in cache)) cache[key] = fn(); return cache[key]; }
const sorted = () => memo('sorted', () => Object.values(S.workouts).filter(w => w && w.start).sort((a, b) => b.start - a.start));
const doneSets = e => (e.sets || []).filter(s => s.done);
const workSets = e => doneSets(e).filter(s => s.k !== 'w');

function lastSession(exId, excludeId, beforeTs = Infinity) {
  for (const w of sorted()) {
    if (w.id === excludeId || w.start >= beforeTs) continue;
    const e = (w.ex || []).find(x => x.exId === exId && doneSets(x).length);
    if (e) return { w, e };
  }
  return null;
}
const e1rm = (w, r) => (!w || !r) ? 0 : r === 1 ? w : w * (1 + Math.min(r, 15) / 30);
function setMetrics(type, s) {
  const m = {};
  if (s.w != null && type !== 'as') m.maxW = s.w;
  if (type === 'wr' && s.w && s.r) { m.rm = e1rm(s.w, s.r); m.vol = s.w * s.r; }
  if (['bw', 'as', 'wr'].includes(type) && s.r) m.reps = s.r;
  if (s.t) m.maxT = s.t;
  if (type === 'dt' && s.d) { m.maxD = s.d; if (s.t && s.d >= 0.5) m.pace = s.t / s.d; }
  return m;
}
function foldBests(b, type, s) {
  const m = setMetrics(type, s);
  for (const k in m) {
    if (k === 'pace') { if (b.pace == null || m.pace < b.pace) b.pace = m.pace; }
    else if (b[k] == null || m[k] > b[k]) b[k] = m[k];
  }
  return b;
}
function bestsFor(exId, beforeTs = Infinity, excludeId = null) {
  const type = getEx(exId).type, b = { n: 0 };
  for (const w of sorted()) {
    if (w.id === excludeId || w.start >= beforeTs) continue;
    (w.ex || []).forEach(e => { if (e.exId === exId) workSets(e).forEach(s => { foldBests(b, type, s); b.n++; }); });
  }
  return b;
}
const PRL = { maxW: 'Heaviest weight', rm: 'Best est. 1RM', vol: 'Best set volume', reps: 'Most reps', maxT: 'Longest time', maxD: 'Longest distance', pace: 'Best pace' };
function prsOfSet(type, s, b) {
  if (!b || !b.n) return [];
  const m = setMetrics(type, s), out = [];
  // keep the most meaningful labels per type
  const keys = { wr: ['maxW', 'rm'], bw: ['reps'], as: ['reps'], ts: ['maxT'], tm: ['maxT'], wt: ['maxW', 'maxT'], dt: ['maxD', 'pace'] }[type] || [];
  keys.forEach(k => {
    if (m[k] == null) return;
    if (k === 'pace') { if (b.pace != null && m.pace < b.pace - 0.5) out.push(k); }
    else if (b[k] != null && m[k] > b[k] + 1e-6) out.push(k);
    else if (b[k] == null && k !== 'maxW') { /* first ever of this metric — skip */ }
  });
  if (type === 'bw' && s.w && b.maxW != null && s.w > b.maxW && s.r >= 1) out.push('maxW');
  return out;
}
function workoutVolume(w) {
  let v = 0;
  (w.ex || []).forEach(e => { const t = getEx(e.exId).type; if (t === 'wr' || t === 'bw') workSets(e).forEach(s => v += (s.w || 0) * (s.r || 0)); });
  return v;
}
const workoutSetsCount = w => (w.ex || []).reduce((a, e) => a + doneSets(e).length, 0);
const workoutDist = w => (w.ex || []).reduce((a, e) => a + (getEx(e.exId).type === 'dt' ? doneSets(e).reduce((x, s) => x + (s.d || 0), 0) : 0), 0);
const wDur = w => (w.end || Date.now()) - w.start;

function weekStats(offset = 0) {
  const ws = weekStartOf(Date.now()) - offset * 7 * DAY, we = ws + 7 * DAY;
  const list = sorted().filter(w => w.start >= ws && w.start < we);
  return { ws, list, count: list.length, vol: list.reduce((a, w) => a + workoutVolume(w), 0), time: list.reduce((a, w) => a + wDur(w), 0), dist: list.reduce((a, w) => a + workoutDist(w), 0) };
}
function streak() {
  const goal = S.settings.weeklyGoal; let n = 0, i = weekStats(0).count >= goal ? 0 : 1;
  if (i === 0) n = 1, i = 1;
  for (; i < 520; i++) { if (weekStats(i).count >= goal) n++; else break; }
  return n;
}
function muscleFreshness() {
  const last = {};
  for (const w of sorted()) (w.ex || []).forEach(e => {
    if (!doneSets(e).length) return;
    const m = getEx(e.exId).muscle;
    for (const g in GROUPS) if (GROUPS[g].includes(m) && last[g] == null) last[g] = w.start;
  });
  return Object.keys(GROUPS).map(g => ({ g, ts: last[g], days: last[g] == null ? null : Math.round((startOfDay(Date.now()) - startOfDay(last[g])) / DAY) }));
}
function nextRoutine() {
  if (!S.routines.length) return null;
  const ids = S.routines.map(r => r.id);
  const lastW = sorted().find(w => w.routineId && ids.includes(w.routineId));
  if (!lastW) return { r: S.routines[0], last: null };
  const i = ids.indexOf(lastW.routineId);
  const r = S.routines[(i + 1) % S.routines.length];
  return { r, last: lastW, lastOfThis: sorted().find(w => w.routineId === r.id) };
}

// ---------- suggestions (progressive overload) ----------
function suggestFor(W, e, mode) {
  const ex = getEx(e.exId), type = ex.type;
  const prev = lastSession(e.exId, W.id, mode === 'edit' ? W.start : Infinity);
  const prevSets = prev ? doneSets(prev.e) : [];
  const prevWork = prevSets.filter(s => s.k !== 'w');
  const rng = parseRange(e.target && e.target.reps);
  const tgtT = e.target && e.target.time, tgtD = e.target && e.target.dist;
  let up = null;
  const inc = S.settings.inc || 2.5;
  if (prevWork.length && rng) {
    const hitTop = prevWork.every(s => (s.r || 0) >= rng.hi);
    if (hitTop && type === 'wr') up = { kind: 'w', txt: `+${fmtN(wOut(inc))} ${wU()}` };
    else if (hitTop && (type === 'bw' || type === 'as')) up = { kind: 'r', txt: '+1 rep' };
  }
  if (prevWork.length && type === 'ts' && tgtT && prevWork.every(s => (s.t || 0) >= tgtT)) up = { kind: 't', txt: '+5s' };
  const sets = (e.sets || []).map((s, i) => {
    const p = prevSets[i] || (s.k !== 'w' ? prevWork[prevWork.length - 1] : null);
    const g = {};
    if (p) { g.w = p.w; g.r = p.r; g.t = p.t; g.d = p.d; }
    else { if (rng) g.r = rng.lo; if (tgtT) g.t = tgtT; if (tgtD) g.d = tgtD; }
    if (up && s.k !== 'w' && p) {
      if (up.kind === 'w' && g.w != null) { g.w = g.w + inc; if (rng) g.r = rng.lo; }
      if (up.kind === 'r' && g.r != null) g.r = g.r + 1;
      if (up.kind === 't' && g.t != null) g.t = g.t + 5;
    }
    return g;
  });
  return { prevSets, sets, up };
}

// ---------- navigation ----------
function cur() { return nav.stack.length ? nav.stack[nav.stack.length - 1] : { s: nav.tab, p: {} }; }
function go(s, p = {}) { nav.stack.push({ s, p }); render(); window.scrollTo(0, 0); }
function back() { const c = nav.stack.pop(); if (c && c.s === 'edit') EDIT = null; if (c && c.s === 'routine') RD = null; render(); window.scrollTo(0, 0); }
function tab(t) { nav.tab = t; nav.stack = []; EDIT = null; RD = null; render(); window.scrollTo(0, 0); }

function render() {
  rebuildEx();
  const c = cur();
  const fn = SCREENS[c.s] || SCREENS.home;
  $('#app').innerHTML = fn(c.p || {});
  $('#app').classList.toggle('has-rest', !!RT);
  renderNav();
  tick();
  syncAwake();
}
function renderNav() {
  const t = nav.stack.length ? null : nav.tab;
  const live = !!S.active;
  const items = [['home', 'home', 'Home'], ['history', 'cal', 'History'], ['log', 'plus', 'Workout'], ['exercises', 'list', 'Exercises'], ['progress', 'chart', 'Progress']];
  $('#nav').innerHTML = `<div class="nav-in">${items.map(([k, i, l]) => k === 'log'
    ? `<button class="nb mid ${live ? 'live' : ''} ${t === 'log' ? 'on' : ''}" data-a="navLog"><span class="pill">${live ? (S.active.dur ? 'Past' : `<span id="navclock" class="num">${fmtClock(Date.now() - S.active.start)}</span>`) : ic('plus')}</span>${live ? 'Active' : 'Start'}</button>`
    : `<button class="nb ${t === k ? 'on' : ''}" data-a="tab" data-t="${k}">${ic(i)}${l}</button>`).join('')}</div>`;
}

// ---------- screens ----------
const SCREENS = {};
const topbar = (title, { backBtn = false, right = '', sub = '' } = {}) =>
  `<div class="top">${backBtn ? `<button class="ib" data-a="back" aria-label="Back">${ic('back')}</button>` : ''}<div class="grow"><h1>${title}</h1>${sub ? `<div class="sub">${sub}</div>` : ''}</div>${right}</div>`;
const empty = (icon, title, text, btn = '') => `<div class="empty">${ic(icon)}<b>${title}</b><div class="small">${text}</div>${btn ? `<div class="mt16">${btn}</div>` : ''}</div>`;

SCREENS.home = () => {
  const now = new Date(), h = now.getHours();
  const greet = h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening';
  const wk = weekStats(0), goal = S.settings.weeklyGoal, st = streak();
  const days = [...Array(7)].map((_, i) => {
    const ds = wk.ws + i * DAY, done = wk.list.some(w => startOfDay(w.start) === ds);
    return `<div class="day ${done ? 'done' : ''} ${ds === startOfDay(Date.now()) ? 'today' : ''}">${WD[new Date(ds).getDay()][0]}<div class="d">${new Date(ds).getDate()}</div></div>`;
  }).join('');
  const nx = nextRoutine();
  let upNext;
  if (S.active) {
    upNext = `<button class="banner" data-a="tab" data-t="log">${ic('timer')}<div class="grow"><div>Workout in progress</div><div class="tiny" style="opacity:.75">${esc(S.active.name)} · tap to continue</div></div>${ic('chev', 'chev')}</button>`;
  } else if (nx) {
    const r = nx.r;
    const lastTxt = nx.last ? `Last session: <b class="tx2">${esc(nx.last.name)}</b> · ${ago(nx.last.start)}` : 'First session of this routine';
    upNext = `<div class="card hero"><div class="kicker">Up next</div><div class="big">${esc(r.name)}</div>
      <div class="small muted">${r.ex.length} exercises · ${r.ex.slice(0, 3).map(x => esc(getEx(x.exId).name)).join(', ')}${r.ex.length > 3 ? '…' : ''}</div>
      <div class="small muted mt4">${lastTxt}${nx.lastOfThis && nx.lastOfThis.id !== (nx.last && nx.last.id) ? ` · did ${esc(r.name)} ${ago(nx.lastOfThis.start).toLowerCase()}` : ''}</div>
      <div class="btns mt12"><button class="btn pri" data-a="startRoutine" data-id="${r.id}">${ic('play')}Start ${esc(r.name)}</button><button class="btn" data-a="openStart" style="flex:0 0 auto">Other</button></div></div>`;
  } else {
    upNext = `<div class="card hero"><div class="kicker">Let's train</div><div class="big">Log today's workout</div>
      <div class="small muted">Start an empty workout and add any exercise, or set up a routine so the app tells you what's next.</div>
      <div class="btns mt12"><button class="btn pri" data-a="startEmpty">${ic('plus')}Empty workout</button><button class="btn" data-a="go" data-s="programs">${ic('book')}Programs</button></div></div>`;
  }
  const fresh = muscleFreshness().filter(m => m.g !== 'Full body').sort((a, b) => (b.days ?? 999) - (a.days ?? 999));
  const freshHtml = sorted().length ? `<div class="sec"><h2>Muscles</h2><span class="small muted"><span class="dot" style="background:var(--gold);display:inline-block"></span> due &nbsp;<span class="dot" style="background:var(--acc);display:inline-block"></span> ready &nbsp;<span class="dot" style="background:var(--blue);display:inline-block"></span> resting</span></div><div class="card"><div class="mchips">${fresh.map(m => {
    const c = m.days == null || m.days > 5 ? 'var(--gold)' : m.days <= 1 ? 'var(--blue)' : 'var(--acc)';
    const lbl = m.days == null ? '—' : m.days === 0 ? 'today' : m.days + 'd';
    return `<span class="mchip"><span class="dot" style="background:${c}"></span>${m.g}<b>${lbl}</b></span>`;
  }).join('')}</div></div>` : '';
  const routines = S.routines.length ? `<div class="list">${S.routines.slice(0, 6).map(r => {
    const lw = sorted().find(w => w.routineId === r.id);
    return `<div class="li"><button class="grow row" data-a="go" data-s="routine" data-id="${r.id}" style="text-align:left"><div class="av">${esc(r.name.slice(0, 2).toUpperCase())}</div><div class="grow"><div class="t ell">${esc(r.name)}</div><div class="s ell">${r.ex.length} exercises · ${lw ? 'last ' + ago(lw.start).toLowerCase() : 'not done yet'}</div></div></button><button class="btn sm pri" data-a="startRoutine" data-id="${r.id}">Start</button></div>`;
  }).join('')}</div>` : `<div class="card small muted">No routines yet. Create one, or add a ready-made program like Push/Pull/Legs.<div class="btns mt12"><button class="btn sm" data-a="newRoutine">${ic('plus')}New routine</button><button class="btn sm" data-a="go" data-s="programs">${ic('book')}Programs</button></div></div>`;
  return `${topbar(`${greet}`, { sub: `${dstr(Date.now())} · ${syncBadge()}`, right: `<button class="ib" data-a="go" data-s="settings" aria-label="Settings">${ic('gear')}</button>` })}
  <div class="wrap">
    ${upNext}
    <div class="sec"><h2>This week</h2><span class="small ${wk.count >= goal ? '' : 'muted'}" style="${wk.count >= goal ? 'color:var(--acc);font-weight:700' : ''}">${wk.count} / ${goal} workouts</span></div>
    <div class="card"><div class="row between"><div class="row gap6">${ic('flame')}<b>${st} week${st === 1 ? '' : 's'}</b><span class="small muted">streak</span></div><button class="small muted" data-a="tab" data-t="history">History ›</button></div><div class="week">${days}</div></div>
    <div class="stats mt8"><div class="stat"><div class="v num">${fmtVol(wk.vol)}</div><div class="l">Volume (${wU()})</div></div><div class="stat"><div class="v num">${fmtDur(wk.time)}</div><div class="l">Time trained</div></div><div class="stat"><div class="v num">${fmtN(r1(dOut(wk.dist)))}</div><div class="l">Cardio (${dU()})</div></div></div>
    ${freshHtml}
    <div class="sec"><h2>My routines</h2><button class="lnk" data-a="go" data-s="routines">${S.routines.length ? 'Manage' : ''}</button></div>
    ${routines}
    ${NATIVE && sorted().length >= 5 && (!S.settings.lastExport || Date.now() - S.settings.lastExport > 30 * DAY) ? `<div class="card mt16 row"><div class="av" style="color:var(--acc)">${ic('cloud')}</div><div class="grow small"><b>Back up your workouts</b><div class="muted">Your log lives on this phone. Save a copy to Drive once a month.</div></div><button class="btn sm" data-a="exportJson">Back up</button></div>` : ''}
  </div>`;
};

function workoutCard(w) {
  const vol = workoutVolume(w), prs = (w.prs || []).length;
  const lines = (w.ex || []).slice(0, 4).map(e => {
    const ex = getEx(e.exId), ds = doneSets(e);
    return `<div class="row small mt4"><span class="tx2 ell grow">${ds.length} × ${esc(ex.name)}</span><span class="muted num">${ds.length ? esc(setStr(ex.type, bestSet(ex.type, ds), true)) : ''}</span></div>`;
  }).join('');
  return `<button class="card tap" style="display:block;width:100%;text-align:left" data-a="go" data-s="workout" data-id="${w.id}">
    <div class="row between"><div class="grow"><div style="font-weight:750;font-size:16px" class="ell">${esc(w.name)}</div><div class="small muted">${dstr(w.start)} · ${tstr(w.start)}</div></div>${prs ? `<span class="tag gold">${ic('trophy')}${prs} PR</span>` : ''}</div>
    <div class="row gap6 mt8 wrapx"><span class="tag">${ic('clock')}${fmtDur(wDur(w))}</span>${vol ? `<span class="tag">${fmtVol(vol)} ${wU()}</span>` : ''}<span class="tag">${workoutSetsCount(w)} sets</span></div>
    <div class="mt8">${lines}${(w.ex || []).length > 4 ? `<div class="small muted mt4">+${w.ex.length - 4} more</div>` : ''}</div></button>`;
}
function bestSet(type, sets) {
  const ws = sets.filter(s => s.k !== 'w'); const arr = ws.length ? ws : sets;
  const score = s => type === 'wr' ? e1rm(s.w, s.r) + (s.w || 0) / 1000 : type === 'dt' ? (s.d || 0) : ['ts', 'tm', 'wt'].includes(type) ? (s.t || 0) + (s.w || 0) : (s.r || 0) + (s.w || 0) / 1000;
  return arr.reduce((b, s) => score(s) > score(b) ? s : b, arr[0]);
}

// ----- history -----
SCREENS.history = () => {
  const all = sorted();
  const seg = `<div class="seg"><button class="${UI.histMode === 'list' ? 'on' : ''}" data-a="histMode" data-m="list">List</button><button class="${UI.histMode === 'cal' ? 'on' : ''}" data-a="histMode" data-m="cal">Calendar</button></div>`;
  let body = '';
  if (!all.length) body = empty('cal', 'No workouts yet', 'Finished workouts show up here so you always know what you did and when.', `<button class="btn pri" data-a="openStart">${ic('plus')}Start a workout</button>`);
  else if (UI.histMode === 'list') {
    let curM = '';
    body = all.map(w => {
      const d = new Date(w.start), m = MONL[d.getMonth()] + ' ' + d.getFullYear();
      let hd = '';
      if (m !== curM) { curM = m; const n = all.filter(x => { const y = new Date(x.start); return y.getMonth() === d.getMonth() && y.getFullYear() === d.getFullYear(); }).length; hd = `<div class="sec"><h2>${m}</h2><span class="small muted">${n} workout${n === 1 ? '' : 's'}</span></div>`; }
      return hd + workoutCard(w);
    }).join('');
  } else body = calendar(all);
  return `${topbar('History', { sub: `${all.length} workouts logged`, right: `<button class="ib" data-a="logPast" aria-label="Log past workout">${ic('plus')}</button>` })}<div class="wrap">${seg}<div class="mt8">${body}</div></div>`;
};
function calendar(all) {
  const base = UI.calMonth ? new Date(UI.calMonth) : new Date(); base.setDate(1); base.setHours(0, 0, 0, 0);
  const y = base.getFullYear(), m = base.getMonth();
  const first = new Date(y, m, 1), off = (first.getDay() - S.settings.weekStart + 7) % 7;
  const days = new Date(y, m + 1, 0).getDate();
  const byDay = {}; all.forEach(w => { const k = ymd(w.start); (byDay[k] = byDay[k] || []).push(w); });
  const heads = [...Array(7)].map((_, i) => `<div class="h">${WD[(i + S.settings.weekStart) % 7].slice(0, 2)}</div>`).join('');
  let cells = '';
  for (let i = 0; i < off; i++) cells += '<div class="c out"></div>';
  const today = ymd(Date.now());
  for (let d = 1; d <= days; d++) {
    const k = ymd(new Date(y, m, d).getTime());
    cells += `<button class="c ${byDay[k] ? 'has' : ''} ${k === today ? 'today' : ''} ${k === UI.calSel ? 'sel' : ''}" data-a="calDay" data-k="${k}">${d}</button>`;
  }
  const monthCount = all.filter(w => { const x = new Date(w.start); return x.getMonth() === m && x.getFullYear() === y; }).length;
  const sel = UI.calSel && byDay[UI.calSel];
  return `<div class="card"><div class="row between"><button class="ib" data-a="calNav" data-d="-1">${ic('back')}</button><div style="text-align:center"><b>${MONL[m]} ${y}</b><div class="tiny muted">${monthCount} workout${monthCount === 1 ? '' : 's'}</div></div><button class="ib" data-a="calNav" data-d="1">${ic('chev')}</button></div><div class="cal">${heads}${cells}</div></div>
  ${UI.calSel ? `<div class="sec"><h2>${dstr(new Date(UI.calSel + 'T12:00').getTime())}</h2></div>${sel ? sel.map(workoutCard).join('') : `<div class="card small muted">Rest day — nothing logged.<div class="mt8"><button class="btn sm" data-a="logPastDay" data-k="${UI.calSel}">${ic('plus')}Log a workout for this day</button></div></div>`}` : '<div class="small muted mt12" style="text-align:center">Tap a day to see what you did.</div>'}`;
}

SCREENS.workout = p => {
  const w = S.workouts[p.id];
  if (!w) return topbar('Workout', { backBtn: true }) + empty('cal', 'Workout not found', 'It may have been deleted.');
  const prMap = {}; (w.prs || []).forEach(x => prMap[x.exId] = x.labels);
  const exs = (w.ex || []).map(e => {
    const ex = getEx(e.exId); let n = 0;
    return `<div class="card"><button class="row between" style="width:100%;text-align:left" data-a="go" data-s="exercise" data-id="${e.exId}"><b style="color:var(--acc)">${esc(ex.name)}</b>${prMap[e.exId] ? `<span class="tag gold">${ic('trophy')}PR</span>` : ''}</button>
    ${e.notes ? `<div class="small muted mt4">${esc(e.notes)}</div>` : ''}
    ${doneSets(e).map(s => { const lab = s.k === 'w' ? 'W' : s.k === 'd' ? 'D' : s.k === 'f' ? 'F' : ++n; return `<div class="row mt8 small"><span class="setno ${s.k || ''}" style="width:28px;height:28px;display:grid;place-items:center;font-size:12px">${lab}</span><span class="grow num" style="font-weight:600">${esc(setStr(ex.type, s))}</span>${s.rpe ? `<span class="tag">RPE ${s.rpe}</span>` : ''}${s.pr ? `<span class="tag gold">${ic('trophy')}</span>` : ''}</div>`; }).join('')}
    ${prMap[e.exId] ? `<div class="tiny mt8" style="color:var(--gold)">${prMap[e.exId].map(k => PRL[k]).join(' · ')}</div>` : ''}</div>`;
  }).join('');
  return `${topbar(esc(w.name), { backBtn: true, sub: `${dstr(w.start)} · ${tstr(w.start)}`, right: `<button class="ib" data-a="wMenu" data-id="${w.id}">${ic('more')}</button>` })}
  <div class="wrap"><div class="stats"><div class="stat"><div class="v">${fmtDur(wDur(w))}</div><div class="l">Duration</div></div><div class="stat"><div class="v">${fmtVol(workoutVolume(w))}</div><div class="l">Volume (${wU()})</div></div><div class="stat"><div class="v">${workoutSetsCount(w)}</div><div class="l">Sets</div></div></div>
  ${w.notes ? `<div class="card mt8 small">${esc(w.notes)}</div>` : ''}
  <div class="mt12">${exs}</div>
  <div class="btns mt16"><button class="btn" data-a="repeatW" data-id="${w.id}">${ic('repeat')}Repeat</button><button class="btn" data-a="editW" data-id="${w.id}">${ic('edit')}Edit</button></div></div>`;
};

// ----- active / edit logger -----
SCREENS.log = () => {
  if (!S.active) {
    return `${topbar('Workout')}<div class="wrap">${empty('dumb', 'No workout running', 'Start an empty workout, pick a routine, or log one you already did.', `<button class="btn pri" data-a="openStart">${ic('plus')}Start workout</button>`)}</div>`;
  }
  return logger(S.active, 'active');
};
SCREENS.edit = () => EDIT ? logger(EDIT, 'edit') : '';

function logger(W, mode) {
  const vol = workoutVolume(W), sets = workoutSetsCount(W);
  const head = mode === 'active'
    ? `<div class="top"><div class="grow"><button data-a="wRename" style="text-align:left;max-width:100%"><h1>${esc(W.name)}</h1></button><div class="sub"><span id="elapsed" class="num">${W.dur ? fmtDur(W.dur * 60000) : fmtClock(Date.now() - W.start)}</span> · <button data-a="wDate" style="color:var(--acc)">${dstr(W.start)}, ${tstr(W.start)}</button></div></div><button class="ib" data-a="restManual" aria-label="Rest timer">${ic('timer')}</button><button class="btn pri sm" data-a="finish">Finish</button></div>`
    : `<div class="top"><button class="ib" data-a="back">${ic('x')}</button><div class="grow"><button data-a="wRename" style="text-align:left;max-width:100%"><h1>${esc(W.name)}</h1></button><div class="sub"><button data-a="wDate" style="color:var(--acc)">${dstr(W.start)}, ${tstr(W.start)} · ${fmtDur(wDur(W))}</button></div></div><button class="btn pri sm" data-a="saveEdit">Save</button></div>`;
  const exHtml = (W.ex || []).map((e, ei) => exCard(W, e, ei, mode)).join('');
  return `${head}<div class="wrap">
    <div class="row gap6 wrapx"><span class="tag">${sets} sets done</span>${vol ? `<span class="tag">${fmtVol(vol)} ${wU()}</span>` : ''}${W.routineId ? `<span class="tag acc">${esc((S.routines.find(r => r.id === W.routineId) || {}).name || 'Routine')}</span>` : ''}</div>
    <textarea class="wnote" style="margin:10px 0 0;width:100%" rows="1" placeholder="Workout notes (how you felt, energy, sleep…)" data-in="wNote">${esc(W.notes || '')}</textarea>
    ${exHtml || `<div class="card mt12 small muted" style="text-align:center;padding:26px">Add your first exercise — strength, calisthenics, cardio, yoga or sport.</div>`}
    <button class="btn full mt12" data-a="addEx" style="color:var(--acc)">${ic('plus')}Add exercise</button>
    ${mode === 'active' ? `<button class="btn danger full mt12" data-a="discard">${ic('trash')}Discard workout</button>` : `<button class="btn danger full mt12" data-a="delW" data-id="${W.id}">${ic('trash')}Delete workout</button>`}
  </div>`;
}
function exCard(W, e, ei, mode) {
  const ex = getEx(e.exId), flds = fieldsFor(ex.type), sg = suggestFor(W, e, mode);
  let n = 0;
  const rows = (e.sets || []).map((s, si) => {
    const lab = s.k === 'w' ? 'W' : s.k === 'd' ? 'D' : s.k === 'f' ? 'F' : ++n;
    const pv = sg.prevSets[si];
    const g = sg.sets[si] || {};
    return `<tr class="${s.done ? 'done' : ''}" id="r-${ei}-${si}"><td><button class="setno ${s.k || ''}" data-a="setMenu" data-ei="${ei}" data-si="${si}">${lab}</button></td>
      <td><button class="prev num" data-a="usePrev" data-ei="${ei}" data-si="${si}">${pv ? esc(setStr(ex.type, pv, true)) : '—'}</button></td>
      ${flds.map(f => `<td><input class="fin num" inputmode="decimal" enterkeyhint="next" data-in="set" data-ei="${ei}" data-si="${si}" data-f="${f.f}" data-tu="${f.tu || ''}" value="${outVal(f.f, s[f.f], f.tu)}" placeholder="${outVal(f.f, g[f.f], f.tu)}"></td>`).join('')}
      <td><button class="ck" data-a="toggleDone" data-ei="${ei}" data-si="${si}" aria-label="Done">${ic('check')}</button></td></tr>`;
  }).join('');
  const tgt = targetStr(ex.type, e.target);
  const nextSS = e.ss && W.ex[ei + 1];
  return `<div class="wex ${e.ss || (ei > 0 && W.ex[ei - 1].ss) ? 'ss' : ''}">
    <div class="wex-h"><div class="grow"><button class="nm" data-a="go" data-s="exercise" data-id="${e.exId}">${esc(ex.name)}</button>
    <div class="meta">${[tgt && 'Target ' + tgt, e.target && e.target.rest ? 'Rest ' + fmtSec(e.target.rest) : ''].filter(Boolean).join(' · ')}${sg.up ? `<span class="sugg">${ic('up')}Go ${sg.up.txt}</span>` : ''}${nextSS ? `<span class="tag blue" style="margin-left:4px">Superset ↓</span>` : ''}</div></div>
    <button class="ib" data-a="exMenu" data-ei="${ei}">${ic('more')}</button></div>
    ${e.notes != null ? `<textarea class="wnote" rows="1" placeholder="Note for this exercise" data-in="exNote" data-ei="${ei}">${esc(e.notes)}</textarea>` : ''}
    <table class="sets"><thead><tr><th>Set</th><th>Previous</th>${flds.map(f => `<th>${f.l}</th>`).join('')}<th></th></tr></thead><tbody>${rows}</tbody></table>
    <button class="addset" data-a="addSet" data-ei="${ei}">+ Add set</button></div>`;
}
function missingFields(type, s) {
  return fieldsFor(type).filter(f => f.f !== 'w' || type === 'wr' || type === 'wt').filter(f => !(type === 'dt' && f.f === 'd')).filter(f => s[f.f] == null);
}
const isComplete = (type, s) => !missingFields(type, s).length;
const curW = () => cur().s === 'edit' ? EDIT : S.active;
const curMode = () => cur().s === 'edit' ? 'edit' : 'active';
const newSet = (k = 'n') => ({ k, w: null, r: null, t: null, d: null, done: false });
function touchW() { if (curMode() === 'active') persistSoon('active'); }
function touchWNow() { if (curMode() === 'active') persist('active'); }

// ----- exercises -----
SCREENS.exercises = () => {
  const chips = ['All', 'Recent', ...CATS, 'Custom'];
  return `${topbar('Exercises', { sub: `${allEx().length} exercises`, right: `<button class="ib" data-a="newCustom" aria-label="New exercise">${ic('plus')}</button>` })}
  <div class="wrap"><div class="search">${ic('search')}<input class="inp" placeholder="Search exercises" data-in="exQ" value="${esc(UI.exQ)}"></div>
  <div class="chips mt8">${chips.map(c => `<button class="chip ${UI.exCat === c ? 'on' : ''}" data-a="exCat" data-c="${esc(c)}">${c}</button>`).join('')}</div>
  <div id="exlist" class="mt8">${exListHtml(UI.exQ, UI.exCat, null)}</div></div>`;
};
function recentIds() {
  return memo('recent', () => { const seen = []; for (const w of sorted()) (w.ex || []).forEach(e => { if (!seen.includes(e.exId)) seen.push(e.exId); }); return seen; });
}
function filterEx(q, cat) {
  q = (q || '').trim().toLowerCase();
  let list;
  if (cat === 'Recent') list = recentIds().map(getEx).filter(e => e && e.name !== 'Unknown exercise');
  else list = allEx().filter(e => cat === 'All' || (cat === 'Custom' ? e.custom : e.cat === cat));
  if (q) {
    const words = q.split(/\s+/);
    list = list.filter(e => { const h = (e.name + ' ' + e.muscle + ' ' + e.equip + ' ' + e.cat).toLowerCase(); return words.every(w => h.includes(w)); });
    const score = e => { const n = e.name.toLowerCase(), ws = n.split(/[^a-z0-9']+/); return words.reduce((a, w) => a + (n.startsWith(w) ? 0 : ws.some(x => x.startsWith(w)) ? 1 : n.includes(w) ? 3 : 4), 0); };
    list = list.map(e => [score(e), e]).sort((a, b) => a[0] - b[0]).map(x => x[1]);
  }
  return list;
}
function exListHtml(q, cat, sel) {
  const list = filterEx(q, cat);
  const lastMap = memo('lastMap', () => { const m = {}; for (const w of sorted()) (w.ex || []).forEach(e => { if (m[e.exId] == null) m[e.exId] = w.start; }); return m; });
  const create = q && q.trim() ? `<button class="li" data-a="newCustom" data-name="${esc(q.trim())}"><div class="av" style="color:var(--acc)">${ic('plus')}</div><div class="grow"><div class="t">Create “${esc(q.trim())}”</div><div class="s">Add your own exercise</div></div></button>` : '';
  if (!list.length) return `<div class="list">${create}</div>${empty('search', 'No match', cat === 'Recent' ? 'Exercises you log will appear here.' : 'Try another word, or create it as a custom exercise.')}`;
  return `<div class="list">${list.slice(0, 400).map(e => {
    const on = sel && sel.has(e.id);
    return `<button class="li" data-a="${sel ? 'pkToggle' : 'go'}" data-s="exercise" data-id="${e.id}"><div class="av" style="${on ? 'background:var(--acc);color:var(--acc-ink)' : ''}">${on ? ic('check') : esc(e.name[0])}</div><div class="grow"><div class="t ell">${esc(e.name)}</div><div class="s ell">${esc(e.muscle)} · ${esc(e.equip)}${lastMap[e.id] ? ' · ' + ago(lastMap[e.id]).toLowerCase() : ''}${e.custom ? ' · custom' : ''}</div></div>${sel ? '' : ic('chev', 'chev')}</button>`;
  }).join('')}${create}</div>`;
}

SCREENS.exercise = p => {
  const ex = getEx(p.id), type = ex.type;
  const sessions = [];
  for (const w of sorted()) (w.ex || []).forEach(e => { if (e.exId === p.id && doneSets(e).length) sessions.push({ w, e }); });
  const b = bestsFor(p.id);
  const prCards = [];
  if (type === 'wr') { prCards.push(['Best est. 1RM', b.rm ? fmtN(wOut(b.rm)) + ' ' + wU() : '–'], ['Heaviest weight', b.maxW != null ? fmtN(wOut(b.maxW)) + ' ' + wU() : '–'], ['Best set volume', b.vol ? fmtVol(b.vol) + ' ' + wU() : '–'], ['Sessions', sessions.length]); }
  else if (type === 'bw' || type === 'as') prCards.push(['Most reps (one set)', b.reps ?? '–'], [type === 'as' ? 'Sessions' : 'Max added weight', type === 'as' ? sessions.length : (b.maxW ? fmtN(wOut(b.maxW)) + ' ' + wU() : '–')], ['Total reps (all time)', sessions.reduce((a, s) => a + workSets(s.e).reduce((x, y) => x + (y.r || 0), 0), 0)], ['Sessions', sessions.length]);
  else if (type === 'dt') prCards.push(['Longest distance', b.maxD ? fmtN(dOut(b.maxD)) + ' ' + dU() : '–'], ['Best pace', b.pace ? fmtPace(b.pace) : '–'], ['Total distance', fmtN(r1(dOut(sessions.reduce((a, s) => a + doneSets(s.e).reduce((x, y) => x + (y.d || 0), 0), 0)))) + ' ' + dU()], ['Sessions', sessions.length]);
  else prCards.push([type === 'tm' ? 'Longest session' : 'Longest hold', b.maxT ? (type === 'tm' ? fmtMin(b.maxT) : fmtSec(b.maxT)) : '–'], ['Total time', fmtMin(sessions.reduce((a, s) => a + doneSets(s.e).reduce((x, y) => x + (y.t || 0), 0), 0))], ['Sessions', sessions.length], ['Last done', sessions[0] ? ago(sessions[0].w.start) : '–']);
  const metrics = { wr: [['rm', 'Est. 1RM'], ['maxW', 'Max weight'], ['vol', 'Volume']], bw: [['reps', 'Best set'], ['tot', 'Total reps']], as: [['reps', 'Best set'], ['tot', 'Total reps']], dt: [['maxD', 'Distance'], ['pace', 'Pace']], ts: [['maxT', 'Best hold']], tm: [['tt', 'Duration']], wt: [['maxW', 'Weight'], ['maxT', 'Time']] }[type] || [];
  const mk = UI.chartMetric[p.id] || (metrics[0] || [])[0];
  const pts = [...sessions].reverse().slice(-30).map(({ w, e }) => {
    const ds = workSets(e).length ? workSets(e) : doneSets(e); let y = 0;
    if (mk === 'rm') y = Math.max(...ds.map(s => e1rm(s.w, s.r))); else if (mk === 'maxW') y = Math.max(...ds.map(s => s.w || 0));
    else if (mk === 'vol') y = ds.reduce((a, s) => a + (s.w || 0) * (s.r || 0), 0); else if (mk === 'reps') y = Math.max(...ds.map(s => s.r || 0));
    else if (mk === 'tot') y = ds.reduce((a, s) => a + (s.r || 0), 0); else if (mk === 'maxD') y = Math.max(...ds.map(s => s.d || 0));
    else if (mk === 'pace') { const pp = ds.filter(s => s.d >= 0.5 && s.t).map(s => s.t / s.d); y = pp.length ? Math.min(...pp) : null; }
    else if (mk === 'maxT') y = Math.max(...ds.map(s => s.t || 0)); else if (mk === 'tt') y = ds.reduce((a, s) => a + (s.t || 0), 0);
    let disp = y;
    if (['rm', 'maxW', 'vol'].includes(mk)) disp = wOut(y); else if (mk === 'maxD') disp = dOut(y); else if (mk === 'pace' && y) disp = metric() ? y / 60 : y / 60 / KM_MI; else if (mk === 'maxT') disp = type === 'tm' ? y / 60 : y; else if (mk === 'tt') disp = y / 60;
    const lab = mk === 'pace' ? (y ? fmtPace(y) : '') : mk === 'maxT' && type !== 'tm' ? fmtSec(y) : mk === 'tt' ? fmtMin(y) : fmtN(r1(disp)) + ({ rm: ' ' + wU(), maxW: ' ' + wU(), vol: ' ' + wU(), maxD: ' ' + dU(), reps: ' reps', tot: ' reps' }[mk] || '');
    return { x: `${new Date(w.start).getDate()} ${MON[new Date(w.start).getMonth()]}`, y: disp == null ? null : r1(disp), tip: `${lab} · ${dstr(w.start)}` };
  }).filter(p => p.y != null);
  const chart = pts.length >= 2 ? lineChart(pts, { invert: mk === 'pace' }) : `<div class="small muted" style="padding:18px 0;text-align:center">Log this exercise at least twice to see a progress chart.</div>`;
  const hist = sessions.slice(0, 40).map(({ w, e }) => `<button class="card tap" style="display:block;width:100%;text-align:left" data-a="go" data-s="workout" data-id="${w.id}"><div class="row between"><b class="small">${dstr(w.start)} <span class="muted" style="font-weight:500">· ${esc(w.name)}</span></b>${(w.prs || []).some(x => x.exId === p.id) ? `<span class="tag gold">${ic('trophy')}PR</span>` : ''}</div><div class="small tx2 mt4 num">${doneSets(e).map(s => esc(setStr(type, s, true))).join(' &nbsp;·&nbsp; ')}</div></button>`).join('');
  return `${topbar(esc(ex.name), { backBtn: true, sub: `${esc(ex.cat)} · ${esc(ex.muscle)} · ${esc(ex.equip)}`, right: ex.custom ? `<button class="ib" data-a="customMenu" data-id="${ex.id}">${ic('more')}</button>` : '' })}
  <div class="wrap"><div class="prs">${prCards.map(([l, v]) => `<div class="pr"><div class="v num">${v}</div><div class="l">${l}</div></div>`).join('')}</div>
  <div class="sec"><h2>Progress</h2></div><div class="card">${metrics.length > 1 ? `<div class="seg">${metrics.map(([k, l]) => `<button class="${k === mk ? 'on' : ''}" data-a="metric" data-id="${p.id}" data-k="${k}">${l}</button>`).join('')}</div>` : ''}${chart}</div>
  <div class="sec"><h2>History</h2><span class="small muted">${sessions.length} sessions</span></div>${hist || `<div class="card small muted">Not logged yet. Add it to a workout and it'll show up here.</div>`}</div>`;
};
function fmtPace(secPerKm) { const s = metric() ? secPerKm : secPerKm / KM_MI; return fmtSec(Math.round(s)) + ' /' + dU(); }
function progTarget([name, , tg]) { const t = getEx(slug(name)).type; return t === 'ts' || t === 'wt' ? tg + 's' : t === 'tm' ? tg + ' min' : t === 'dt' ? tg + ' km' : String(tg); }

// ----- routines -----
SCREENS.routines = () => `${topbar('My routines', { backBtn: true, sub: 'The order sets what "Up next" suggests', right: `<button class="ib" data-a="newRoutine">${ic('plus')}</button>` })}
  <div class="wrap">${S.routines.length ? `<div class="list">${S.routines.map((r, i) => `<div class="li"><button class="grow row" style="text-align:left" data-a="go" data-s="routine" data-id="${r.id}"><div class="av">${i + 1}</div><div class="grow"><div class="t ell">${esc(r.name)}</div><div class="s ell">${r.ex.map(x => esc(getEx(x.exId).name)).join(', ')}</div></div></button><button class="ib" data-a="rMove" data-i="${i}" data-d="-1">${ic('up')}</button><button class="ib" data-a="rMove" data-i="${i}" data-d="1">${ic('down')}</button></div>`).join('')}</div>` : empty('list', 'No routines', 'Routines are saved workouts with target sets and reps.')}
  <div class="btns mt12"><button class="btn" data-a="newRoutine">${ic('plus')}New routine</button><button class="btn" data-a="go" data-s="programs">${ic('book')}Programs</button></div></div>`;

SCREENS.routine = p => {
  if (!RD || RD._for !== (p.id || 'new')) {
    const r = p.id && S.routines.find(x => x.id === p.id);
    RD = r ? clone(r) : { id: uid(), name: '', notes: '', ex: [] };
    RD._for = p.id || 'new'; RD._new = !r;
  }
  const rows = RD.ex.map((x, i) => {
    const ex = getEx(x.exId), t = ex.type;
    let tf;
    if (['wr', 'bw', 'as'].includes(t)) tf = `<div><label>Reps</label><input class="inp" inputmode="text" data-in="rd" data-i="${i}" data-f="reps" value="${esc(x.reps || '')}" placeholder="8-12"></div>`;
    else if (t === 'dt') tf = `<div><label>${dU()}</label><input class="inp" inputmode="decimal" data-in="rd" data-i="${i}" data-f="dist" value="${x.dist ? fmtN(dOut(x.dist)) : ''}" placeholder="5"></div>`;
    else tf = `<div><label>${t === 'tm' ? 'Minutes' : 'Seconds'}</label><input class="inp" inputmode="decimal" data-in="rd" data-i="${i}" data-f="time" value="${x.time ? (t === 'tm' ? fmtN(x.time / 60) : x.time) : ''}" placeholder="${t === 'tm' ? '30' : '60'}"></div>`;
    return `<div class="rex"><div class="row"><b class="grow ell" style="color:var(--acc)">${esc(ex.name)}</b><button class="ib" data-a="rdMove" data-i="${i}" data-d="-1">${ic('up')}</button><button class="ib" data-a="rdMove" data-i="${i}" data-d="1">${ic('down')}</button><button class="ib" data-a="rdDel" data-i="${i}" style="color:var(--red)">${ic('x')}</button></div>
    <div class="flds"><div><label>Sets</label><input class="inp" inputmode="numeric" data-in="rd" data-i="${i}" data-f="sets" value="${x.sets || ''}" placeholder="3"></div>${tf}<div><label>Rest (s)</label><input class="inp" inputmode="numeric" data-in="rd" data-i="${i}" data-f="rest" value="${x.rest || ''}" placeholder="${S.settings.rest}"></div></div>
    ${RD.ex[i + 1] ? `<button class="small mt8 row gap6 ${x.ss ? '' : 'muted'}" data-a="rdSS" data-i="${i}" style="${x.ss ? 'color:var(--blue);font-weight:700' : ''}">${ic('link')}${x.ss ? 'Supersetted with next ✓' : 'Superset with next'}</button>` : ''}</div>`;
  }).join('');
  return `${topbar(RD._new ? 'New routine' : 'Edit routine', { backBtn: true, right: `<button class="btn pri sm" data-a="rdSave">Save</button>` })}
  <div class="wrap"><label class="fld"><span>Name</span><input class="inp" data-in="rdName" value="${esc(RD.name)}" placeholder="e.g. Push Day, Leg Day, Morning Run"></label>
  <label class="fld"><span>Notes (optional)</span><input class="inp" data-in="rdNotes" value="${esc(RD.notes || '')}" placeholder="Warm-up, cues, tempo…"></label>
  ${rows || `<div class="card mt12 small muted">Add the exercises for this routine. You can set target sets, reps (like 8-12), time or distance, and rest.</div>`}
  <button class="btn full mt12" data-a="rdAdd" style="color:var(--acc)">${ic('plus')}Add exercises</button>
  ${!RD._new ? `<div class="btns mt12"><button class="btn pri" data-a="startRoutine" data-id="${RD.id}">${ic('play')}Start now</button><button class="btn danger" data-a="rdDelete">${ic('trash')}Delete</button></div>` : ''}</div>`;
};

SCREENS.programs = () => `${topbar('Programs', { backBtn: true, sub: 'Proven plans — add and customise' })}
  <div class="wrap">${PROGRAMS.map((pg, i) => `<div class="card"><div class="kicker">${esc(pg.level)}</div><div style="font-weight:800;font-size:18px;margin-top:4px">${esc(pg.name)}</div><div class="small muted mt4">${esc(pg.desc)}</div>
  ${pg.routines.map(r => `<div class="mt12"><b class="small">${esc(r.name)}</b><div class="small muted">${r.ex.map(x => `${esc(x[0])} ${x[1]}×${esc(progTarget(x))}`).join(' · ')}</div></div>`).join('')}
  <button class="btn sm pri mt12" data-a="addProgram" data-i="${i}">${ic('plus')}Add ${pg.routines.length} routine${pg.routines.length > 1 ? 's' : ''}</button></div>`).join('')}</div>`;

// ----- progress -----
SCREENS.progress = () => {
  const all = sorted();
  if (!all.length) return `${topbar('Progress', { right: `<button class="ib" data-a="go" data-s="settings">${ic('gear')}</button>` })}<div class="wrap">${empty('chart', 'No data yet', 'Charts, PRs and trends appear once you log a few workouts.')}${toolsHtml()}${bwHtml()}</div>`;
  const weeks = [...Array(12)].map((_, i) => weekStats(11 - i));
  const wpts = weeks.map(w => ({ x: `${new Date(w.ws).getDate()} ${MON[new Date(w.ws).getMonth()]}`, y: w.count, tip: `${w.count} workout${w.count === 1 ? '' : 's'} · week of ${dstr(w.ws)}` }));
  const vpts = weeks.map(w => ({ x: `${new Date(w.ws).getDate()} ${MON[new Date(w.ws).getMonth()]}`, y: Math.round(wOut(w.vol) || 0), tip: `${fmtVol(w.vol)} ${wU()} · week of ${dstr(w.ws)}` }));
  const since = Date.now() - 30 * DAY, mc = {};
  all.filter(w => w.start >= since).forEach(w => (w.ex || []).forEach(e => { const m = getEx(e.exId).muscle; mc[m] = (mc[m] || 0) + workSets(e).length; }));
  const mlist = Object.entries(mc).filter(x => x[1] > 0).sort((a, b) => b[1] - a[1]); const mmax = Math.max(1, ...mlist.map(x => x[1]));
  const recentPR = []; all.forEach(w => (w.prs || []).forEach(x => recentPR.push({ w, ...x })));
  const thisM = all.filter(w => { const d = new Date(w.start), n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length;
  return `${topbar('Progress', { right: `<button class="ib" data-a="go" data-s="settings">${ic('gear')}</button>` })}<div class="wrap">
  <div class="stats"><div class="stat"><div class="v">${all.length}</div><div class="l">Total workouts</div></div><div class="stat"><div class="v">${thisM}</div><div class="l">This month</div></div><div class="stat"><div class="v">${streak()}</div><div class="l">Week streak</div></div></div>
  <div class="sec"><h2>Workouts per week</h2><span class="small muted">goal ${S.settings.weeklyGoal}</span></div><div class="card">${barChart(wpts, { goal: S.settings.weeklyGoal })}</div>
  <div class="sec"><h2>Weekly volume (${wU()})</h2></div><div class="card">${barChart(vpts, {})}</div>
  <div class="sec"><h2>Sets per muscle · 30 days</h2></div><div class="card bars">${mlist.length ? mlist.map(([m, v]) => `<div class="b"><span class="n">${esc(m)}</span><span class="tr"><span class="fl" style="width:${Math.max(4, v / mmax * 100)}%;display:block"></span></span><span class="v num">${v}</span></div>`).join('') : '<div class="small muted">No sets in the last 30 days.</div>'}</div>
  <div class="sec"><h2>Recent PRs</h2></div>${recentPR.length ? `<div class="list">${recentPR.slice(0, 12).map(x => `<button class="li" data-a="go" data-s="exercise" data-id="${x.exId}"><div class="av" style="color:var(--gold)">${ic('trophy')}</div><div class="grow"><div class="t ell">${esc(getEx(x.exId).name)}</div><div class="s">${x.labels.map(k => PRL[k]).join(' · ')} · ${ago(x.w.start).toLowerCase()}</div></div>${ic('chev', 'chev')}</button>`).join('')}</div>` : '<div class="card small muted">Beat a previous best and it lands here.</div>'}
  ${bwHtml()}${toolsHtml()}</div>`;
};
function bwHtml() {
  const list = [...S.bw].sort((a, b) => a.d < b.d ? -1 : 1);
  const pts = list.slice(-40).map(x => ({ x: `${+x.d.slice(8)} ${MON[+x.d.slice(5, 7) - 1]}`, y: r1(wOut(x.w)), tip: `${fmtN(wOut(x.w))} ${wU()} · ${dstr(new Date(x.d + 'T12:00').getTime())}` }));
  const lastV = list.length ? list[list.length - 1] : null, firstV = list[0];
  const delta = lastV && firstV && list.length > 1 ? wOut(lastV.w) - wOut(firstV.w) : null;
  return `<div class="sec"><h2>Body weight</h2><button class="lnk" data-a="bwAdd">+ Log weight</button></div><div class="card">${lastV ? `<div class="row between"><div><span class="big num">${fmtN(wOut(lastV.w))}</span> <span class="muted">${wU()}</span></div>${delta != null ? `<span class="tag">${delta > 0 ? '+' : ''}${fmtN(r1(delta))} ${wU()} since ${dstr(new Date(firstV.d + 'T12:00').getTime())}</span>` : ''}</div>` : '<div class="small muted">Track your body weight to see the trend next to your lifts.</div>'}${pts.length >= 2 ? lineChart(pts, {}) : ''}${list.length ? `<button class="small muted mt8" data-a="bwList">View all entries ›</button>` : ''}</div>`;
}
const toolsHtml = () => `<div class="sec"><h2>Tools</h2></div><div class="list"><button class="li" data-a="tool1rm"><div class="av">${ic('calc')}</div><div class="grow"><div class="t">1RM calculator</div><div class="s">Estimate your max and training percentages</div></div>${ic('chev', 'chev')}</button><button class="li" data-a="toolPlates"><div class="av">${ic('plates')}</div><div class="grow"><div class="t">Plate calculator</div><div class="s">Which plates to load on each side</div></div>${ic('chev', 'chev')}</button><button class="li" data-a="restManual"><div class="av">${ic('timer')}</div><div class="grow"><div class="t">Rest timer</div><div class="s">Start a countdown any time</div></div>${ic('chev', 'chev')}</button></div>`;

// ----- settings -----
SCREENS.settings = () => {
  const s = S.settings, m = metric();
  const tog = (k, l, d) => `<button class="li" data-a="tog" data-k="${k}"><div class="grow"><div class="t">${l}</div>${d ? `<div class="s">${d}</div>` : ''}</div><span class="tog ${s[k] ? 'on' : ''}"></span></button>`;
  const step = (k, l, v, d) => `<div class="li"><div class="grow"><div class="t">${l}</div>${d ? `<div class="s">${d}</div>` : ''}</div><div class="stepper"><button data-a="step" data-k="${k}" data-d="-1">−</button><span class="v num">${v}</span><button data-a="step" data-k="${k}" data-d="1">+</button></div></div>`;
  return `${topbar('Settings', { backBtn: true })}<div class="wrap">
  <div class="sec"><h2>Units</h2></div><div class="seg"><button class="${m ? 'on' : ''}" data-a="units" data-u="metric">kg · km</button><button class="${!m ? 'on' : ''}" data-a="units" data-u="imperial">lb · miles</button></div>
  <div class="sec"><h2>Workout</h2></div><div class="list">
  ${step('rest', 'Default rest time', fmtSec(s.rest), 'Used when a routine has no rest set')}
  ${tog('autoRest', 'Auto-start rest timer', 'Starts when you tick a set')}
  ${tog('sound', 'Sound when rest ends')}
  ${tog('vibrate', NATIVE ? 'Vibration' : 'Vibrate when rest ends', NATIVE ? 'Buzz when you tick a set and when rest ends' : 'Works on Android if your browser allows it')}
  ${NATIVE ? tog('keepAwake', 'Keep screen on during workouts', 'So your phone doesn\'t lock between sets') : ''}
  ${step('inc', 'Weight jump for progression', fmtN(wOut(s.inc)) + ' ' + wU(), 'Suggested when you hit the top of your rep range')}
  ${step('bar', 'Barbell weight', fmtN(wOut(s.bar)) + ' ' + wU(), 'For the plate calculator')}
  </div>
  ${NATIVE ? remindHtml() : ''}
  <div class="sec"><h2>Goals</h2></div><div class="list">${step('weeklyGoal', 'Weekly workout goal', s.weeklyGoal + ' / week')}
  <div class="li"><div class="grow"><div class="t">Week starts on</div></div><div class="seg" style="width:150px"><button class="${s.weekStart === 1 ? 'on' : ''}" data-a="weekStart" data-v="1">Mon</button><button class="${s.weekStart === 0 ? 'on' : ''}" data-a="weekStart" data-v="0">Sun</button></div></div></div>
  <div class="sec"><h2>Your data</h2></div><div class="card small">${syncBadge()}<div class="muted mt8">${NATIVE ? `Your workouts are stored privately on this phone and work fully offline. Export a backup now and then (to Google Drive or email) so you never lose your history.${S.settings.lastExport ? ` Last backup: ${ago(S.settings.lastExport).toLowerCase()}.` : ' No backup yet.'}` : "Workouts are saved to your Claude account (private to you), so they're the same on your phone and laptop. A copy is also kept on this device so logging works with a weak gym signal."}</div></div>
  <div class="list mt8"><button class="li" data-a="exportJson"><div class="av">${ic('download')}</div><div class="grow"><div class="t">Export backup (JSON)</div><div class="s">Everything — restore it here any time</div></div></button>
  <button class="li" data-a="exportCsv"><div class="av">${ic('download')}</div><div class="grow"><div class="t">Export to spreadsheet (CSV)</div><div class="s">One row per set — open in Excel or Sheets</div></div></button>
  <label class="li" style="cursor:pointer"><div class="av">${ic('upload')}</div><div class="grow"><div class="t">Import backup</div><div class="s">Merge a RepBook JSON backup</div></div><input type="file" accept=".json,application/json" data-in="importFile" style="display:none"></label>
  <button class="li" data-a="eraseAll"><div class="av" style="color:var(--red)">${ic('trash')}</div><div class="grow"><div class="t" style="color:var(--red)">Erase all data</div></div></button></div>
  ${NATIVE ? '' : `<div class="sec"><h2>Put it on your home screen</h2></div><div class="card small tx2">In the Claude app: open this page from your chats or projects. In Chrome on Android: open the page link, tap ⋮ → <b>Add to Home screen</b> — it opens like an app.</div>`}
  <div class="small muted mt16" style="text-align:center">RepBook ${NATIVE ? 'v' + esc(APP_VERSION) + ' · ' : ''}${LIBRARY.length} built-in exercises</div></div>`;
};

function remindHtml() {
  const r = S.settings.remind, dn = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];
  const order = [...Array(7)].map((_, i) => (i + S.settings.weekStart) % 7);
  return `<div class="sec"><h2>Reminders</h2></div><div class="list"><button class="li" data-a="remTog"><div class="grow"><div class="t">Workout reminders</div><div class="s">A nudge on your training days with what's up next</div></div><span class="tog ${r.on ? 'on' : ''}"></span></button>
  ${r.on ? `<div class="li" style="display:block"><div class="s" style="margin-bottom:8px">Days</div><div class="row gap6">${order.map(d => `<button class="chip ${r.days.includes(d) ? 'on' : ''}" data-a="remDay" data-d="${d}" style="flex:1;justify-content:center;padding:0">${dn[d]}</button>`).join('')}</div></div>
  <div class="li"><div class="grow t">Time</div><input class="inp" type="time" data-in="remTime" value="${esc(r.time)}" style="width:130px;height:40px"></div>` : ''}</div>`;
}

// ---------- charts ----------
function niceStep(v) { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
function niceMax(v) { if (v <= 0) return 1; const p = Math.pow(10, Math.floor(Math.log10(v))), n = v / p; return (n <= 1 ? 1 : n <= 2 ? 2 : n <= 2.5 ? 2.5 : n <= 5 ? 5 : 10) * p; }
function chartFrame(pts, { min = 0, max, h = 170, div = 3 }) {
  const W = 340, L = 34, R = 8, T = 10, B = 22, iw = W - L - R, ih = h - T - B;
  const ys = (v) => T + ih - (v - min) / (max - min || 1) * ih;
  let grid = '';
  const dv = div > 6 ? (div % 2 ? 3 : div / 2) : div;
  for (let i = 0; i <= dv; i++) { const v = min + (max - min) * i / dv, y = ys(v); grid += `<line class="ch-grid" x1="${L}" x2="${W - R}" y1="${y}" y2="${y}"/><text class="ch-axis" x="${L - 6}" y="${y + 3.5}" text-anchor="end">${v >= 10000 ? r1(v / 1000) + 'k' : fmtN(v < 10 ? r1(v) : Math.round(v))}</text>`; }
  return { W, L, R, T, B, iw, ih, h, ys, grid };
}
function lineChart(pts, { invert = false } = {}) {
  const vals = pts.map(p => p.y); let lo = Math.min(...vals), hi = Math.max(...vals);
  const pad = (hi - lo) * 0.1 || Math.max(0.5, hi * 0.05); lo = Math.max(0, lo - pad); hi = hi + pad;
  const step = niceStep((hi - lo) / 3), lo2 = Math.floor(lo / step) * step;
  const nsteps = Math.max(3, Math.ceil((hi - lo2) / step));
  const f = chartFrame(pts, { min: lo2, max: lo2 + step * nsteps, div: nsteps });
  const n = pts.length, xs = i => f.L + (n === 1 ? f.iw / 2 : i * f.iw / (n - 1));
  const yv = v => invert ? f.T + f.ih - (f.ys(v) - f.T) : f.ys(v);
  const d = pts.map((p, i) => `${i ? 'L' : 'M'}${xs(i).toFixed(1)},${yv(p.y).toFixed(1)}`).join('');
  const area = `${d}L${xs(n - 1).toFixed(1)},${f.T + f.ih}L${xs(0).toFixed(1)},${f.T + f.ih}Z`;
  const dots = pts.map((p, i) => `<circle cx="${xs(i)}" cy="${yv(p.y)}" r="${i === n - 1 ? 4.5 : 3}" fill="${i === n - 1 ? 'var(--acc)' : 'var(--card)'}" stroke="var(--acc)" stroke-width="2"/>`).join('');
  const hits = pts.map((p, i) => `<rect x="${xs(i) - f.iw / n / 2}" y="0" width="${Math.max(12, f.iw / n)}" height="${f.h}" fill="transparent" data-a="tip" data-tip="${esc(p.tip)}" data-x="${(xs(i) / f.W * 100).toFixed(1)}" data-y="${(yv(p.y) / f.h * 100).toFixed(1)}"/>`).join('');
  const xl = `<text class="ch-axis" x="${xs(0)}" y="${f.h - 4}" text-anchor="start">${esc(pts[0].x)}</text><text class="ch-axis" x="${xs(n - 1)}" y="${f.h - 4}" text-anchor="end">${esc(pts[n - 1].x)}</text>`;
  const gridFixed = invert ? '' : f.grid;
  return `<div class="chart"><svg viewBox="0 0 ${f.W} ${f.h}">${gridFixed}<path d="${area}" fill="var(--acc)" opacity=".08"/><path d="${d}" fill="none" stroke="var(--acc)" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>${dots}${xl}${hits}</svg><div class="tip" style="display:none"></div>${invert ? '<div class="tiny muted">Higher on the chart = faster pace</div>' : ''}</div>`;
}
function barChart(pts, { goal } = {}) {
  const top = Math.max(1, (goal || 0) + (goal ? 1 : 0), ...pts.map(p => p.y));
  const step = Math.max(goal ? 1 : 0, niceStep(top / 3)), max = step * Math.ceil(top / step);
  const f = chartFrame(pts, { min: 0, max, div: Math.round(max / step) });
  const n = pts.length, slot = f.iw / n, bw = Math.min(18, slot * 0.6);
  const bars = pts.map((p, i) => {
    const x = f.L + i * slot + (slot - bw) / 2, y = f.ys(p.y), hgt = f.T + f.ih - y, r = Math.min(4, hgt);
    const path = hgt > 0 ? `<path d="M${x},${f.T + f.ih}V${y + r}Q${x},${y} ${x + r},${y}H${x + bw - r}Q${x + bw},${y} ${x + bw},${y + r}V${f.T + f.ih}Z" fill="${i === n - 1 ? 'var(--acc)' : '#7d9a33'}"/>` : '';
    return path + `<rect x="${f.L + i * slot}" y="0" width="${slot}" height="${f.h}" fill="transparent" data-a="tip" data-tip="${esc(p.tip)}" data-x="${((x + bw / 2) / f.W * 100).toFixed(1)}" data-y="${(Math.min(y, f.T + f.ih - 2) / f.h * 100).toFixed(1)}"/>`;
  }).join('');
  const gl = goal ? `<line x1="${f.L}" x2="${f.W - f.R}" y1="${f.ys(goal)}" y2="${f.ys(goal)}" stroke="var(--tx2)" stroke-dasharray="4 4" stroke-width="1"/>` : '';
  const xl = `<text class="ch-axis" x="${f.L + slot / 2}" y="${f.h - 4}" text-anchor="start">${esc(pts[0].x)}</text><text class="ch-axis" x="${f.W - f.R}" y="${f.h - 4}" text-anchor="end">This week</text>`;
  return `<div class="chart"><svg viewBox="0 0 ${f.W} ${f.h}">${f.grid}${gl}${bars}${xl}</svg><div class="tip" style="display:none"></div></div>`;
}

// ---------- sheets ----------
let sheetEl = null, sheetCb = null;
function openSheet(html, { tall = false, onClose = null } = {}) {
  closeSheet(true);
  const layer = $('#layer');
  layer.innerHTML = `<div class="scrim" data-a="closeSheet"></div><div class="sheet ${tall ? 'tall' : ''}" role="dialog">${html}</div>`;
  sheetEl = $('.sheet', layer); sheetCb = onClose;
  requestAnimationFrame(() => { $('.scrim', layer).classList.add('show'); sheetEl.classList.add('show'); });
  return sheetEl;
}
function closeSheet(instant) {
  const layer = $('#layer'); if (!layer.innerHTML) return;
  const cb = sheetCb; sheetCb = null; sheetEl = null;
  if (instant) layer.innerHTML = '';
  else { const s = $('.sheet', layer), sc = $('.scrim', layer); s && s.classList.remove('show'); sc && sc.classList.remove('show'); setTimeout(() => { if (!sheetEl) layer.innerHTML = ''; }, 200); }
  if (cb) cb();
}
const sh = (title, body, foot = '') => `<div class="sh-h"><div class="grab"></div><div class="row between"><h3 class="grow">${title}</h3><button class="ib" data-a="closeSheet" aria-label="Close" style="margin-right:-8px">${ic('x')}</button></div></div><div class="sh-b">${body}</div>${foot ? `<div class="sh-f">${foot}</div>` : ''}`;
let askRes = null;
function ask(title, msg, buttons) {
  return new Promise(res => {
    askRes = res;
    openSheet(sh(title, `<div class="tx2">${msg}</div><div class="mt16" style="display:grid;gap:8px">${buttons.map((b, i) => `<button class="btn full ${b.cls || ''}" data-a="askBtn" data-i="${i}">${b.l}</button>`).join('')}</div>`), { onClose: () => { if (askRes) { const r = askRes; askRes = null; r(null); } } });
    ask._vals = buttons.map(b => b.v);
  });
}
let toastT;
function toast(msg, cls = '') {
  const t = $('#toast'); t.className = 'toast ' + cls; t.innerHTML = msg;
  requestAnimationFrame(() => t.classList.add('show'));
  clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('show'), cls === 'pr' ? 2600 : 1900);
}

// --- start sheet ---
function openStart() {
  const rs = S.routines.map(r => `<button class="opt" data-a="startRoutine" data-id="${r.id}">${ic('play')}<div class="grow"><div>${esc(r.name)}</div><div class="tiny muted">${r.ex.length} exercises</div></div></button>`).join('');
  openSheet(sh('Start a workout', `<button class="opt" data-a="startEmpty">${ic('plus')}<div class="grow"><div>Empty workout</div><div class="tiny muted">Add exercises as you go</div></div></button>
  ${rs}<button class="opt" data-a="logPast">${ic('cal')}<div class="grow"><div>Log a past workout</div><div class="tiny muted">Forgot to log? Pick the date</div></div></button>
  <button class="opt" data-a="go" data-s="programs">${ic('book')}<div class="grow"><div>Browse programs</div><div class="tiny muted">PPL, Upper/Lower, Calisthenics, Cardio…</div></div></button>`));
}
async function startWorkout(w) {
  closeSheet(true);
  if (S.active) {
    const v = await ask('Workout already running', `“${esc(S.active.name)}” is still in progress.`, [{ l: 'Resume it', v: 'resume', cls: 'pri' }, { l: 'Discard it and start new', v: 'new', cls: 'danger' }]);
    if (v === 'resume') return tab('log');
    if (v !== 'new') return;
  }
  const h = new Date().getHours();
  S.active = { id: uid(), name: w.name || (h < 12 ? 'Morning workout' : h < 17 ? 'Afternoon workout' : 'Evening workout'), start: w.start || Date.now(), routineId: w.routineId || null, notes: '', ex: w.ex || [], dur: w.dur || null };
  persist('active'); tab('log');
}
function exFromRoutine(r) {
  return r.ex.map(x => ({ id: uid(), exId: x.exId, notes: null, ss: !!x.ss, target: { reps: x.reps || null, time: x.time || null, dist: x.dist || null, rest: x.rest || null }, sets: [...Array(Math.max(1, +x.sets || 3))].map(() => newSet()) }));
}

// --- exercise picker ---
let PK = null;
function openPicker({ multi = true, title = 'Add exercises', cb }) {
  PK = { sel: new Set(), q: '', cat: 'All', multi, cb };
  const chips = ['All', 'Recent', ...CATS, 'Custom'];
  openSheet(`<div class="sh-h"><div class="grab"></div><div class="row between"><h3>${title}</h3><button class="ib" data-a="closeSheet">${ic('x')}</button></div>
    <div class="search mt8">${ic('search')}<input class="inp" placeholder="Search ${allEx().length} exercises" data-in="pkQ"></div>
    <div class="chips mt8" id="pkchips">${chips.map(c => `<button class="chip ${c === 'All' ? 'on' : ''}" data-a="pkCat" data-c="${esc(c)}">${c}</button>`).join('')}</div></div>
    <div class="sh-b" id="pklist">${exListHtml('', 'All', PK.sel)}</div>
    ${multi ? `<div class="sh-f"><button class="btn pri full" data-a="pkDone" id="pkbtn" disabled style="opacity:.5">Select exercises</button></div>` : ''}`, { tall: true });
}
function pkRefresh() {
  $('#pklist').innerHTML = exListHtml(PK.q, PK.cat, PK.sel);
  const b = $('#pkbtn'); if (b) { const n = PK.sel.size; b.disabled = !n; b.style.opacity = n ? 1 : .5; b.textContent = n ? `Add ${n} exercise${n > 1 ? 's' : ''}` : 'Select exercises'; }
}

// --- custom exercise ---
function openCustom({ name = '', edit = null, onSave = null } = {}) {
  const e = edit || { name, cat: 'Strength', muscle: 'Chest', equip: 'Dumbbell', type: 'wr' };
  const sel = (k, opts, v) => `<select class="inp" data-cx="${k}">${opts.map(o => typeof o === 'string' ? `<option ${o === v ? 'selected' : ''}>${esc(o)}</option>` : `<option value="${o[0]}" ${o[0] === v ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>`;
  openSheet(sh(edit ? 'Edit exercise' : 'New exercise', `<label class="fld"><span>Name</span><input class="inp" data-cx="name" value="${esc(e.name)}" placeholder="e.g. Cable Y-Raise"></label>
  <label class="fld"><span>Category</span>${sel('cat', CATS, e.cat)}</label>
  <label class="fld"><span>Main muscle</span>${sel('muscle', MUSCLES, e.muscle)}</label>
  <label class="fld"><span>Equipment</span>${sel('equip', EQUIP, e.equip)}</label>
  <label class="fld"><span>What do you track?</span>${sel('type', Object.entries(TYPES), e.type)}</label>`, `<button class="btn pri full" data-a="saveCustom">Save exercise</button>`));
  openCustom._ctx = { edit, onSave };
}

// --- tools ---
function open1rm() {
  openSheet(sh('1RM calculator', `<div class="row"><label class="fld grow"><span>Weight (${wU()})</span><input class="inp num" inputmode="decimal" data-in="c1w" placeholder="100"></label><label class="fld grow"><span>Reps</span><input class="inp num" inputmode="numeric" data-in="c1r" placeholder="5"></label></div><div id="c1out" class="mt16 small muted">Enter a set you've done to estimate your one-rep max.</div>`));
}
function calc1rm() {
  const w = parseFloat($('[data-in=c1w]').value), r = parseInt($('[data-in=c1r]').value);
  const o = $('#c1out'); if (!w || !r) { o.innerHTML = 'Enter a set you\'ve done to estimate your one-rep max.'; return; }
  const rm = e1rm(w, r);
  const pcts = [[1, 100], [2, 95], [3, 93], [4, 90], [5, 87], [6, 85], [8, 80], [10, 75], [12, 70], [15, 65]];
  o.innerHTML = `<div class="card hero"><div class="kicker">Estimated 1RM</div><div class="big num">${fmtN(r1(rm))} ${wU()}</div><div class="tiny muted">Epley formula — most accurate under 10 reps</div></div><div class="list mt8">${pcts.map(([rr, p]) => `<div class="li"><div class="grow t">${rr} rep${rr > 1 ? 's' : ''}</div><span class="muted small">${p}%</span><b class="num" style="width:80px;text-align:right">${fmtN(r1(rm * p / 100))} ${wU()}</b></div>`).join('')}</div>`;
}
function openPlates() {
  openSheet(sh('Plate calculator', `<label class="fld"><span>Target weight (${wU()}) · bar ${fmtN(wOut(S.settings.bar))} ${wU()}</span><input class="inp num" inputmode="decimal" data-in="plw" placeholder="${metric() ? 100 : 225}"></label><div id="plout"></div>`));
}
function calcPlates() {
  const t = parseFloat($('[data-in=plw]').value), bar = wOut(S.settings.bar), o = $('#plout');
  if (!t || t <= bar) { o.innerHTML = `<div class="small muted mt12">Enter a weight above the bar (${fmtN(bar)} ${wU()}).</div>`; return; }
  const plates = metric() ? [25, 20, 15, 10, 5, 2.5, 1.25] : [45, 35, 25, 10, 5, 2.5];
  const col = { 25: '#e5484d', 20: '#3e8ef7', 15: '#f5c84a', 10: '#4cc38a', 5: '#e8e8e8', 2.5: '#9aa0aa', 1.25: '#c0c4cc', 45: '#3e8ef7', 35: '#f5c84a' };
  let side = (t - bar) / 2; const used = [];
  plates.forEach(p => { while (side >= p - 1e-9) { used.push(p); side -= p; } });
  const loaded = bar + used.reduce((a, b) => a + b, 0) * 2;
  const vis = used.map(p => `<div class="plate" style="background:${col[p] || '#ccc'};height:${40 + p / plates[0] * 50}px;width:${p >= 10 ? 16 : 11}px">${p}</div>`).join('');
  o.innerHTML = `<div class="plates"><div class="barbar"></div>${vis}</div><div class="card"><div class="small muted">Each side</div><div style="font-weight:800;font-size:18px" class="num">${used.length ? used.join(' + ') : 'No plates'} ${wU()}</div>${Math.abs(loaded - t) > 0.01 ? `<div class="small mt4" style="color:var(--gold)">Closest you can load: ${fmtN(loaded)} ${wU()}</div>` : ''}</div>`;
}

// --- first-run welcome ---
let WZ = null;
function maybeWelcome() {
  if (S.settings.onboarded || sorted().length || S.routines.length || S.active) return;
  WZ = { units: S.settings.units, goal: S.settings.weeklyGoal, prog: 0 };
  renderWelcome();
}
function renderWelcome() {
  const progs = [...PROGRAMS.slice(0, 4).map((p, i) => [i, p.name, p.level]), [-1, "I'll set up my own", 'Start empty, add routines later']];
  const html = sh('Welcome to RepBook 👋', `<div class="tx2 small">Three quick choices and you're ready. You can change all of this later in Settings.</div>
  <div class="fld"><span>Units</span><div class="seg"><button class="${WZ.units === 'metric' ? 'on' : ''}" data-a="wz" data-k="units" data-v="metric">kg · km</button><button class="${WZ.units === 'imperial' ? 'on' : ''}" data-a="wz" data-k="units" data-v="imperial">lb · miles</button></div></div>
  <div class="fld"><span>Workouts per week</span><div class="row gap6">${[2, 3, 4, 5, 6].map(n => `<button class="chip ${WZ.goal === n ? 'on' : ''}" data-a="wz" data-k="goal" data-v="${n}" style="flex:1;justify-content:center">${n}</button>`).join('')}</div></div>
  <div class="fld"><span>Starting plan</span><div class="list">${progs.map(([i, n, l]) => `<button class="li" data-a="wz" data-k="prog" data-v="${i}"><div class="grow"><div class="t">${esc(n)}</div><div class="s">${esc(l)}</div></div><span class="radio ${WZ.prog === i ? 'on' : ''}"></span></button>`).join('')}</div></div>`,
    `<button class="btn pri full" data-a="wzGo">Let's go</button>`);
  if (sheetEl && $('.sheet').dataset.wz) { sheetEl.innerHTML = html; return; }
  openSheet(html, { tall: true, onClose: () => { if (WZ) { S.settings.onboarded = true; persist('profile'); WZ = null; } } });
  $('.sheet').dataset.wz = 1;
}

// ---------- workout actions ----------
function addExercisesToW(ids) {
  const W = curW(); if (!W) return;
  ids.forEach(id => {
    const prev = lastSession(id, W.id);
    const n = prev ? Math.max(1, doneSets(prev.e).length) : (['tm', 'dt'].includes(getEx(id).type) ? 1 : 3);
    const ks = prev ? doneSets(prev.e).map(s => s.k || 'n') : null;
    W.ex.push({ id: uid(), exId: id, notes: null, ss: false, target: null, sets: [...Array(n)].map((_, i) => newSet(ks ? ks[i] : 'n')) });
  });
  touchWNow(); render();
  setTimeout(() => { const cards = document.querySelectorAll('.wex'); const c = cards[cards.length - ids.length]; c && c.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 60);
}
function toggleDone(ei, si) {
  const W = curW(), e = W.ex[ei], s = e.sets[si], ex = getEx(e.exId);
  if (s.done) { s.done = false; delete s.pr; touchWNow(); render(); return; }
  const sg = suggestFor(W, e, curMode()), g = sg.sets[si] || {};
  const tmp = { ...s };
  fieldsFor(ex.type).forEach(f => { if (tmp[f.f] == null && g[f.f] != null) tmp[f.f] = g[f.f]; });
  const miss = missingFields(ex.type, tmp);
  if (miss.length) { toast(`Enter ${miss.map(f => f.l).join(' & ')} first`); const inp = $(`#r-${ei}-${si} input[data-f="${miss[0].f}"]`); inp && inp.focus(); return; }
  Object.assign(s, tmp);
  s.done = true;
  // PR check against history + earlier sets in this workout
  if (s.k !== 'w') {
    const b = bestsFor(e.exId, curMode() === 'edit' ? W.start : Infinity, W.id);
    W.ex.forEach((x, xi) => { if (x.exId === e.exId) workSets(x).forEach((y) => { if (y !== s) foldBests(b, ex.type, y); }); });
    const prs = prsOfSet(ex.type, s, b);
    if (prs.length) { s.pr = prs; toast(`${ic('trophy')} New PR · ${prs.map(k => PRL[k]).join(', ')}`, 'pr'); } else delete s.pr;
  }
  touchWNow();
  if (curMode() === 'active' && S.settings.autoRest && !(e.ss && W.ex[ei + 1])) startRest((e.target && e.target.rest) || S.settings.rest);
  render();
  const row = $(`#r-${ei}-${si}`); if (row && s.pr) row.classList.add('prflash');
}
async function finishWorkout() {
  const W = S.active; if (!W) return;
  let filled = 0, done = 0;
  W.ex.forEach(e => e.sets.forEach(s => { if (s.done) done++; else if (isComplete(getEx(e.exId).type, s)) filled++; }));
  if (filled) {
    const v = await ask('Finish workout?', `${filled} set${filled > 1 ? 's have' : ' has'} numbers but ${filled > 1 ? "aren't" : "isn't"} ticked.`, [{ l: 'Count them as done', v: 'done', cls: 'pri' }, { l: 'Leave them out', v: 'drop' }, { l: 'Keep logging', v: null }]);
    if (!v) return;
    if (v === 'done') W.ex.forEach(e => e.sets.forEach(s => { if (!s.done && isComplete(getEx(e.exId).type, s)) s.done = true; }));
    done += v === 'done' ? filled : 0;
  } else if (!done) {
    const v = await ask('Nothing logged yet', 'Tick at least one set to save this workout.', [{ l: 'Keep logging', v: null, cls: 'pri' }, { l: 'Discard workout', v: 'discard', cls: 'danger' }]);
    if (v === 'discard') { S.active = null; persist('active'); stopRest(); tab('home'); }
    return;
  } else {
    const v = await ask('Finish workout?', 'Save it to your history.', [{ l: 'Finish & save', v: 'ok', cls: 'pri' }, { l: 'Keep logging', v: null }]);
    if (!v) return;
  }
  W.ex.forEach(e => { e.sets = e.sets.filter(s => s.done); });
  W.ex = W.ex.filter(e => e.sets.length);
  W.end = W.dur ? W.start + W.dur * 60000 : Date.now();
  computePRs(W);
  S.workouts[W.id] = W; S.active = null;
  persist('w:' + W.id); persist('active'); stopRest();
  tab('home');
  showSummary(W);
  scheduleReminders(false);
}
function computePRs(W) {
  W.prs = [];
  W.ex.forEach(e => {
    const ex = getEx(e.exId), b = bestsFor(e.exId, W.start, W.id), labels = new Set();
    const before = clone(b);
    workSets(e).forEach(s => { const p = prsOfSet(ex.type, s, b); if (p.length) { s.pr = p; p.forEach(k => labels.add(k)); } else delete s.pr; foldBests(b, ex.type, s); });
    if (labels.size && before.n) W.prs.push({ exId: e.exId, labels: [...labels] });
  });
}
function showSummary(W) {
  const wk = weekStats(0);
  const prs = (W.prs || []).map(x => `<div class="row mt8"><span style="color:var(--gold)">${ic('trophy')}</span><div class="grow"><b class="small">${esc(getEx(x.exId).name)}</b><div class="tiny muted">${x.labels.map(k => PRL[k]).join(' · ')}</div></div></div>`).join('');
  openSheet(sh('Workout complete 💪', `<div class="big">${esc(W.name)}</div><div class="small muted">${dstr(W.start)}</div>
  <div class="stats mt12"><div class="stat"><div class="v">${fmtDur(wDur(W))}</div><div class="l">Duration</div></div><div class="stat"><div class="v">${fmtVol(workoutVolume(W))}</div><div class="l">Volume (${wU()})</div></div><div class="stat"><div class="v">${workoutSetsCount(W)}</div><div class="l">Sets</div></div></div>
  ${prs ? `<div class="sec"><h2>Personal records</h2></div>${prs}` : ''}
  <div class="card mt12 small"><b>${wk.count} of ${S.settings.weeklyGoal}</b> workouts this week${wk.count >= S.settings.weeklyGoal ? ' — goal hit! 🔥' : ''}</div>`,
    `<div class="btns">${!W.routineId ? `<button class="btn" data-a="saveAsRoutine" data-id="${W.id}">Save as routine</button>` : ''}<button class="btn pri" data-a="closeSheet">Done</button></div>`));
}
function routineFromWorkout(w) {
  return {
    id: uid(), name: w.name, notes: '', ex: w.ex.map(e => {
      const ex = getEx(e.exId), ws = workSets(e).length ? workSets(e) : doneSets(e);
      const reps = ws.map(s => s.r).filter(Boolean);
      return { exId: e.exId, sets: ws.length || 3, reps: e.target && e.target.reps ? e.target.reps : (reps.length ? (Math.min(...reps) === Math.max(...reps) ? String(reps[0]) : `${Math.min(...reps)}-${Math.max(...reps)}`) : null), time: ['ts', 'tm', 'wt'].includes(ex.type) ? Math.max(...ws.map(s => s.t || 0)) || null : null, dist: ex.type === 'dt' ? Math.max(...ws.map(s => s.d || 0)) || null : null, rest: e.target && e.target.rest || null, ss: !!e.ss };
    })
  };
}
function workoutText(w) {
  let t = `${w.name} — ${dstr(w.start)} (${fmtDur(wDur(w))})\n`;
  w.ex.forEach(e => { const ex = getEx(e.exId); t += `\n${ex.name}\n` + doneSets(e).map((s, i) => `  ${s.k === 'w' ? 'W' : i + 1}. ${setStr(ex.type, s)}${s.pr ? ' 🏆' : ''}`).join('\n') + '\n'; });
  return t + '\nLogged with RepBook';
}

// ---------- rest timer ----------
let RT = null, actx = null;
function ensureAudio() { try { actx = actx || new (window.AudioContext || window.webkitAudioContext)(); if (actx.state === 'suspended') actx.resume(); } catch (e) { } }
function beep() {
  if (!S.settings.sound || !actx || NATIVE) return; // on Android the notification plays the sound
  try { [0, .25, .5].forEach((d, i) => { const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = i === 2 ? 1320 : 880; o.connect(g); g.connect(actx.destination); const t = actx.currentTime + d; g.gain.setValueAtTime(.0001, t); g.gain.exponentialRampToValueAtTime(.35, t + .02); g.gain.exponentialRampToValueAtTime(.0001, t + .18); o.start(t); o.stop(t + .2); }); } catch (e) { }
}
function startRest(sec) { ensureAudio(); RT = { end: Date.now() + sec * 1000, total: sec, fired: false }; $('#app').classList.add('has-rest'); tick(); scheduleRestNote(); }
function stopRest() { const had = RT && !RT.fired; RT = null; const el = $('#rest'); el && el.remove(); $('#app').classList.remove('has-rest'); if (had) cancelRestNote(); }
function tick() {
  const el = $('#elapsed'); if (el && S.active && cur().s === 'log' && !S.active.dur) el.textContent = fmtClock(Date.now() - S.active.start);
  const nc = $('#navclock'); if (nc && S.active) nc.textContent = fmtClock(Date.now() - S.active.start);
  if (!RT) return;
  let r = $('#rest');
  if (!r) { r = document.createElement('div'); r.id = 'rest'; r.className = 'rest'; r.innerHTML = `<div class="grow"><div class="tiny muted" id="rlab">Rest</div><div class="tm num" id="rtm"></div></div><button class="btn sm" data-a="restAdj" data-d="-15">−15</button><button class="btn sm" data-a="restAdj" data-d="15">+15</button><button class="btn sm pri" data-a="restSkip">Skip</button><div class="bar" id="rbar"></div>`; document.body.appendChild(r); }
  const left = RT.end - Date.now();
  if (left <= 0) {
    if (!RT.fired) { RT.fired = true; beep(); if (S.settings.vibrate) buzz([250, 120, 250]); }
    r.classList.add('over'); $('#rlab').textContent = 'Rest over — next set!'; $('#rtm').textContent = '+' + fmtClock(-left); $('#rbar').style.width = '0';
    if (left < -15000) stopRest();
  } else {
    r.classList.remove('over'); $('#rlab').textContent = 'Rest'; $('#rtm').textContent = fmtClock(left + 999); $('#rbar').style.width = (left / (RT.total * 1000) * 100) + '%';
  }
}
setInterval(tick, 250);

// ---------- export / import ----------
async function saveFile(filename, data) {
  if (NATIVE) {
    try {
      const r = await Nat.fs.writeFile({ path: filename, data, directory: 'CACHE', encoding: 'utf8' });
      await Nat.share.share({ title: filename, files: [r.uri], dialogTitle: 'Save your backup to Drive, email or Files' });
      if (/\.json$/.test(filename)) { S.settings.lastExport = Date.now(); persist('profile'); render(); }
    } catch (e) { if (!/cancel/i.test((e && e.message) || '')) toast("Couldn't export — " + ((e && e.message) || 'try again')); }
    return;
  }
  let dl = null;
  try { dl = window.claude && await window.claude.use('downloads'); } catch (e) { }
  if (dl) {
    try { await dl.save({ filename, data }); toast('Saved ' + filename); if (/\.json$/.test(filename)) { S.settings.lastExport = Date.now(); persist('profile'); } return; }
    catch (e) { if (e && e.code === 'declined') return; }
  }
  openSheet(sh('Copy your backup', `<div class="small muted">Downloads aren't available here, so copy this text and keep it somewhere safe (e.g. a note or email to yourself).</div><textarea class="inp mt12 num" style="min-height:220px;font-size:12px" readonly>${esc(data)}</textarea>`, `<button class="btn pri full" data-a="copyText">Copy</button>`));
}
function exportJson() { saveFile(`repbook-backup-${ymd(Date.now())}.json`, JSON.stringify({ app: 'RepBook', v: 1, exported: new Date().toISOString(), data: { settings: S.settings, custom: S.custom, routines: S.routines, bw: S.bw, workouts: S.workouts } }, null, 1)); }
function exportCsv() {
  const q = v => { v = v == null ? '' : String(v); return /[",\n]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; };
  const rows = [['Date', 'Time', 'Workout', 'Exercise', 'Category', 'Muscle', 'Set', 'Set type', `Weight (${wU()})`, 'Reps', `Distance (${dU()})`, 'Duration (sec)', 'RPE', 'Est. 1RM', 'PR', 'Workout duration (min)', 'Notes']];
  [...sorted()].reverse().forEach(w => w.ex.forEach(e => { const ex = getEx(e.exId); doneSets(e).forEach((s, i) => rows.push([ymd(w.start), tstr(w.start), w.name, ex.name, ex.cat, ex.muscle, i + 1, { w: 'Warm-up', d: 'Drop', f: 'Failure' }[s.k] || 'Normal', s.w != null ? fmtN(wOut(s.w)) : '', s.r ?? '', s.d != null ? fmtN(dOut(s.d)) : '', s.t ?? '', s.rpe ?? '', ex.type === 'wr' && s.w && s.r ? fmtN(r1(wOut(e1rm(s.w, s.r)))) : '', s.pr ? s.pr.map(k => PRL[k]).join('; ') : '', Math.round(wDur(w) / 60000), i === 0 ? [w.notes, e.notes].filter(Boolean).join(' | ') : ''])); }));
  saveFile(`repbook-sets-${ymd(Date.now())}.csv`, rows.map(r => r.map(q).join(',')).join('\n'));
}
function importJson(file) {
  const rd = new FileReader();
  rd.onload = () => {
    try {
      const o = JSON.parse(rd.result), d = o.data || o;
      if (!d.workouts && !d.routines) throw 0;
      let nw = 0;
      Object.values(d.workouts || {}).forEach(w => { if (w && w.id && w.start) { w.ex = Array.isArray(w.ex) ? w.ex : []; if (!S.workouts[w.id]) nw++; S.workouts[w.id] = w; persist('w:' + w.id); } });
      (d.routines || []).forEach(r => { if (!S.routines.find(x => x.id === r.id)) S.routines.push(r); });
      (d.custom || []).forEach(c => { if (!S.custom.find(x => x.id === c.id)) S.custom.push(c); });
      (d.bw || []).forEach(b => { if (!S.bw.find(x => x.d === b.d)) S.bw.push(b); });
      persist('profile'); render(); toast(`Imported ${nw} new workout${nw === 1 ? '' : 's'}`);
    } catch (e) { toast("That file isn't a RepBook backup"); }
  };
  rd.readAsText(file);
}

// ---------- event handling ----------
const A = {};
document.addEventListener('click', e => {
  const el = e.target.closest('[data-a]'); if (!el) return;
  const fn = A[el.dataset.a]; if (fn) { fn(el, e); }
});
A.tab = el => tab(el.dataset.t);
A.back = () => back();
A.go = el => { closeSheet(true); go(el.dataset.s, { id: el.dataset.id }); };
A.navLog = () => { if (S.active) tab('log'); else openStart(); };
A.openStart = () => openStart();
A.closeSheet = () => closeSheet();
A.askBtn = el => { const v = ask._vals[+el.dataset.i]; const r = askRes; askRes = null; closeSheet(); r && r(v); };
A.startEmpty = () => startWorkout({});
A.startRoutine = el => { const r = S.routines.find(x => x.id === el.dataset.id); if (!r) return; RD = null; startWorkout({ name: r.name, routineId: r.id, ex: exFromRoutine(r) }); };
A.logPast = () => openPastSheet(ymd(Date.now() - DAY));
A.logPastDay = el => openPastSheet(el.dataset.k);
function openPastSheet(day) {
  openSheet(sh('Log a past workout', `<label class="fld"><span>Date</span><input class="inp" type="date" data-px="date" value="${day}" max="${ymd(Date.now())}"></label><label class="fld"><span>Start time</span><input class="inp" type="time" data-px="time" value="18:00"></label><label class="fld"><span>Duration (minutes)</span><input class="inp" inputmode="numeric" data-px="dur" value="60"></label>${S.routines.length ? `<label class="fld"><span>Routine (optional)</span><select class="inp" data-px="rt"><option value="">— Empty workout —</option>${S.routines.map(r => `<option value="${r.id}">${esc(r.name)}</option>`).join('')}</select></label>` : ''}`, `<button class="btn pri full" data-a="pastGo">Continue</button>`));
}
A.pastGo = () => {
  const d = $('[data-px=date]').value, t = $('[data-px=time]').value || '18:00', dur = parseInt($('[data-px=dur]').value) || 60;
  if (!d) return toast('Pick a date');
  const start = new Date(d + 'T' + t).getTime(); const rid = $('[data-px=rt]') ? $('[data-px=rt]').value : '';
  const r = S.routines.find(x => x.id === rid);
  startWorkout({ start, dur, name: r ? r.name : 'Workout', routineId: r ? r.id : null, ex: r ? exFromRoutine(r) : [] });
};
A.wRename = () => {
  const W = curW();
  openSheet(sh('Workout name', `<input class="inp" data-px="nm" value="${esc(W.name)}">`, `<button class="btn pri full" data-a="wRenameOk">Save</button>`));
  setTimeout(() => { const i = $('[data-px=nm]'); i && i.select(); }, 250);
};
A.wRenameOk = () => { const v = $('[data-px=nm]').value.trim(); if (v) { curW().name = v; touchWNow(); } closeSheet(); render(); };
A.wDate = () => {
  const W = curW(), d = new Date(W.start);
  const durMin = W.dur || (W.end ? Math.round((W.end - W.start) / 60000) : '');
  openSheet(sh('Date & duration', `<label class="fld"><span>Date</span><input class="inp" type="date" data-px="date" value="${ymd(W.start)}"></label><label class="fld"><span>Start time</span><input class="inp" type="time" data-px="time" value="${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}"></label><label class="fld"><span>Duration (minutes)${curMode() === 'active' ? ' — leave empty to use the live timer' : ''}</span><input class="inp" inputmode="numeric" data-px="dur" value="${durMin}"></label>`, `<button class="btn pri full" data-a="wDateOk">Save</button>`));
};
A.wDateOk = () => {
  const W = curW(), d = $('[data-px=date]').value, t = $('[data-px=time]').value, dur = parseInt($('[data-px=dur]').value);
  const oldDur = W.end ? Math.round((W.end - W.start) / 60000) : 60;
  if (d && t) W.start = new Date(d + 'T' + t).getTime();
  if (curMode() === 'edit') { W.end = W.start + (dur > 0 ? dur : oldDur || 60) * 60000; }
  else W.dur = dur > 0 ? dur : null;
  touchWNow(); closeSheet(); render();
};
A.addEx = () => openPicker({ cb: ids => addExercisesToW(ids) });
A.pkCat = el => { PK.cat = el.dataset.c; document.querySelectorAll('#pkchips .chip').forEach(c => c.classList.toggle('on', c.dataset.c === PK.cat)); pkRefresh(); };
A.pkToggle = el => {
  const id = el.dataset.id;
  if (!PK.multi) { const cb = PK.cb; closeSheet(true); cb([id]); return; }
  PK.sel.has(id) ? PK.sel.delete(id) : PK.sel.add(id); pkRefresh();
};
A.pkDone = () => { const ids = [...PK.sel], cb = PK.cb; closeSheet(true); cb(ids); };
A.addSet = el => {
  const W = curW(), e = W.ex[+el.dataset.ei]; const last = e.sets[e.sets.length - 1];
  e.sets.push(newSet(last && last.k === 'd' ? 'd' : 'n')); touchWNow(); render();
  const row = $(`#r-${el.dataset.ei}-${e.sets.length - 1} input`); row && row.focus({ preventScroll: true });
};
A.usePrev = el => {
  const W = curW(), ei = +el.dataset.ei, si = +el.dataset.si, e = W.ex[ei];
  const sg = suggestFor(W, e, curMode()), p = sg.prevSets[si]; if (!p) return;
  const s = e.sets[si]; if (s.done) return;
  fieldsFor(getEx(e.exId).type).forEach(f => s[f.f] = p[f.f] ?? null); touchW(); render();
};
A.toggleDone = el => { ensureAudio(); if (NATIVE && S.settings.vibrate) buzz(15); toggleDone(+el.dataset.ei, +el.dataset.si); };
A.setMenu = el => {
  const ei = +el.dataset.ei, si = +el.dataset.si, s = curW().ex[ei].sets[si];
  const opt = (k, l, c) => `<button class="opt" data-a="setKind" data-ei="${ei}" data-si="${si}" data-k="${k}"><span class="setno ${k}" style="width:28px;height:28px;display:grid;place-items:center;font-size:12px">${c}</span><div class="grow">${l}</div>${(s.k || 'n') === k ? ic('check') : ''}</button>`;
  openSheet(sh(`Set ${si + 1}`, `${opt('w', 'Warm-up set', 'W')}${opt('n', 'Normal set', '#')}${opt('d', 'Drop set', 'D')}${opt('f', 'To failure', 'F')}
  <div class="opt" style="display:block"><div class="small muted" style="margin-bottom:8px">RPE — how hard was it? (10 = max effort)</div><div class="row gap6">${[6, 7, 8, 9, 10].map(v => `<button class="chip ${s.rpe === v ? 'on' : ''}" data-a="setRpe" data-ei="${ei}" data-si="${si}" data-v="${v}">${v}</button>`).join('')}<button class="chip" data-a="setRpe" data-ei="${ei}" data-si="${si}" data-v="">Clear</button></div></div>
  <button class="opt red" data-a="setDel" data-ei="${ei}" data-si="${si}">${ic('trash')}Delete set</button>`));
};
A.setKind = el => { curW().ex[+el.dataset.ei].sets[+el.dataset.si].k = el.dataset.k; touchWNow(); closeSheet(); render(); };
A.setRpe = el => { const s = curW().ex[+el.dataset.ei].sets[+el.dataset.si]; s.rpe = el.dataset.v ? +el.dataset.v : null; touchWNow(); closeSheet(); render(); };
A.setDel = el => { const e = curW().ex[+el.dataset.ei]; e.sets.splice(+el.dataset.si, 1); touchWNow(); closeSheet(); render(); };
A.exMenu = el => {
  const ei = +el.dataset.ei, W = curW(), e = W.ex[ei];
  openSheet(sh(esc(getEx(e.exId).name), `
  <button class="opt" data-a="exNoteAdd" data-ei="${ei}">${ic('note')}${e.notes != null ? 'Remove note' : 'Add note'}</button>
  <button class="opt" data-a="exRest" data-ei="${ei}">${ic('timer')}Rest time for this exercise</button>
  ${W.ex[ei + 1] ? `<button class="opt" data-a="exSS" data-ei="${ei}">${ic('link')}${e.ss ? 'Remove superset' : 'Superset with next exercise'}</button>` : ''}
  <button class="opt" data-a="exReplace" data-ei="${ei}">${ic('swap')}Replace exercise</button>
  ${ei > 0 ? `<button class="opt" data-a="exMove" data-ei="${ei}" data-d="-1">${ic('up')}Move up</button>` : ''}
  ${W.ex[ei + 1] ? `<button class="opt" data-a="exMove" data-ei="${ei}" data-d="1">${ic('down')}Move down</button>` : ''}
  <button class="opt" data-a="go" data-s="exercise" data-id="${e.exId}">${ic('chart')}History & charts</button>
  <button class="opt red" data-a="exDel" data-ei="${ei}">${ic('trash')}Remove exercise</button>`));
};
A.exNoteAdd = el => { const e = curW().ex[+el.dataset.ei]; e.notes = e.notes != null ? null : ''; touchWNow(); closeSheet(); render(); };
A.exSS = el => { const e = curW().ex[+el.dataset.ei]; e.ss = !e.ss; touchWNow(); closeSheet(); render(); };
A.exMove = el => { const W = curW(), i = +el.dataset.ei, j = i + +el.dataset.d; [W.ex[i], W.ex[j]] = [W.ex[j], W.ex[i]]; touchWNow(); closeSheet(); render(); };
A.exDel = el => { curW().ex.splice(+el.dataset.ei, 1); touchWNow(); closeSheet(); render(); };
A.exReplace = el => { const ei = +el.dataset.ei; closeSheet(true); openPicker({ multi: false, title: 'Replace with…', cb: ids => { const e = curW().ex[ei]; e.exId = ids[0]; e.sets.forEach(s => { s.w = s.r = s.t = s.d = null; s.done = false; delete s.pr; }); touchWNow(); render(); } }); };
A.exRest = el => {
  const ei = +el.dataset.ei, e = curW().ex[ei], cur = (e.target && e.target.rest) || S.settings.rest;
  openSheet(sh('Rest time', `<div class="row wrapx gap6">${[30, 45, 60, 90, 120, 150, 180, 240, 300].map(v => `<button class="chip ${v === cur ? 'on' : ''}" data-a="exRestSet" data-ei="${ei}" data-v="${v}">${fmtSec(v)}</button>`).join('')}</div>`));
};
A.exRestSet = el => { const e = curW().ex[+el.dataset.ei]; e.target = e.target || {}; e.target.rest = +el.dataset.v; touchWNow(); closeSheet(); render(); };
A.restManual = () => openSheet(sh('Rest timer', `<div class="row wrapx gap6">${[30, 45, 60, 90, 120, 180, 240, 300].map(v => `<button class="chip" data-a="restGo" data-v="${v}">${fmtSec(v)}</button>`).join('')}</div>`));
A.restGo = el => { closeSheet(); startRest(+el.dataset.v); };
A.restAdj = el => { if (!RT) return; RT.end += +el.dataset.d * 1000; RT.total = Math.max(RT.total + +el.dataset.d, 5); RT.fired = RT.end <= Date.now(); tick(); if (!RT.fired) scheduleRestNote(); else cancelRestNote(); };
A.restSkip = () => stopRest();
A.finish = () => finishWorkout();
A.discard = async () => { const v = await ask('Discard workout?', 'Everything logged in this workout will be lost.', [{ l: 'Discard', v: 1, cls: 'danger' }, { l: 'Cancel', v: null }]); if (v) { S.active = null; persist('active'); stopRest(); tab('home'); toast('Workout discarded'); } };
A.saveAsRoutine = el => { const w = S.workouts[el.dataset.id]; if (!w) return; const r = routineFromWorkout(w); S.routines.push(r); w.routineId = r.id; persist('profile'); persist('w:' + w.id); closeSheet(); toast('Saved as routine'); render(); };

A.wMenu = el => {
  const id = el.dataset.id;
  openSheet(sh('Workout', `<button class="opt" data-a="repeatW" data-id="${id}">${ic('repeat')}Repeat this workout</button><button class="opt" data-a="editW" data-id="${id}">${ic('edit')}Edit</button><button class="opt" data-a="saveAsRoutine" data-id="${id}">${ic('list')}Save as routine</button><button class="opt" data-a="copyW" data-id="${id}">${ic('copy')}Copy as text</button><button class="opt red" data-a="delW" data-id="${id}">${ic('trash')}Delete</button>`));
};
A.repeatW = el => { const w = S.workouts[el.dataset.id]; if (!w) return; startWorkout({ name: w.name, routineId: w.routineId, ex: w.ex.map(e => ({ id: uid(), exId: e.exId, notes: null, ss: !!e.ss, target: e.target || null, sets: doneSets(e).map(s => newSet(s.k)) })) }); };
A.editW = el => { closeSheet(true); const w = S.workouts[el.dataset.id]; if (!w) return; EDIT = clone(w); nav.stack.push({ s: 'edit', p: { id: w.id } }); render(); window.scrollTo(0, 0); };
A.saveEdit = () => {
  const W = EDIT; W.ex.forEach(e => { e.sets = e.sets.filter(s => s.done || isComplete(getEx(e.exId).type, s)); e.sets.forEach(s => s.done = true); }); W.ex = W.ex.filter(e => e.sets.length);
  if (!W.ex.length) return toast('Add at least one set');
  computePRs(W); S.workouts[W.id] = W; persist('w:' + W.id); EDIT = null; nav.stack.pop(); render(); toast('Workout updated');
};
A.copyW = el => { const w = S.workouts[el.dataset.id]; try { navigator.clipboard.writeText(workoutText(w)).then(() => toast('Copied — paste it anywhere'), () => toast("Couldn't copy")); } catch (e) { toast("Couldn't copy"); } closeSheet(); };
A.copyText = () => { const t = $('.sheet textarea'); try { navigator.clipboard.writeText(t.value).then(() => toast('Copied'), () => { t.select(); toast('Select all & copy'); }); } catch (e) { t.select(); } };
A.delW = async el => {
  const id = el.dataset.id;
  const v = await ask('Delete workout?', 'This removes it from your history for good.', [{ l: 'Delete', v: 1, cls: 'danger' }, { l: 'Cancel', v: null }]);
  if (!v) return; delete S.workouts[id]; persist('w:' + id); EDIT = null; nav.stack = nav.stack.filter(x => x.p.id !== id); render(); toast('Deleted');
};

A.histMode = el => { UI.histMode = el.dataset.m; render(); };
A.calNav = el => { const b = UI.calMonth ? new Date(UI.calMonth) : new Date(); b.setDate(1); b.setMonth(b.getMonth() + +el.dataset.d); UI.calMonth = b.getTime(); render(); };
A.calDay = el => { UI.calSel = UI.calSel === el.dataset.k ? null : el.dataset.k; render(); };
A.exCat = el => { UI.exCat = el.dataset.c; document.querySelectorAll('.chips .chip').forEach(c => c.classList.toggle('on', c.dataset.c === UI.exCat)); $('#exlist').innerHTML = exListHtml(UI.exQ, UI.exCat, null); };
A.metric = el => { UI.chartMetric[el.dataset.id] = el.dataset.k; render(); };
A.tip = el => {
  const c = el.closest('.chart'), t = $('.tip', c); t.style.display = 'block'; t.textContent = el.dataset.tip;
  t.style.left = Math.min(85, Math.max(15, +el.dataset.x)) + '%'; t.style.top = (el.dataset.y / 100 * c.querySelector('svg').getBoundingClientRect().height) + 'px';
};

A.newCustom = el => {
  const fromPicker = !!PK && !!$('#pklist');
  const cb = fromPicker ? PK.cb : null, prevSel = fromPicker && PK.multi ? [...PK.sel] : [];
  closeSheet(true);
  openCustom({ name: el.dataset.name || '', onSave: cb ? id => cb([...prevSel, id]) : null });
};
A.saveCustom = () => {
  const g = k => $(`[data-cx=${k}]`).value;
  const name = g('name').trim(); if (!name) return toast('Give it a name');
  const ctx = openCustom._ctx || {};
  if (ctx.edit) { Object.assign(S.custom.find(x => x.id === ctx.edit.id), { name, cat: g('cat'), muscle: g('muscle'), equip: g('equip'), type: g('type') }); }
  else {
    if (allEx().some(e => e.name.toLowerCase() === name.toLowerCase())) return toast('That exercise already exists');
    const ex = { id: 'c-' + slug(name).slice(0, 40) + '-' + uid().slice(-4), name, cat: g('cat'), muscle: g('muscle'), equip: g('equip'), type: g('type') };
    S.custom.push(ex); rebuildEx(); persist('profile'); closeSheet(true);
    if (ctx.onSave) ctx.onSave(ex.id); else { render(); toast('Exercise created'); }
    return;
  }
  persist('profile'); closeSheet(); render(); toast('Saved');
};
A.customMenu = el => {
  const id = el.dataset.id;
  openSheet(sh('Custom exercise', `<button class="opt" data-a="customEdit" data-id="${id}">${ic('edit')}Edit</button><button class="opt red" data-a="customDel" data-id="${id}">${ic('trash')}Delete</button>`));
};
A.customEdit = el => { const e = S.custom.find(x => x.id === el.dataset.id); closeSheet(true); openCustom({ edit: e }); };
A.customDel = async el => {
  const id = el.dataset.id, used = sorted().some(w => w.ex.some(e => e.exId === id));
  const v = await ask('Delete exercise?', used ? "It's in your history, so past workouts keep it — it just won't show in lists." : 'This can\'t be undone.', [{ l: 'Delete', v: 1, cls: 'danger' }, { l: 'Cancel', v: null }]);
  if (!v) return;
  if (used) S.custom.find(x => x.id === id).hidden = true; else S.custom = S.custom.filter(x => x.id !== id);
  persist('profile'); back();
};

A.newRoutine = () => { RD = null; go('routine', {}); };
A.rMove = el => { const i = +el.dataset.i, j = i + +el.dataset.d; if (j < 0 || j >= S.routines.length) return; [S.routines[i], S.routines[j]] = [S.routines[j], S.routines[i]]; persist('profile'); render(); };
A.rdAdd = () => openPicker({ cb: ids => { ids.forEach(id => { const t = getEx(id).type; RD.ex.push({ exId: id, sets: ['tm', 'dt'].includes(t) ? 1 : 3, reps: ['wr', 'bw', 'as'].includes(t) ? '8-12' : null, time: t === 'ts' ? 60 : t === 'tm' ? 1800 : t === 'wt' ? 45 : null, dist: t === 'dt' ? 5 : null, rest: null }); }); render(); } });
A.rdMove = el => { const i = +el.dataset.i, j = i + +el.dataset.d; if (j < 0 || j >= RD.ex.length) return; [RD.ex[i], RD.ex[j]] = [RD.ex[j], RD.ex[i]]; render(); };
A.rdDel = el => { RD.ex.splice(+el.dataset.i, 1); render(); };
A.rdSS = el => { const x = RD.ex[+el.dataset.i]; x.ss = !x.ss; render(); };
A.rdSave = () => {
  if (!RD.name.trim()) return toast('Name your routine');
  if (!RD.ex.length) return toast('Add at least one exercise');
  const r = clone(RD); delete r._for; delete r._new; r.name = r.name.trim();
  const i = S.routines.findIndex(x => x.id === r.id); if (i >= 0) S.routines[i] = r; else S.routines.push(r);
  persist('profile'); RD = null; nav.stack.pop(); render(); toast('Routine saved');
};
A.rdDelete = async () => {
  const v = await ask('Delete routine?', 'Past workouts stay in your history.', [{ l: 'Delete', v: 1, cls: 'danger' }, { l: 'Cancel', v: null }]);
  if (!v) return; S.routines = S.routines.filter(x => x.id !== RD.id); persist('profile'); RD = null; nav.stack.pop(); render();
};
A.addProgram = (el, quiet) => {
  const pg = PROGRAMS[+el.dataset.i]; let n = 0;
  pg.routines.forEach(r => {
    const ex = r.ex.map(([name, sets, tg]) => { const id = slug(name), t = getEx(id).type; return { exId: id, sets, reps: ['wr', 'bw', 'as'].includes(t) ? String(tg) : null, time: t === 'ts' || t === 'wt' ? +tg : t === 'tm' ? +tg * 60 : null, dist: t === 'dt' ? +tg : null, rest: null }; });
    S.routines.push({ id: uid(), name: r.name, notes: pg.name, ex }); n++;
  });
  persist('profile'); if (!quiet) toast(`Added ${n} routine${n > 1 ? 's' : ''} — find them on Home`); render();
};

A.bwAdd = () => openSheet(sh('Log body weight', `<label class="fld"><span>Date</span><input class="inp" type="date" data-px="date" value="${ymd(Date.now())}" max="${ymd(Date.now())}"></label><label class="fld"><span>Weight (${wU()})</span><input class="inp num" inputmode="decimal" data-px="w" placeholder="${S.bw.length ? fmtN(wOut(S.bw[S.bw.length - 1].w)) : metric() ? 70 : 155}"></label>`, `<button class="btn pri full" data-a="bwSave">Save</button>`));
A.bwSave = () => {
  const d = $('[data-px=date]').value, v = parseFloat($('[data-px=w]').value.replace(',', '.'));
  if (!d || !v) return toast('Enter a weight');
  S.bw = S.bw.filter(x => x.d !== d); S.bw.push({ d, w: wIn(v) }); S.bw.sort((a, b) => a.d < b.d ? -1 : 1);
  persist('profile'); closeSheet(); render(); toast('Weight logged');
};
A.bwList = () => openSheet(sh('Body weight entries', `<div class="list">${[...S.bw].reverse().map(x => `<div class="li"><div class="grow"><div class="t num">${fmtN(wOut(x.w))} ${wU()}</div><div class="s">${dstr(new Date(x.d + 'T12:00').getTime())}</div></div><button class="ib" data-a="bwDel" data-d="${x.d}" style="color:var(--red)">${ic('trash')}</button></div>`).join('')}</div>`));
A.bwDel = el => { S.bw = S.bw.filter(x => x.d !== el.dataset.d); persist('profile'); closeSheet(); render(); };
A.tool1rm = () => open1rm();
A.wz = el => { const k = el.dataset.k, v = el.dataset.v; WZ[k] = k === 'units' ? v : +v; renderWelcome(); };
A.wzGo = () => {
  const z = WZ; WZ = null;
  S.settings.units = z.units; S.settings.inc = z.units === 'metric' ? 2.5 : 5 / KG_LB; S.settings.bar = z.units === 'metric' ? 20 : 45 / KG_LB;
  S.settings.weeklyGoal = z.goal; S.settings.onboarded = true;
  if (z.prog >= 0) A.addProgram({ dataset: { i: z.prog } }, true);
  persist('profile'); closeSheet(); render();
};
A.toolPlates = () => openPlates();

A.units = el => { const u = el.dataset.u; if (u === S.settings.units) return; S.settings.units = u; S.settings.inc = u === 'metric' ? 2.5 : 5 / KG_LB; S.settings.bar = u === 'metric' ? 20 : 45 / KG_LB; persist('profile'); render(); };
A.tog = el => { const k = el.dataset.k; S.settings[k] = !S.settings[k]; persist('profile'); render(); };
A.weekStart = el => { S.settings.weekStart = +el.dataset.v; persist('profile'); bump(); render(); };
A.step = el => {
  const k = el.dataset.k, d = +el.dataset.d, s = S.settings;
  if (k === 'rest') s.rest = Math.min(600, Math.max(15, s.rest + d * 15));
  if (k === 'weeklyGoal') s.weeklyGoal = Math.min(14, Math.max(1, s.weeklyGoal + d));
  if (k === 'inc') { const opts = metric() ? [0.5, 1, 1.25, 2, 2.5, 5] : [1, 2.5, 5, 10].map(x => x / KG_LB); let i = opts.findIndex(x => Math.abs(x - s.inc) < 0.01); if (i < 0) i = metric() ? 4 : 2; s.inc = opts[Math.min(opts.length - 1, Math.max(0, i + d))]; }
  if (k === 'bar') { const opts = metric() ? [7.5, 10, 15, 20, 25] : [15, 25, 35, 45].map(x => x / KG_LB); let i = opts.findIndex(x => Math.abs(x - s.bar) < 0.05); if (i < 0) i = metric() ? 3 : 3; s.bar = opts[Math.min(opts.length - 1, Math.max(0, i + d))]; }
  persist('profile'); render();
};
A.exportJson = () => exportJson();
A.remTog = async () => { const r = S.settings.remind; r.on = !r.on; persist('profile'); render(); if (r.on) { await scheduleReminders(true); toast('Reminders on'); } else scheduleReminders(false); };
A.remDay = el => { const r = S.settings.remind, d = +el.dataset.d; r.days = r.days.includes(d) ? r.days.filter(x => x !== d) : [...r.days, d].sort(); persist('profile'); render(); scheduleReminders(false); };
A.exportCsv = () => exportCsv();
A.eraseAll = async () => {
  const v = await ask('Erase everything?', 'All workouts, routines, custom exercises and body weight entries will be deleted from this device and your account. Export a backup first if you might want them.', [{ l: 'Erase all data', v: 1, cls: 'danger' }, { l: 'Cancel', v: null }]);
  if (!v) return;
  Object.keys(S.workouts).forEach(id => { delete S.workouts[id]; persist('w:' + id); });
  S.routines = []; S.custom = []; S.bw = []; S.active = null; S.settings = { ...DEFAULT_SETTINGS, onboarded: true };
  persist('profile'); persist('active'); stopRest(); tab('home'); toast('All data erased');
};

// inputs
document.addEventListener('input', e => {
  const el = e.target, k = el.dataset && el.dataset.in; if (!k) return;
  if (k === 'set') {
    const W = curW(), s = W.ex[+el.dataset.ei].sets[+el.dataset.si];
    s[el.dataset.f] = inVal(el.dataset.f, el.value, el.dataset.tu || null); touchW();
  } else if (k === 'wNote') { curW().notes = el.value; touchW(); autoGrow(el); }
  else if (k === 'exNote') { curW().ex[+el.dataset.ei].notes = el.value; touchW(); autoGrow(el); }
  else if (k === 'exQ') { UI.exQ = el.value; $('#exlist').innerHTML = exListHtml(UI.exQ, UI.exCat, null); }
  else if (k === 'pkQ') { PK.q = el.value; pkRefresh(); }
  else if (k === 'rdName') RD.name = el.value;
  else if (k === 'rdNotes') RD.notes = el.value;
  else if (k === 'rd') {
    const x = RD.ex[+el.dataset.i], f = el.dataset.f, t = getEx(x.exId).type, n = parseFloat(el.value.replace(',', '.'));
    if (f === 'reps') x.reps = el.value.trim() || null;
    else if (f === 'sets') x.sets = n > 0 ? Math.min(20, Math.round(n)) : null;
    else if (f === 'rest') x.rest = n > 0 ? Math.round(n) : null;
    else if (f === 'dist') x.dist = n > 0 ? dIn(n) : null;
    else if (f === 'time') x.time = n > 0 ? (t === 'tm' ? Math.round(n * 60) : Math.round(n)) : null;
  }
  else if (k === 'c1w' || k === 'c1r') calc1rm();
  else if (k === 'remTime') { if (el.value) { S.settings.remind.time = el.value; persist('profile'); clearTimeout(A._rt); A._rt = setTimeout(() => scheduleReminders(false), 600); } }
  else if (k === 'plw') calcPlates();
});
document.addEventListener('change', e => { const el = e.target; if (el.dataset && el.dataset.in === 'importFile' && el.files[0]) { importJson(el.files[0]); el.value = ''; } });
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && e.target.classList.contains('fin')) {
    e.preventDefault();
    const all = [...document.querySelectorAll('.fin')]; const i = all.indexOf(e.target);
    if (all[i + 1]) all[i + 1].focus(); else e.target.blur();
  }
});
function autoGrow(el) { el.style.height = 'auto'; el.style.height = Math.min(200, el.scrollHeight + 2) + 'px'; }

// ---------- boot ----------
function handleBack() {
  if ($('#layer').innerHTML) return closeSheet();
  if (nav.stack.length) return back();
  if (nav.tab !== 'home') return tab('home');
  try { Nat.app.minimizeApp(); } catch (e) { }
}
async function boot() {
  loadLocal();
  if (NATIVE) await loadNative();
  rebuildEx();
  if (S.active) nav.tab = 'log';
  render();
  setStatus(NATIVE ? 'device' : window.claude ? 'connecting' : 'local');
  setTimeout(connect, 0);
  if (NATIVE || !window.claude) maybeWelcome();
  if (NATIVE) {
    document.documentElement.classList.add('native');
    try {
      Nat.app.addListener('backButton', handleBack);
      Nat.app.addListener('pause', () => savePref());
      Nat.app.addListener('resume', () => { tick(); if (cur().s === 'home') render(); });
    } catch (e) { }
    await setupChannels();
    scheduleReminders(false);
  }
}
boot();
