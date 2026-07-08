# Ideas para la capa de negocio

El builder resuelve la **producción**. Estas son las palancas para convertirlo en un negocio recurrente y escalable.

## 1. Productiza la oferta (no vendas "una web", vende paquetes)

| Paquete | Qué incluye | Precio orientativo | Coste real para ti |
|---|---|---|---|
| **Presencia** | Landing 1 página, dominio, SSL, formulario | 390-590 € | ~1-2 h con el builder |
| **Negocio** | 4-5 páginas, SEO local, Google Business, WhatsApp | 790-1.200 € | ~3-4 h |
| **Premium** | Lo anterior + blog, copywriting, fotos IA/stock, analytics | 1.500-2.500 € | ~1-2 días |

La clave: el precio se fija por **valor para el cliente**, no por tus horas — el builder hace que tus horas sean pocas.

## 2. Ingresos recurrentes (lo más importante)

- **Mantenimiento + hosting**: 25-50 €/mes por web (tu coste real en el VPS Hetzner: céntimos por web al estar todas en el mismo servidor con Dokploy). 20 clientes = 500-1.000 €/mes pasivos.
- Incluye: dominio, SSL, copias, pequeños cambios de contenido (limita a p.ej. 30 min/mes), informe mensual automático de visitas (Plausible).
- Cobra por Stripe con suscripción para que sea automático.

## 3. Velocidad como argumento de venta

- "Tu web lista en 48 h" es un diferenciador brutal frente a agencias que tardan un mes.
- Con el preview del builder puedes **enseñar la web al cliente en la primera reunión** (o en vivo por pantalla compartida) y cerrar la venta ahí: eliges tema/paleta delante de él y ve su marca en pantalla.

## 4. Nichos y plantillas de nicho

- Especialízate por sectores (peluquerías, clínicas dentales, restaurantes, abogados…): crea 1 receta base por nicho con textos semi-escritos del sector.
- Ventaja: el marketing se afina ("webs para clínicas dentales desde 790 €"), el boca a boca funciona dentro del gremio y cada web sale aún más rápido.
- Guarda cada receta de cliente en `recipes/` — son plantillas reutilizables.

## 5. Upsells naturales

- Página legal RGPD/LSSI (obligatoria en España — añádela al builder como sección automática y véndela incluida).
- Google Business + reseñas.
- Email profesional (Google Workspace / Zoho).
- SEO local mensual, campañas de Google Ads.
- Reservas online (Cal.com embebido) para negocios con cita.

## 6. Operación

- **Contrato y alta simplificados**: formulario tipo Tally/Typeform que el cliente rellena (datos, textos, fotos) y que mapea 1:1 con los pasos del builder.
- **Demo pública**: monta 3-4 webs de ejemplo (una por tema fuerte) en subdominios tuyos para enseñar portfolio.
- **Los proyectos generados son tuyos**: si un cliente se va, apagas su app en Dokploy; si no paga, la web no se publica. El repo privado en tu GitHub es tu control.

## 7. Roadmap técnico al servicio del negocio

1. Página legal automática (desbloquea vender a cualquier negocio español sin riesgo).
2. Parametrizar textos en todos los heroes/CTA (menos edición manual post-generación).
3. Miniaturas en el paso Secciones (cerrar ventas en vivo más rápido).
4. Informe mensual automático de visitas por email (justifica la cuota de mantenimiento).
5. CMS ligero opcional (Decap/TinaCMS) como upsell "edita tú mismo" (+300 € y +10 €/mes).
