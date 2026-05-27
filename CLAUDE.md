# HidratIV — Hidratación IV Pediátrica (PWA)

## Qué es este proyecto
PWA de un solo archivo (`index.html`) para calcular pautas de rehidratación intravenosa en urgencias pediátricas. Sin servidor, backend ni dependencias externas. Todo el código — HTML, CSS y JS — vive en `index.html`.

**URL pública:** https://cjgaland.github.io/Rehidrataci-n-pediatr-a/
**Repositorio:** https://github.com/cjgaland/Rehidrataci-n-pediatr-a.git
**Rama de despliegue:** `main` (GitHub Pages sirve desde la raíz de `main`)

## Estructura del proyecto
```
index.html              # App completa (HTML + CSS + JS inline)
sw.js                   # Service Worker (cache-first, offline)
manifest.webmanifest    # Manifiesto PWA
icons/                  # Iconos PWA (192, 512, 512-maskable, apple-touch)
scripts/                # Utilidades de generación de iconos (Python)
```

## Cómo probar localmente
```bash
npx serve -l 8099 .
# → http://localhost:8099
```
Requiere servidor HTTP; el SW no funciona con `file://`.
El servidor está configurado en `.claude/launch.json` para el preview de Claude Code.

## Lógica clínica implementada

### Escala de Gorelick (10 ítems)
Cada ítem marcado suma 1 punto:
- 0 pts → Sin deshidratación
- 1-2 pts → Leve (≈ 4%)
- 3-5 pts → Moderada (≈ 7%)
- 6-10 pts → Grave (≈ 10%)

### Holliday-Segar (necesidades basales)
- ≤ 10 kg → 100 ml/kg/día
- 10-20 kg → 1000 + 50 ml/kg >10
- > 20 kg → 1500 + 20 ml/kg >20

### Estrategia de rehidratación (`determineStrategy`)
1. **Solo basales** — Gorelick = 0
2. **RHO** — Leve/moderada sin contraindicaciones
3. **RIR** — Grave sin contraindicaciones (20 ml/kg/h, máx 700 ml/h)
4. **IV clásica** — Con alguna contraindicación: edad < 3 meses, Na+ alterado (< 130 o > 150 mEq/L), comorbilidad/inestabilidad

### Tipos de natremia
- Hiponatrémica: Na+ < 130 mEq/L
- Isonatrémica: 130-150 mEq/L
- Hipernatrémica: > 150 mEq/L → reposición 48 h, descenso ≤ 0,5 mEq/L/h

## Funcionalidades de UI
- **Dark/light mode** — toggle luna/sol en la cabecera; respeta `prefers-color-scheme`; preferencia guardada en `localStorage` con clave `hidrativ-theme`
- **Sección Bibliografía** — acordeón colapsado al pie; 3 referencias con enlaces a PDF/DOI
- **Informe copiable** — texto plano para pegar en historia clínica; editable antes de copiar
- **Enter para calcular** — desde cualquier campo numérico
- **PWA instalable** — Service Worker cache-first, banner de actualización automático al detectar nueva versión

## Versionado y despliegue

### Dónde vive la versión
La versión se mantiene en **dos lugares** que deben estar siempre sincronizados:
1. `sw.js` → constante `CACHE_VERSION` (ej. `'v1.0.0'`)
2. `index.html` → div `.app-autor` al pie (ej. `HidratIV v1.0.0 · 2026 · por Carlos J. Galán Doval`)

El incremento de `CACHE_VERSION` es lo que activa la actualización automática del Service Worker en los dispositivos de los usuarios finales, sin que tengan que vaciar la caché manualmente.

### Comando de despliegue
Cuando el usuario escriba **"Despliega"**, **"Deploy"**, **"Publica la app"** o expresiones equivalentes, ejecutar este flujo exacto sin pedir confirmación adicional:

**Paso 1 — Leer versión actual**
Leer el valor de `CACHE_VERSION` en `sw.js`.

**Paso 2 — Calcular nueva versión**
Incrementar el número de parche (patch): `v1.0.0` → `v1.0.1`, `v1.2.9` → `v1.2.10`.

**Paso 3 — Actualizar `sw.js`**
Sustituir `CACHE_VERSION = 'vX.X.X'` por la nueva versión.

**Paso 4 — Actualizar `index.html`**
Sustituir la versión en el texto del div `.app-autor`, manteniendo el formato:
`HidratIV vX.X.X · 2026 · por Carlos J. Galán Doval`

**Paso 5 — Commit**
```bash
git add sw.js index.html
git commit -m "$(cat <<'EOF'
chore: deploy vX.X.X

Co-Authored-By: Claude Sonnet 4.6 <noreply@anthropic.com>
EOF
)"
```

**Paso 6 — Push**
```bash
git push origin main
```

GitHub Pages publica automáticamente en https://cjgaland.github.io/Rehidrataci-n-pediatr-a/ al recibir el push. Los usuarios verán el banner "Nueva versión disponible" en su próxima visita y podrán actualizar con un toque.

### Primer push al repositorio remoto
Si el repo remoto está vacío (primera vez):
```bash
git add index.html sw.js manifest.webmanifest icons/ scripts/ .gitignore README.md CLAUDE.md
git commit -m "chore: initial deploy v1.0.0"
git push -u origin main
```

## Bibliografía base
- García Herrero et al. (2024). SEUP, Protocolos 4.ª ed., Cap. 17. → lógica principal, sueros, indicaciones
- Mora-Capín et al. (2022). An Pediatr 96(6):523-535. → criterios RIR, documento GRADE
- Manrique-Martínez et al. (2011). An Pediatr Cont 9(2):106-115. → contexto histórico de las nuevas pautas

## Convenciones de código
- JS vanilla ES5 en IIFE (sin módulos, sin bundler) — compatibilidad máxima móvil
- CSS con variables custom en `:root`; paleta teal/cyan (`--primary`, `--accent`)
- Dark mode: bloque `html.dark { }` + `@media (prefers-color-scheme: dark) { html:not(.light) { } }`
- Prefijos `-webkit-` mantenidos para iOS Safari
- `fmt(n, dec)` — formatea números en `es-ES`
- `buildReportText(d)` — genera texto plano para informe clínico

## Mejoras pendientes identificadas
- Reemplazar `alert()` de validación por mensajes inline (mejor UX en móvil)
- Añadir `aria-label` descriptivos a cada toggle de la escala Gorelick
- Añadir `aria-live="polite"` al marcador de puntuación Gorelick
- Validación de rangos fisiológicos imposibles (Na+ < 100, peso > 150 kg…)
