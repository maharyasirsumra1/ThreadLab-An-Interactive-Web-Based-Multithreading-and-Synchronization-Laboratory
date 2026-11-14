# ThreadLab — Verification Notes and Browser Acceptance Checklist

## Automated checks (November 13, 2026)

- JavaScript syntax verified with `node --check` for all JS modules.
- All eight HTML documents checked for existence and internal static links.
- `npm test`: **6 tests passed, 0 failed**.
- Tested concepts:
  1. Producer–Consumer queue does not exceed capacity, retains FIFO ordering, and handles full/empty conditions.
  2. An intentionally interleaved shared counter loses an update, whereas protected increments produce the correct total.
  3. Experiment runner pause/resume/cancel transitions work.
  4. Range clamping and CSV escaping work.
  5. Browser worker posts start, progress, and complete events including the passed argument.
  6. Browser worker cancellation prevents completion.
- Static HTTP file serving responded successfully locally (HTTP 200).

**Environment limitation:** Automated full-browser acceptance and screenshot capture could not be completed in the authoring environment because its Chromium policy blocks all URL navigation. This restriction does not apply to a normal local user browser. The screenshots listed in the original proposal should be captured after running this project on the target Windows/Ubuntu machine. Do not present these checks as completed visual browser testing.

## Manual QA acceptance (run in Chrome/Edge/Firefox)

- [ ] Open `http://localhost:5500` via `npm run dev` or a Python static server.
- [ ] Dashboard canvas animates; all four lab cards and navigation links work.
- [ ] At approximately 390px mobile width, there is no horizontal document overflow and the navigation drawer opens/closes.
- [ ] **Thread Creation:** choose 2 workers and 500ms duration. Start; confirm 2 started and 2 completed, each with a separate argument.
- [ ] **Thread Creation:** start 8 workers at 4 seconds. Pause/resume and then stop; no further progress occurs after Stop.
- [ ] **Race Condition:** 2 threads × 2 increments, Compare; unsafe observed = 2 of 4, lost = 2; mutex observed = 4 of 4, lost = 0.
- [ ] **Race Condition:** run Unsafe and Mutex separately, and verify completion, reset, logs, and save behavior.
- [ ] **Mutex:** 2 threads × 1 request: each enters the critical section once, with no overlapping owner; total protected writes = 2.
- [ ] **Producer–Consumer:** use 2-slot buffer with Producer-heavy mode; observe full-buffer waits, then Consumer-heavy mode and observe empty-buffer waits in a separate session.
- [ ] **Producer–Consumer:** Step once, Pause/Resume, Finish & save, Reset all work.
- [ ] **Linux Observation:** `ps`, `top`, `ps -T`, `ps aux` example output changes; examples are clearly not live OS data. Step through conceptual process states.
- [ ] **Run History:** completed runs appear; row inspection displays settings/metrics/events. Export JSON and CSV; verify files downloaded.
- [ ] **Run History:** clearing history requires confirmation and leaves empty-state UI.
- [ ] **Learning Guide:** all FAQ accordions, internal links, and explanatory sections work.
- [ ] Resize to tablet (768px) and desktop (1440px); ensure text remains legible and panels are not clipped.
- [ ] Enable reduced motion in OS/browser and ensure decorative movement is suppressed.
- [ ] Browser DevTools Console has no unexpected uncaught exceptions.

## Screenshot capture for academic presentation

1. Dashboard desktop overview
2. Thread creation with completed browser workers and event logs
3. Unsafe race counter (lost updates)
4. Race Compare result (mutex protected)
5. Mutex queue with active lock holder
6. Producer–Consumer buffer at a full condition
7. Linux sample `ps -T` output
8. Run History table with evidence of saved runs
9. Responsive mobile dashboard

Save these into `docs/screenshots/` after actual testing. Do not mistake example Linux output or an animation for actual POSIX/C++ backend execution.
