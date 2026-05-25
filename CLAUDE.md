# HidratIV — Hidratación IV Pediátrica (PWA)

## Qué es este proyecto
PWA de un solo archivo (`index.html`) para calcular pautas de rehidratación intravenosa en urgencias pediátricas. No tiene servidor, backend ni dependencias externas. Todo el código — HTML, CSS y JS — vive en `index.html`.

## Estructura del proyecto
```
index.html          # App completa (HTML + CSS + JS inline)
sw.js               # Service Worker (cache-first, offline)
manifest.webmanifest
icons/              # Iconos PWA (192, 512, 512-maskable, apple-touch)
scripts/            # Utilidades de generación de iconos (Python)
```

## Cómo probar localmente
Necesita un servidor HTTP (no funciona abriendo el archivo directamente por restricciones del SW):
```bash
python3 -m http.server 8080
# → http://localhost:8080
```
O con Node: `npx serve .`

## Lógica clínica implementada

### Escala de Gorelick (10 ítems)
Cada ítem marcado suma 1 punto. La puntuación determina la gravedad:
- 0 pts → Sin deshidratación
- 1-2 pts → Leve (≈ 4%)
- 3-5 pts → Moderada (≈ 7%)
- 6-10 pts → Grave (≈ 10%)

### Necesidades basales: Holliday-Segar
- ≤ 10 kg: 100 ml/kg/día
- 10-20 kg: 1000 + 50 ml por cada kg > 10
- > 20 kg: 1500 + 20 ml por cada kg > 20

### Estrategia de rehidratación (función `determineStrategy`)
1. **Solo basales** — Gorelick = 0
2. **RHO** (rehidratación oral) — Leve/moderada sin contraindicaciones
3. **RIR** (IV rápida, 20 ml/kg/h, máx 700 ml/h) — Grave sin contraindicaciones
4. **IV clásica** — Si alguna contraindicación: edad < 3 meses, natremia alterada (< 130 o > 150 mEq/L), o comorbilidad/inestabilidad hemodinámica

### Tipos de natremia
- Hiponatrémica: Na+ < 130 mEq/L
- Isonatrémica: 130-150 mEq/L
- Hipernatrémica: > 150 mEq/L (reposición en 48 h, descenso ≤ 0,5 mEq/L/h)

## Bibliografía base
- García Herrero et al. (2024). SEUP, Protocolos 4.ª ed., Cap. 17. → lógica principal, sueros, indicaciones
- Mora-Capín et al. (2022). An Pediatr 96(6):523-535. → criterios RIR, documento GRADE
- Manrique-Martínez et al. (2011). An Pediatr Cont 9(2):106-115. → contexto histórico de las nuevas pautas

## PWA / Service Worker
- Estrategia cache-first con fallback a red
- Para publicar una actualización: incrementar `CACHE_VERSION` en `sw.js`
- El banner de actualización se activa automáticamente cuando hay nueva versión instalada

## Convenciones de código
- JS vanilla ES5 en IIFE (sin módulos, sin bundler) para máxima compatibilidad móvil
- CSS con variables custom en `:root`; paleta teal/cyan (`--primary`, `--accent`)
- Prefijos `-webkit-` mantenidos para compatibilidad iOS Safari
- `fmt(n, dec)` — función local para formatear números en `es-ES`
- `buildReportText(d)` — genera el texto plano para copiar al informe clínico

## Mejoras pendientes identificadas
- Reemplazar `alert()` de validación por mensajes inline (mejor UX en móvil)
- Implementar `prefers-color-scheme` para dark mode
- Añadir `aria-label` descriptivos a cada toggle de la escala Gorelick
- Añadir `aria-live="polite"` al marcador de puntuación Gorelick
- Considerar separar CSS y JS en archivos propios si el HTML supera ~1500 líneas
