# BRAND MASTER
*Master brand guidelines for all Stackz ventures*

---

## MISSION

Every venture that ships from this company looks like it was built by a world-class design team. This document defines the master brand identity that all ventures inherit and adapt from.

---

## BRAND PRINCIPLES

### 1. Precision Over Noise
We don't clutter. Every element serves a purpose. White space is a feature, not a bug.

### 2. Motion as Language
Our interfaces breathe. Animations are purposeful, not decorative. Everything moves with intention.

### 3. Darkness as Canvas
Our visual identity lives in dark mode. Light elements on dark backgrounds create depth and focus.

### 4. Speed as Aesthetic
Clean lines and fast interactions signal performance. Our brand should feel as fast as our products.

### 5. Distinctive, Not Derivative
We don't follow trends. We set them. Our aesthetic is instantly recognizable.

---

## COLOR SYSTEM

### Primary Palette

| Role | Hex | Usage |
|------|-----|-------|
| Background Primary | `#050508` | Main app background |
| Background Secondary | `#0a0a0f` | Cards, panels |
| Background Tertiary | `#12121a` | Elevated surfaces |
| Surface | `#1a1a24` | Input fields, buttons |
| Border | `#2a2a3a` | Dividers, outlines |

### Accent Colors

| Role | Hex | Usage |
|------|-----|-------|
| Primary Accent | `#00d4aa` | CTAs, active states, success |
| Secondary Accent | `#7c3aed` | Highlights, secondary actions |
| Warning | `#f59e0b` | Warnings, pending states |
| Error | `#ef4444` | Errors, destructive actions |
| Info | `#3b82f6` | Informational elements |

### Text Colors

| Role | Hex | Usage |
|------|-----|-------|
| Text Primary | `#f4f4f5` | Headlines, primary content |
| Text Secondary | `#a1a1aa` | Body text, descriptions |
| Text Muted | `#52525b` | Placeholders, disabled |

---

## TYPOGRAPHY

### Type Scale

| Level | Font | Size | Weight | Line Height |
|-------|------|------|--------|-------------|
| Display | Inter / custom | 48px | 700 | 1.1 |
| H1 | Inter / custom | 36px | 600 | 1.2 |
| H2 | Inter / custom | 28px | 600 | 1.25 |
| H3 | Inter / custom | 22px | 600 | 1.3 |
| H4 | Inter / custom | 18px | 500 | 1.35 |
| Body Large | Inter / custom | 16px | 400 | 1.5 |
| Body | Inter / custom | 14px | 400 | 1.5 |
| Small | Inter / custom | 12px | 400 | 1.4 |
| Caption | Inter / custom | 11px | 500 | 1.3 |

### Font Guidelines
- Primary: Inter (or similar clean sans-serif)
- Monospace: JetBrains Mono, Fira Code
- No more than 2 font families per venture

---

## SPACING SYSTEM

### Base Unit
4px

### Spacing Scale
| Token | Value |
|-------|-------|
| xs | 4px |
| sm | 8px |
| md | 16px |
| lg | 24px |
| xl | 32px |
| 2xl | 48px |
| 3xl | 64px |
| 4xl | 96px |

---

## VISUAL EFFECTS

### Shadows
```css
/* Subtle elevation */
--shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.3);
--shadow-md: 0 4px 6px rgba(0, 0, 0, 0.4);
--shadow-lg: 0 10px 15px rgba(0, 0, 0, 0.5);
--shadow-glow: 0 0 20px rgba(0, 212, 170, 0.3);
```

### Borders
- Radius: 6px (buttons), 8px (cards), 12px (modals), 16px (large panels)
- Border width: 1px standard, 2px for emphasis
- Border color: `#2a2a3a` (subtle), `#3a3a4a` (elevated)

### Gradients
Use sparingly. Only when they serve a purpose.
- Subtle radial for depth
- No heavy linear gradients on backgrounds

---

## LOGO USAGE

### Primary Logo
- Full color on dark backgrounds
- Monochrome (white) on light backgrounds
- Minimum clear space: 8px or 1x height

### Logo Variants Required
- Full logo (wordmark + icon)
- Icon only (for favicons, app icons)
- Wordmark only (for narrow spaces)

### Don't
- Stretch or distort
- Change colors outside palette
- Add effects (shadows, glows) without approval
- Place on busy backgrounds without container

---

## ICONOGRAPHY

### Style
- Stroke-based (not filled)
- 1.5px or 2px stroke weight
- Rounded corners on terminals
- Consistent 24px base size

### Icon Set
- Lucide React (recommended)
- Custom icons for brand-specific elements

---

## ANIMATION GUIDELINES

### Timing
- Micro-interactions: 150-200ms
- Page transitions: 250-350ms
- Modal/drawer: 300-400ms
- Loading states: Loops at 1-2s

### Easing
- Standard: `cubic-bezier(0.4, 0, 0.2, 1)`
- Bounce: `cubic-bezier(0.34, 1.56, 0.64, 1)`
- Smooth: `cubic-bezier(0.25, 0.1, 0.25, 1)`

### Principles
- Purposeful: Every animation has a reason
- Subtle: Never distracting
- Consistent: Same actions = same animations
- Performant: 60fps, no jank

---

## VOICE & TONE

### Voice
- Direct and confident
- Minimal filler words
- Technical but accessible
- Never arrogant

### Tone by Context
| Context | Tone |
|---------|------|
| Product UI | Clear, helpful, brief |
| Marketing | Confident, benefit-focused |
| Error states | Empathetic, solution-oriented |
| Onboarding | Welcoming, guiding |

---

## PER-VENTURE ADAPTATION

Each venture receives a `[venture-slug]-brand.md` that adapts the master brand:

### Required Adaptations
1. **Venture Name** + tagline
2. **Primary accent color** (choose from palette or request custom)
3. **Icon style** (custom or from icon set)
4. **Additional typography** (if needed beyond master)

### Fixed from Master
- Background system (dark mode default)
- Spacing scale
- Animation principles
- Voice and tone
- Quality standards

---

## APPROVAL

All brand usage must be approved by `brand-guard` before publication. Complex brand decisions escalate to `canvas`.

---

## CONTACT

- Brand questions: canvas
- Asset requests: palette, illustrator, animator
- Brand compliance: brand-guard
