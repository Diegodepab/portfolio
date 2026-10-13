# Curriculum Vitae (CV) Generator

Este módulo compila y publica automáticamente las distintas variantes del currículum de Diego De Pablo tanto en español como en inglés, en formato estándar y con fotografía profesional.

## Variantes Disponibles

| Archivo Fuente TeX | Archivo Generado en `public/` | Idioma | Fotografía |
| :--- | :--- | :--- | :--- |
| `cv-es.tex` | `public/cv_es.pdf` / `public/cv_diego_de_pablos.pdf` | Español | No |
| `cv-en.tex` | `public/cv_en.pdf` | Inglés | No |
| `cv-es-photo.tex` | `public/cv_es_foto.pdf` | Español | Sí |
| `cv-en-photo.tex` | `public/cv_en_photo.pdf` | Inglés | Sí |

## Requisitos y Compilación

Para compilar todas las variantes a PDF y copiarlas al directorio público del portfolio:

```bash
npm run cv:build
```

### Características Técnicas del Motor LaTeX
- **Formato estricto de 1 página:** Optimizado tipográficamente para directores de ingeniería y ATS.
- **Tolerancia a dependencias externas:** Incluye preámbulo condicional con fallback automático a `tgheros` (TeX Gyre Heros) e iconos vectoriales integrados en TikZ si `inter` o `fontawesome5` no están disponibles en el entorno de compilación.
- **Generación automática del avatar:** Extrae y recorta el retrato formal desde `public/images/portraits/diego-formal.webp` a `assets/diego-formal.jpg` mediante Sharp si no existe.

