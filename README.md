# Portfolio - Optimized Build

This portfolio has been optimized with a modern build system using Vite, TypeScript, and Tailwind CSS.

## Improvements

- **Modular Architecture**: Code split into separate TypeScript modules for better maintainability
- **Build System**: Vite for fast development and optimized production builds
- **Type Safety**: Full TypeScript support with strict type checking
- **CSS Optimization**: Tailwind CSS with PostCSS purging to remove unused styles
- **Code Splitting**: Three.js and Lenis are loaded as separate chunks for better caching
- **Lazy Loading**: Three.js background is loaded asynchronously to improve initial load time
- **Minification**: Production builds are minified and optimized with Terser
- **Tree Shaking**: Unused code is automatically removed from the bundle

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
├── src/
│   ├── scripts/          # TypeScript modules
│   │   ├── loading.ts
│   │   ├── smooth-scroll.ts
│   │   ├── navigation.ts
│   │   ├── scroll-reveal.ts
│   │   ├── bento-cards.ts
│   │   ├── floating-header.ts
│   │   └── three-background.ts
│   ├── styles/
│   │   └── main.css      # Tailwind CSS with custom styles
│   └── main.ts           # Entry point
├── public/               # Static assets
│   ├── images/
│   └── 404.html
├── index.html            # HTML entry point
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind configuration
└── tsconfig.json         # TypeScript configuration
```

## Deployment

The build output is in the `dist` folder. Firebase hosting is configured to serve from this directory.

```bash
# Build for production
npm run build

# Deploy to Firebase
firebase deploy
```

## Performance Optimizations

1. **Code Splitting**: Three.js and Lenis are in separate chunks
2. **Lazy Loading**: Three.js background loads asynchronously
3. **CSS Purging**: Unused Tailwind classes are removed
4. **Minification**: All code is minified in production
5. **Tree Shaking**: Unused imports are removed
6. **Image Optimization**: Images use lazy loading

## Browser Support

Modern browsers with ES2020 support. The build system automatically handles transpilation and polyfills as needed.
