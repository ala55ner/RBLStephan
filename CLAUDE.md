# Video-to-Website Project

## Overview
This workspace builds **premium scroll-driven animated websites** from video files using GSAP, Lenis smooth scroll, and canvas frame rendering.

## Project Structure
```
/
├── SKILL.md              # Full workflow & specifications
├── CLAUDE.md             # This file
├── .gitignore
├── index.html            # Main HTML file
├── css/
│   └── style.css         # All styling
├── js/
│   └── app.js            # All JavaScript logic
└── frames/               # Extracted video frames (generated)
    ├── frame_0001.webp
    ├── frame_0002.webp
    └── ...
```

## Key Requirements (Non-Negotiable)
- **Lenis smooth scroll** - smooth experience across all sections
- **4+ animation types** - never repeat the same entrance animation consecutively
- **Staggered reveals** - label → heading → body → CTA, never all at once
- **Massive typography** - hero 12rem+, section headings 4rem+
- **Side-aligned text ONLY** - all text in outer 40% zones (align-left/align-right)
- **Circle-wipe hero reveal** - canvas reveals via clip-path as hero scrolls away
- **Dark overlay for stats** - 0.88-0.92 opacity for stat sections
- **Counter animations** - all numbers count up from 0
- **Horizontal text marquee** - at least one oversized text element (12vw+)
- **CTA persists** - final section stays visible once scrolled into view
- **Frame speed 1.8-2.2** - product animation completes by ~55% scroll

## Workflow Steps (from SKILL.md)

### 1. Analyze the Video
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,r_frame_rate,nb_frames -of csv=p=0 "<VIDEO_PATH>"
```

### 2. Extract Frames
```bash
ffmpeg -i "<VIDEO_PATH>" -vf "fps=<CALCULATED_FPS>,scale=<WIDTH>:-1" -c:v libwebp -quality 80 "frames/frame_%04d.webp"
```

**Target frame count**: 150-300 frames
- Short video (<10s): extract at original fps, cap at ~300
- Medium (10-30s): extract at 10-15fps
- Long (30s+): extract at 5-10fps

### 3. Build HTML/CSS/JS
- Use vanilla HTML/CSS/JS + CDN libraries (no bundler)
- Follow the structure defined in SKILL.md sections 4-6
- Test locally with `npx serve .` or `python -m http.server 8000`

## Animation Types
- `fade-up` - vertical entrance from below
- `slide-left` - horizontal entrance from left
- `slide-right` - horizontal entrance from right
- `scale-up` - scale from 0.85 to 1
- `rotate-in` - rotate with vertical entrance
- `stagger-up` - staggered vertical entrance
- `clip-reveal` - clip-path reveal from top

## CDN Libraries (Order Matters)
```html
<script src="https://cdn.jsdelivr.net/npm/lenis@1/dist/lenis.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/gsap.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/gsap@3/dist/ScrollTrigger.min.js"></script>
<script src="js/app.js"></script>
```

## Tools & Prerequisites
- **FFmpeg/FFprobe** - for frame extraction (must be on PATH)
- **Node.js** - for local serving (`npx serve .`)
- **Browser** - modern browsers with Canvas and CSS clip-path support

## Testing Checklist
- [ ] All sections have different animation types
- [ ] Smooth scroll is enabled (Lenis)
- [ ] Frame playback matches scroll position
- [ ] Staggered reveals work (label → heading → body → CTA)
- [ ] Marquee text slides on scroll
- [ ] Counter numbers count up from 0
- [ ] Dark overlay fades in/out for stats
- [ ] CTA section persists at end
- [ ] Hero has 20%+ scroll range before canvas reveals
- [ ] No layout issues on mobile (<768px)

## Mobile Responsiveness
- Collapse side alignment to centered text with dark backdrop overlays
- Reduce scroll height to ~550vh
- Ensure frames scale responsively
- Test touch scroll smoothness

## Common Issues & Solutions

**Frames not loading** → Must serve via HTTP (not `file://`)

**Choppy scrolling** → Increase `scrub` value or reduce frame count

**Blurry canvas** → Apply `devicePixelRatio` scaling to canvas dimensions

**Lenis conflicts** → Ensure `lenis.on("scroll", ScrollTrigger.update)` is connected

**Counters not animating** → Verify `data-value` attribute and snap settings match decimals

**Memory issues on mobile** → Reduce frames to <150, resize to 1280px width

## Next Steps
1. Prepare your video file
2. Extract frames using ffmpeg (Step 1-2 from SKILL.md)
3. Build HTML structure (index.html)
4. Add styling (css/style.css)
5. Implement JavaScript logic (js/app.js)
6. Test locally and iterate

See SKILL.md for complete technical specifications and code examples.