# Hidratación IV Pediátrica · PWA

Calculadora clínica de apoyo a la decisión para la rehidratación intravenosa pediátrica en el contexto de gastroenteritis aguda. Implementa la **Escala de Gorelick**, la fórmula de **Holliday-Segar** y el algoritmo de **Rehidratación Intravenosa Rápida (RIR)** según las recomendaciones más actuales.

Aplicación web autocontenida, instalable como PWA en iOS y Android, con funcionamiento **offline completo** una vez instalada.

---

## Referencias clínicas

- García Herrero MA, López López R, Guibert Zafra B. **Deshidratación en contexto de gastroenteritis aguda.** En: *Protocolos diagnósticos y terapéuticos en Urgencias de Pediatría*. SEUP, 4ª ed. Febrero 2024.
- Mora-Capín A, López-López R, Guibert-Zafra B, et al. **Documento de recomendaciones sobre la rehidratación intravenosa rápida en gastroenteritis aguda.** *An Pediatr (Engl Ed)*. 2022;96(6):523-535. (Metodología GRADE).
- Gorelick MH, Shaw KN, Murphy KO. Validity and reliability of clinical signs in the diagnosis of dehydration in children. *Pediatrics*. 1997;99(5):E6.

---

## ⚠️ Aviso legal

Esta aplicación es una **herramienta de apoyo a la decisión clínica**. **No sustituye al criterio médico** ni a la valoración individualizada del paciente. El profesional sanitario es responsable de verificar los cálculos y de adaptarlos al contexto clínico concreto y a las guías locales de su centro.

---

## 📂 Estructura del proyecto

```
.
├── index.html                  # Aplicación principal (autocontenida)
├── manifest.webmanifest        # Manifest de la PWA
├── sw.js                       # Service Worker (offline)
├── icon-source.svg             # SVG fuente del icono
├── README.md
├── .gitignore
├── scripts/
│   └── generate-icons.py       # Script para regenerar iconos desde SVG
└── icons/
    ├── icon-192.png            # Android (192×192)
    ├── icon-512.png            # Android alta resolución (512×512)
    ├── icon-512-maskable.png   # Android adaptive icons
    └── apple-touch-icon.png    # iOS home screen (180×180)
```

---

## 🚀 Despliegue en GitHub Pages

Pasos para publicar la app y obtener una URL pública:

### 1. Crear el repositorio en GitHub
- Entra en [github.com](https://github.com) y crea un nuevo repositorio (botón **New**).
- Nombre sugerido: `hidratacion-iv-pediatrica` (o el que prefieras).
- Visibilidad: **Public** (gratis) o **Private** (Pages funciona también en privado si tienes cuenta Pro).
- **No** marques "Initialize with README" — ya tienes uno.

### 2. Subir el código

Desde la carpeta del proyecto en tu MacBook:

```bash
git init
git add .
git commit -m "Initial commit: PWA Hidratación IV Pediátrica v1.0.0"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

### 3. Activar GitHub Pages
En la página del repo en GitHub:
1. **Settings** → **Pages** (menú lateral izquierdo).
2. **Source**: *Deploy from a branch*.
3. **Branch**: `main` · **Folder**: `/ (root)` → **Save**.
4. Espera 1–2 minutos. GitHub te mostrará la URL pública:

   ```
   https://TU_USUARIO.github.io/TU_REPO/
   ```

5. Comparte ese enlace con tus colegas por WhatsApp, email o donde prefieras. Un enlace no se corrompe al pasar por mensajería.

---

## 📱 Instalación en el dispositivo

### iPhone / iPad (iOS 16.4+)
1. Abre la URL en **Safari** (no funciona desde Chrome o WhatsApp).
2. Toca el botón **Compartir** (cuadrado con flecha hacia arriba).
3. Desplázate y selecciona **Añadir a pantalla de inicio**.
4. Toca **Añadir**. Aparecerá el icono en la pantalla de inicio.
5. Al abrirla desde el icono, se comportará como app nativa (sin barra de Safari).

### Android (Chrome / Edge / Samsung Internet)
1. Abre la URL en **Chrome** u otro navegador moderno.
2. Aparecerá un banner "Añadir a pantalla de inicio". Si no aparece: menú (⋮) → **Instalar app** o **Añadir a pantalla de inicio**.
3. Listo: app instalada con icono propio.

Una vez instalada, **funciona sin conexión** indefinidamente. La primera carga online cachea todos los recursos.

---

## 🔄 Cómo publicar una actualización

Cuando hagas cambios en el código:

1. Modifica los ficheros que necesites (`index.html`, etc.).
2. **Importante**: edita `sw.js` y sube la versión del cache:
   ```js
   const CACHE_VERSION = 'v1.0.1';  // antes era v1.0.0
   ```
3. Commit y push:
   ```bash
   git add .
   git commit -m "v1.0.1: descripción del cambio"
   git push
   ```

GitHub Pages se actualiza en 1-2 minutos. La próxima vez que cada usuario abra la app (con conexión), verá un pequeño banner **"Nueva versión disponible"** en la parte inferior. Al pulsar **Actualizar**, la app recarga con la versión nueva en menos de un segundo.

---

## 🛠️ Regenerar iconos

Si modificas `icon-source.svg`, regenera los PNG:

```bash
pip install cairosvg pillow
python3 scripts/generate-icons.py
```

---

## 🧪 Probar en local antes de desplegar

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000/` en tu navegador. Para probar el funcionamiento offline:
1. Carga la página una vez con conexión.
2. Abre DevTools → Application → Service Workers → confirma que está activo.
3. Application → Service Workers → marca **Offline**.
4. Recarga: la app debe seguir funcionando.

---

## Licencia y autoría

Desarrollado para uso clínico interno. Verificar siempre con guías locales y criterio médico antes de aplicar las recomendaciones.

**Versión actual:** v1.0.0
