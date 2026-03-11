// Configuration
const CONFIG = {
    TOTAL_FRAMES: 121,
    FRAME_PATH: 'frames/frame_%04d.png'
};

// State
const state = {
    frames: [],
    currentFrameIndex: -1,
    isPreloading: true,
    canvas: null,
    ctx: null,
    lastScrollProgress: -1,
    frameBuffer: new Map()
};

// Preload frames efficiently
async function preloadFrames() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) {
        console.error('Canvas not found');
        return;
    }

    state.canvas = canvas;
    state.ctx = canvas.getContext('2d');

    // Pre-size canvas
    initCanvas();

    console.log('Loading frames...');

    // Load all frames
    const promises = [];
    for (let i = 1; i <= CONFIG.TOTAL_FRAMES; i++) {
        promises.push(new Promise((resolve) => {
            const img = new Image();
            const frameNum = String(i).padStart(4, '0');

            img.onload = () => {
                state.frames[i - 1] = img;
                resolve();
            };
            img.onerror = () => {
                console.warn(`Frame ${frameNum} failed`);
                resolve();
            };

            img.src = CONFIG.FRAME_PATH.replace('%04d', frameNum);
        }));
    }

    await Promise.all(promises);
    console.log(`Loaded ${state.frames.filter(f => f).length} frames`);

    state.isPreloading = false;
    drawFrame(0);
}

// Initialize canvas
function initCanvas() {
    const canvas = state.canvas;
    const parent = canvas.parentElement;
    const dpr = window.devicePixelRatio || 1;
    const rect = parent.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    state.ctx.scale(dpr, dpr);
}

// Optimized frame drawing
function drawFrame(index) {
    if (!state.frames[index]) return;
    if (index === state.currentFrameIndex) return;

    const frame = state.frames[index];
    const canvas = state.canvas;
    const ctx = state.ctx;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    ctx.clearRect(0, 0, w, h);

    const imgAspect = frame.width / frame.height;
    const canvasAspect = w / h;

    let drawWidth, drawHeight, x = 0, y = 0;

    if (imgAspect > canvasAspect) {
        drawHeight = h;
        drawWidth = drawHeight * imgAspect;
        x = (w - drawWidth) / 2;
    } else {
        drawWidth = w;
        drawHeight = drawWidth / imgAspect;
        y = (h - drawHeight) / 2;
    }

    ctx.drawImage(frame, x, y, drawWidth, drawHeight);
    state.currentFrameIndex = index;
}

// Scroll handler - triggers frame updates
function onScroll() {
    if (state.isPreloading || state.frames.length === 0) return;

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = docHeight > 0 ? scrolled / docHeight : 0;

    state.lastScrollProgress = progress;

    const maxIndex = CONFIG.TOTAL_FRAMES - 1;
    const frameIndex = Math.floor(progress * maxIndex);
    const index = Math.min(frameIndex, maxIndex);

    drawFrame(index);
}

// Initialize Lenis with optimized settings
function initSmooth() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: false,
        mouseMultiplier: 1,
        touchMultiplier: 2,
        syncTouch: true,
    });

    // RAF loop
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Connect to GSAP
    lenis.on('scroll', () => {
        ScrollTrigger.update();
        onScroll();
    });

    return lenis;
}

// GSAP animations - optimized
function initAnimations() {
    gsap.registerPlugin(ScrollTrigger);

    // Hero animations - immediate
    const heroElements = document.querySelectorAll('.hero [data-enter]');
    const heroTl = gsap.timeline();

    heroElements.forEach((el) => {
        const delay = parseFloat(el.dataset.delay) || 0;
        const type = el.dataset.enter;
        const props = getProps(type);

        heroTl.fromTo(el, props, {
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out'
        }, delay);
    });

    // Lazy load other section animations
    setTimeout(() => {
        animateSections();
    }, 100);
}

function animateSections() {
    // Opening
    animateSection('.section-opening', [
        { sel: 'h2', type: 'slide-left' },
        { sel: 'p', type: 'fade-up', delay: 0.15 }
    ]);

    // Why RBL
    animateSection('.section-why-rbl', [
        { sel: '.section-title', type: 'slide-left' }
    ]);

    document.querySelectorAll('.column[data-enter]').forEach((col, i) => {
        gsap.to(col, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: col,
                start: 'top 75%',
                once: true
            },
            delay: i * 0.08
        });
    });

    // Sleeve
    animateSection('.section-sleeve', [
        { sel: 'h2', type: 'slide-right' },
        { sel: 'p', type: 'fade-up', delay: 0.15 }
    ]);

    // Activation tiles
    document.querySelectorAll('.activation-tile').forEach((tile, i) => {
        gsap.to(tile, {
            opacity: 1,
            y: 0,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: tile,
                start: 'top 80%',
                once: true
            },
            delay: i * 0.06
        });
    });

    // Stats with counters
    document.querySelectorAll('.stat-card').forEach((card, i) => {
        const valueEl = card.querySelector('.stat-value');
        const targetVal = parseInt(valueEl.dataset.value) || 0;

        gsap.timeline({
            scrollTrigger: {
                trigger: card,
                start: 'top 75%',
                once: true
            }
        })
            .to(card, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            }, 0)
            .to({ value: 0 }, {
                value: targetVal,
                duration: 1.2,
                ease: 'power1.out',
                onUpdate: function() {
                    const n = Math.floor(this.targets()[0].value);
                    if (n >= 1000000) {
                        valueEl.textContent = (n / 1000000).toFixed(0) + 'M';
                    } else if (n >= 1000) {
                        valueEl.textContent = (n / 1000).toFixed(0) + 'K';
                    } else {
                        valueEl.textContent = n.toString();
                    }
                }
            }, 0.1);
    });

    // Closing
    animateSection('.section-closing', [
        { sel: 'h2', type: 'slide-left' },
        { sel: 'p', type: 'fade-up', delay: 0.15 }
    ]);

    // Final
    animateSection('.section-final', [
        { sel: 'h2', type: 'slide-left' }
    ]);
}

function getProps(type) {
    switch (type) {
        case 'fade-up':
            return { opacity: 0, y: 30 };
        case 'slide-left':
            return { opacity: 0, x: -50 };
        case 'slide-right':
            return { opacity: 0, x: 50 };
        case 'scale-up':
            return { opacity: 0, scale: 0.9 };
        default:
            return { opacity: 0 };
    }
}

function animateSection(selector, items) {
    const section = document.querySelector(selector);
    if (!section) return;

    items.forEach(({ sel, type, delay = 0 }) => {
        const el = section.querySelector(sel);
        if (!el) return;
        const props = getProps(type);

        gsap.to(el, {
            ...props,
            opacity: 1,
            x: 0,
            y: 0,
            scale: 1,
            duration: 0.6,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: el,
                start: 'top 75%',
                once: true
            },
            delay
        });
    });
}

// Main init
async function init() {
    await preloadFrames();
    initSmooth();
    initAnimations();

    // Scroll listener
    window.addEventListener('scroll', onScroll, { passive: true });

    // Resize
    window.addEventListener('resize', () => {
        initCanvas();
        drawFrame(state.currentFrameIndex);
    });

    console.log('🎬 Website ready');
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
