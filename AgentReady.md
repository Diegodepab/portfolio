# AgentReady Audit & Configuration

## 1. Context & Purpose
This file provides context for any AI agents interacting with this repository or deployed website.
- **Project**: Diego de Pablos' Professional Portfolio
- **Role**: Software Engineer, Data Spaces & AI Architect
- **Goal**: Highlight key projects, skills, and professional experience with an interactive, accessible, and fast interface.

## 2. Technical Architecture
- **Framework**: React 19 + Vite + TypeScript
- **Styling**: Vanilla CSS with a dynamic Pokemon-based theming system (`pokePalettes`). No utility CSS frameworks like Tailwind are used.
- **Key Features**:
  - Full i18n support (English/Spanish).
  - Dynamic semantic search and knowledge graph visualizations (`MetaDataSearch` project).
  - Custom UI animations with `motion`.
  - Interactive Avatar Guide using `driver.js`.

## 3. SEO & Accessibility (WAVE & PageSpeed targets)
- Semantic HTML5 structure (nav, main, section, article).
- Accessible ARIA labels on all interactive elements (buttons, links).
- Dynamic meta tags managed via `react-helmet-async` for optimal SEO and OpenGraph rendering.
- Reduced motion preferences respected in CSS (`@media (prefers-reduced-motion: reduce)`).

## 4. Security & Headers
The deployed application must implement the following headers for **Mozilla Observatory** and **SecurityHeaders** compliance:
- `Content-Security-Policy`: Restricts scripts and styles to trusted origins.
- `Strict-Transport-Security`: Enforces HTTPS (max-age=31536000; includeSubDomains; preload).
- `X-Frame-Options`: DENY or SAMEORIGIN to prevent clickjacking.
- `X-Content-Type-Options`: nosniff.
- `Referrer-Policy`: strict-origin-when-cross-origin.
- `Permissions-Policy`: Restricts browser features (e.g., geolocation=(), camera=()).

*(Note: These headers should be configured in the deployment platform like Vercel, Netlify, or Nginx).*

## 5. Agent Instructions
- **Code modifications**: When writing code, ensure all styles are added to the corresponding `.css` files. Do not use inline styles or Tailwind classes.
- **Component structure**: Keep components small, functional, and strictly typed in TypeScript.
- **Theme**: Always use CSS variables (`--color-accent-1`, etc.) to inherit the dynamic Pokemon palette colors. Avoid hardcoding HEX/RGB colors.

---
**Status**: The portfolio has been audited and prepared for maximum speed, accessibility, and agent-readability.
