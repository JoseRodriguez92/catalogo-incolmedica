@AGENTS.md

# Guía de Desarrollo - INCOLMEDICA Catálogo Virtual

## Colores Corporativos

Usa estos colores en todo el proyecto para mantener la identidad visual de INCOLMEDICA:

| Nombre                        | Clase Tailwind        | Hex     | Uso Recomendado                     |
| ----------------------------- | --------------------- | ------- | ----------------------------------- |
| Azul claro / Cyan corporativo | `incolmedica-cyan`    | #1887E5 | Acentos, highlights                 |
| Azul medio                    | `incolmedica-blue`    | #0E9FDD | Elementos secundarios, hover states |
| Azul fuerte corporativo       | `incolmedica-primary` | #005CB9 | Botones principales, enlaces, CTA   |
| Azul oscuro texto             | `incolmedica-dark`    | #0A4F9E | Textos importantes, headings        |

### Ejemplos de uso:

```tsx
// Fondo
className = "bg-incolmedica-primary";

// Texto
className = "text-incolmedica-dark";

// Borde
className = "border-incolmedica-cyan";

// Hover
className = "hover:bg-incolmedica-blue";
```

## Convenciones del Proyecto

- **Framework**: Next.js 16+ (App Router)
- **Estilos**: Tailwind CSS 4
- **Animaciones**: GSAP para efectos avanzados
- **Componentes**: React Server Components por defecto, `"use client"` solo cuando sea necesario
