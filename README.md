# Elidev CodeQuest - Plataforma de Aprendizaje de Analisis de Datos

Aplicacion web interactiva construida con React + Vite para aprender Analisis de Datos en Python mediante teoria, ejercicios practicos, quizzes, visualizaciones y gamificacion.

## Descripcion
El proyecto propone una experiencia tipo curso guiado donde el estudiante avanza por modulos, ejecuta codigo Python, gana XP, desbloquea insignias y puede obtener un certificado al completar el recorrido.

La interfaz principal y la logica de curso estan implementadas en `src/App.jsx`, y el proyecto incluye una base modular adicional (`src/components`, `src/data`, `src/hooks`) para evolucionar hacia una arquitectura mas desacoplada.

## Caracteristicas principales
- Registro de estudiante dentro de la app.
- Curso por modulos con secciones de teoria, ejercicios y quiz.
- Ejercicios con validacion y retroalimentacion inmediata.
- Galeria de tipos de graficos con panel expandible:
  - para que se usa cada grafico,
  - como implementarlo,
  - snippet de ejemplo.
- Sistema de progreso:
  - XP total,
  - racha,
  - avance por modulo,
  - progreso global.
- Gamificacion:
  - niveles,
  - insignias,
  - tienda de items,
  - temas y avatar,
  - toasts, overlays y confetti.
- Dashboard de progreso.
- Certificado de finalizacion.

## Stack tecnologico
- React 19
- Vite 8 (beta)
- Zustand (estado persistente)
- Recharts
- CodeMirror 6 (dependencias instaladas)
- canvas-confetti
- ESLint 9

## Requisitos
- Node.js 20 o superior (recomendado)
- npm

## Instalacion
```bash
npm install
```

## Ejecucion en desarrollo
```bash
npm run dev
```

## Build de produccion
```bash
npm run build
```

## Vista previa de build
```bash
npm run preview
```

## Lint
```bash
npm run lint
```

## Scripts disponibles
- `npm run dev`: inicia servidor de desarrollo con HMR.
- `npm run build`: genera build de produccion.
- `npm run preview`: sirve localmente el build generado.
- `npm run lint`: ejecuta reglas de ESLint.
- `npm run check`: ejecuta lint + build (ideal antes de desplegar).

## Despliegue
El proyecto ya queda preparado para despliegue estatico.

### Vercel
1. Importa el repositorio en Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Deploy.

Tambien se incluye `vercel.json` en la raiz con esta configuracion.

### Netlify
1. Importa el repositorio en Netlify.
2. Build command: `npm run build`.
3. Publish directory: `dist`.
4. Deploy.

Tambien se incluye `netlify.toml` en la raiz, con redirect SPA a `index.html`.

### Recomendacion de runtime
- Node.js `20+` (archivo `.nvmrc` incluido).

## Estructura del proyecto
```text
codequest/
|- public/
|- src/
|  |- App.jsx
|  |- main.jsx
|  |- components/
|  |  |- Gamification.jsx
|  |  |- Notifications.jsx
|  |  |- PyEditor.jsx
|  |- data/
|  |  |- gamification.js
|  |  |- modules.js
|  |- hooks/
|  |  |- usePyodide.js
|  |  |- useStore.js
|  |- pages/
|  |  |- CertificatePage.jsx
|  |  |- Dashboard.jsx
|  |  |- RegisterPage.jsx
|  |- utils/
|     |- theme.js
|- package.json
|- vite.config.js
|- eslint.config.js
```

## Flujo funcional de la app
1. El usuario se registra.
2. Selecciona y completa secciones del curso.
3. Resuelve ejercicios y quizzes para ganar XP.
4. Desbloquea insignias y compra items en la tienda.
5. Consulta su dashboard de progreso.
6. Completa modulos y obtiene certificado.

## Estado actual
- El flujo principal del producto funciona sobre `src/App.jsx`.
- Existen archivos adicionales (hooks/data/components/pages) que sirven como base para refactorizacion o expansion futura.

## Mejoras recomendadas
- Separar `App.jsx` en modulos de dominio (curso, UI, gamificacion, tienda).
- Conectar ejercicios a un motor real de ejecucion Python (por ejemplo, Pyodide via `usePyodide`).
- Agregar pruebas unitarias e integracion.
- Versionar contenido de modulos en JSON/MD para mantenimiento mas simple.
- Internacionalizacion formal (i18n) y accesibilidad.

## Creditos
- Autora: Luz Eliana Martinez
- GitHub: https://github.com/EMARTINEZ1993
