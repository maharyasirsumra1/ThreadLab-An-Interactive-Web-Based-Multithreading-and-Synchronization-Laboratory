# ThreadLab — Proposal Requirements Traceability

Source: supplied **OS Project Proposal**, pages 2–7. This document tracks every user-facing requirement and explains the unavoidable frontend-only deviation from the original C++ implementation.

## Core features (proposal section 4.1)

| Proposal item | Delivery | Status |
| --- | --- | --- |
| **4.1.1 Interactive dashboard** — select, configure, view results | Homepage, sidebar, seven internal sections, responsive panels, experiment controls | Implemented |
| **4.1.2 Thread creation & management** — multiple threads, arguments, execution, completion | `pages/thread-creation.html`, `js/workers/thread-worker.js` using actual browser workers | Browser-native equivalent; not C++ threads |
| **4.1.3 Race conditions** — synchronized vs unsynchronized counters | `pages/race-condition.html`, controlled unsafe and mutex-protected interleavings, compare output | Implemented as educational simulation |
| **4.1.4 Mutex synchronization** — locks, shared resource, critical section | `pages/mutex.html`, lock owner, FIFO waiter queue, protected counter | Implemented as educational simulation |
| **4.1.5 Producer–consumer** — synchronized bounded buffer | `pages/producer-consumer.html`, finite capacity, FIFO operations, full/empty waits | Implemented as educational simulation |
| **4.1.6 Execution logs & visualization** — events, states, results | All four labs: timestamped logs, state indicators, metrics, canvas/DOM visualizations; Run History page | Implemented |
| **4.1.7 Linux process/thread observation (if feasible)** | `pages/linux-observation.html`, selectable sample command outputs, process tree, browser hints | Illustrative data only; real OS process inspection impossible in static frontend |

## Operating Systems concepts (proposal section 4.2)

- Process vs thread: Learning Guide and Linux Observation
- Thread creation, execution and completion: Thread Creation lab
- Concurrency / multithreading: Thread Creation lab + guide
- Shared resources and critical sections: Race / Mutex labs
- Race conditions and mutual exclusion: Race / Mutex labs
- Mutex synchronization: Mutex lab
- Producer–consumer coordination: Producer–Consumer lab
- Basic Linux observation: Linux Observation teaching examples
- Optional deadlocks and advanced synchronization: **not required**; original proposal calls these extensions after the core.

## User experience and design

- Professional premium dark interface, 3D-style responsive animated canvas hero, cards with perspective transforms, smooth gradients and interactions.
- Responsive desktop, tablet and mobile navigation; mobile drawer, touch-friendly controls.
- Scroll reveals, animated status elements, state transitions, semantic controls, live values and button feedback.
- `prefers-reduced-motion` support for motion-sensitive users.
- HTML files under root/pages, CSS under `css`, scripts under `js`, assets under `assets`.

## Original proposal 4.4 and 4.5: technology and limitations

| Original requirement | Resolution under frontend-only instruction |
| --- | --- |
| Frontend HTML5, CSS3, JavaScript | Fully implemented |
| C++ backend with actual threads | **Not implemented** — conflicts with strictly frontend-only architecture; replaced with browser workers / models |
| C++ threads / POSIX threads | **Not implemented** — standard browser cannot execute host C++/POSIX thread programs |
| Local frontend/backend HTTP + JSON API | **Not implemented** — application has no backend; local static HTTP is used only to serve files |
| G++ Ubuntu / WSL development | Not needed for static frontend; optional for separately running original C++ exercises |
| Git | Optional and available externally; no repository is required for download |
| Run predefined experiments only | Implemented; no arbitrary user code execution |
| Simplified thread-state events | Implemented and truthfully labeled (not actual OS scheduler states) |
| No scheduling algorithms, memory manager, cloud, accounts or DB | Respected |

## Work Breakdown Structure deliverables (proposal pages 5–7)

| WBS | Deliverable under frontend-only build |
| --- | --- |
| 1.0–1.3 Planning | This requirement matrix documents objectives, selected experiments, users and exclusions |
| 2.1 Web interface | Implemented dashboard and individual labs |
| 2.2–2.3 Backend plan / HTTP endpoints | Superseded by frontend-only requirement (no C++ backend / API) |
| 2.4 Event/state model | Shared `js/core/ui.js` logging, storage, state model and per-lab visual states |
| 3.1 HTML pages | Separate files in `pages/` |
| 3.2 Responsive styling | Organized CSS under `css/` |
| 3.3 JavaScript interactions | Modules in `js/features/` and `js/core/` |
| 3.4 Results and logs | Visual panels on labs and Run History |
| 4.1 C++ environment | Superseded; static frontend has no C++ compilation |
| 4.2 Thread creation | Actual browser workers with arguments |
| 4.3 Race counter | Controlled event-based simulation |
| 4.4 Mutex | Controlled lock/queue simulation |
| 4.5 Producer–consumer | Stateful bounded-buffer simulation |
| 4.6 Record results | Event log + locally saved run objects |
| 4.7 Linux commands | Clearly labeled illustrative examples |
| 5.1 App/backend integration | Not applicable; local frontend state and browser workers use message passing |
| 5.2 Thread completion tests | Unit-testable lifecycle + manual browser checklist |
| 5.3 Sync vs unsync compare | Interactive Compare experiment + deterministic counter checks |
| 5.4 Invalid inputs / cleanup | Slider bounds, payload max length, worker termination, runner cancellation, queue invariants |
| 5.5 Responsiveness | Desktop/tablet/mobile CSS; manual browser checklist |
| 6.1 Technical documentation | `README.md` and docs under `docs/` |
| 6.2 Screenshots and test results | Unit-test evidence in `docs/TEST_REPORT.md`; screenshots must be captured on target machine |
| 6.3 Demonstration / presentation | `docs/PRESENTATION_NOTES.md` |
| 6.4 Individual viva | OS Q&A and demo explanation in presentation notes |
