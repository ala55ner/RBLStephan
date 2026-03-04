---
name: frontend-design
description: Premium web design guidance for scroll-driven experiences with GSAP, canvas, and modern typography.
---

# Frontend Design Skill

Create **distinctive, premium, and memorable** designs for scroll-driven websites. This skill provides design guidance, color theory, typography systems, spacing models, and component styling for video-to-website projects.

## Design Philosophy

**Premium scroll-driven experiences are built on:**

1. **Simplicity with Impact** — Minimize decorative elements. Let content breathe.
2. **Purposeful Motion** — Every animation serves clarity or hierarchy, never distraction.
3. **Typography-First** — Type carries narrative weight. Size, weight, spacing tell the story.
4. **Generous Whitespace** — 40% of layout is breathing room. Dense layouts feel cheap.
5. **Layering & Depth** — Canvas, overlays, text, marquee create visual hierarchy.
6. **Color Discipline** — 3-5 colors max: primary, secondary, accent, light bg, dark bg.
7. **Accessibility First** — High contrast, readable on all devices, reduced motion respects.

## Color Palette Strategy

### The Formula: 3+2 Color System

**Primary Colors (2):**
- **Light background** — 95-98% lightness, slightly warm (beige/off-white)
- **Dark background** — 5-8% lightness, pure black or warm black
- **Contrast ratio must be >15:1** for text accessibility

**Accent Color (1):**
- One bold color that pops on both light and dark
- Use sparingly: CTA buttons, highlights, hover states
- Saturation 60-80%, lightness 40-60%

