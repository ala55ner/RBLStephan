// Configuration
const CONFIG = {
    TOTAL_FRAMES: 121,
    FRAME_PATH: 'frames/frame_%04d.png',
    PRELOAD_BUFFER: 15  // Load 15 frames ahead and behind current
};

// State
const state = {
    frames: new Map(),
    currentFrameIndex: -1,
    isPreloading: true,
    canvas: null,
    ctx: null,
    lenis: null,
    animatedElements: new Set(),
    loadingFrames: new Set(),
    preloadQueue: []
};

// ============================================
// LAZY FRAME LOADING
// ============================================

async function loadFrame(index) {
    if (state.frames.has(index) || state.loadingFrames.has(index)) return;

    state.loadingFrames.add(index);

    return new Promise((resolve) => {
        const img = new Image();
        const frameNum = String(index + 1).padStart(4, '0');

        img.onload = () => {
            state.frames.set(index, img);
            state.loadingFrames.delete(index);
            resolve(img);
        };

        img.onerror = () => {
            state.loadingFrames.delete(index);
            resolve(null);
        };

        img.src = CONFIG.FRAME_PATH.replace('%04d', frameNum);
    });
}

async function preloadFramesAroundIndex(centerIndex) {
    const buffer = CONFIG.PRELOAD_BUFFER;
    const start = Math.max(0, centerIndex - buffer);
    const end = Math.min(CONFIG.TOTAL_FRAMES - 1, centerIndex + buffer);

    const promises = [];
    for (let i = start; i <= end; i++) {
        if (!state.frames.has(i) && !state.loadingFrames.has(i)) {
            promises.push(loadFrame(i));
        }
    }

    if (promises.length > 0) {
        await Promise.all(promises);
    }
}

// ============================================
// CANVAS & RENDERING
// ============================================

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
    if (!state.frames.has(index) || index === state.currentFrameIndex) return;

    const frame = state.frames.get(index);
    if (!frame) return;

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
// SCROLL HANDLING
// ============================================

function updateFrameOnScroll() {
    if (state.frames.size === 0) return;

    // Calculate scroll progress
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;
    const progress = docHeight > 0 ? scrolled / docHeight : 0;

    // Map to frame index
    const maxIndex = CONFIG.TOTAL_FRAMES - 1;
    const frameIndex = Math.round(progress * maxIndex);
    const index = Math.min(Math.max(frameIndex, 0), maxIndex);

    // Draw current frame if loaded
    drawFrame(index);

    // Preload frames around current position
    preloadFramesAroundIndex(index);
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
    console.log('⚡ Initializing Premium Pitch Deck (Fast Loading)...');

    const canvas = document.getElementById('heroCanvas');
    if (!canvas) {
        console.error('❌ Canvas not found');
        return;
    }

    state.canvas = canvas;
    state.ctx = canvas.getContext('2d');
    initCanvas();

    // Load first frame + buffer immediately
    console.log('🎬 Preloading frames...');
    await preloadFramesAroundIndex(0);

    // Draw first frame
    if (state.frames.has(0)) {
        drawFrame(0);
        console.log('✅ First frame loaded - page ready instantly!');
    }

    state.isPreloading = false;

    // Initialize smooth scroll
    initSmooth();

    // Initial animation pass
    animateScrollElements();
    animateNumbersOnScroll();

    // Handle window resize
    window.addEventListener('resize', () => {
        initCanvas();
        if (state.currentFrameIndex >= 0) {
            drawFrame(state.currentFrameIndex);
        }
    }, { passive: true });

    console.log('✅ Ready! Frames load as you scroll.');
}

// Start when ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
