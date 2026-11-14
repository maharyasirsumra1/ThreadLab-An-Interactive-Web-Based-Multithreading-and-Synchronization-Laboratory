# ThreadLab — Demo and OS Viva Notes

## Short project introduction

ThreadLab is an educational, interactive frontend website for learning process/thread concepts and synchronization. It has an elegant dashboard, four hands-on concurrency labs, a Linux command tutorial, and locally stored run history. The design translates abstract Operating Systems ideas into visual state changes, counters, queues, and time-stamped events.

## Recommended 5–7 minute demonstration

1. **Dashboard:** Explain the four labs and how the application is structured into HTML, CSS, JavaScript, Web Workers and assets.
2. **Thread Creation:** Configure 3 workers with unique arguments and press Start. Show that each real browser worker reports progress independently.
3. **Race Condition:** Run Compare with 3 threads and 3 increments. Explain the non-atomic read–modify–write and why lost updates appear without synchronization.
4. **Mutex:** Run 4 simulated threads and show that the shared critical section only has one owner at any moment. Point out the waiting queue and lock release.
5. **Producer–Consumer:** Reduce buffer capacity to 2 and select Producer-heavy. Watch the queue fill and explain why further producers wait. Then try Consumer-heavy.
6. **Linux Observation:** Demonstrate how `ps`, `top`, and `ps -T` work conceptually. State that terminal output is an illustration, not the live OS process table.
7. **Run History:** Inspect a saved session, review its metrics/events and export the JSON/CSV result.

## Common viva questions and answers

**What is the difference between a process and a thread?**
A process has its own address space and resources. A thread is an execution unit inside a process; threads belonging to one process share parts of that process's memory/resources.

**What is the difference between concurrency and parallelism?**
Concurrency is overlapping progress of tasks. Parallelism means execution at exactly the same time on different computational resources.

**What is a race condition?**
A program can produce different or incorrect results depending on the order or timing of accesses to shared data.

**Why can `counter++` be unsafe when shared?**
It involves reading the old value, adding one, and writing a new value. Several threads may read the same old value and overwrite each other's updates.

**What is a critical section?**
Code that accesses a shared resource where uncontrolled concurrent entry would be unsafe.

**What is a mutex?**
A mutual exclusion lock. One owner holds it at a time, and other requesters wait until it is released.

**What is the producer–consumer problem?**
Producers generate items for a shared bounded buffer. Consumers remove them. Coordination ensures consumers do not take from an empty buffer and producers do not overfill a full buffer.

**What is a Web Worker?**
A JavaScript worker running in a distinct browser execution context. It can execute away from the main UI thread and communicate through messages. It is not a POSIX thread API.

**Why doesn't this frontend run C++ or native Linux commands?**
Browsers sandbox websites. The current version was explicitly constrained to frontend-only, so it uses browser workers and educational state simulations instead of the C++/Linux backend originally proposed.

**Can the visualizations show exact OS scheduler states?**
No. The project displays application-observed or modeled events. It cannot expose internal kernel scheduler state from a normal webpage.

**How are results preserved?**
Run records are saved using the browser's `localStorage` and can be exported as JSON or CSV.

## Suggested slide outline

1. Title / team / course
2. Problem statement and motivation
3. Objectives and user groups
4. Modules and system architecture
5. Browser Worker thread lifecycle demonstration
6. Race condition: unsafe vs mutex-protected results
7. Mutex critical-section queue demonstration
8. Producer–Consumer bounded-buffer example
9. Responsive 3D-inspired design and run history
10. Testing and current limitations
11. Conclusion and questions

## Individual responsibilities

The original proposal names two team members but does not assign their development responsibilities. Agree on and write down real contributions before the viva rather than inventing individual assignments.
