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
    lenis: null,
    animatedElements: new Set(),
    lastScrollTime: 0,
    scrollTimeout: null
};

// ============================================
// FRAME PRELOADING & RENDERING
// ============================================

async function preloadFrames() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) {
        console.error('❌ Canvas not found');
        return;
    }

    state.canvas = canvas;
    state.ctx = canvas.getContext('2d');
    initCanvas();

    console.log('🎬 Loading frames...');

    const promises = [];
    for (let i = 1; i <= CONFIG.TOTAL_FRAMES; i++) {
        promises.push(
            new Promise((resolve) => {
                const img = new Image();
                const frameNum = String(i).padStart(4, '0');

                img.onload = () => {
                    state.frames[i - 1] = img;
                    resolve();
                };

                img.onerror = () => {
                    console.warn(`⚠️  Frame ${frameNum} not found`);
                    resolve();
                };

                img.src = CONFIG.FRAME_PATH.replace('%04d', frameNum);
            })
        );
    }

    await Promise.all(promises);
    const loadedCount = state.frames.filter(f => f).length;
    console.log(`✅ Loaded ${loadedCount}/${CONFIG.TOTAL_FRAMES} frames`);

    state.isPreloading = false;
    drawFrame(0);
}

function initCanvas() {
    const canvas = state.canvas;
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';

    state.ctx.scale(dpr, dpr);
}

function drawFrame(index) {
    if (!state.frames[index] || index === state.currentFrameIndex) return;

    const frame = state.frames[index];
    const canvas = state.canvas;
    const ctx = state.ctx;
    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    // Clear canvas
    ctx.fillStyle = '#0A1B35';
    ctx.fillRect(0, 0, w, h);

    // Draw frame with proper aspect ratio
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

// ============================================
// SMOOTH SCROLL FRAME UPDATES
// ============================================

function updateFrameOnScroll() {
    if (state.isPreloading || state.frames.length === 0) return;

    // Calculate scroll progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = docHeight > 0 ? scrolled / docHeight : 0;

    // Smooth frame mapping with easing
    const maxIndex = CONFIG.TOTAL_FRAMES - 1;
    const frameIndexRaw = progress * maxIndex;

    // Use smooth interpolation
    const frameIndex = Math.round(frameIndexRaw);
    const index = Math.min(Math.max(frameIndex, 0), maxIndex);

    drawFrame(index);
}

function animateScrollElements() {
    const elements = document.querySelectorAll('[data-scroll-reveal]:not(.is-visible)');

    elements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const triggerPoint = window.innerHeight * 0.85;

        if (rect.top < triggerPoint && rect.bottom > 0 && !state.animatedElements.has(el)) {
            el.classList.add('is-visible');
            state.animatedElements.add(el);
        }
    });
}

function animateNumbersOnScroll() {
    const statNumbers = document.querySelectorAll('.stat-num[data-value]');

    statNumbers.forEach((el) => {
        if (el.dataset.animating === 'true') return;

        const rect = el.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.85 && rect.bottom > 0;

        if (isInView && !el.dataset.animated) {
            el.dataset.animating = 'true';
            animateNumber(el);
        }
    });
}

function animateNumber(el) {
    const targetVal = parseInt(el.dataset.value) || 0;
    const duration = 2.4;
    const steps = 60;
    const stepDuration = (duration * 1000) / steps;
    let currentStep = 0;

    function updateNumber() {
        currentStep++;
        const progress = currentStep / steps;
        const easeProgress = easeOutQuad(progress);
        const currentVal = Math.floor(easeProgress * targetVal);

        if (currentVal >= 1000000) {
            el.textContent = (currentVal / 1000000).toFixed(1) + 'M';
        } else if (currentVal >= 1000) {
            el.textContent = (currentVal / 1000).toFixed(0) + 'K';
        } else {
            el.textContent = currentVal.toString();
        }

        if (currentStep < steps) {
            setTimeout(updateNumber, stepDuration);
        } else {
            el.dataset.animated = 'true';
            el.dataset.animating = 'false';
        }
    }

    updateNumber();
}

function easeOutQuad(t) {
    return t * (2 - t);
}

// ============================================
// LENIS SMOOTH SCROLL
// ============================================

function initSmooth() {
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        smooth: true,
        smoothTouch: true,
        mouseMultiplier: 1,
        touchMultiplier: 1
    });

    state.lenis = lenis;

    // RAF loop for Lenis
    function raf(time) {
        lenis.raf(time);
        requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Optimized scroll event with throttling
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateFrameOnScroll();
                animateScrollElements();
                animateNumbersOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });

    return lenis;
}

// ============================================
// INITIALIZATION
// ============================================

async function init() {
    console.log('⚡ Initializing Premium Pitch Deck...');

    // Preload frames
    await preloadFrames();

    // Initialize smooth scroll
    initSmooth();

    // Initial animation pass
    animateScrollElements();
    animateNumbersOnScroll();

    // Handle window resize
    window.addEventListener('resize', () => {
        initCanvas();
        drawFrame(state.currentFrameIndex);
    }, { passive: true });

    console.log('✅ Ready to present! Scroll to see the magic.');
}

// Start when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
