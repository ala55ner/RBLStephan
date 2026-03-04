# Video-to-Website: Premium Scroll-Driven Animated Websites

Transform any video into a stunning scroll-driven animated website with GSAP, Lenis smooth scroll, and canvas frame rendering.

## Quick Start

### 1. Prepare Your Video
- Have your video file ready (MP4, MOV, etc.)
- Know basic info: resolution, duration, frame rate

### 2. Extract Frames
```bash
# Analyze video info
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,r_frame_rate,nb_frames -of csv=p=0 "your_video.mp4"

# Extract frames (adjust fps and width based on your video)
mkdir -p frames
ffmpeg -i "your_video.mp4" -vf "fps=15,scale=1920:-1" -c:v libwebp -quality 80 "frames/frame_%04d.webp"
```

**Target frame counts:**
- Short video (<10s): extract at original fps, cap at ~300 frames
- Medium (10-30s): extract at 10-15fps, expect 100-300 frames
- Long (30s+): extract at 5-10fps, expect 150-300 frames

### 3. Customize Your Site
Edit these files:
- **index.html** - Update hero text, section content, stats, CTA
- **css/style.css** - Adjust colors, fonts, spacing
- **js/app.js** - Modify scroll ranges, animation timings

### 4. Test Locally
```bash
# Using Node.js
npx serve .

# Or Python
python -m http.server 8000

# Then visit: http://localhost:3000 (or :8000 for Python)
```

## Project Structure

```
/
├── README.md              # This file
├── CLAUDE.md              # Project documentation
├── SKILL.md               # Complete technical specifications
├── index.html             # Main HTML file
├── css/
│   └── style.css          # All styling
├── js/
│   └── app.js             # All JavaScript logic
└── frames/                # Extracted video frames (generate these)
    ├── frame_0001.webp
    ├── frame_0002.webp
    └── ...
```

## Key Features

✅ **Lenis Smooth Scroll** - Silky smooth scroll experience
✅ **4+ Animation Types** - Variety of section entrances
✅ **Staggered Reveals** - Elements animate in sequence
✅ **Canvas Animation** - Smooth video frame playback
✅ **Circle-Wipe Effect** - Hero transitions to canvas smoothly
✅ **Responsive Design** - Works on mobile and desktop
✅ **Stats Counters** - Numbers animate from 0
✅ **Dark Overlays** - Professional stats section styling
✅ **Text Marquee** - Oversized sliding text
✅ **Persistent CTA** - Final section stays visible

## Customization Guide

### Change Colors
Edit `:root` variables in `css/style.css`:
```css
:root {
  --bg-light: #f5f3f0;
  --bg-dark: #111111;
  --text-on-light: #1a1a1a;
  --text-on-dark: #f0ede8;
  --accent: #d4a574;
}
```

### Add/Remove Sections
1. Add new `<section>` in HTML with `data-enter`, `data-leave`, `data-animation` attributes
2. Adjust scroll percentages to fit your content
3. Choose animation type: `fade-up`, `slide-left`, `slide-right`, `scale-up`, `rotate-in`, `stagger-up`, `clip-reveal`

### Adjust Scroll Speed
Change `FRAME_SPEED` in `js/app.js` (1.8-2.2 recommended):
```js
const FRAME_SPEED = 2.0; // Higher = finishes animation earlier
```

### Modify Total Scroll Height
Change `.scroll-container` height in `css/style.css`:
```css
.scroll-container {
  height: 800vh; /* 800vh = 8x viewport height of scrolling */
}
```

### Customize Fonts
Update font imports and `--font-display` / `--font-body` in CSS

## Animation Types Reference

| Type | Effect | Best For |
|------|--------|----------|
| `fade-up` | Fades in while rising | General content |
| `slide-left` | Slides from left | Left-aligned sections |
| `slide-right` | Slides from right | Right-aligned sections |
| `scale-up` | Scales up from 85% | Important features |
| `rotate-in` | Rotates while entering | Dynamic elements |
| `stagger-up` | Cascading reveal | Lists, stats |
| `clip-reveal` | Top-to-bottom reveal | Bold statements |

## Performance Tips

- **Keep frame count 150-300** - Balance quality vs performance
- **Use WebP format** - Smaller file sizes than PNG/JPEG
- **Optimize images** - Compress with quality 75-85
- **Test on mobile** - Use DevTools to simulate slow devices
- **Monitor scroll fps** - Ensure 60fps smooth scrolling

## Troubleshooting

**Frames not loading?**
→ Must serve via HTTP, not `file://`
→ Check frame file names match `frame_0001.webp` format

**Choppy scrolling?**
→ Reduce frame count or increase `scrub` value
→ Check for JavaScript errors in console

**Blurry canvas?**
→ `devicePixelRatio` scaling is automatic
→ Verify source frames are high quality

**Counters not animating?**
→ Check `data-value` and `data-decimals` attributes
→ Verify stats section scroll percentages

**Memory issues on mobile?**
→ Reduce frame count to <150
→ Resize frames to 1280px width or less

## Browser Support

- Modern browsers with Canvas and CSS clip-path support
- Chrome/Firefox/Safari/Edge (latest 2 versions)
- Mobile: iOS Safari 13+, Chrome Android 90+

## Resources

- [SKILL.md](SKILL.md) - Complete technical documentation
- [CLAUDE.md](CLAUDE.md) - Project setup and guidelines
- [GSAP Docs](https://greensock.com/docs/)
- [Lenis Docs](https://lenis.darkroom.engineering/)
- [FFmpeg Guide](https://ffmpeg.org/)

## License

This is a template for building scroll-driven websites. Use and modify as needed for your projects.

---

Ready to build something amazing? Start with the Quick Start section above! 🚀
