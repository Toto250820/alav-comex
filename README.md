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

## Colaboración: "quién está trabajando ahora"

Se agregó un sistema liviano para uso simultáneo entre varias personas:

- **Badge de presencia** (arriba a la derecha del header): muestra quién más tiene la app abierta y en qué sección está.
- **Alerta de conflicto**: si dos personas están en la misma salida al mismo tiempo, aparece un aviso.
- **Banner de novedades**: si alguien más creó/modificó una salida o un borrador mientras vos tenías la página abierta, aparece "Hay novedades — Actualizar ahora" (vos elegís cuándo recargar, para no perder lo que estás completando).

Esto **no es sincronización instantánea carácter por carácter** (no es Google Docs real), es un chequeo periódico cada 15-20 segundos. Para la mayoría de los casos de uso (una persona armando una salida, otra consultando stock) alcanza y sobra.

### Paso obligatorio: crear la tabla en Supabase

Antes de que esto funcione, tenés que correr un SQL una sola vez:

1. Entrá a [supabase.com](https://supabase.com) → tu proyecto (`itdgwactnogeilxnqdsy`)
2. Menú lateral → **SQL Editor** → **New query**
3. Pegá el contenido de `presence_setup.sql` (incluido en esta carpeta)
4. **Run**

Si no corrés este paso, la app funciona igual que antes — el sistema de presencia simplemente queda desactivado en silencio (no rompe nada, no tira errores visibles).

La primera vez que cada persona abre la app, le va a pedir el nombre (una sola vez, queda guardado en ese dispositivo).

## Cargar despachos por PDF (sin PIN, para cuando Javi no está)

Se agregó una página separada, **`cargar-despacho.html`**, para cargar stock nuevo (ZFI6/ZFI8) sin pasar por el panel de Admin ni el PIN. Se accede desde el link **"📄 Cargar despacho (PDF)"** en el header de la app, o directamente en:

`https://toto250820.github.io/alav-comex/cargar-despacho.html`

### Cómo funciona

1. Cualquiera de las 3 personas (Javier/Marina/Carina) elige su nombre.
2. Sube el PDF del despacho (ARCA, ZFI6 o ZFI8) — arrastrando o tocando para elegir el archivo.
3. La app lo lee sola: identifica el despacho, la fecha, los ítems, cantidades, kilos, FOB y calcula el CIF automáticamente.
4. Cada ítem se clasifica por material según el código NCM:
   - 🟢 **Verde ("auto")**: el NCM identifica el material sin ambigüedad (ej. Bolsa PVC, Guata, Hilo, TNT, Bies, Poliamida, Insert, Manta) — no hace falta tocar nada.
   - 🟡 **Amarillo ("elegir")**: el NCM es compartido por varios materiales (ej. Corderito/Terciopelo/Funda comparten un mismo código, igual que Microfibra 90g/100g) — hay que elegir de un desplegable antes de poder confirmar. La app intenta adivinar, pero siempre revisable.
5. Todo queda editable en una tabla antes de guardar — cantidad, kilos, FOB, CIF, detalle, marca de "sospechoso". Nada se carga al stock hasta tocar **"Confirmar y cargar a stock"**.
6. Si el despacho ya estaba cargado, avisa antes de sobreescribir.

### Precisión de los datos extraídos

Se probó y validó campo por campo contra despachos reales ya cargados en tu stock — despacho, fecha, cantidades, kilos, FOB y CIF calculado coinciden exactamente. Aun así, como cualquier lector automático, **conviene pegarle una revisada rápida a los números antes de confirmar**, sobre todo en despachos con formato poco común.

### Nota sobre seguridad

Esta página **no pide PIN** a propósito, para que cualquiera de las 3 personas pueda cargar despachos sin depender de Javi. Si en algún momento querés protegerla igual, avisame y le agrego el mismo PIN que usa el panel de Admin.

## ET19: vencimiento de reimportación (22 meses)

La misma herramienta (`cargar-despacho.html`) detecta sola si el PDF que subiste es un **ET19** (en vez de un ZFI6/ZFI8). En ese caso no toca el stock — en cambio:

1. Lee la fecha de oficialización del ET19.
2. Calcula el vencimiento: **oficialización + 22 meses** (es el plazo para reimportarlo como ZFI6).
3. Te muestra un botón **"Agregar a Google Calendar"** que abre el evento ya armado — con los **3 mails precargados como invitados** (Javier, Marina, Carina), así a los tres les queda el aviso en su calendario apenas alguien lo confirma.

No hace falta que configures nada: el link de Google Calendar no requiere que autoricen ninguna app, simplemente abre la pantalla de "crear evento" de Google ya completa — un clic en "Guardar" (o "Enviar" si pide confirmar invitados) y queda listo en los 3 calendarios.

Los 3 mails están fijos en el código de la herramienta:
- javis.spinelli@gmail.com
- alav.pico@gmail.com
- admi.alavpico02@gmail.com

Si en algún momento cambia alguno de estos mails, avisame y te actualizo el archivo.
