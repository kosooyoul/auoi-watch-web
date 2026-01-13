# auoi-watch-web Tasks & Roadmap

## Current State (v1.5.0)
- ✅ Real-time clock with comet trail animation (ms/sec/min/hour rings)
- ✅ SVG-based premium visual design
- ✅ 60fps smooth animation
- ✅ Accessible text time display
- ✅ Responsive design
- ✅ Theme system with 5 color presets
- ✅ Settings panel UI with modal
- ✅ localStorage persistence for user preferences

---

## Philosophy: 시계의 본질 × 웹의 강점

### 시계가 필요로 하는 것
1. **정확한 시간** - 신뢰할 수 있는 시간 표시
2. **가독성** - 빠르게 시간을 파악
3. **개인화** - 사용자 취향에 맞는 설정
4. **기능성** - 알람, 타이머, 스톱워치 등
5. **접근성** - 어디서나 쉽게 사용

### 웹이 제공하는 강점
1. **localStorage** - 설정 영구 저장 (브라우저 재시작 후에도 유지)
2. **URL Sharing** - 특정 테마/설정을 URL로 공유
3. **PWA** - 설치 가능, 오프라인 동작, 앱처럼 사용
4. **Web APIs** - Notification(알람), Fullscreen, Geolocation, Intl
5. **Cross-platform** - OS/디바이스 무관, 즉시 접근
6. **Responsive** - 모바일부터 대형 모니터까지
7. **No Installation** - URL만 있으면 즉시 사용

---

## Completed Tasks

### ✅ 1. Settings Persistence + Theme Customization (v1.5.0)
**Completed:** 2026-01-12
**Implemented:**
- ✅ 5 color theme presets (Classic, Warm Sunset, Ocean Breeze, Neon Night, Soft Pastel)
- ✅ CSS variables-based theming system
- ✅ Settings modal UI with theme selector
- ✅ localStorage save/restore functionality
- ✅ Dynamic ring color updates based on theme
- ✅ Accessible keyboard navigation and ARIA attributes
- ✅ Smooth theme transition animations (0.3-0.5s)

**Files Modified:**
- `styles.css` - Added CSS variables, settings UI styles
- `index.html` - Added settings button and modal
- `main.js` - Theme system, localStorage, event handlers

---

### ✅ 2. URL-based Theme Sharing (v1.5.0)
**Completed:** 2026-01-12
**Implemented:**
- ✅ Query params로 테마 인코딩 (`?theme=themeName`)
- ✅ "Copy URL" 버튼으로 현재 설정 URL 복사
- ✅ 클립보드 복사 성공/실패 피드백
- ✅ 페이지 로드 시 URL params 우선 적용 (localStorage보다 우선)
- ✅ 테마 변경 시 URL 자동 업데이트 (history.replaceState)

**Functions Implemented:**
- `getThemeFromURL()` - URL에서 테마 파라미터 읽기
- `updateURL()` - 현재 테마로 URL 업데이트
- `copyShareURL()` - 공유 가능한 URL 클립보드 복사
- `showCopyFeedback()` - 복사 성공/실패 시각적 피드백

**Files Modified:**
- `main.js` - URL handling, clipboard API
- `index.html` - Share URL button in settings modal

---

### ✅ 3. Fullscreen Mode (v1.5.0)
**Completed:** 2026-01-12
**Implemented:**
- ✅ Fullscreen 토글 버튼 (⛶) 추가
- ✅ Fullscreen API 사용 (requestFullscreen/exitFullscreen)
- ✅ ESC 종료 안내 힌트 (3초 자동 숨김)
- ✅ 전체화면 시 Settings 버튼 자동 숨김
- ✅ Fullscreen 상태 변화 이벤트 처리
- ✅ 접근성 지원 (aria-label)

**Functions Implemented:**
- `toggleFullscreen()` - 전체화면 진입/종료
- `handleFullscreenChange()` - 전체화면 상태 변화 처리
- `initFullscreen()` - 이벤트 리스너 초기화

**Files Modified:**
- `main.js` - Fullscreen system
- `index.html` - Fullscreen button and hint
- `styles.css` - Fullscreen UI styles

---

### ✅ 4. PWA Support (v1.6.0)
**Completed:** 2026-01-12
**Implemented:**
- ✅ manifest.json 생성 (앱 메타데이터, 아이콘, 테마 색상)
- ✅ Service Worker 등록 (오프라인 캐싱)
- ✅ Cache-first 전략 (CSS, JS, images)
- ✅ Network-first 전략 (HTML)
- ✅ 자동 캐시 업데이트 및 버전 관리
- ✅ App icons 생성 (192x192, 512x512 PNG)
- ✅ Apple Touch Icon 지원
- ✅ Standalone 모드 감지
- ✅ Install prompt 이벤트 핸들링
- ✅ 푸시 알림 준비 (향후 알람 기능용)

