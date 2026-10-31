"""Builds RepBook into one HTML file.

  python3 build.py            -> dist/index.html  (web version, published as a Claude artifact)
  python3 build.py --native   -> www/index.html   (Android app, wrapped by Capacitor)
"""
import os
import pathlib
import sys

root = pathlib.Path(__file__).parent
src = root / 'src'
native = '--native' in sys.argv
version = os.environ.get('VERSION_NAME', '1.0')

fonts = '' if native else (
    '<link rel="preconnect" href="https://fonts.googleapis.com">'
    '<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">'
)
cap = f'<script>window.REPBOOK_VERSION={version!r};</script><script src="capacitor.js"></script>' if native else ''

html = f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,user-scalable=no">
<meta name="theme-color" content="#0d0e11">
<title>RepBook — Workout Tracker</title>
{fonts}
<style>{(src / 'style.css').read_text()}</style></head>
<body><div id="app"></div><nav class="nav" id="nav"></nav><div id="layer"></div><div class="toast" id="toast"></div>
{cap}
<script>{(src / 'data.js').read_text()}
{(src / 'app.js').read_text()}</script></body></html>'''

out = root / ('www' if native else 'dist')
out.mkdir(exist_ok=True)
(out / 'index.html').write_text(html)
print(f'built {out / "index.html"} ({len(html):,} bytes)')
