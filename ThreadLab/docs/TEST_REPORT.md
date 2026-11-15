# ThreadLab — Verification Notes and Browser Acceptance Checklist

## Automated and browser checks (November 14, 2026)

- JavaScript syntax verified with `node --check` for all 16 JS modules.
- All eight HTML documents checked for existence and internal static links.
- `npm test`: **6 tests passed, 0 failed**.
- Chrome smoke-tested all eight pages in both themes; system color preference, saved theme, reduced motion, and the light-mode custom cursor were verified.
- Browser interactions verified: two real Web Workers and passed arguments; worker pause/resume/stop; race comparison (2/4 unsafe with 2 lost updates, 4/4 protected); two mutex writes; producer–consumer step/finish plus full-buffer producer waits and empty-buffer consumer waits; Linux command/state controls; FAQ accordion; and four saved runs in Run History.
- Mobile navigation opened and closed at 390px. At 390px, 768px, and 1440px there was no user-scrollable horizontal overflow.
- No uncaught page errors or browser console errors during the checks. Test-generated local history and theme preferences were restored afterward.
- Tested concepts:
  1. Producer–Consumer queue does not exceed capacity, retains FIFO ordering, and handles full/empty conditions.
  2. An intentionally interleaved shared counter loses an update, whereas protected increments produce the correct total.
  3. Experiment runner pause/resume/cancel transitions work.
  4. Range clamping and CSV escaping work.
  5. Browser worker posts start, progress, and complete events including the passed argument.
  6. Browser worker cancellation prevents completion.
- Static HTTP file serving responded successfully locally (HTTP 200).

**Scope note:** These are local Chrome smoke checks, not a complete acceptance pass for every item below. Unchecked items still require manual verification. No presentation screenshots were saved in this repository.

## Remaining manual QA

- [ ] Dashboard canvas animates; test each lab card and sidebar link by clicking through the site.
- [ ] **Thread Creation:** after Stop, confirm worker progress does not continue.
- [ ] **Race Condition:** run Unsafe and Mutex separately; verify reset, event-log copy/export, and saved results.
- [ ] **Mutex:** verify queued requests never overlap, then test reset and event-log copy/export.
- [ ] **Producer–Consumer:** test continuous-run Pause/Resume and Reset after a finished session.
- [ ] **Linux Observation:** verify `ps`, `top`, `ps -T`, `ps aux`, Copy, and a complete process-state lifecycle.
- [ ] **Run History:** inspect a saved run's details, download JSON/CSV and a selected run, then confirm Clear History and its empty state.
- [ ] **Learning Guide:** check every FAQ, internal link, and explanatory section.
- [ ] At 768px and 1440px, visually inspect text legibility and panel clipping in both themes.

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

Save these into `docs/screenshots/` after remaining visual checks. Do not mistake example Linux output or an animation for actual POSIX/C++ backend execution.
