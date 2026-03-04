// ============================================================================
// INITIALIZATION & SETUP
// ============================================================================

const FRAME_SPEED = 2.0; // 1.8-2.2, higher = product animation finishes earlier
const IMAGE_SCALE = 0.78; // Smaller scale for eye floating in black void
let frames = [];
let currentFrame = 0;
let FRAME_COUNT = 0;
let bgColor = "#000000"; // Pure black background

// Get DOM elements
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");
const loader = document.getElementById("loader");
const loaderBar = document.getElementById("loader-bar");
const loaderProgress = document.getElementById("loader-progress");
const loaderPercent = document.getElementById("loader-percent");
const canvasWrap = document.querySelector(".canvas-wrap");
const heroText = document.querySelector(".hero-text");

// ============================================================================
// LENIS SMOOTH SCROLL (MANDATORY)
// ============================================================================

const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true
});

lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

// ============================================================================
// FRAME PRELOADER
// ============================================================================

async function preloadFrames() {
  // This is a template - update frame paths based on your actual frames
  // Currently expects frames in frames/ directory named frame_0001.webp, etc.

  const frameDir = "frames";
  let frameCount = 1;
  let loadedFrames = [];
  let preloadedCount = 0;

  // Try to load frames - adjust this based on your actual frame count
  // First, we'll start with attempting to load frames and catching errors
  const maxAttempts = 500; // Max frames to attempt loading

  // Phase 1: Load first 10 frames immediately for fast first paint
  const phase1Promises = [];
  for (let i = 1; i <= 10; i++) {
    const frameName = `frame_${String(i).padStart(4, "0")}.png`;
    const framePath = `${frameDir}/${frameName}`;
    phase1Promises.push(
      loadFrame(framePath).then((img) => {
        if (img) {
          loadedFrames[i - 1] = img;
          preloadedCount++;
        }
      })
    );
  }

  await Promise.all(phase1Promises);
  console.log(`Phase 1 complete: ${preloadedCount} frames loaded`);

  // Phase 2: Load remaining frames in background
  (async () => {
    for (let i = 11; i <= maxAttempts; i++) {
      const frameName = `frame_${String(i).padStart(4, "0")}.png`;
      const framePath = `${frameDir}/${frameName}`;

      const img = await loadFrame(framePath);
      if (!img) {
        console.log(`Stopped at frame ${i}: file not found`);
        FRAME_COUNT = i - 1;
        break;
      }

      loadedFrames[i - 1] = img;
      preloadedCount++;

      // Update progress bar during phase 2
      const progress = Math.min(preloadedCount, FRAME_COUNT || maxAttempts);
      const total = FRAME_COUNT || maxAttempts;
      updateLoaderProgress(progress, total);

      // Small yield to prevent blocking
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    frames = loadedFrames.filter((f) => f !== undefined);
    FRAME_COUNT = frames.length;

    console.log(`Phase 2 complete: ${FRAME_COUNT} total frames loaded`);
    hideLoader();
    setupCanvas();
    setupScrollAnimations();
  })();
}

function loadFrame(src) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });
}

function updateLoaderProgress(loaded, total) {
  const percent = Math.round((loaded / total) * 100);
  loaderProgress.style.width = `${percent}%`;
  loaderPercent.textContent = `${percent}%`;
}

function hideLoader() {
  loader.classList.add("hidden");
  animateHeroEntrance();
}

function animateHeroEntrance() {
  const heroChildren = document.querySelectorAll(
    '.hero-text .hero-heading, .hero-text .hero-subtitle, .hero-text .hero-tagline, .hero-text .hero-location, .hero-text .scroll-indicator'
  );
  gsap.from(heroChildren, {
    y: 30,
    opacity: 0,
    stagger: 0.18,
    duration: 1.2,
    ease: "power3.out",
    delay: 0.3
  });
}

// ============================================================================
// CANVAS SETUP & RENDERING
// ============================================================================

