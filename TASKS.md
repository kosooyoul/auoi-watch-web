# auoi-watch-web Tasks & Roadmap

## Current State (v1.9.0)
- ✅ Real-time clock with comet trail animation (ms/sec/min/hour rings)
- ✅ SVG-based premium visual design
- ✅ 60fps smooth animation
- ✅ Accessible text time display
- ✅ Responsive design
- ✅ Theme system with 5 color presets
- ✅ Settings panel UI with modal
- ✅ localStorage persistence for user preferences
- ✅ PWA support (offline, installable)
- ✅ Alarm & Timer system with visual markers
- ✅ Notification API integration
- ✅ World Clock with multi-timezone support
- ✅ Stopwatch with lap timing and millisecond precision

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

### ✅ 5. Alarm & Timer System with Visual Markers (v1.7.0)
**Completed:** 2026-01-14
**Implemented:**
- ✅ Alarm UI with second-precision input (HH:MM:SS format)
- ✅ Timer countdown with progress bar
- ✅ Visual alarm markers on clock rings
  - Markers appear on hour/minute/second rings based on alarm time
  - Markers disappear when comet trail passes (natural flow)
  - Pulsing animation with glow effects
  - Accurate 24-hour positioning with SVG rotation compensation
- ✅ Notification API integration for browser alerts
- ✅ Alarm management (add/delete/toggle/sort)
- ✅ localStorage persistence for alarms
- ✅ Premium UI design with glassmorphic effects
- ✅ Responsive modal (85vh max-height, mobile-optimized)
- ✅ Alarm button positioned on left side (no overlap with settings)

**Marker Display Logic:**
- Same hour & minute → second ring
- Same hour only → minute ring
- Different hour → hour ring
- Markers scale with ring size (7px/6px/5px)

**Functions Implemented:**
- `addAlarm()` - Create alarm with hour/minute/second
- `renderAlarms()` - Display alarm list with HH:MM:SS format
- `checkAlarms()` - Check for triggered alarms every second
- `triggerAlarm()` - Fire notification and play sound
- `renderAlarmMarkers()` - Draw visual markers on clock rings
- `toggleTimer()` - Start/pause timer
- `resetTimer()` - Reset timer to zero
- `updateTimer()` - Update timer display and progress bar

**Files Modified:**
- `index.html` - Added seconds input, alarm markers container
- `main.js` - Alarm/timer system, marker rendering (110+ lines)
- `styles.css` - Premium UI styling, marker animations (300+ lines)

**Result:** Full-featured alarm and timer system with visual clock integration

---

### ✅ 6. World Clock (Multi-timezone) (v1.8.0)
**Completed:** 2026-01-15
**Implemented:**
- ✅ World clock button (🌍) positioned on left side below alarm button
- ✅ Modal UI with city selection dropdown
- ✅ 20 major cities across all timezones (Seoul, Tokyo, NYC, London, Paris, Sydney, etc.)
- ✅ Intl API for accurate timezone conversion
- ✅ Real-time updates (1-second interval)
- ✅ Display time (HH:MM:SS), date, and UTC offset for each city
- ✅ Add/delete cities with duplicate prevention
- ✅ localStorage persistence for selected timezones
- ✅ Premium glassmorphic UI design
- ✅ Responsive layout for mobile devices
- ✅ Smooth animations and hover effects

**Cities Included:**
- Asia: Seoul, Tokyo, Hong Kong, Singapore, Shanghai, Dubai, Mumbai
- Europe: Moscow, Istanbul, Paris, London, Berlin
- Americas: New York, Los Angeles, Chicago, Toronto, Mexico City, São Paulo
- Oceania: Sydney, Auckland

