# AGENTS.md - Coding Guidelines for Propavite

## Project Overview
- **Framework**: Svelte 4 + Vite
- **Language**: JavaScript (ES modules)
- **Animation**: GSAP with ScrollTrigger
- **Package Manager**: pnpm (lockfile present)

## Build Commands

```bash
# Development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

**Note**: No lint, test, or typecheck commands are configured in this project.

## Code Style Guidelines

### Imports
- Use ES module syntax (`import`/`export`)
- Group imports: 1) external libraries, 2) internal utilities, 3) Svelte imports
- Use double quotes for imports: `import { foo } from "bar"`
- Svelte imports: `import { onMount, tick } from "svelte"`
- Local imports use relative paths: `import { utils } from "./lib/utils"`

### Formatting
- Indent: 2 spaces
- Semicolons: optional (omitted preferred)
- Line endings: Unix (LF)
- Max line length: ~100 characters (soft limit)
- Braces: Opening brace on same line

### Naming Conventions
- **Components**: PascalCase (e.g., `PropaGrid.svelte`, `App.svelte`)
- **Functions/Variables**: camelCase (e.g., `onScrollAssets`, `generateProbables`)
- **Constants**: UPPER_SNAKE_CASE for true constants
- **Stores**: camelCase, descriptive (e.g., `intersection`, `animatables`)
- **CSS Classes**: kebab-case (e.g., `.propa-grid`, `.circle-white`)
- **Private**: Prefix with underscore for internal functions (optional)

### Types
- Use JSDoc annotations for type checking (`/** @type {number} */`)
- `jsconfig.json` has `checkJs: true` enabled for type checking
- Use `import type` for TypeScript types (per jsconfig rules)

### Component Structure
```svelte
<script context="module">
  // Module-level exports/helpers
</script>

<script>
  // Component logic, exports, lifecycle
</script>

<!-- Markup -->

<style>
  /* Component styles (or use app.css for global) */
</style>
```

### Error Handling
- Use optional chaining and nullish coalescing where appropriate
- Guard clauses at function start for early returns
- Use `console.error()` for debugging (remove before production)

### State Management
- Use Svelte stores for global state (`writable`, `readable`)
- Component props: `export let propName = defaultValue`
- Reactive statements: `$: computedValue = ...`

### Animation Guidelines
- GSAP timelines: Use `gsap.timeline()` for sequenced animations
- Register plugins: `gsap.registerPlugin(ScrollTrigger)`
- Clean up ScrollTriggers on component destroy
- Use CSS transforms (x, y, scale) for performance

### File Organization
```
src/
  lib/           # Reusable components and utilities
  assets/        # Static assets imported by components
  *.svelte       # Page/screen components
  *.js           # Utility modules
  *.css          # Global styles
```

### Performance Notes
- Use GSAP's `transformOrigin` for smooth scaling
- Prefer CSS `transform` over `top/left` for animations
- Lazy load heavy assets when possible
- Use `requestAnimationFrame` for custom animations

## Editor Setup
- Recommended: VS Code with Svelte extension
- Extensions: `svelte.svelte-vscode` (configured in `.vscode/extensions.json`)

## Dependencies
- **Runtime**: `gsap`, `polymorph-js`
- **Dev**: `@sveltejs/vite-plugin-svelte`, `svelte`, `vite`

## Notes
- No ESLint or Prettier configured - follow existing patterns
- No testing framework set up
- Project uses `vite-env.d.ts` for Vite client types
