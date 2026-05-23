#!/usr/bin/env python3
"""
Genera los iconos PNG necesarios para la PWA desde icon-source.svg.
Requiere cairosvg: pip install cairosvg
"""
import cairosvg
from pathlib import Path
import io
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "icon-source.svg"
OUT = ROOT / "icons"
OUT.mkdir(exist_ok=True)

# Iconos cuadrados con fondo transparente
sizes = {
    "icon-192.png": 192,
    "icon-512.png": 512,
    "apple-touch-icon.png": 180,
}

for name, size in sizes.items():
    cairosvg.svg2png(
        url=str(SRC),
        write_to=str(OUT / name),
        output_width=size,
        output_height=size,
    )
    print(f"  ✓ {name} ({size}×{size})")

# Maskable: el icono debe quedar en la "safe zone" (40% central según spec).
# Renderizamos el SVG al 60% del tamaño total y lo centramos sobre fondo teal sólido.
SIZE = 512
INNER = int(SIZE * 0.6)  # 307px - icono dentro
margin = (SIZE - INNER) // 2

png_bytes = cairosvg.svg2png(
    url=str(SRC),
    output_width=INNER,
    output_height=INNER,
)

inner = Image.open(io.BytesIO(png_bytes)).convert("RGBA")
# Fondo teal sólido (mismo que background_color del manifest sería raro; usamos el primary)
bg = Image.new("RGBA", (SIZE, SIZE), (13, 148, 136, 255))  # #0d9488
bg.paste(inner, (margin, margin), inner)
bg.save(OUT / "icon-512-maskable.png", "PNG")
print(f"  ✓ icon-512-maskable.png (512×512, safe zone 60%)")

print("\nIconos generados en:", OUT)