**Functions Implemented:**
- `initWorldClockSystem()` - Initialize system with dropdown and event listeners
- `addWorldClock()` - Add new city clock with duplicate check
- `deleteWorldClock()` - Remove city clock
- `renderWorldClocks()` - Render all clock cards
- `createClockCard()` - Create individual clock card element
- `updateWorldClocks()` - Update all clocks every second with Intl API
- `saveWorldClocks()` - Persist to localStorage
- `loadWorldClocks()` - Load from localStorage on init

**Files Modified:**
- `index.html` - World clock button, modal structure (25 lines)
- `main.js` - World clock system (265+ lines)
- `styles.css` - Premium UI styling, animations (295+ lines)

**Result:** Fully functional world clock system with accurate timezone support using Web Intl API

---

### ✅ 7. Stopwatch Mode (v1.9.0)
**Completed:** 2026-01-15
**Implemented:**
- ✅ Stopwatch button (⏱️) on left side below world clock
- ✅ Premium glassmorphic modal interface
- ✅ High-precision timing with performance.now()
- ✅ Start/Stop/Reset/Lap controls with premium UI
- ✅ HH:MM:SS.mmm format display
- ✅ Lap time recording with split and total times
- ✅ Automatic fastest/slowest lap highlighting (green/red borders)
- ✅ 60fps smooth animation with requestAnimationFrame
- ✅ Responsive design for mobile and desktop
- ✅ Accessible keyboard navigation (ESC to close)

**Functions Implemented:**
- `initStopwatchSystem()` - Initialize modal and event listeners
- `toggleStopwatch()` - Start/stop timing with state management
- `startStopwatchAnimation()` - 60fps animation loop
- `updateStopwatchDisplay()` - Real-time display updates
- `formatStopwatchTime()` - Format ms to HH:MM:SS.mmm
- `recordLap()` - Record lap with split and total times
- `resetStopwatch()` - Reset all state and clear laps
- `renderLapTimes()` - Render lap list with fastest/slowest highlighting
- `createLapElement()` - Create individual lap card elements

**Files Modified:**
- `index.html` - Stopwatch button and modal structure (44 lines)
- `main.js` - Stopwatch timing system and lap recording (297 lines)
- `styles.css` - Premium UI styling and animations (425 lines)

**Result:** Full-featured stopwatch with millisecond precision and lap timing

---

## Remaining Tasks (Priority Order)

### 2. [FUTURE] Recurring Alarms
**Why:** 매일/평일 반복 알람 - 더 실용적
**Effort:** Small (1-2 hours)
**Value:** Medium - 알람 기능 확장
**Scope:**
- 반복 옵션 UI 연결 (이미 HTML에 존재)
- 반복 로직 구현
- localStorage에 반복 설정 저장
**Web Strength:** Date/Time API로 요일 계산

---

### 3. [FUTURE] Animation Speed Control
**Why:** 시각적 선호도 - 빠른/느린 애니메이션
**Effort:** Small (1 hour)
**Value:** Low-Medium
**Scope:**
- 속도 슬라이더 (0.5x ~ 2x)
- requestAnimationFrame delta 조정
- localStorage로 저장
**Web Strength:** requestAnimationFrame 정밀 제어

---

### 4. [FUTURE] 12h/24h Format Toggle
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

### 🎯 Next: Task #2 "Recurring Alarms"

**Rationale:**
- Stopwatch 완성으로 시계의 핵심 부가 기능 완료
- 반복 알람은 실용성을 크게 향상시킴
- HTML UI가 이미 존재하여 구현이 빠름
- 매일/평일 알람은 가장 많이 요청되는 기능
- Date/Time API를 활용한 자연스러운 구현

**Alternative Next Steps:**
1. Task #3 (Animation Speed Control) - 빠른 구현 (1시간)
2. Task #4 (12h/24h Format Toggle) - 지역화 개선 (1시간)
3. Business planning - 수익화 전략 수립

---

## Notes
- 모든 작업은 Vanilla JS 유지
- 성능 우선 (60fps 유지)
- 접근성 고려 (키보드 네비게이션, ARIA)
- Live Server로 검증 후 main 머지