**Functions Implemented:**
- `initPWA()` - PWA 초기화 및 Service Worker 등록
- Service Worker (`sw.js`):
  - `install` - 정적 파일 캐싱
  - `activate` - 구 캐시 정리
  - `fetch` - 캐싱 전략 (cache-first/network-first)
  - `sync` - 백그라운드 동기화 준비
  - `push` - 푸시 알림 준비

**Files Created:**
- `manifest.json` - PWA manifest
- `sw.js` - Service Worker (180+ lines)
- `icons/icon.svg` - 앱 아이콘 소스
- `icons/icon-192.png` - 192x192 PNG icon
- `icons/icon-512.png` - 512x512 PNG icon
- `icons/README.md` - Icon generation guide

**Files Modified:**
- `index.html` - Manifest link, meta tags, Apple Touch Icon
- `main.js` - PWA initialization system

**Result:** 앱으로 설치 가능, 오프라인에서도 작동, 독립 창으로 실행

---

## Remaining Tasks (Priority Order)

### 1. [MEDIUM] Alarm / Timer Feature
**Why:** 시계의 핵심 기능 - 단순 시간 표시를 넘어서
**Effort:** Medium-High (3-5 hours)
**Value:** High - 실용적 기능
**Scope:**
- 알람 설정 UI (시간 선택)
- 타이머 카운트다운 UI
- Notification API로 브라우저 알림
- 알람/타이머 목록 관리
- localStorage로 알람 저장
**Web Strength:** Notification API - 백그라운드에서도 알림 가능

---

### 2. [LOW] World Clock (Multi-timezone)
**Why:** 글로벌 시대 - 여러 시간대 동시 확인
**Effort:** Medium (3-4 hours)
**Value:** Medium - 특정 사용자에게 큰 가치
**Scope:**
- 시간대 선택 UI (주요 도시)
- Intl API로 정확한 시간대 처리
- 여러 시계 동시 표시 옵션
- localStorage로 선택한 시간대 저장
**Web Strength:** Intl API - 정확한 국제화/지역화

---

### 3. [LOW] Stopwatch Mode
**Why:** 시계의 부가 기능 - 운동, 요리 등에 유용
**Effort:** Medium (2-3 hours)
**Value:** Medium - 특정 사용 사례
**Scope:**
- Start/Stop/Reset 버튼
- Lap time 기록
- 밀리초 정밀도
- 모드 전환 UI (Clock ↔ Stopwatch)
**Web Strength:** High-precision timing with performance.now()

---

### 4. [FUTURE] Animation Speed Control
**Why:** 시각적 선호도 - 빠른/느린 애니메이션
**Effort:** Small (1 hour)
**Value:** Low-Medium
**Scope:**
- 속도 슬라이더 (0.5x ~ 2x)
- requestAnimationFrame delta 조정
- localStorage로 저장
**Web Strength:** requestAnimationFrame 정밀 제어

---

### 5. [FUTURE] 12h/24h Format Toggle
**Why:** 지역/개인 선호도
**Effort:** Small (1 hour)
**Value:** Low-Medium
**Scope:**
- 토글 버튼
- 시간 표시 포맷 변경
- localStorage로 저장
**Web Strength:** Intl.DateTimeFormat로 자동 지역화 가능

---

## Recommended Next Task

### 🎯 Next: Task #1 "Alarm / Timer Feature"

**Rationale:**
- 기본 UX와 PWA 완성으로 플랫폼 기반 완료
- 시계의 핵심 실용 기능 추가
- 웹의 강력한 특성 활용 (Notification API)
- 백그라운드에서도 알림 가능

**Implementation:**
- 알람/타이머 설정 UI 디자인
- 시간 선택 인터페이스 (시, 분)
- localStorage로 알람 목록 저장
- Notification API로 브라우저 알림
- 반복 알람 옵션 (매일, 평일 등)
- Effort: 3-5 hours
- Files: index.html, main.js, styles.css, (new alarm-system section)

---

## Alternative Next Steps
1. Task #2 (World Clock) - 글로벌 사용자에게 가치
2. Task #3 (Stopwatch) - 부가 기능
3. Task #4 (Animation Speed) - 빠른 구현

---

## Notes
- 모든 작업은 Vanilla JS 유지
- 성능 우선 (60fps 유지)
- 접근성 고려 (키보드 네비게이션, ARIA)
- Live Server로 검증 후 main 머지
