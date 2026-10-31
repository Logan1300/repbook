// Applies RepBook's branding, permissions and signing to the Capacitor-generated android/ project.
// Run after `npx cap add android`.
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..');
const app = path.join(root, 'android', 'app');
const res = path.join(app, 'src', 'main', 'res');
const must = (cond, msg) => { if (!cond) { console.error('patch-android: ' + msg); process.exit(1); } };

// 1. icons, notification icon, theme + colours
const copyDir = (from, to) => {
  for (const e of fs.readdirSync(from, { withFileTypes: true })) {
    const a = path.join(from, e.name), b = path.join(to, e.name);
    if (e.isDirectory()) { fs.mkdirSync(b, { recursive: true }); copyDir(a, b); } else fs.copyFileSync(a, b);
  }
};
copyDir(path.join(root, 'android-res'), res);

// 2. permissions
const manifestPath = path.join(app, 'src', 'main', 'AndroidManifest.xml');
let manifest = fs.readFileSync(manifestPath, 'utf8');
const perms = [
  '<uses-permission android:name="android.permission.VIBRATE" />',
  '<uses-permission android:name="android.permission.POST_NOTIFICATIONS" />',
  '<uses-permission android:name="android.permission.USE_EXACT_ALARM" />',
  '<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM" android:maxSdkVersion="32" />',
  '<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED" />'
].filter(p => !manifest.includes(p.split('"')[1]));
must(manifest.includes('</manifest>'), 'manifest not found');
manifest = manifest.replace('</manifest>', '    ' + perms.join('\n    ') + '\n</manifest>');
manifest = manifest.replace('<activity', '<activity\n            android:windowSoftInputMode="adjustResize"');
fs.writeFileSync(manifestPath, manifest);

// 3. signing + version
const gradlePath = path.join(app, 'build.gradle');
let g = fs.readFileSync(gradlePath, 'utf8');
must(/versionCode \d+/.test(g) && /versionName "[^"]*"/.test(g), 'version lines not found in app/build.gradle');
g = g.replace(/versionCode \d+/, 'versionCode Integer.parseInt(System.getenv("VERSION_CODE") ?: "1")')
     .replace(/versionName "[^"]*"/, 'versionName (System.getenv("VERSION_NAME") ?: "1.0")');
const signing = `
    signingConfigs {
        release {
            storeFile file(System.getenv("RB_KEYSTORE") ?: "../../keystore/repbook-release.jks")
            storePassword System.getenv("RB_STORE_PASSWORD")
            keyAlias System.getenv("RB_KEY_ALIAS") ?: "repbook"
            keyPassword System.getenv("RB_STORE_PASSWORD")
        }
    }
`;
must(/android\s*\{/.test(g), 'android block not found');
g = g.replace(/android\s*\{/, m => m + signing);
must(/buildTypes\s*\{\s*release\s*\{/.test(g), 'release buildType not found');
g = g.replace(/buildTypes\s*\{\s*release\s*\{/, m => m + '\n            signingConfig signingConfigs.release');
fs.writeFileSync(gradlePath, g);

console.log('patch-android: done (' + perms.length + ' permissions added)');
