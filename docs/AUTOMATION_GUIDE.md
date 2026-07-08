# Guía desde cero: Builder → GitHub → Dokploy

Flujo objetivo: montar una web en el builder, pulsar **"Montar web"** y obtener un proyecto independiente en el Escritorio, subido a GitHub y desplegado en tu VPS Hetzner con Dokploy.

## 1. Preparar el VPS (una sola vez)

1. VPS en Hetzner con Ubuntu LTS.
2. Subdominio para el panel, ej. `dokploy.tudominio.com` → registro A a la IP del VPS.
3. Instala Dokploy siguiendo la documentación oficial.
4. En Dokploy crea una **API key** (se usa con el header `x-api-key` contra `https://dokploy.tudominio.com/api`).

## 2. Preparar GitHub (una sola vez)

Opción A — token fine-grained (recomendada):

1. GitHub → Settings → Developer settings → Personal access tokens → Fine-grained tokens.
2. Permiso `Administration: Read and write` (para crear repos) y `Contents: Read and write`.

```powershell
$env:GITHUB_TOKEN="github_pat_xxx"
```

Opción B — GitHub CLI: `gh auth login`. El orquestador detecta `gh` automáticamente si no hay token.

## 3. Datos de Dokploy para la automatización total (una sola vez)

Rellena en el paso **Deploy** del builder:

- **URL del panel**: `https://dokploy.tudominio.com`
- **Environment ID**: en el panel, dentro de tu proyecto → environment (o vía `https://dokploy.tudominio.com/swagger`).
- **Server ID**: solo si tu instalación lo pide.
- **GitHub Provider ID**: tras conectar tu GitHub como provider en Dokploy (Settings → Git providers), su ID.

```powershell
$env:DOKPLOY_API_TOKEN="tu_api_key"
```

Con eso el orquestador hace: `application.create` → `application.saveGithubProvider` → `application.saveBuildType` (Dockerfile) → `application.saveEnvironment` → `domain.create` (HTTPS Let's Encrypt) → `application.deploy`.

## 4. Montar una web

1. `npm run dev` → `http://localhost:4321`.
2. Sigue los 10 pasos del wizard (el preview de la derecha es la web real).
3. En "Montar web" pulsa 🚀 y sigue el log en vivo.

Resultado en `Escritorio/webs-generadas/<proyecto>`:

```text
src/pages/            una .astro por página elegida
src/components/       solo las variantes usadas (copiadas de la librería)
src/config.ts         datos del negocio (edítalo al personalizar)
src/styles/theme.css  paleta en CSS variables
Dockerfile nginx.conf deploy Dokploy (puerto interno 80)
site.recipe.json      receta reproducible
README.md             chuleta de personalización
```

CLI equivalente: `npm run build:site -- recipes/cliente.recipe.json`

## 5. Después de generar

1. `cd Escritorio/webs-generadas/<proyecto> && npm run dev` → personaliza fotos, textos finos y logo.
2. `git add . && git commit && git push` → si Dokploy quedó conectado, se redespliega solo.

## 6. DNS del dominio del cliente

```text
A     @      IP_DEL_VPS
A     www    IP_DEL_VPS
```

Con Cloudflare, desactiva el proxy (nube gris) durante la primera emisión del certificado SSL.

## 7. Si algo falla

- **"Falta GITHUB_TOKEN o gh"**: exporta el token en la MISMA terminal donde corre `npm run dev` (la API hereda ese entorno) y relanza.
- **"La carpeta ya existe"**: bórrala o cambia el nombre del proyecto en el paso Negocio.
- **Dokploy 401/403**: revisa `DOKPLOY_API_TOKEN` y que la API key tenga permisos.
- **El deploy no se dispara al hacer push**: falta el GitHub Provider ID en la receta, o el provider no tiene acceso al repo (revisa la app de GitHub de Dokploy).
- El log completo de cada build queda en `.builder-jobs/<job>/log.jsonl`.

## 8. Dónde tocar código

- Wizard: `src/components/automation/SiteBuilder.tsx`
- Presets (paletas, fuentes, páginas, temas): `src/data/recipeSchema.ts`
- Registry de variantes: `src/data/componentRegistry.ts`
- Preview: `src/pages/preview.astro`
- Orquestador: `scripts/build-site.mjs`
- API de jobs: `src/pages/api/build.ts`

(Los scripts antiguos de la v1 están en `scripts/legacy/`.)
