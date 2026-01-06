# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands

```bash
npm run dev       # Start development server (Vite)
npm run build     # TypeScript compile + Vite production build
npm run preview   # Preview production build locally
npm run lint      # ESLint check
```

**Deployment:** `npm run build && firebase deploy` (Firebase Hosting, project: wriosdev)

## Architecture

This is a multi-page portfolio website built with Vite, TypeScript, and Tailwind CSS.

### Multi-Page Structure

Vite builds 5 separate HTML entry points configured in `vite.config.ts`:
- `index.html` - Main portfolio homepage
- `pages/landing-pages.html` - Landing page showcase
- `pages/creative-studio.html` - Creative studio demo
- `pages/luxury-restaurant.html` - Restaurant landing demo
- `pages/tech-dash.html` - Crypto dashboard demo

### Key Directories

- `src/scripts/` - TypeScript modules for interactive features (loading, navigation, animations, Three.js background)
- `src/styles/main.css` - Tailwind CSS with custom design tokens
- `pages/` - Additional HTML pages (multi-page app)
- `public/` - Static assets served at root

### Path Alias

`@` maps to `./src` (configured in both vite.config.ts and tsconfig.json)

### Code Splitting

Manual chunks configured in Vite:
- `three` - Three.js library (heavy, loaded conditionally)
- `lenis` - Smooth scroll library

### Conditional Feature Loading

`src/scripts/environment.ts` provides device detection utilities. Heavy features (Three.js background, complex animations) only load on desktop devices without reduced-motion preferences. Check `isMobileDevice()` and `prefersReducedMotion()` before adding performance-intensive features.

### Design System

Custom Tailwind config defines:
- Colors: `dark-bg` (#0a041a), `primary` (#8a2be2), `primary-light` (#a78bfa)
- Fonts: Inter (sans), Roboto Mono (mono), Lora (serif)
- Custom animations and glassmorphism utilities

## TypeScript

Strict mode enabled with no unused variables/parameters. Target ES2020.
