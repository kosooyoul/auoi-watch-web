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

---

## 9) Team Structure & Roles

### Two-Role Setup

**Developer** (works in root directory):
- **Worklog**: WORKLOG.md
- **Responsibilities**:
  - Implement features in Vanilla JS/HTML/CSS
  - Test on Live Server
  - Update WORKLOG.md after each task
- **Cannot**: Do business planning, market research, monetization strategy

**Business Planner** (works in `business/` directory):
- **Location**: business/
- **Role Doc**: business/.claude/ROLE.md
- **Worklog**: business/WORKLOG.md
- **Responsibilities**:
  - Research market & competitors
  - Design monetization strategy (premium themes, ads, subscriptions)
  - Create marketing plans (ProductHunt, SEO, social media)
  - Analyze user feedback and business metrics
  - Recommend feature priorities based on business value
- **Cannot**: Write JavaScript/HTML/CSS code

### Information Sharing

**Business Planner → Developer:**
1. Write business proposals in `business/strategy/`
2. Create task cards in `TASKS.md` for revenue-generating features
3. Developer reads proposals and estimates effort

**Developer → Business Planner:**
1. Developer completes features → updates `WORKLOG.md`
2. Business Planner analyzes results (usage data, revenue, feedback)
3. Business Planner adjusts strategy

**Both ↔ Project Manager:**
- PM coordinates priorities across P1/P2/P3
- PM reads both `WORKLOG.md` and `business/WORKLOG.md`
- PM decides when P1 should be "Active Build" (prioritized)

**Shared Documents:**
- `TASKS.md`: Both read & write (development + business tasks)
- `CLAUDE.md`: Both read only (this file - reference)
- `business/WORKLOG.md`: Business Planner writes, Developer & PM read
- `WORKLOG.md`: Developer writes, Business Planner & PM read

**See** `business/README.md` for detailed collaboration protocol.

---

## 10) Business Goals

### Current Status
- ✅ **Product**: MVP complete (v1.6.0 with PWA support)
- ✅ **Features**: 5 themes, URL sharing, fullscreen, offline capability
- ❌ **Monetization**: Not implemented yet
- 🎯 **Next**: Commercialization strategy

### Revenue Opportunities
1. **Premium Themes**: Sell exclusive theme packs ($2.99 one-time or $1.99/month)
2. **Display Ads**: Show ads for free users (AdSense)
3. **Freemium Model**: Free basic features + paid premium (Pomodoro timer, custom themes)
4. **B2B**: White-label for companies ($9.99/user/month)

### Target Customers
- Productivity enthusiasts (Notion, Todoist users)
- Design lovers (Dribbble, Behance community)
- Remote workers (need visual time tracking)

### Success Metrics (6-month goals)
- **Revenue**: $1,000 MRR
- **Users**: 10,000 MAU
- **Conversion**: 5-10% (free → premium)
- **Retention**: 30-day retention > 20%

**See** `business/strategy/` for detailed business plans.
