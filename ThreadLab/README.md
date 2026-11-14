# ThreadLab — Interactive Multithreading & Synchronization Laboratory

**A premium, responsive, frontend-only OS learning website** built from the supplied project proposal. No framework, login, API, database, or application backend is required. Three.js, GSAP/ScrollTrigger, Lenis, and Google Fonts load from CDNs for the visual experience; internet access enables those enhancements, while local fallbacks preserve the core interface when a CDN is unavailable.

## Start the project

### Option A — VS Code + Node.js (recommended)

1. Extract the `ThreadLab` folder and open that entire folder in Visual Studio Code.
2. Open **Terminal → New Terminal**.
3. Run:

   ```bash
   npm run dev
   ```

4. Visit **http://localhost:5500/** in your browser.

`npm run dev` launches a **static file server only**; it is not a C++ or application backend. It serves the HTML/CSS/JS files so the browser can load JavaScript modules and Web Workers. This project has **zero npm dependencies**. The optional 3D, smooth-scroll, animation, and web-font enhancements are fetched from CDNs; without internet, the hero uses its built-in canvas rendering and the browser uses native scrolling.

### Option B — Python static server

From the project folder, run:

```bash
python -m http.server 5500
```

Open **http://localhost:5500/**. On Ubuntu, `python3 -m http.server 5500` is often the correct command.

### Option C — VS Code Live Server

Right-click `index.html` and choose **Open with Live Server**. Navigate using the sidebar.

**Do not open `index.html` by double-clicking** if you intend to use Thread Creation. Most browsers restrict Web Workers and ES module imports on `file://` URLs. Run one of the static servers instead.

## Included pages

| Page | Functionality |
| --- | --- |
| `index.html` | Home dashboard, animated 3D-like network hero, four lab launchers, demo terminal, local activity summary |
| `pages/thread-creation.html` | Actual JavaScript Web Workers, argument passing, parallel/staggered dispatch, progress, pause, cancel, completion |
| `pages/race-condition.html` | Simulated interleaved read/write operations; unsafe, protected, or side-by-side comparison; lost-update metrics |
| `pages/mutex.html` | FIFO mutex / critical-section simulation; lock ownership, queued requests, protected writes |
| `pages/producer-consumer.html` | Bounded FIFO queue simulation; capacity and worker controls; full/empty blocking, live fill visualization and history |
| `pages/linux-observation.html` | **Illustrative** `ps`, `top`, `ps -T`, `ps aux` outputs, browser capability facts, process states |
| `pages/concepts.html` | Guided OS concepts, learning path, design boundaries, FAQs |
| `pages/results.html` | Local run history, metrics and event inspector, filters, JSON/CSV export, clearing results |

## Core interactions

- Configure each experiment using sliders, selectors, and text fields.
- Start, pause/resume, stop, and reset where applicable. Producer–Consumer also supports a single **Step once** and **Finish & save**.
- Read timestamped event logs, copy them, and export JSON.
- Completed experiments are saved in this browser's `localStorage` (maximum 80 runs).
- Review experiment history under **Run History**, and export saved runs in JSON or CSV.
- Explore device-specific browser API hints in **Linux Observation**; example terminal output is explicitly labeled as such.
- Animations support reduced-motion preferences, and the layout adapts to phones, tablets, and desktops.

## Important frontend-only scope clarification

The original proposal explicitly specifies a **C++ backend, POSIX/C++ threads, and a local HTTP/JSON interface**. Your newer instruction requires **frontend-only**, which overrides that architecture. It is not possible for an ordinary standalone static browser website to run the original C++ program or execute `ps`, `top`, and `ps -T` against the visitor's operating system.

Accordingly:

- Thread Creation executes **actual browser Web Workers**, using message passing; these are not C++ or POSIX threads.
- Race Condition uses a controlled, educational read/modify/write interleaving model.
- Mutex Synchronization uses a simulated ownership lock and FIFO queue.
- Producer–Consumer uses a stateful bounded FIFO queue model, demonstrating waiting conditions.
- Linux process outputs and process IDs are **illustrative**, never falsely presented as live system output.
- Thread-state visualizations are based on application events, **not** exact OS scheduler states.

This covers the **frontend-visible learning features** of the proposal without claiming the original backend's OS-level execution. To satisfy the original C++ backend requirements literally, a separate backend (or explicitly provisioned, compiled WASM solution with restrictions) would be necessary and would change the frontend-only scope.

## Project folder structure

```text
ThreadLab/
├── index.html
├── pages/
│   ├── thread-creation.html
│   ├── race-condition.html
│   ├── mutex.html
│   ├── producer-consumer.html
│   ├── linux-observation.html
│   ├── concepts.html
│   └── results.html
├── css/
│   ├── variables.css
│   ├── base.css
│   ├── layout.css
│   ├── components.css
│   ├── animations.css
│   ├── pages.css
│   └── premium.css
├── js/
│   ├── core/
│   │   ├── app.js
│   │   ├── animations.js
│   │   ├── orbit.js
│   │   ├── scene3d.js
│   │   ├── simulation.js
│   │   └── ui.js
│   ├── features/   # One JavaScript module per page/experiment
│   └── workers/    # Dedicated browser worker script
├── assets/
│   ├── icons/      # SVG favicon
│   ├── images/     # SVG graphic asset
│   └── fonts/      # Reserved (system font fallback used)
├── scripts/        # Development-only static HTTP server + launchers
├── tests/          # Automated logic tests
├── docs/           # Requirement matrix, verification and viva notes
├── package.json
└── README.md
```

Each page is a separate HTML file. CSS, dynamic behavior, animations, visualizations, static assets, and workers live in their respective directories.

## Test instructions

Run from the project root:

```bash
npm test
```

This verifies bounded-buffer capacity and FIFO behavior, lost updates and protected writes, runner state transitions, and shared utilities. Also manually follow the acceptance checklist in `docs/TEST_REPORT.md` in a real browser.

## Academic project context

- **Title:** ThreadLab: An Interactive Web-Based Multithreading and Synchronization Laboratory
- **Course:** Operating Systems
- **Audience:** Software Engineering / Computer Science students and OS instructors
- **Original technologies:** HTML/CSS/JS frontend and C++ backend (adapted to frontend-only by request)

See `docs/REQUIREMENTS_MATRIX.md`, `docs/TEST_REPORT.md`, and `docs/PRESENTATION_NOTES.md` for proposal coverage, verification, and presentation/viva guidance.
