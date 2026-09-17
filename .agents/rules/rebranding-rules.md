---
trigger: always_on
description: Rebranding and architecture rules for Ktab web application
---

# Ktab Rebranding & Architecture Rules

## 1. Design & Brand Identity
- **Eleven Reader + Apple Inspired**: Clean, editorial, modern, ultra-clean design aesthetic modeled after Eleven Reader (`elevenreader.io`) and Apple. Generous whitespace, refined typography, and subtle micro-animations.
- **No Badges / No "AI Design" Clutter**: Do NOT add unsolicited badges (e.g., "النسخة الجديدة", "توصية القراء", or floating instructional pills) anywhere in the application unless explicitly requested by the user.
- **Light Mode Default**: All rebranded pages and components must be in Light Mode (not dark mode).
- **Core Brand Palette**: **Black**, **White**, and **Teal** (`#5de3ba` / `#4ed4ab`). Black and white form the core editorial baseline; teal serves as the signature interactive accent.
- **Dynamic CSS Colors**: **Never** hardcode hex or rgba color codes in component CSS files. Always use dynamic CSS variables declared in `src/index.css` (`var(--bg-primary)`, `var(--brand-black)`, `var(--brand-teal)`, `var(--gradient)`, `var(--shadow-teal)`, etc.).

## 2. Iterative Workflow
- **Component-by-Component**: Rebrand iteratively section-by-section, feature-by-feature.
- Ensure the landing page transitions smoothly while preserving legacy sections until their turn for rebranding.

## 3. Hero Section Rules
- **No Videos**: Remove background or foreground videos from hero sections.
- **Rich Fluid 3D Book Showcase**: Use an interactive 3D perspective book flip carousel with fluid, physics-based motion and animated transitions between items.
- **Floating Audio Bar**: Include a synchronized floating audio preview bar with 15s skip controls, play/pause, seekable progress bar, and "استمع في التطبيق" action button.

## 4. CSS & Component Architecture
- **Component Folder Structure**: Every component MUST have its own dedicated directory named after the component (e.g., `src/features/home/components/Navbar/`). Inside that directory, it MUST contain both the component JSX file and its standalone CSS file (e.g., `Navbar.jsx` and `Navbar.css`).
- **Switch from Tailwind to Normal CSS**: All new and rebranded components must use standard CSS.
- **Standalone CSS Files**: Each component and view must have its own standalone CSS file inside its component directory (`Navbar.css`, `Hero.css`, `HomeView.css`).
- **No Inline Styles**: Avoid inline style attributes in JSX except for purely dynamic numeric/layout transforms (e.g., progress percentages).

## 5. Component Logic & Hook Architecture
- **Zero Business Logic in Views / JSX**: Do not write calculations, complex state, event handling logic, or DOM effects directly inside JSX or views.
- **Always Use Dedicated Custom Hooks**: Encapsulate all state, event handlers, audio controls, and lifecycle logic inside dedicated custom hooks (e.g., `useNavbar.js`, `useHero.js`, `useShowcaseVideo.js`). For `src/features/home/`, all hooks reside in `src/features/home/hooks/` alongside `useHero.js` and `useNavbar.js`, not inside the component folders.
- **Pure Declarative JSX**: Components should only invoke their custom hook and render declarative markup.

## 6. Fake Data vs. Real Content Management
- **Centralized Test Media**: All fake/mock data (specifically audio files, placeholder book covers, and mock book catalog items) must reside in `src/fakedataorassets/testData.js` so it can be easily removed or swapped later.
- **Authentic Platform Text**: Real platform copy (such as official navigation links, section titles, and action button labels) is authentic content and must remain in the feature logic/hook, not mixed into the temporary mock assets file.

## 7. Developer-Centric Code Comments (No Marketing / Aesthetic Buzzwords)
- **Technical & Informative Comments Only**: Write code comments strictly aimed at helping future software engineers understand and maintain the code.
- **Document the "Why" and Edge Cases**: Explain non-obvious engineering solutions (e.g. why `activeElement.blur()` is required to defeat browser focus-anchoring during pagination scrolling, minimum network animation delay rationale, Spring Boot page parsing fallbacks, CSS clipping compensations).
- **Zero Marketing Fluff**: Strictly avoid design slogans or aesthetic buzzwords in code comments (do NOT write "Apple style", "Eleven reader aesthetic", "hero numbers taking full control", "buttery smooth"). Keep all comments technical, practical, and functional.
