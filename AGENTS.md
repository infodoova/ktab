# Ktab Project Agent Guidelines & Memory

## Brand & Design System
- **Eleven Reader + Apple Aesthetic**: Editorial, high-contrast, premium, modern, ultra-clean design modeled after `elevenreader.io` and Apple. Generous whitespace, refined typography, and subtle micro-interactions.
- **No Badges / No "AI Design" Clutter**: Never add unsolicited badges (e.g., "النسخة الجديدة", "توصية القراء", or floating instructional pills) unless explicitly requested. Keep the interface pure, uncluttered, and editorial.
- **Light Mode Primary**: All rebranded components and views must be built in Light Mode.
- **Palette**: **Black**, **White**, and **Teal** (`#5de3ba` / `#4ed4ab`). Use black and white as structural foundations, with teal reserved for elegant, purposeful accents (active audio progress, interactive indicators, subtle glow).
- **Dynamic CSS Variables**: All colors in component styles MUST be dynamically bound to variables defined in `src/index.css` (`var(--...)`). Never hardcode hex/rgba color codes in component stylesheets.

## Engineering Standards
- **Rich, Fluid 3D Animations**: Provide buttery-smooth, spring-like animations for carousels, 3D book shifting, page transitions, and interactive components. Avoid static jumps when navigating.
- **Prominent Brand Logo**: Logo must be sized clearly and prominently (height ~54px–62px), never cramped or tiny.
- **Component-by-Component**: Follow an iterative component-by-component, feature-by-feature rebranding process.
- **Hero Specifications**: No hero videos. Use interactive 3D book showcase with smooth animated carousel, 3D flip card, and synchronized floating audio player bar.
- **Component Folder Structure**: Each component MUST have its own dedicated directory named after the component (e.g., `src/features/home/components/Navbar/`). Inside that folder, it MUST contain both the component JSX (`Navbar.jsx`) and its standalone stylesheet (`Navbar.css`).
- **Normal CSS Over Tailwind**: New and rebranded components use standard CSS in standalone files (`ComponentName.css`, `ViewName.css`). No inline styles.
- **Logic in Hooks Only**: Never write business logic, complex state, or event handlers inside JSX or views. Always extract all logic into dedicated custom hooks (`useComponentName.js`). In `features/home/`, all component hooks reside in `src/features/home/hooks/` (with `useHero.js`, `useNavbar.js`, etc.), not inside component folders.
- **Centralized Fake Media**: Fake media assets (audio, book covers, sample books) must be placed in `src/fakedataorassets/testData.js` for easy deletion. Authentic platform text (nav links, buttons) belongs in the feature.
