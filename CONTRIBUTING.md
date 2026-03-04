# Contributing Guide

## Development Workflow

### 1. Extract Frames from Video
```bash
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration,r_frame_rate,nb_frames -of csv=p=0 "your_video.mp4"
```

Then extract:
```bash
ffmpeg -i "your_video.mp4" -vf "fps=15,scale=1920:-1" -c:v libwebp -quality 80 "frames/frame_%04d.webp"
```

### 2. Start Local Server
```bash
npm run serve
# or
npm run serve:python
```

### 3. Edit & Test
- Modify `index.html` for content structure
- Update `css/style.css` for design changes
- Adjust `js/app.js` for animation/scroll behavior

### 4. Test Checklist
Before committing:
- [ ] All sections have different animation types
- [ ] Smooth scroll works (Lenis enabled)
- [ ] Canvas frames display correctly
- [ ] Staggered reveals animate properly
- [ ] Stats counters count up
- [ ] Marquee text slides smoothly
- [ ] Dark overlay fades in/out
- [ ] CTA section persists at bottom
- [ ] Mobile responsive (<768px)
- [ ] No console errors

## File Structure

```
/
├── index.html           ← Main HTML (customize content here)
├── css/style.css        ← All styling (customize design here)
├── js/app.js            ← All JavaScript (customize behavior here)
├── frames/              ← Generated video frames (auto-created by ffmpeg)
├── assets/              ← Optional: images, fonts, icons
├── public/              ← Optional: generated files for deployment
├── docs/                ← Optional: additional documentation
├── SKILL.md             ← Technical specifications
├── CLAUDE.md            ← Project guidelines
├── README.md            ← Quick start guide
└── package.json         ← Project metadata
```

## Code Style

- **Indentation:** 2 spaces (enforced by `.editorconfig`)
- **Line length:** No strict limit, but keep under 120 chars when reasonable
- **Comments:** Add only where logic isn't self-evident
- **Variables:** Use descriptive camelCase names
- **Functions:** Keep to single responsibility principle

## Common Tasks

### Change Color Scheme
Edit `:root` variables in `css/style.css`

### Add New Section
1. Add `<section>` in `index.html` with proper attributes
2. Update scroll percentages in `data-enter` and `data-leave`
3. Choose animation type from available options

### Adjust Animation Speed
Change `FRAME_SPEED` in `js/app.js` (1.8-2.2 range recommended)

### Modify Scroll Height
Change `.scroll-container { height: Xvh; }` in `css/style.css`

## Troubleshooting

**Frames not loading?**
- Must serve via HTTP, not file://
- Check frame naming: `frame_0001.webp`, `frame_0002.webp`, etc.

**Choppy animations?**
- Reduce frame count (less = smoother)
- Increase `scrub` value in ScrollTrigger

**Blurry canvas?**
- Ensure source frames are high quality
- Check `IMAGE_SCALE` value (0.82-0.90 optimal)

**Mobile issues?**
- Test with DevTools device emulation
- Check `<meta name="viewport">` in HTML
- Verify mobile CSS breakpoint (@media max-width: 768px)

## Performance Tips

- Keep frame count 150-300 for optimal performance
- Use WebP format (smaller than PNG/JPEG)
- Optimize images: quality 75-85 recommended
- Monitor: DevTools Performance tab during scroll
- Target: 60fps smooth scrolling

## Git Workflow

```bash
# Before you start
git pull origin main

# Create feature branch
git checkout -b feature/your-feature-name

# Make changes, test thoroughly
npm run serve

# Stage and commit
git add .
git commit -m "Clear, descriptive message"

# Push to remote
git push origin feature/your-feature-name

# Create pull request on GitHub
```

## Questions?

Refer to:
- **SKILL.md** — Technical specifications
- **CLAUDE.md** — Project guidelines
- **README.md** — Quick start

Happy building! 🚀
