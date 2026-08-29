# Portafolio de Diego De Pablo

Portafolio bilingüe construido con React, TypeScript y Vite. Incluye proyectos,
experiencia, formación, temas visuales accesibles y el asistente `dIAgo`, cuya
integración con Groq se ejecuta de forma segura en una Vercel Function.

## Requisitos

- Node.js 22
- npm
- Una clave de Groq para utilizar el chat

## Configuración local

```bash
npm install
cp .env.example .env
```

Variables disponibles:

```dotenv
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.3-70b-versatile
VITE_SITE_URL=http://localhost:5173
```

`GROQ_API_KEY` solo se lee en `api/chat.ts`; no debe llevar el prefijo `VITE_`,
porque eso la expondría al navegador. `API_CHAT` se admite temporalmente para
compatibilidad con el entorno local existente, pero la variable recomendada para
Vercel y nuevos entornos es `GROQ_API_KEY`.

## Desarrollo

```bash
npm run dev
```

Ese comando sirve únicamente la aplicación Vite. Para probar también la ruta
serverless `/api/chat` se necesita Vercel CLI:

```bash
npm run dev:vercel
```

## Comprobaciones

```bash
npm run check
```

Ejecuta lint, pruebas unitarias, comprobación de TypeScript y build de producción.

## Despliegue en Vercel

1. Importa el repositorio en Vercel y selecciona `portfolio` como Root Directory
   si el repositorio contiene otras carpetas.
2. Mantén el preset Vite y los comandos detectados (`npm run build`, salida `dist`).
3. En Project Settings > Environment Variables añade `GROQ_API_KEY` para Production,
   Preview y Development. Opcionalmente añade `GROQ_MODEL` y `VITE_SITE_URL`.
4. Despliega. Vercel publicará `api/chat.ts` automáticamente como `/api/chat`.

La función valida el cuerpo, limita tamaño y frecuencia por instancia, recupera
solo contexto del portafolio y transmite la respuesta al cliente. Para un límite
global entre instancias conviene añadir una regla de rate limiting en Vercel
Firewall.

## Scripts

- `npm run dev`: frontend con Vite.
- `npm run dev:vercel`: frontend y funciones mediante Vercel CLI.
- `npm run test`: pruebas con Vitest.
- `npm run lint`: análisis estático con Oxlint.
- `npm run build`: comprobación de tipos y build de producción.
- `npm run check`: validación completa.