function setupCanvas() {
  // Set canvas size with device pixel ratio for crisp rendering
  const rect = canvas.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  ctx.scale(dpr, dpr);

  // Set initial background color
  if (frames.length > 0) {
    sampleBgColor(0);
  }

  // Draw first frame
  drawFrame(0);

  // Handle window resize
  window.addEventListener("resize", () => {
    const newRect = canvas.getBoundingClientRect();
    const newDpr = window.devicePixelRatio || 1;

    canvas.width = newRect.width * newDpr;
    canvas.height = newRect.height * newDpr;
    ctx.scale(newDpr, newDpr);

    drawFrame(currentFrame);
  });
}

function sampleBgColor(frameIndex) {
  // Always use pure black for this site
  bgColor = "#000000";
}

function drawFrame(index) {
  const img = frames[index];
  if (!img) return;

  const cw = canvas.width / (window.devicePixelRatio || 1);
  const ch = canvas.height / (window.devicePixelRatio || 1);
  const iw = img.naturalWidth;
  const ih = img.naturalHeight;

  // Padded cover mode
  const scale = Math.max(cw / iw, ch / ih) * IMAGE_SCALE;
  const dw = iw * scale;
  const dh = ih * scale;
  const dx = (cw - dw) / 2;
  const dy = (ch - dh) / 2;

  // Fill background and draw image
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);

  // Sample new bg color every 20 frames
  if (index % 20 === 0) {
    sampleBgColor(index);
  }
}

// ============================================================================
// SCROLL ANIMATIONS
// ============================================================================

function setupScrollAnimations() {
  // Frame-to-scroll binding
  setupFrameScrollBinding();

  // Canvas fade when contact section enters
  setupCanvasFade();

  // Streaming text animations
  setupStreamAnimations();

  // Counter animations
  setupCounterAnimations();
}

function setupFrameScrollBinding() {
  ScrollTrigger.create({
    trigger: document.documentElement,
    start: "top top",
    end: "bottom bottom",
    scrub: true,
    onUpdate: (self) => {
      // Advance frames throughout entire scroll - husky rotates continuously
      const accelerated = Math.min(self.progress * FRAME_SPEED, 1);
      const index = Math.min(
        Math.floor(accelerated * FRAME_COUNT),
        FRAME_COUNT - 1
      );

      if (index !== currentFrame) {
        currentFrame = index;
        requestAnimationFrame(() => drawFrame(currentFrame));
      }
    }
  });
}

function setupCanvasFade() {
  // Canvas fades to black when contact section enters view
  gsap.to(canvasWrap, {
    opacity: 0,
    ease: "none",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 80%",
      end: "top 10%",
      scrub: true
    }
  });
}


function setupStreamAnimations() {
  // Animate stream sections as they enter viewport
  document.querySelectorAll(".stream-section").forEach((section) => {
    const elements = section.querySelectorAll(
      ".section-label, .section-heading, .section-body, .pillar, .services-list li, .stat"
    );

    gsap.from(elements, {
      y: 50,
      opacity: 0,
      stagger: 0.14,
      duration: 0.9,
      ease: "power3.out",
      scrollTrigger: {
        trigger: section,
        start: "top 75%",
        toggleActions: "play none none reverse"
      }
    });
  });

  // Animate contact section
  const contactElements = document.querySelectorAll(
    ".contact-section .section-heading, .contact-section .contact-info, .contact-section .cta-button"
  );
  gsap.from(contactElements, {
    y: 40,
    opacity: 0,
    stagger: 0.15,
    duration: 0.9,
    ease: "power3.out",
    scrollTrigger: {
      trigger: ".contact-section",
      start: "top 70%",
      toggleActions: "play none none reverse"
    }
  });
}

function setupCounterAnimations() {
  document.querySelectorAll(".stat-number").forEach((el) => {
    const target = parseFloat(el.dataset.value);
    const decimals = parseInt(el.dataset.decimals || "0");

    gsap.from(el, {
      textContent: 0,
      duration: 2,
      ease: "power1.out",
      snap: { textContent: decimals === 0 ? 1 : 0.01 },
      scrollTrigger: {
        trigger: el.closest(".stream-section"),
        start: "top 70%",
        toggleActions: "play none none reverse"
      }
    });
  });
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Start preloading frames when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", preloadFrames);
} else {
  preloadFrames();
}
