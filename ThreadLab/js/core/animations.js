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
  track.setAttribute('role', 'progressbar');
  track.setAttribute('aria-label', 'Loading ThreadLab');
  track.setAttribute('aria-valuemin', '0');
  track.setAttribute('aria-valuemax', '100');

  loader.append(mark, title, status, track);
  document.body.append(loader);

  const setProgress = (value, message) => {
    track.setAttribute('aria-valuenow', String(value));
    track.style.setProperty('--loader-progress', `${value}%`);
    if (message) status.textContent = message;
    if (value === 100) loader.classList.add('is-complete');
  };
  setProgress(34);
  window.setTimeout(() => setProgress(68, 'Finishing the details'), 130);

  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    setProgress(100, 'Ready');
    loader.classList.add('is-leaving');
    window.setTimeout(() => loader.remove(), 650);
  };

  if (document.readyState === 'complete') {
    setProgress(100, 'Ready');
    window.setTimeout(dismiss, 320);
  } else {
    window.addEventListener('load', () => {
      setProgress(100, 'Ready');
      window.setTimeout(dismiss, 350);
    }, {once: true});
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
  const eyebrowTargets = gsap.utils.toArray('.hero-copy .eyebrow, .lab-header .eyebrow');
  if (eyebrowTargets.length) intro.from(eyebrowTargets, {
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
  const gradientHeadings = gsap.utils.toArray('h1 .gradient-text');
  if (gradientHeadings.length) intro.from(gradientHeadings, {
    y: 16,
    autoAlpha: 0,
    duration: .58
  }, '-=.3');
  const introTargets = gsap.utils.toArray('.hero-copy > p, .hero-buttons, .hero-ticks, .lab-header aside');
  if (introTargets.length) intro.from(introTargets, {
    y: 16,
    autoAlpha: 0,
    duration: .55,
    stagger: .09
  }, '-=.38');
  const statValues = gsap.utils.toArray('.stat-value');
  if (statValues.length) gsap.from(statValues, {
    scale: .88,
    autoAlpha: 0,
    duration: .65,
    stagger: .07,
    ease: 'back.out(1.4)',
    clearProps: 'transform,opacity'
  });

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
    gsap.to(section, {
      '--section-parallax-y': '38px',
      ease: 'none',
      scrollTrigger: {
        trigger: section,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1
      }
    });
  }

  window.addEventListener('load', () => ScrollTrigger.refresh(), {once: true});
}

function mountScrollProgress() {
  const progress = document.createElement('div');
  progress.className = 'premium-scroll-progress';
  progress.setAttribute('role', 'progressbar');
  progress.setAttribute('aria-label', 'Page scroll progress');
  progress.setAttribute('aria-valuemin', '0');
  progress.setAttribute('aria-valuemax', '100');
  const fill = document.createElement('span');
  progress.append(fill);
  document.body.append(progress);

  let frame = 0;
  const update = () => {
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const value = Math.min(100, Math.max(0, window.scrollY / maxScroll * 100));
      fill.style.transform = `scaleX(${value / 100})`;
      progress.setAttribute('aria-valuenow', String(Math.round(value)));
    });
  };

  window.addEventListener('scroll', update, {passive: true});
  window.addEventListener('resize', update, {passive: true});
  update();
}

function mountCardTilt() {
  if (reducedMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  for (const card of document.querySelectorAll('.lab-card, .concept-item, .stat-tile')) {
    if (card.classList.contains('tilt-card')) continue;
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - .5;
      const y = (event.clientY - bounds.top) / bounds.height - .5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 4).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg) translateY(-2px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  }
}

function mountMagneticButtons() {
  if (reducedMotion || !matchMedia('(hover: hover) and (pointer: fine)').matches) return;
  for (const button of document.querySelectorAll('.hero-buttons .button-primary, .button-row .button-primary')) {
    button.addEventListener('pointermove', event => {
      if (button.disabled) return;
      const bounds = button.getBoundingClientRect();
      const x = (event.clientX - bounds.left - bounds.width / 2) * .1;
      const y = (event.clientY - bounds.top - bounds.height / 2) * .1;
      button.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  }
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
  mountScrollProgress();
  mountCardTilt();
  mountMagneticButtons();
  initSmoothScroll();
}
