"""Renders RepBook's launcher, round, adaptive-foreground and notification icons into android-res/."""
import pathlib
from playwright.sync_api import sync_playwright

ROOT = pathlib.Path(__file__).resolve().parent.parent
RES = ROOT / 'android-res'
BG, ACC = '#0d0e11', '#c6f24e'
# dumbbell drawn in a 108x108 box, tilted
DB = f'''<g transform="rotate(-35 54 54)" fill="{{c}}">
  <rect x="31" y="50.5" width="46" height="7" rx="3.5"/>
  <rect x="35" y="36" width="9" height="36" rx="4"/>
  <rect x="64" y="36" width="9" height="36" rx="4"/>
  <rect x="26" y="42" width="7" height="24" rx="3.5"/>
  <rect x="75" y="42" width="7" height="24" rx="3.5"/>
</g>'''

def svg(kind):
    if kind == 'fg':      # adaptive foreground: transparent, glyph inside the 66dp safe zone
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><g transform="translate(54 54) scale(.9) translate(-54 -54)">{DB.format(c=ACC)}</g></svg>'
    if kind == 'legacy':
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><rect x="4" y="4" width="100" height="100" rx="24" fill="{BG}"/><g transform="translate(54 54) scale(1.12) translate(-54 -54)">{DB.format(c=ACC)}</g></svg>'
    if kind == 'round':
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><circle cx="54" cy="54" r="50" fill="{BG}"/><g transform="translate(54 54) scale(1.08) translate(-54 -54)">{DB.format(c=ACC)}</g></svg>'
    if kind == 'stat':    # notification icon: white silhouette
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><g transform="translate(54 54) scale(1.3) translate(-54 -54)">{DB.format(c="#ffffff")}</g></svg>'
    if kind == 'store':
        return f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 108 108"><rect width="108" height="108" fill="{BG}"/><g transform="translate(54 54) scale(1.15) translate(-54 -54)">{DB.format(c=ACC)}</g></svg>'

DENS = {'mdpi': 1, 'hdpi': 1.5, 'xhdpi': 2, 'xxhdpi': 3, 'xxxhdpi': 4}
jobs = []
for d, k in DENS.items():
    jobs += [(f'mipmap-{d}/ic_launcher.png', 'legacy', int(48 * k)),
             (f'mipmap-{d}/ic_launcher_round.png', 'round', int(48 * k)),
             (f'mipmap-{d}/ic_launcher_foreground.png', 'fg', int(108 * k)),
             (f'drawable-{d}/ic_stat_repbook.png', 'stat', int(24 * k))]
jobs.append(('../icon-src/icon-512.png', 'store', 512))

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    for rel, kind, size in jobs:
        pg.set_viewport_size({'width': size, 'height': size})
        pg.set_content(f'<html><body style="margin:0;background:transparent">{svg(kind).replace("<svg ", f"<svg width=\"{size}\" height=\"{size}\" ", 1)}</body></html>')
        out = (RES / rel).resolve()
        out.parent.mkdir(parents=True, exist_ok=True)
        pg.screenshot(path=str(out), omit_background=True, clip={'x': 0, 'y': 0, 'width': size, 'height': size})
    b.close()
print('icons done')
