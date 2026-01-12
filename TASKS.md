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

## Remaining Tasks (Priority Order)

### 1. [MEDIUM] URL-based Theme Sharing
**Why:** "내 시계 설정 봐" - URL 하나로 공유 가능 (웹의 핵심 강점)
**Effort:** Small (1 hour)
**Value:** Medium - 공유 가능성
**Scope:**
- Query params로 테마/설정 인코딩 (예: `?theme=neon&speed=1.5`)
- URL 복사 버튼 ("Share Settings")
- 공유받은 URL 열면 해당 설정으로 자동 적용
**Web Strength:** URL sharing - 웹의 가장 강력한 공유 메커니즘

---

### 2. [MEDIUM] Fullscreen Mode
**Why:** 시계를 전체 화면으로 보고 싶을 때 (프레젠테이션, 대기 화면)
**Effort:** Small (30 min - 1 hour)
**Value:** Medium - 특정 사용 사례에서 큰 가치
**Scope:**
- Fullscreen button 추가
- Fullscreen API 사용
- ESC로 종료 안내 표시
- 전체화면에서 UI 최적화 (설정 버튼 숨기기 등)
**Web Strength:** Fullscreen API - 네이티브처럼 사용 가능

---

### 3. [MEDIUM] PWA Support (Install as App)
**Why:** "앱처럼 설치해서 사용하고 싶다" - 북마크보다 접근성 높음
**Effort:** Medium (2-3 hours)
**Value:** High - 앱 같은 경험
**Scope:**
- manifest.json 생성 (아이콘, 이름, 테마 색상)
- Service Worker 등록 (오프라인 동작)
- Install prompt 추가
- Standalone mode 최적화
**Web Strength:** PWA - 설치 가능, 오프라인, 푸시 알림 가능

---

### 4. [MEDIUM] Alarm / Timer Feature
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

### 5. [LOW] World Clock (Multi-timezone)
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

### 6. [LOW] Stopwatch Mode
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

### 7. [FUTURE] Animation Speed Control
**Why:** 시각적 선호도 - 빠른/느린 애니메이션
**Effort:** Small (1 hour)
**Value:** Low-Medium
**Scope:**
- 속도 슬라이더 (0.5x ~ 2x)
- requestAnimationFrame delta 조정
- localStorage로 저장
**Web Strength:** requestAnimationFrame 정밀 제어

---

### 8. [FUTURE] 12h/24h Format Toggle
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

### 🎯 Next: Task #1 "URL-based Theme Sharing"

**Rationale:**
- 테마 시스템이 완성되었으므로 공유 기능 추가
- 빠른 구현 (1시간 정도)
- 웹의 강력한 특성 활용 (URL sharing)
- 사용자가 설정을 쉽게 공유 가능

**Implementation:**
- Query params로 테마 인코딩 (`?theme=neon`)
- URL 복사 버튼 추가
- 페이지 로드 시 URL params 체크 및 적용
- Effort: 1 hour
- Files: main.js, (optional) index.html

---

## Alternative Next Steps
1. Task #2 (Fullscreen) - 빠른 win, 특정 사용 사례에서 큰 가치
2. Task #3 (PWA) - 앱 경험으로 업그레이드
3. Task #4 (Alarm) - 실용성 추가

---

## Notes
- 모든 작업은 Vanilla JS 유지
- 성능 우선 (60fps 유지)
- 접근성 고려 (키보드 네비게이션, ARIA)
- Live Server로 검증 후 main 머지
