# RepBook — workout tracker for Android

A minimal, offline workout log for **every kind of training**: weight training, calisthenics, cardio, HIIT, yoga/mobility and sports (243 built-in exercises, plus your own).

## Install on your phone

1. Open **[Releases](../../releases/latest)** on your Android phone.
2. Tap **RepBook-1.0.x.apk** to download it, then open it.
3. If Android asks, allow your browser/Files app to **install unknown apps**, then tap **Install**.

New versions install over the old one — your workouts are kept.

## What it does

- **Know what's next** — routines run in order (e.g. Push → Pull → Legs); Home shows what's up next and when you last did it, plus which muscles are rested.
- **Fast logging** — last session's numbers appear next to every set and are pre-filled; tick a set and the rest timer starts.
- **Progressive overload** — hit the top of your rep range on every set and it suggests adding weight (or a rep).
- **Rest timer** that alerts you on the lock screen, with vibration.
- **Workout reminders** on the days you choose.
- **Screen stays on** during a workout.
- **PRs**, per-exercise charts (est. 1RM, max weight, volume, pace), weekly goal & streak, sets per muscle, body weight.
- **History** as a list or calendar; edit, repeat or copy any workout; log past workouts.
- **Ready-made programs** (PPL, Upper/Lower, Full Body, Calisthenics, Cardio, Mobility) and a routine builder.
- **Tools** — 1RM calculator, plate calculator.
- **Backups** — export JSON (restore anytime) or CSV (Excel/Sheets) via the share sheet; import a backup.

Your data stays on your phone. No account, no ads.

## How it's built

- `src/` — the whole app (vanilla JS, no framework): `data.js` (exercise library & programs), `app.js`, `style.css`.
- `build.py` — bundles `src/` into one HTML file (`--native` for the Android build).
- `capacitor.config.json`, `scripts/patch-android.mjs`, `android-res/` — Android wrapper (Capacitor 8), icons and permissions.
- `.github/workflows/build-apk.yml` — every push to `main` builds a signed APK and publishes it as a Release.
- `keystore/` — the signing key, so each build installs as an update of the last one.
