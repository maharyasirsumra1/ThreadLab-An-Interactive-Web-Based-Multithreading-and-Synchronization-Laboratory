const STORAGE_KEY = 'threadlab-theme';
const root = document.documentElement;
const systemPreference = matchMedia('(prefers-color-scheme: dark)');
let storedPreference = null;
let themeButton = null;

try {
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  if (savedTheme === 'dark' || savedTheme === 'light') storedPreference = savedTheme;
} catch (error) {
  console.warn('ThreadLab could not read the saved theme preference.', error);
}

function updateButton(theme) {
  if (!themeButton) return;
  const nextTheme = theme === 'dark' ? 'light' : 'dark';
  themeButton.setAttribute('aria-label', `Switch to ${nextTheme} mode`);
  themeButton.title = `Switch to ${nextTheme} mode`;
  themeButton.setAttribute('aria-pressed', String(theme === 'light'));
}

function applyTheme(theme, persist = false) {
  if (theme !== 'dark' && theme !== 'light') return;

  root.dataset.theme = theme;
  root.dataset.themeReady = 'true';
  updateButton(theme);
  document.dispatchEvent(new CustomEvent('threadlab:themechange', {detail: {theme}}));

  if (persist) {
    storedPreference = theme;
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      console.warn('ThreadLab could not save the theme preference.', error);
    }
  }
}

function makeIcon(name) {
  const namespace = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(namespace, 'svg');
  svg.setAttribute('viewBox', '0 0 24 24');
  svg.setAttribute('fill', 'none');
  svg.setAttribute('stroke', 'currentColor');
  svg.setAttribute('stroke-width', '1.7');
  svg.setAttribute('stroke-linecap', 'round');
  svg.setAttribute('stroke-linejoin', 'round');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('theme-toggle__icon', `theme-toggle__icon--${name}`);

  const shape = document.createElementNS(namespace, name === 'sun' ? 'g' : 'path');
  if (name === 'sun') {
    const circle = document.createElementNS(namespace, 'circle');
    circle.setAttribute('cx', '12');
    circle.setAttribute('cy', '12');
    circle.setAttribute('r', '3.7');
    shape.append(circle);
    for (const [x1, y1, x2, y2] of [
      [12, 2, 12, 4], [12, 20, 12, 22], [4.93, 4.93, 6.35, 6.35],
      [17.65, 17.65, 19.07, 19.07], [2, 12, 4, 12], [20, 12, 22, 12],
      [4.93, 19.07, 6.35, 17.65], [17.65, 6.35, 19.07, 4.93]
    ]) {
      const ray = document.createElementNS(namespace, 'line');
      ray.setAttribute('x1', String(x1));
      ray.setAttribute('y1', String(y1));
      ray.setAttribute('x2', String(x2));
      ray.setAttribute('y2', String(y2));
      shape.append(ray);
    }
  } else {
    shape.setAttribute('d', 'M20.2 15.4A8.6 8.6 0 0 1 8.6 3.8 8.7 8.7 0 1 0 20.2 15.4Z');
    const star = document.createElementNS(namespace, 'path');
    star.setAttribute('d', 'M16.8 3.2v2.2m-1.1-1.1h2.2');
    svg.append(star);
  }
  svg.append(shape);
  return svg;
}

function addThemeToggle() {
  const topbar = document.querySelector('.topbar-right');
  if (!topbar || themeButton) return;

  themeButton = document.createElement('button');
  themeButton.type = 'button';
  themeButton.className = 'theme-toggle';
  themeButton.append(makeIcon('sun'), makeIcon('moon'));
  themeButton.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme, true);
  });
  topbar.append(themeButton);
  updateButton(root.dataset.theme);
}

export function initTheme() {
  const initialTheme = storedPreference || (systemPreference.matches ? 'dark' : 'light');
  applyTheme(initialTheme);
  addThemeToggle();

  const followSystemPreference = event => {
    if (!storedPreference) applyTheme(event.matches ? 'dark' : 'light');
  };
  if (systemPreference.addEventListener) systemPreference.addEventListener('change', followSystemPreference);
  else systemPreference.addListener(followSystemPreference);
}
