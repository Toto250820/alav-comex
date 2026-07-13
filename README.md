# ALAV COMEX — Gestión Aduanera (PWA)

Tu app ahora es instalable (ícono en el celu/PC, funciona offline) y está lista para publicarse en GitHub Pages.

## Qué se agregó

- `manifest.json` — define nombre, íconos y modo "app" (sin barra del navegador)
- `service-worker.js` — cachea la app para que abra rápido y funcione sin conexión. **Nunca cachea Supabase**: los datos siempre se leen en vivo cuando hay internet.
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` — íconos de la app
- `index.html` — tu archivo original, con el registro del service worker y los meta tags de instalación agregados (la lógica interna no se tocó)

## Cómo subirla a tu repo de GitHub

1. Copiá estos 5 archivos (`index.html`, `manifest.json`, `service-worker.js`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`) a tu repo, reemplazando el HTML viejo.
   - **Importante:** el archivo principal tiene que llamarse exactamente `index.html` y estar en la raíz del repo (o en la carpeta que hayas configurado como fuente de Pages).
2. Hacé commit y push.
3. En tu repo de GitHub: **Settings → Pages**.
   - En "Build and deployment" → Source: **Deploy from a branch**.
   - Branch: `main` (o la que uses), carpeta `/ (root)`.
   - Guardá.
4. GitHub te va a dar una URL tipo:
   `https://tu-usuario.github.io/nombre-del-repo/`
   (puede tardar 1-2 minutos en activarse la primera vez).
5. Entrá a esa URL desde el celu:
   - **Android/Chrome:** aparece un cartel de "Agregar a pantalla de inicio", o desde el menú (⋮) → "Instalar app".
   - **iPhone/Safari:** botón compartir (□↑) → "Agregar a pantalla de inicio".
   - **PC/Chrome o Edge:** ícono de instalar (⊕) en la barra de direcciones.

## Actualizaciones futuras

Cada vez que hagas push de cambios al HTML, el service worker los va a detectar y actualizar la app la próxima vez que se abra (puede necesitar cerrar y volver a abrir una vez para que tome la versión nueva).

## Nota sobre Supabase

Como el backend ya es Supabase, no hace falta servidor propio: GitHub Pages solo sirve los archivos estáticos, y la app se conecta a Supabase directamente desde el navegador, igual que antes.
