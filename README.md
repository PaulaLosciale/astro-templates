# Astro Landing Page Template 🚀

Este es un proyecto de landing page moderno y altamente personalizable construido con **Astro 5** y **Tailwind CSS**. Está diseñado para ser rápido, accesible y visualmente impactante.

## 🛠️ Tecnologías

- **Framework:** [Astro 5](https://astro.build/)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/)
- **Lenguaje:** [TypeScript](https://www.typescript.org/)
- **Iconos:** SVGs integrados (Heroicons/Custom)
- **Tipografía:** Inter (Google Fonts)

## 📁 Estructura del Proyecto

```text
/
├── public/             # Activos estáticos (imágenes, favicon, etc.)
├── src/
│   ├── components/     # Componentes modulares organizados por secciones
│   │   ├── navigation/ # Header y menús
│   │   ├── heroes/     # Secciones principales (Hero)
│   │   ├── features/   # Secciones de características
│   │   ├── cta/        # Llamadas a la acción
│   │   └── footers/    # Pie de página
│   ├── layouts/        # Plantillas base (Layout.astro)
│   └── pages/          # Páginas del sitio (index.astro, etc.)
├── tailwind.config.cjs # Configuración de Tailwind con safelist para colores dinámicos
└── astro.config.mjs    # Configuración principal de Astro
```

## 🚀 Ejecución en Local

Sigue estos pasos para poner en marcha el proyecto en tu máquina:

### 1. Requisitos Previos

Asegúrate de tener instalado [Node.js](https://nodejs.org/) (versión 18.x o superior) y npm.

### 2. Instalación de Dependencias

Desde la raíz del proyecto, ejecuta:

```bash
npm install
```

### 3. Servidor de Desarrollo

Inicia el servidor local con:

```bash
npm run dev
```

El proyecto estará disponible en `http://localhost:4321`.

### 4. Construcción para Producción

Para generar el sitio estático optimizado:

```bash
npm run build
```

Los archivos se generarán en la carpeta `dist/`.

### 5. Vista Previa de Producción

Para probar la versión de producción localmente:

```bash
npm run preview
```

## 🎨 Personalización

### Cambiar Colores o Textos
La mayoría de las secciones se configuran pasando props a los componentes en `src/pages/index.astro`. Por ejemplo:

```astro
<Hero01 
  title="Tu Título Aquí"
  description="Tu descripción personalizada..."
  ...
/>
```

### Colores Dinámicos
Los componentes de características (`Features01.astro`) soportan colores dinámicos (`blue`, `green`, `purple`, etc.). Si añades nuevos colores, asegúrate de incluirlos en el `safelist` de `tailwind.config.cjs` para que Tailwind no los elimine.

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. ¡Siéntete libre de usarlo y mejorarlo!
