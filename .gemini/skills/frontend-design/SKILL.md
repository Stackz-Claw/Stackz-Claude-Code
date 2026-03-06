---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use this skill when the user asks to build web components, pages, artifacts, posters, or applications (examples include websites, landing pages, dashboards, React components, HTML/CSS layouts, or when styling/beautifying any web UI). Generates creative, polished code and UI design that avoids generic AI aesthetics.
license: Complete terms in LICENSE.txt
---

This skill guides creation of distinctive, production-grade frontend interfaces that avoid generic "AI slop" aesthetics. Implement real working code with exceptional attention to aesthetic details and creative choices.

The user provides frontend requirements: a component, page, application, or interface to build. They may include context about the purpose, audience, or technical constraints.

## Design Thinking

Before coding, understand the context and commit to a BOLD aesthetic direction:
- **Purpose**: What problem does this interface solve? Who uses it?
- **Tone**: Pick an extreme: brutally minimal, maximalist chaos, retro-futuristic, organic/natural, luxury/refined, playful/toy-like, editorial/magazine, brutalist/raw, art deco/geometric, soft/pastel, industrial/utilitarian, glassmorphic premium, warm japandi, neubrutalist, claymorphic, etc. There are so many flavors to choose from. Use these for inspiration but design one that is true to the aesthetic direction.
- **Constraints**: Technical requirements (framework, performance, accessibility).
- **Differentiation**: What makes this UNFORGETTABLE? What's the one thing someone will remember?

- **Reference Sites**: If the user provides URLs or names of sites they like, treat these as the highest-signal aesthetic input available. Extract the specific qualities they evoke — spacing rhythm, color temperature, type weight, interaction density — and carry those qualities into the implementation rather than copying surface appearance. If no references are provided, proactively name 2–3 real sites whose aesthetic matches your chosen direction, so the user can validate the direction before you build.

**CRITICAL**: Choose a clear conceptual direction and execute it with precision. Bold maximalism and refined minimalism both work - the key is intentionality, not intensity.

Then implement working code (HTML/CSS/JS, React, Vue, etc.) that is:
- Production-grade and functional
- Visually striking and memorable
- Cohesive with a clear aesthetic point-of-view
- Meticulously refined in every detail

## Frontend Aesthetics Guidelines

Focus on:
- **Typography**: Choose fonts that are beautiful, unique, and interesting. Avoid generic fonts like Arial and Inter; opt instead for distinctive choices that elevate the frontend's aesthetics; unexpected, characterful font choices. Pair a distinctive display font with a refined body font. Consider variable fonts for dynamic weight shifts on hover/scroll — smooth transitions between weights create tactile depth without animation overhead. For display text, use tight tracking (`letter-spacing: -0.03em`) at large sizes; for labels and eyebrows, use wide tracking (`letter-spacing: 0.08em`). Reference font pairings: Playfair Display + DM Serif Text (editorial), Bebas Neue + Space Mono (brutalist), Oxanium + IBM Plex Mono (retro-tech), Fraunces + Nunito (soft organic), Cinzel + Raleway (luxury). Never default to Space Grotesk.

