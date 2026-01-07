# Project: Ring Time Clock (Vanilla JS)

## 1) Goal (What we are building)
- Build a web-based clock using **Vanilla JavaScript + HTML + CSS** (no framework).
- Display time as **HH / MM / SS / MS** (milliseconds).
- Each time unit is represented as a **ring** (circular progress).
- Rings fill smoothly according to time flow, with **emotionally pleasing** visuals (soft motion, subtle glow, tasteful gradients, premium feel).

## 2) Product Spec (Must-have)
### Time units
- Hours: 00–23 (or 01–12 if we add a toggle later; default is 24h)
- Minutes: 00–59
- Seconds: 00–59
- Milliseconds: 000–999

### Rings behavior
- Each time unit maps to a ring progress:
  - hourProgress = currentHour / 24
  - minuteProgress = currentMinute / 60
  - secondProgress = currentSecond / 60
  - msProgress = currentMs / 1000
- Rings should animate **smoothly** (avoid jitter):
  - Prefer `requestAnimationFrame` loop.
  - Use actual `Date.now()` / `performance.now()` to compute progress (not incremental timers).

### Visual/UX
- “감성의 터치” 우선순위:
  - Smooth motion (easing), not robotic stepping.
  - Subtle glow, blur, shadow, glass 느낌 가능.
  - Typography is clean and calm.
  - Colors: tasteful, not oversaturated; gradients OK but avoid noisy rainbow.
- Page should be responsive and centered.
- Accessibility:
  - Provide a readable text time (HH:MM:SS.mmm) as well.
  - Ensure contrast is acceptable.

## 3) Tech Constraints
- Vanilla JS only (no React/Vue).
- No build step required.
- Must run by opening with **Live Server** (VSCode/Cursor extension) or equivalent static server.

### Rendering choice (fixed)
- Rings are rendered with **SVG circles**.
- Progress updates by changing `stroke-dashoffset`.
- Use `requestAnimationFrame` for smooth motion.
- Visual direction: calm, premium, minimal (avoid flashy UI).

## 4) Repo Structure (recommended)
- /index.html
- /styles.css
- /main.js
- /assets/ (optional: fonts, icons)
- /docs/ (optional: design notes)

## 5) Branching & Git Workflow
- Only use branches: `dev` and `main`.
- All work is done on `dev`.
- After manual testing on Live Server, merge `dev` → `main`.

### Commit rules
- Small commits with clear messages:
  - `feat: ...` / `fix: ...` / `style: ...` / `chore: ...`

## 6) How to Run / Test
- Open repo folder in VSCode or Cursor
- Run Live Server on `index.html`
- Manual checks (must pass before merge to main):
  1) Clock updates smoothly (no stutter)
  2) Rings fill correctly and continuously
  3) Tab inactive → resume without time drift (uses real time)
  4) Works on desktop + mobile viewport
  5) No console errors

## 7) Coding Guidelines (must follow)
- Keep files small and readable.
- Avoid magic numbers: define constants like `HOURS_IN_DAY = 24`.
- Prefer pure functions for progress calculation.
- Rendering:
  - If using `<canvas>`, keep draw loop efficient.
  - If using SVG, update stroke-dashoffset efficiently.
- Do not introduce external libraries unless explicitly approved.

## 8) Definition of Done (DoD)
A task is "done" only if:
- Implemented on `dev`
- Verified on Live Server (manual checks above)
- No console errors
- Code is formatted and commented where needed
- Brief summary added in commit message or PR notes
