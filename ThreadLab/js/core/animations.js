const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
const GSAP_URL = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/+esm';
const SCROLL_TRIGGER_URL = 'https://cdn.jsdelivr.net/npm/gsap@3.13.0/ScrollTrigger/+esm';
const LENIS_URL = 'https://cdn.jsdelivr.net/npm/lenis@1.3.8/+esm';

function mountPreloader() {
  if (reducedMotion || !document.body) return;

  const loader = document.createElement('div');
  loader.className = 'premium-preloader';
  loader.setAttribute('role', 'status');
  loader.setAttribute('aria-live', 'polite');
  loader.setAttribute('aria-label', 'Loading ThreadLab');

  const mark = document.createElement('span');
  mark.className = 'premium-preloader__mark';
  mark.setAttribute('aria-hidden', 'true');
  const title = document.createElement('span');
  title.className = 'premium-preloader__title';
  title.textContent = 'THREADLAB';
  const status = document.createElement('span');
  status.className = 'premium-preloader__status';
  status.textContent = 'Preparing your lab';
  const track = document.createElement('span');
  track.className = 'premium-preloader__track';
  track.setAttribute('aria-hidden', 'true');

  loader.append(mark, title, status, track);
  document.body.append(loader);

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    loader.classList.add('is-leaving');
    window.setTimeout(() => loader.remove(), 650);
  };

  if (document.readyState === 'complete') {
    window.setTimeout(dismiss, 500);
  } else {
    window.addEventListener('load', () => window.setTimeout(dismiss, 350), {once: true});
  }
  window.setTimeout(dismiss, 2400);
}

function mountCursor() {
  if (reducedMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  const cursor = document.createElement('span');
  cursor.className = 'premium-cursor';
  cursor.setAttribute('aria-hidden', 'true');
  const dot = document.createElement('span');
  dot.className = 'premium-cursor__dot';
  const ring = document.createElement('span');
  ring.className = 'premium-cursor__ring';
  cursor.append(dot, ring);
  document.body.append(cursor);
  document.body.classList.add('has-premium-cursor');

  let x = -100;
  let y = -100;
  let frame = 0;
  const move = event => {
    x = event.clientX;
    y = event.clientY;
    const target = event.target instanceof Element ? event.target : null;
    const interactive = target?.closest('a,button,[role="button"],input,select,textarea,label');
    const textEntry = target?.closest('input,textarea,[contenteditable="true"]');
    cursor.classList.toggle('is-interactive', Boolean(interactive));
    cursor.classList.toggle('is-hidden', Boolean(textEntry));
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      cursor.style.setProperty('--cursor-x', `${x}px`);
      cursor.style.setProperty('--cursor-y', `${y}px`);
    });
  };

  document.addEventListener('pointermove', move, {passive: true});
  document.addEventListener('pointerdown', () => cursor.classList.add('is-pressed'), {passive: true});
  document.addEventListener('pointerup', () => cursor.classList.remove('is-pressed'), {passive: true});
  document.addEventListener('pointerleave', () => cursor.classList.add('is-hidden'));
  document.addEventListener('pointerenter', () => cursor.classList.remove('is-hidden'));
}

function initGsapAnimations(gsap, ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);

  const intro = gsap.timeline({defaults: {ease: 'power3.out'}});
  intro.from('.hero-copy .eyebrow, .lab-header .eyebrow', {
    y: 14,
    autoAlpha: 0,
    duration: .55,
    stagger: .08
  });
  intro.from('h1', {
    y: 28,
    autoAlpha: 0,
    duration: .8,
    stagger: .08
  }, '-=.28');
  intro.from('h1 .gradient-text', {
    y: 16,
    autoAlpha: 0,
    duration: .58
  }, '-=.3');
  intro.from('.hero-copy > p, .hero-buttons, .hero-ticks, .lab-header aside', {
    y: 16,
    autoAlpha: 0,
    duration: .55,
    stagger: .09
  }, '-=.38');

  if (document.querySelector('.hero .hero-canvas-wrap')) {
    gsap.to('.hero .hero-canvas-wrap', {
      y: 48,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: .8
      }
    });
  }

  for (const section of document.querySelectorAll('.main-content > .section')) {
    const targets = section.querySelectorAll('.section-heading, .panel, .stat-tile, .lab-card, .concept-item');
    if (!targets.length) continue;
    gsap.from(targets, {
      y: 24,
      autoAlpha: 0,
      duration: .72,
      stagger: .075,
      ease: 'power2.out',
      clearProps: 'transform,opacity',
      scrollTrigger: {
        trigger: section,
        start: 'top 82%',
        once: true
      }
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), {once: true});
}

async function initSmoothScroll() {
  if (reducedMotion) return;

  let gsap;
  let ScrollTrigger;
  try {
    const [gsapModule, scrollTriggerModule] = await Promise.all([
      import(GSAP_URL),
      import(SCROLL_TRIGGER_URL)
    ]);
    gsap = gsapModule.gsap || gsapModule.default?.gsap || gsapModule.default;
    ScrollTrigger = scrollTriggerModule.ScrollTrigger || scrollTriggerModule.default?.ScrollTrigger || scrollTriggerModule.default;
    if (!gsap || !ScrollTrigger) throw new Error('GSAP or ScrollTrigger did not expose its expected module export');
  } catch (error) {
    console.warn('ThreadLab scroll animations unavailable; using built-in CSS animations.', error);
    return;
  }

  initGsapAnimations(gsap, ScrollTrigger);

  try {
    const lenisModule = await import(LENIS_URL);
    const Lenis = lenisModule.default || lenisModule.Lenis;
    if (!Lenis) throw new Error('Lenis did not expose its expected module export');
    const lenis = new Lenis({lerp: .085, wheelMultiplier: .9, smoothWheel: true});
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add(time => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);
    document.documentElement.classList.add('lenis', 'lenis-smooth');
  } catch (error) {
    console.warn('Lenis unavailable; native browser scrolling remains enabled.', error);
  }
}

export function initPremiumMotion() {
  mountPreloader();
  mountCursor();
  initSmoothScroll();
}
