#!/usr/bin/env python3
"""Génère autonome/index.html et autonome/biens.html : chaque page embarque
son CSS, ses scripts, ses polices et ses images (lisibles sans dossier assets,
par exemple ouvertes directement sur un téléphone)."""
import base64, re, subprocess, pathlib, tempfile

ROOT = pathlib.Path(__file__).parent
OUT = ROOT / "autonome"
OUT.mkdir(exist_ok=True)
_cache = {}

def data_uri(path, mime, recompress=False):
    key = (str(path), recompress)
    if key not in _cache:
        raw = path.read_bytes()
        if recompress:  # images allégées pour garder des pages légères
            with tempfile.NamedTemporaryFile(suffix=".jpg") as t:
                subprocess.run(["convert", str(path), "-resize", "1400x1400>", "-quality", "62",
                                "-sampling-factor", "4:2:0", "-strip", "-interlace", "JPEG", t.name], check=True)
                raw = pathlib.Path(t.name).read_bytes()
        _cache[key] = "data:%s;base64,%s" % (mime, base64.b64encode(raw).decode())
    return _cache[key]

def img(rel):
    return data_uri(ROOT / rel, "image/jpeg", recompress=True)

css = (ROOT / "assets/css/style.css").read_text()
css = re.sub(r'url\("\.\./fonts/([^"]+)"\)', lambda m: 'url("%s")' % data_uri(ROOT / "assets/fonts" / m.group(1), "font/woff2"), css)
css = re.sub(r'url\("\.\./img/([^"]+)"\)', lambda m: 'url("%s")' % img("assets/img/" + m.group(1)), css)
main_js = (ROOT / "assets/js/main.js").read_text()
biens_js = (ROOT / "assets/js/biens.js").read_text()

for page in ["index.html", "biens.html"]:
    html = (ROOT / page).read_text()
    html = html.replace('<link rel="stylesheet" href="assets/css/style.css">', "<style>\n" + css + "\n</style>")
    # L'accueil n'affiche que les 3 premiers biens : inutile d'embarquer les autres photos
    shown = [0]
    def bien_img(m):
        shown[0] += 1
        return '"%s"' % img(m.group(1)) if page == "biens.html" or shown[0] <= 3 else '""'
    js_biens = re.sub(r'"(assets/img/[^"]+)"', bien_img, biens_js)
    html = html.replace('<script src="assets/js/biens.js"></script>', "<script>\n" + js_biens + "\n</script>")
    html = html.replace('<script src="assets/js/main.js"></script>', "<script>\n" + main_js + "\n</script>")
    html = re.sub(r'src="(assets/img/[^"]+)"', lambda m: 'src="%s"' % img(m.group(1)), html)
    (OUT / page).write_text(html)
    left = re.findall(r'(?:src|href)="assets/[^"]+"', html)
    print(page, round(len(html) / 1e6, 2), "Mo", "— références restantes :", left)
