# Guía completa desde 0: de la idea a la web publicada

Esta es LA guía. Si sigues estos pasos en orden, acabas con la web de un cliente publicada en su dominio con HTTPS y auto-deploy. La primera vez tardarás ~1 hora (por las cuentas y tokens); a partir de la segunda web, minutos.

---

## PARTE A — Preparación (solo la primera vez)

### A1. Token de GitHub (para que el builder cree repos y haga push solo)

1. Entra en GitHub → tu avatar → **Settings**.
2. Abajo del todo: **Developer settings**.
3. **Personal access tokens → Fine-grained tokens → Generate new token**.
4. Nombre: `astro-builder`. Expiración: 1 año. Repository access: **All repositories**.
5. En **Permissions → Repository permissions** activa:
   - `Administration`: **Read and write** (para crear repos)
   - `Contents`: **Read and write** (para hacer push)
6. Genera y **copia el token** (empieza por `github_pat_…`). Solo se muestra una vez.

### A2. API key de Dokploy

1. Entra en tu panel Dokploy (`https://dokploy.tudominio.com`).
2. Menú de usuario / **Settings** → **API/CLI** (o "API Keys").
3. Crea una key y cópiala.

### A3. IDs de Dokploy (una vez por servidor)

- **Environment ID**: en Dokploy todo proyecto tiene environments (por defecto "production"). Entra en tu proyecto → environment → el ID está en la URL o en `https://dokploy.tudominio.com/swagger` (endpoint `project.all`). Es un texto tipo `clx…`.
- **Server ID**: solo si tu Dokploy gestiona varios servidores (si no, déjalo vacío).
- **GitHub Provider ID**: para el auto-deploy por push, Dokploy necesita estar conectado a tu GitHub:
  1. Dokploy → **Settings → Git providers → GitHub → Connect**.
  2. Instala la GitHub App en tu cuenta (dale acceso a todos los repos o a los que uses).
  3. El ID del provider aparece en esa pantalla (o en Swagger, endpoint `github.githubProviders`).

### A4. Exportar los tokens en la terminal

⚠️ **Clave**: los tokens deben estar en la MISMA terminal donde arrancas el builder, porque "Montar web" hereda ese entorno.

```powershell
$env:GITHUB_TOKEN="github_pat_xxxxx"
$env:DOKPLOY_API_TOKEN="xxxxx"
cd "C:\Users\Paula Losciale\Desktop\astro-templates"
npm run dev
```

Para no repetirlo cada vez, puedes guardarlos permanentes (una sola vez):

```powershell
[Environment]::SetEnvironmentVariable("GITHUB_TOKEN","github_pat_xxxxx","User")
[Environment]::SetEnvironmentVariable("DOKPLOY_API_TOKEN","xxxxx","User")
```

(cierra y reabre la terminal después).

---

## PARTE B — Crear la web en el builder

Arranca con `npm run dev` y abre `http://localhost:4321`. El panel izquierdo son los pasos; la derecha es la web real (cambia según eliges). Puedes verla en móvil 📱, abrirla en pestaña nueva ↗ y cambiar de página con las pestañas.

### Paso 1 — Negocio
Datos del cliente: la **marca visible** sale en navbar/footer, el **email/teléfono/dirección** van a config y contacto, la **descripción** alimenta el SEO y las páginas legales. **Idiomas**: elige el principal y añade extras (genera `/en/…` con selector flotante y hreflang; los textos salen en el idioma principal y los traduces al personalizar). El **nombre del proyecto** es el nombre de la carpeta y del repo (usa minúsculas y guiones: `restaurante-lumbre`).

### Paso 2 — Páginas
Agrupadas en: **Esenciales** (inicio, servicios, sobre, contacto), **Contenido** (portfolio, galería, equipo, blog, precios, FAQ), **Sectores** (carta/menú para restaurantes, reservas, cómo llegar) y **Legal** (aviso legal, privacidad, cookies). 💡 Si la web tiene formulario o cookies, en España las 3 legales son obligatorias — inclúyelas siempre.

### Paso 3 — Estilo
El tema define la estética global (9 temas). Cambiar de tema resetea las variantes de sección a las de ese tema.

### Paso 4 — Paleta
Preset o colores custom (se derivan automáticamente las escalas claro/oscuro). El preview lo aplica al instante.

### Paso 5 — Tipografía
Pares de Google Fonts, o **sube tu propia fuente** (ttf/otf/woff/woff2 descargada de DaFont, Fontshare, etc.): elige si va en titulares, cuerpo o ambos. La fuente se copia dentro del proyecto generado (self-hosted, no depende de Google). ⚠️ Comprueba que la licencia permita uso web.

### Paso 6 — Secciones
Por cada página, elige la variante de cada bloque. El desplegable muestra primero las **recomendadas** del tema y debajo **otros estilos** (puedes mezclar, con criterio). Reordena con ↑↓, quita con ✕, añade con "+ Añadir sección".

### Paso 7 — Contenido
Titular y subtitular del hero, CTAs, servicios y SEO (title + meta description de 150-160 caracteres).

### Paso 8 — Extras
- **Formulario**: Formspree (crea cuenta gratis en formspree.io → New form → copia el ID) o sin backend.
- **Analytics**: Plausible (de pago, ligero) o GA4 (gratis).
- **Widgets**:
  - **Crisp** (chat): crea cuenta en crisp.chat → Settings → Website Settings → copia el Website ID.
  - **Tawk.to** (chat gratis): dashboard → Administration → Property ID.
  - **Reservas**: pega tu enlace de Cal.com o Calendly → botón flotante "📅 Reservar" en toda la web.
  - **Google Maps**: en Google Maps busca el negocio → Compartir → **Insertar un mapa** → copia SOLO la URL que va en `src="…"` del iframe. Aparece en las secciones "Mapa / Ubicación".
  - **Script personalizado**: cualquier otro widget (se inyecta antes de `</body>`). Solo código de confianza.
