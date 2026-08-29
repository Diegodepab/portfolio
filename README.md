# Diego De Pablo — Software Engineer Portfolio

[Ver Portafolio Online](https://tu-dominio-vercel.vercel.app) *(Actualizar cuando esté desplegado)*

Este repositorio contiene el código fuente de mi portafolio profesional. Está construido como una aplicación web altamente interactiva y enfocada en el rendimiento, diseñada para demostrar mi experiencia en arquitectura frontend, diseño de sistemas y UX engineering.

## 🏗 Arquitectura y Sistemas Core

Más que un simple sitio estático, este portafolio implementa múltiples sistemas de ingeniería a medida:

- **Motor de Temas Dinámico (Poke-Palette):** Una arquitectura de estilos personalizada que altera toda la interfaz y sus tokens CSS en tiempo real, basándose en la extracción de colores dominantes.
- **MetalFx & Thinking Orbs:** Motores de renderizado nativos en HTML5 Canvas para componentes visuales de alto rendimiento (reflejos metálicos, nodos interactivos y estados de IA), construidos desde cero para evitar la sobrecarga de librerías WebGL pesadas.
- **Project Orrery (CSS 3D):** Un carrusel 3D acelerado por hardware que utiliza técnicas matemáticas de *billboarding* para mantener los nodos siempre orientados hacia la cámara sin problemas de superposición.
- **Integración de Agente LLM (dIAgo):** Un asistente de inteligencia artificial integrado nativamente en la UI, servido a través de Vercel Serverless Functions y potenciado por la API de Groq para responder dudas sobre mi experiencia profesional en tiempo real.
- **Tour Interactivo (AvatarGuide):** Un sistema de onboarding guiado y orquestado en React que controla el estado de la UI para demostrar las funcionalidades clave de forma programática.

## 🛠 Tech Stack

- **Core:** React 19, TypeScript, Vite
- **Estilos:** Vanilla CSS (Variables CSS, Grid, CSS 3D Transforms)
- **Animaciones:** Motion (Framer Motion API)
- **Backend/API:** Vercel Serverless Functions (`api/chat.ts`), Groq SDK
- **Tooling:** Oxlint, Vitest

## 📦 Desarrollo Local

Si deseas explorar la arquitectura o levantar el proyecto en local:

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

*(Nota: Para habilitar el chat interactivo, es necesario configurar la variable `GROQ_API_KEY` en un archivo `.env` en la raíz del proyecto).*