- **Color & Theme**: Commit to a cohesive aesthetic. Use CSS variables for consistency. Dominant colors with sharp accents outperform timid, evenly-distributed palettes. Use ONE accent color; never two competing accents. For dark themes, use near-black backgrounds (#0a0a0f range) with off-white text (#f0f0f5, not pure white). For light themes, use warm off-whites (#fafaf7) with near-black text. Structure tokens as: `--color-bg`, `--color-surface`, `--color-border`, `--color-accent`, `--color-text-primary`, `--color-text-secondary`.

- **Motion**: Use animations for effects and micro-interactions. Prioritize CSS-only solutions for HTML. Use Motion library for React when available. Focus on high-impact moments: one well-orchestrated page load with staggered reveals (`animation-delay: Xms` increments of 80ms) creates more delight than scattered micro-interactions. Use scroll-triggering and hover states that surprise. Micro-interaction checklist: button scale on press (`transform: scale(0.97)`), input label float on focus, skeleton screens instead of spinners for loading states, card lift shadow on hover (200ms ease transition), success/error state animations (checkmark morph, 3-cycle shake). **Always** include `@media (prefers-reduced-motion: reduce)` — set all animations to `0.01ms` duration so the layout remains correct without motion.

- **Spatial Composition**: Unexpected layouts. Asymmetry. Overlap. Diagonal flow (`clip-path: polygon(...)` section breaks). Grid-breaking elements. Generous negative space OR controlled density. For bento-style layouts, use CSS Grid with cells spanning variable columns (`grid-column: span 2`) — modular blocks of varying sizes suit dashboards, product pages, and portfolios. For editorial layouts, allow text to overlap imagery with intentional negative margin. Scale all spacing fluidly: `padding: clamp(16px, 4vw, 48px)`.

- **Backgrounds & Visual Details**: Create atmosphere and depth rather than defaulting to solid colors. Add contextual effects and textures that match the overall aesthetic. Apply creative forms like gradient meshes (multiple `radial-gradient` layers at different positions), noise textures (`opacity: 0.03` SVG grain overlay), geometric patterns, layered transparencies, dramatic shadows, decorative borders, custom cursors, and grain overlays. For glassmorphism: `backdrop-filter: blur(12px) saturate(180%)` with `background: rgba(255,255,255,0.05)` and a `1px solid rgba(255,255,255,0.10)` border — use on floating panels, modals, and nav bars, not on text-heavy content.

NEVER use generic AI-generated aesthetics like overused font families (Inter, Roboto, Arial, system fonts), cliched color schemes (particularly purple gradients on white backgrounds), predictable layouts and component patterns, and cookie-cutter design that lacks context-specific character.

Interpret creatively and make unexpected choices that feel genuinely designed for the context. No design should be the same. Vary between light and dark themes, different fonts, different aesthetics. NEVER converge on common choices (Space Grotesk, for example) across generations.

**IMPORTANT**: Match implementation complexity to the aesthetic vision. Maximalist designs need elaborate code with extensive animations and effects. Minimalist or refined designs need restraint, precision, and careful attention to spacing, typography, and subtle details. Elegance comes from executing the vision well.

## Accessibility (Always Included)

Good design is accessible design. Every implementation must meet WCAG 2.1 AA as a baseline:

- **Contrast**: Normal text ≥ 4.5:1, large text ≥ 3:1, UI components ≥ 3:1. Glassmorphism text always verify — it fails more often than it looks.
- **Focus**: Never `outline: none` globally. Use `:focus-visible` with a styled ring (`outline: 2px solid var(--color-accent); outline-offset: 3px`). All interactive elements reachable via Tab in logical order.
- **Semantics**: `<button>` for actions, `<a>` for navigation. All images have `alt` text (empty `alt=""` for decorative). Heading hierarchy never skips levels (H1→H2→H3). Icon-only buttons have `aria-label`.
- **Color independence**: Never convey state through color alone — pair with icon or text label.
- **Motion safety**: `prefers-reduced-motion` fallback required on every animation block.

## Performance (Ship Fast or It Doesn't Matter)

- Use `transform` and `opacity` for all animations — GPU composited, no layout reflow.
- Limit `backdrop-filter` to ≤ 5 simultaneous elements — it is GPU-intensive.
- Web fonts: load only needed weights, use `font-display: swap`.
- Fluid type with `clamp()` eliminates most breakpoint-specific overrides: `font-size: clamp(1rem, 2.5vw, 1.5rem)`.
- `will-change: transform` only during active animation; remove it after.

## Anti-Patterns (Never Do These)

| Anti-Pattern | Fix |
|---|---|
| `outline: none` globally | Style `:focus-visible` instead |
| Div or span as interactive element | Use semantic `<button>` / `<a>` |
| Color alone conveys state | Add icon + text label |
| `backdrop-filter` on 10+ elements | Redesign or reduce layering |
| Prose lines wider than ~75 characters | `max-width: 65ch` on text containers |
| Tooltip on hover only | Add tap/focus fallback for touch |
| Autoplay video with audio | Mute by default, provide controls |
| No loading feedback for async actions | Skeleton screen or progress indicator |

Remember: Claude is capable of extraordinary creative work. Don't hold back, show what can truly be created when thinking outside the box and committing fully to a distinctive vision.
