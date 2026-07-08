# Roadmap: mejoras, implementaciones e ideas

> 20 + 20 + 20 con recomendación de prioridad. ✅ = ya hecho a 5 julio 2026.

## A. 20 MEJORAS (pulir lo que ya existe)

1. **Parametrizar textos en TODOS los componentes** — hoy solo ~1/3 acepta props; el resto lleva texto demo. La mejora nº1: menos edición manual post-generación.
2. **Miniaturas visuales de cada variante** en el paso Secciones (captura estática por componente) en vez de un desplegable de texto.
3. **Contenido por sección en la receta** — poder escribir los textos de servicios/FAQ/carta desde el builder, no solo el hero.
4. **Editor de navegación** — elegir qué páginas aparecen en el menú y su orden (hoy los navbars llevan links demo).
5. **Traducción de contenido por idioma** en la receta (campo de textos por idioma) en vez de copiar el idioma principal.
6. **Subir logo del cliente** (SVG/PNG) desde el builder → navbar + favicon + OG image.
7. **Subida de imágenes propias** para hero/galería desde el builder (como las fuentes).
8. **Previsualizar la variante al pasar el ratón** por la opción del desplegable.
9. **Deshacer/rehacer** en el wizard y confirmación antes de "Empezar de cero".
10. **Dark mode real en preview** — toggle para ver la web en claro/oscuro antes de montar.
11. **Validar receta completa antes de montar** (dominio bien formado, IDs de widgets con formato correcto).
12. **Editar una web ya generada desde el builder** — cargar su `site.recipe.json` y regenerar sin perder personalizaciones (regeneración selectiva: solo estilos, solo páginas nuevas…).
13. **Log de build con tiempos y botón "abrir carpeta"** al terminar.
14. **Página 404 personalizada** en cada web generada.
15. **OG image autogenerada** (título + paleta) para compartir en redes.
16. **Optimización de imágenes** en el generador (astro:assets o sharp: webp + tamaños).
17. **Font subsetting** de fuentes subidas (woff2 + subset latín) para peso mínimo.
18. **Detección de contraste insuficiente** al elegir paleta custom (aviso AA).
19. **Favicon a partir del logo o iniciales** con la paleta elegida.
20. **Plantilla de commit y README del cliente más rica** (checklist de personalización pendiente).

## B. 20 IMPLEMENTACIONES (features nuevas)

1. ✅ ~~Fuentes propias (ttf/otf/woff/woff2)~~ · 2. ✅ ~~Multi-idioma con hreflang y selector~~ · 3. ✅ ~~Widgets (Crisp, Tawk.to, Cal.com/Calendly, Maps, script custom)~~ · 4. ✅ ~~Páginas legales RGPD/LSSI~~ · 5. ✅ ~~Carta de restaurante, galería, equipo, mapa~~
6. **Blog funcional** con content collections + 2-3 posts demo y RSS.
7. **CMS ligero opcional** (Decap CMS) para que el cliente edite textos — upsell "edita tú mismo".
8. **Formularios propios** (endpoint SSR + email vía Resend) como alternativa a Formspree.
9. **Reservas embebidas** (iframe de Cal.com en página Reservas, no solo botón).
10. **E-commerce ligero** (Stripe Payment Links / Snipcart) para 1-10 productos.
11. **Testimonios desde Google Reviews** (import manual o API) con marcado schema.org.
12. **Schema.org por sector** (LocalBusiness, Restaurant con menú, Attorney…) autogenerado.
13. **Modo "demo para vender"**: generar 3 variantes de la misma web (3 temas) y enseñarlas al cliente en una URL temporal.
14. **Duplicar web existente** como punto de partida (clonar receta con un clic).
15. **Galería de recetas por nicho** (peluquería, clínica, restaurante, abogado…) con textos semi-escritos del sector.
16. **Generación de textos con IA** desde la descripción del negocio (rellenar hero, servicios, FAQ, meta descriptions).
17. **Cookie consent con bloqueo real** de analytics hasta aceptar (RGPD estricto) + página de preferencias.
18. **Informe mensual automático** (visitas Plausible → email al cliente) — justifica la cuota de mantenimiento.
19. **Panel propio de "flota"**: lista de todas las webs generadas con estado del deploy, dominio, SSL y último push.
20. **Backup automático** de recetas y webs (git bundle a otro remoto o S3/Backblaze).

## C. 20 IDEAS (negocio y crecimiento)

1. Landing propia del servicio con demos en vivo de los 9 temas (hechas con tu propio builder — dogfooding).
2. Oferta "web en 48 h" con precio cerrado y garantía de devolución.
3. Paquetes: Presencia 390-590 € / Negocio 790-1.200 € / Premium 1.500-2.500 €.
4. Cuota de mantenimiento 25-50 €/mes (hosting, dominio, SSL, cambios menores) — el verdadero negocio.
5. Nichos: elige 2-3 gremios y sé "la de las webs de [gremio]" en tu zona.
6. Demo en vivo en la primera reunión: montar la home delante del cliente y cerrar ahí.
7. Vídeo corto de 60s mostrando el proceso builder→web para redes/anuncios.
8. Programa de referidos: 10-15% o un mes gratis por cliente traído.
9. Partners: gestorías, asesorías, imprentas y fotógrafos locales que te pasen clientes.
10. Google Business + SEO local para ti misma ("diseño web [tu ciudad]").
11. Upsell legal: textos legales revisados/adaptados (+100-200 €).
12. Upsell reservas para restaurantes y clínicas (+150-300 € con Cal.com).
13. Upsell Google Ads inicial (campaña de lanzamiento, +200-400 €).
14. Migraciones desde Wix/WordPress lentos: "tu misma web, 10× más rápida".
15. Auditoría gratuita de la web actual (PageSpeed + capturas) como gancho comercial.
16. Contrato y facturación recurrente con Stripe (suscripciones) para las cuotas.
17. White-label: vender el servicio de producción a otras agencias/freelancers.
18. Kit de onboarding: formulario Tally que el cliente rellena (textos, fotos, gustos) y que mapea 1:1 con los pasos del builder.
19. Testimonios en vídeo de los primeros clientes a cambio de descuento.
20. Cuando tengas 15-20 clientes: segundo VPS y separación staging/producción.

## Recomendación de prioridades (mi consejo)

**Ya (esta semana):** A1 parametrizar componentes → B15 recetas por nicho → C18 formulario de onboarding. Con eso el ciclo venta→entrega queda fino.
**Después (este mes):** B16 textos con IA + A6 subir logo + B12 schema.org por sector → la web sale "casi terminada" del builder.
**Cuando haya clientes:** B18 informe mensual + B19 panel de flota + C16 facturación Stripe → el recurrente se gestiona solo.
