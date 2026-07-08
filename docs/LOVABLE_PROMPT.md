# Prompt para Lovable

Dos formas de usarlo:

1. **Automática (recomendada)**: en el builder, paso "Montar web" → botón **"Copiar prompt Lovable"**. Genera el prompt ya relleno con todos los datos de la receta actual (marca, paleta exacta, tipografías, páginas, secciones y contenido).
2. **Manual**: copia la plantilla de abajo y rellena los huecos `{{...}}`.

---

## Plantilla maestra

```text
Crea una página web completa, multi-página y responsive para el siguiente negocio. Usa React + Tailwind CSS con un diseño pixel-perfect, moderno y profesional. NO uses contenido lorem ipsum: usa el contenido real que te doy y complétalo de forma coherente con el sector cuando falte.

## Negocio
- Marca: {{marca}}
- Sector: {{sector}}
- Descripción: {{descripción del negocio en 1-2 frases}}
- Teléfono: {{teléfono}} · Email: {{email}}
- Dirección: {{dirección}}, {{ciudad}}
- Horario: {{horario}}
- Redes sociales: {{instagram/facebook/etc con URLs}}
- Idioma de todos los textos: español

## Dirección de arte
- Estilo visual: {{elegante-editorial | moderno | minimalista | corporativo | creativo | saas | glassmorfismo | terminal}} — descríbelo en una frase
- Paleta EXACTA (respétala): primario {{#hex}}, secundario {{#hex}}, acento {{#hex}}, fondo claro {{#hex}}, texto {{#hex}}
- Tipografía: titulares con "{{fuente heading}}" y cuerpo con "{{fuente body}}" (Google Fonts)
- Animaciones sutiles de entrada (fade/slide) al hacer scroll

## Estructura del sitio
- Página "Inicio" (/): navegación, hero {{estilo de hero}}, servicios, testimonios, llamada a la acción, footer
- Página "Servicios" (/servicios): navegación, listado de servicios, precios, FAQ, CTA, footer
- Página "Sobre nosotros" (/sobre-nosotros): navegación, historia y valores, testimonios, CTA, footer
- Página "Contacto" (/contacto): navegación, formulario + datos de contacto + mapa, footer
{{añade/quita páginas según el proyecto}}

## Contenido clave
- Titular del hero: "{{titular}}"
- Subtitular: "{{subtitular}}"
- CTA primario: "{{texto botón}}" · CTA secundario: "{{texto botón}}"
- Servicios: {{lista de servicios con 1 frase cada uno}}

## SEO
- Title: "{{title del sitio}}"
- Meta description: "{{150-160 caracteres}}"
- h1 único por página, etiquetas semánticas, alt en imágenes

## Funcionalidad
- Menú responsive con hamburguesa en móvil
- Formulario de contacto {{con Formspree ID xxx | con validación, sin backend}}
- Botón de WhatsApp flotante ({{número}})
- Footer con datos reales, enlaces y redes
{{analytics, banner de cookies, etc. si aplica}}

## Calidad
- Mobile-first, accesible (contraste AA, focus visible) y rápido
- Imágenes: placeholders elegantes acordes a la paleta que pueda sustituir después
```

## Consejos de uso en Lovable

- Pega el prompt completo en el primer mensaje; Lovable trabaja mejor con toda la información de golpe.
- Después pide cambios de uno en uno ("cambia el hero por…", "haz el footer más compacto").
- Si el resultado se desvía de la paleta, recuérdale los hex exactos: es lo primero que suele perder.
- Para exportar: conecta GitHub desde Lovable y clona el repo; el deploy en Dokploy es igual que con los proyectos del builder (añade un Dockerfile como el de `scripts/build-site.mjs`).