- El **botón de WhatsApp** sale solo si pusiste número de WhatsApp en el paso 1.

### Paso 9 — Deploy
- **Dominio final**: el dominio real del cliente (`clientedominio.com`). Se usa para SEO, sitemap y Dokploy.
- **Carpeta de salida**: vacío = `Escritorio\webs-generadas`. Si escribes un nombre suelto se crea en el Escritorio; también acepta rutas absolutas.
- **npm install automático**: déjalo activado.
- **GitHub**: owner = tu usuario (`PaulaLosciale`), repo = nombre del proyecto, privado.
- **Dokploy**: URL del panel + Environment ID + Provider ID (de la Parte A).

### Paso 10 — Montar web 🚀
Revisa el resumen (¡mira "Se creará en"!) y pulsa **Montar web**. El log muestra cada paso. Al terminar tienes: carpeta independiente + git + (opcional) repo GitHub + (opcional) app Dokploy desplegada. También puedes **copiar la receta JSON** (guárdala en `recipes/` — es tu plantilla reutilizable) o **copiar el prompt Lovable**.

---

## PARTE C — El dominio en Cloudflare (paso a paso)

Supongamos que el cliente compró `clientedominio.com` y lo gestionas en Cloudflare:

1. **Añadir el sitio** (si no está): Cloudflare → Add a site → introduce el dominio → plan Free → Cloudflare te da 2 nameservers → cámbialos en el registrador donde se compró el dominio (GoDaddy, Namecheap, IONOS…). Tarda de minutos a horas.
2. **Crear los registros DNS**: pestaña **DNS → Records → Add record**:
   ```
   Tipo A    Nombre @      Contenido <IP_DE_TU_VPS_HETZNER>    Proxy: DNS only (nube GRIS)
   Tipo A    Nombre www    Contenido <IP_DE_TU_VPS_HETZNER>    Proxy: DNS only (nube GRIS)
   ```
   (la IP la ves en la consola de Hetzner, es la IPv4 pública del servidor)
3. ⚠️ **Nube gris (DNS only), no naranja**, al menos hasta que el certificado SSL esté emitido. Con el proxy naranja activo, Let's Encrypt no puede validar el dominio desde Dokploy y el SSL falla.
4. **Espera la propagación** (5-30 min normalmente). Comprueba con: `nslookup clientedominio.com` — debe devolver la IP del VPS.
5. En **Dokploy**, si usaste el builder, el dominio ya está creado con HTTPS Let's Encrypt. Si el certificado falló por probarlo antes de propagar: entra en la app → Domains → borra y recrea el dominio (o redeploy).
6. **Verifica**: `https://clientedominio.com` debe cargar con candado.
7. (Opcional) Cuando el SSL ya funciona, puedes activar el proxy naranja de Cloudflare si quieres su CDN/protección; pon SSL/TLS en modo **Full (strict)** en Cloudflare.

**Recomendación**: compra tú los dominios de los clientes (en Cloudflare Registrar es a precio de coste) y cóbralos dentro de la cuota anual — así controlas el DNS y no dependes del cliente para nada técnico.

---

## PARTE D — Personalizar la web generada

```powershell
cd "C:\Users\Paula Losciale\Desktop\webs-generadas\<proyecto>"
npm run dev   # abre en http://localhost:4321
```

Dónde está cada cosa:

| Qué | Dónde |
|---|---|
| Datos del negocio (email, teléfono, redes) | `src/config.ts` |
| Colores | `src/styles/theme.css` |
| Tipografías y @font-face | `src/styles/global.css` |
| SEO base, widgets, cookies, idiomas | `src/layouts/Layout.astro` |
| Textos de cada sección | los componentes en `src/components/…` |
| Composición de cada página | `src/pages/*.astro` (y `src/pages/en/…` si hay idiomas) |
| Fotos | `public/images/` (sustituye por las del cliente, mismo nombre = cero cambios) |
| Carta del restaurante | `src/components/menu/base/MenuList.astro` (edita el array `sections`) |
| Textos legales | `src/components/legal/base/LegalText.astro` (rellena NIF, dirección…) |

Al terminar: `git add . ; git commit -m "personalización cliente" ; git push` → Dokploy redespliega solo.

---

## PARTE E — Problemas típicos

| Síntoma | Causa y solución |
|---|---|
| "Montar web" no hace nada visible | Mira el log del paso 10; el detalle queda en `.builder-jobs/<job>/log.jsonl` |
| No encuentro la carpeta generada | Mira "Se creará en" en el resumen del paso 10 |
| "Necesito GITHUB_TOKEN o gh CLI" | El token no está en la terminal que corre `npm run dev` (Parte A4) |
| "La carpeta ya existe" | Cambia el nombre del proyecto o borra la carpeta anterior |
| SSL no se emite | DNS aún no propagado o nube naranja activa en Cloudflare (Parte C3) |
| Push no redespliega | Falta el GitHub Provider ID o la GitHub App de Dokploy no tiene acceso a ese repo |
| La fuente subida no se ve | ¿Licencia web ok y formato correcto? Revisa `@font-face` en `src/styles/global.css` del proyecto generado |
| Formulario no envía | Falta el Formspree ID (paso Extras) o el dominio no está verificado en Formspree |