**Neutrals (2):**
- **Text on light** — 90% lightness (dark gray, not pure black #1a1a1a)
- **Text on dark** — 8-12% lightness (bright gray #f0ede8)
- **Muted text** — 50-60% lightness for secondary content (#666666)

### Pre-Built Palettes (Copy & Modify)

**Minimal Luxe (Gold/Cream)**
```css
--bg-light: #faf8f5;
--bg-dark: #0f0f0f;
--text-on-light: #1a1a1a;
--text-on-dark: #f5f3f0;
--accent: #d4a574;  /* warm gold */
--muted: #888888;
```

**Modern Tech (Slate/Sky)**
```css
--bg-light: #f8f9fa;
--bg-dark: #0a0e27;
--text-on-light: #1a202c;
--text-on-dark: #e2e8f0;
--accent: #3b82f6;  /* bright blue */
--muted: #64748b;
```

**Bold Organic (Sage/Cream)**
```css
--bg-light: #f5f7f4;
--bg-dark: #1a1f1a;
--text-on-light: #2d3a2d;
--text-on-dark: #e8ede8;
--accent: #7d9b5e;  /* sage green */
--muted: #6b7b6b;
```

**Premium Dark (Charcoal/White)**
```css
--bg-light: #f0ede8;
--bg-dark: #1a1a1a;
--text-on-light: #111111;
--text-on-dark: #f5f3f0;
--accent: #ff6b35;  /* burnt orange */
--muted: #7a7a7a;
```

**Testing Contrast:**
- Use WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
- Aim for WCAG AAA (7:1) for body text
- AA (4.5:1) minimum for compliance

## Typography System

### The Pairing Formula

**Best Modern Combinations:**
1. **Elegant** — Display: `Playfair Display` + Body: `Inter`
2. **Refined** — Display: `Abril Fatface` + Body: `Lato`
3. **Bold** — Display: `Bebas Neue` + Body: `Open Sans`
4. **Minimal** — Display: `Space Grotesk` + Body: `Inter`
5. **Warm** — Display: `Cormorant Garamond` + Body: `Lora`

### Size Scale (Modular Scale: 1.2x)

```css
/* Base: 1rem = 16px */
--text-xs: 0.75rem;    /* 12px - labels, captions */
--text-sm: 0.875rem;   /* 14px - nav, metadata */
--text-base: 1rem;     /* 16px - body text */
--text-lg: 1.2rem;     /* 19px - intro, emphasis */
--text-xl: 1.44rem;    /* 23px - subheadings */
--text-2xl: 1.728rem;  /* 28px - section labels, small h3 */
--text-3xl: 2.074rem;  /* 33px - subheading h2 */
--text-4xl: 2.488rem;  /* 40px - section heading */
--text-5xl: 2.986rem;  /* 48px - major heading */
--text-6xl: 3.583rem;  /* 57px - hero (smaller screens) */
--text-7xl: 4.3rem;    /* 69px - hero section */
--text-8xl: 5.16rem;   /* 83px - hero (larger screens) */
--text-9xl: 6.19rem;   /* 99px - hero (massive) */

/* Responsive Hero: clamp(min, preferred, max) */
hero-heading: clamp(3rem, 12vw, 12rem);
```

### Font Weight Strategy

- **Display (headings):** 700 (bold) always
- **Section labels:** 500-600 (medium-semibold)
- **Body copy:** 400 (regular)
- **Emphasis in body:** 600 (semibold, not bold)
- **Captions/metadata:** 400 (regular) or 500 (medium)

### Line Height & Letter Spacing

```css
/* Headings: tighter for impact */
h1, h2, h3 {
  line-height: 1.1;
  letter-spacing: -0.02em;  /* -2% of font size */
}

/* Body: generous for readability */
p, li {
  line-height: 1.6 to 1.8;
  letter-spacing: -0.005em;  /* -0.5% for warmth */
}

/* Labels & metadata: expanded for clarity */
.label, .meta {
  letter-spacing: 0.1em to 0.15em;  /* +10% to +15% */
}
```

## Spacing System

### The Golden Ratio Model (8px base)

```css
--space-0: 0;
--space-1: 0.5rem;   /* 8px */
--space-2: 1rem;     /* 16px */
--space-3: 1.5rem;   /* 24px */
--space-4: 2rem;     /* 32px */
--space-5: 3rem;     /* 48px */
--space-6: 4rem;     /* 64px */
--space-7: 6rem;     /* 96px */
--space-8: 8rem;     /* 128px */
--space-9: 12rem;    /* 192px */
--space-10: 16rem;   /* 256px */
```

### Section Layout Model

```css
/* Padding for side-aligned text zones */
.align-left {
  padding-left: 5vw;      /* breathing room from left edge */
  padding-right: 55vw;    /* push text to left 40% of viewport */
}

.align-right {
  padding-left: 55vw;
  padding-right: 5vw;
}

/* Section inner: constrain readable width */
.section-inner {
  max-width: 40vw;
  width: 100%;
}

/* Vertical spacing */
.section-label {
  margin-bottom: 2rem;    /* space to heading */
}

.section-heading {
  margin: 1rem 0;         /* balanced top/bottom */
}

.section-body {
  margin: 1.5rem 0;       /* space to next element */
  line-height: 1.8;
}
```

### Mobile Collapse (< 768px)

```css
@media (max-width: 768px) {
  .align-left,
  .align-right {
    padding-left: 5vw;
    padding-right: 5vw;
  }

  .section-inner {
    max-width: 100%;
  }

  /* Center text with semi-transparent dark backdrop */
  .scroll-section {
    background-color: rgba(0, 0, 0, 0.3);
    padding: 2rem 5vw;
  }
}
```

## Component Styling

### Buttons & CTAs

**Premium CTA Button:**
```css
.cta-button {
  padding: 1rem 2.5rem;
  background-color: var(--accent);
  color: var(--text-on-light);
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  border: none;
  border-radius: 0;  /* sharp edges = premium */
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

.cta-button:hover {
  opacity: 0.9;
  transform: translateY(-2px);  /* subtle lift */
}

.cta-button:active {
  transform: translateY(0);
}
```

**Why this works:**
- Sharp corners feel modern & intentional
- Small vertical lift on hover adds sophistication
- Opacity change (not color) maintains brand
- Uppercase letters command attention

### Stats Counters

**Premium Stats Layout:**
```css
.stat {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  text-align: center;
}

.stat-number {
  font-family: var(--font-display);
  font-size: clamp(2rem, 6vw, 3.5rem);
  font-weight: 700;
  color: var(--text-on-dark);  /* bright on dark overlay */
  line-height: 1;              /* tight spacing for impact */
}

.stat-label {
  font-size: 0.875rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(240, 237, 232, 0.8);
}
```

**Dark Overlay (Stats Background):**
```css
#dark-overlay {
  background-color: rgba(0, 0, 0, 0.88);  /* 0.88-0.92 opacity */
  backdrop-filter: blur(4px);              /* subtle blur */
  pointer-events: none;
}
```

### Navigation & Header

**Fixed Header (Premium):**
```css
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: rgba(245, 243, 240, 0.95);
  backdrop-filter: blur(8px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);  /* subtle divider */
}

.logo {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.02em;
}

.nav-links a {
  font-size: 0.875rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: opacity 0.3s ease;
}

.nav-links a:hover {
  opacity: 0.6;
}
```

### Marquee Text

**Oversized Sliding Text:**
```css
.marquee-text {
  white-space: nowrap;
  font-family: var(--font-display);
  font-size: clamp(4rem, 12vw, 12rem);
  font-weight: 700;
  color: rgba(255, 255, 255, 0.05);  /* very subtle, doesn't dominate */
  letter-spacing: -0.02em;
  line-height: 1;
}
```

**Why faint?** Marquee is environmental texture, not content. It should enhance, not distract.

## Animation Pairing with Design

### Entrance Animations × Design Intent

| Animation | Visual Effect | When to Use | Design Note |
|-----------|--------------|------------|------------|
| `fade-up` | Rise + fade in | Accessible default for most content | Emotional, gentle |
| `slide-left` | Slide from left edge | Left-aligned sections | Directional energy |
| `slide-right` | Slide from right edge | Right-aligned sections | Mirrors left |
| `scale-up` | Grow from 85% | Features, importance | Expansive, joyful |
| `rotate-in` | Rotate + rise | Dynamic sections | Playful, creative |
| `stagger-up` | Sequential reveal | Stats, lists, grids | Choreography, rhythm |
| `clip-reveal` | Top-to-bottom wipe | Bold statements | Cinematic, rare |

### Never do this:
- ❌ Repeat the same animation 2x in a row (breaks rhythm)
- ❌ Rotate text (unreadable, gimmicky)
- ❌ Animate everything (attention fatigue)
- ❌ Use `ease: "bounce"` (looks cheap)
- ❌ Durations > 1.2s (feels sluggish)

## Responsive Design Principles

### Breakpoints

```css
/* Mobile First */
/* 320px - 479px: small phones */
/* 480px - 767px: large phones */
/* 768px - 1023px: tablets */
/* 1024px+: desktop */

@media (max-width: 767px) {
  /* Stack everything, increase vertical spacing */
  /* Reduce font sizes by 15-20% */
  /* Center text instead of side-align */
}

@media (min-width: 1440px) {
  /* Increase padding/margins by 10-20% */
  /* More generous whitespace */
}
```

### Responsive Typography

```css
/* Use clamp() for fluid scaling */
.section-heading {
  font-size: clamp(1.5rem, 5vw, 4rem);
  /* min: 24px, preferred: 5% viewport width, max: 64px */
}
```

### Canvas & Marquee on Mobile

- Reduce marquee font size: `clamp(2rem, 8vw, 4rem)`
- Simplify: hide fancy effects, focus on core content
- Increase touch targets: buttons >= 44px × 44px

## Dark Mode Considerations

If implementing dark mode toggle:

1. **Color Variables** — Use CSS custom properties for easy swapping
2. **Maintain Contrast** — Test all color combos in both modes
3. **Reduce Brightness on Dark** — Make dark backgrounds even darker for contrast
4. **Test Carefully** — Dark mode isn't just inverting colors

## Design Checklist

Before declaring a design "complete":

- [ ] All text meets WCAG AAA contrast (7:1 minimum)
- [ ] Heading hierarchy is clear (h1 > h2 > h3)
- [ ] Whitespace is generous (40%+ of layout is empty)
- [ ] Color palette has exactly 5 colors max
- [ ] Typography uses no more than 2 fonts
- [ ] No two consecutive sections have identical animations
- [ ] Font sizes scale smoothly on mobile (using `clamp()`)
- [ ] No glossy effects (frosted glass is OK, gradients sparingly)
- [ ] CTA button is obviously clickable (color, shape, or shadow)
- [ ] Stats section dark overlay is readable (0.88-0.92 opacity)
- [ ] Marquee text is subtle (doesn't compete with content)

## Common Mistakes & Fixes

| Problem | Why It Fails | Solution |
|---------|------------|----------|
| Too many colors | Overwhelms viewers | Stick to 3-5 colors max |
| Centered text everywhere | Loses side-aligned power | Use 40% zones for hierarchy |
| Thin fonts for headings | Looks weak, cheap | Use 700+ weight for impact |
| Pure black text on white | Too harsh, tiring | Use #1a1a1a on #f5f3f0 |
| Same animation repeated | Predictable, boring | Vary entrance types |
| Tight spacing | Claustrophobic feeling | Increase padding/margins 20% |
| Glossy cards with gradients | Dated 2016 design | Use flat backgrounds, layers |
| No visual hierarchy | All content equal weight | Use size, weight, color strategically |
| Mobile text too small | Unreadable on phones | Use `clamp()` for scaling |
| Overused opacity | Creates visual noise | Use opacity sparingly for depth |

## Quick Reference: Pre-Built Themes

### Theme: "Minimal Luxe"
```css
:root {
  --bg-light: #faf8f5;
  --bg-dark: #0f0f0f;
  --text-on-light: #1a1a1a;
  --text-on-dark: #f5f3f0;
  --accent: #d4a574;
  --font-display: "Playfair Display", serif;
  --font-body: "Inter", sans-serif;
}

/* Generous padding, serif display, muted accent */
```

### Theme: "Bold Modern"
```css
:root {
  --bg-light: #f0f0f0;
  --bg-dark: #0a0a0a;
  --text-on-light: #111111;
  --text-on-dark: #ffffff;
  --accent: #ff6b35;
  --font-display: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
}

/* Sharp sans-serif, high contrast, warm accent */
```

### Theme: "Premium Tech"
```css
:root {
  --bg-light: #f8f9fa;
  --bg-dark: #0a0e27;
  --text-on-light: #1a202c;
  --text-on-dark: #e2e8f0;
  --accent: #3b82f6;
  --font-display: "Sora", sans-serif;
  --font-body: "Inter", sans-serif;
}

/* Cool tones, rounded corners, tech aesthetic */
```

---

## How to Use This Skill

1. **When designing a new section** — Reference color palette, spacing model, typography scale
2. **When choosing animations** — Match animation type to design intent
3. **When debugging visual issues** — Check typography hierarchy, contrast, spacing
4. **When building components** — Follow button/stat/header patterns
5. **For color decisions** — Use one of the pre-built palettes or the 3+2 color formula
6. **For responsive work** — Use `clamp()` and mobile-first breakpoints

**Always prioritize:**
1. Readability (contrast, font size, line height)
2. Hierarchy (size, weight, color, position)
3. Space (generous margins, clear breathing room)
4. Motion (purposeful animations, no redundancy)

This skill is a guide, not a rulebook. Adapt, experiment, and trust your creative instincts. The best designs follow principles but aren't slave to them.
