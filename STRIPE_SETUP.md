# Stripe Payment Links Setup Guide

이 가이드는 Ring Time Clock의 프리미엄 테마 결제 시스템을 설정하는 방법을 안내합니다.

## 설정 방식: Stripe Payment Links

**장점:**
- ✅ 서버리스 함수 불필요 (프론트엔드만으로 가능)
- ✅ Stripe Dashboard에서 링크 생성 (코드 작성 최소화)
- ✅ Secret key가 클라이언트에 노출되지 않음
- ✅ 안전하고 빠른 구현

---

## 1단계: Stripe 계정 생성

### 1.1 계정 가입
1. **https://stripe.com** 방문
2. "Start now" 또는 "Sign up" 클릭
3. 이메일과 비밀번호로 가입
4. 계정 생성 완료

### 1.2 Test Mode 활성화
- Dashboard 왼쪽 상단의 토글을 **"Test mode"**로 설정
- 테스트 모드에서는 실제 돈이 결제되지 않습니다
- 테스트 카드로 결제 플로우를 검증할 수 있습니다

---

## 2단계: Payment Links 생성 (4개)

### 2.1 Payment Links 메뉴로 이동
1. Stripe Dashboard 좌측 메뉴에서 **"Payment Links"** 클릭
2. **"+ New"** 버튼 클릭

### 2.2 각 팩마다 링크 생성

총 4개의 Payment Link를 생성해야 합니다:

#### Link 1: Luxury Pack
- **Product name**: Luxury Theme Pack
- **Price**: $4.99 USD
- **Payment type**: One-time
- **Success URL**:
  ```
  http://localhost:5500/?purchase=success&pack=luxury
  ```
- **Cancel URL** (선택사항):
  ```
  http://localhost:5500/?purchase=cancel
  ```

#### Link 2: Nature Pack
- **Product name**: Nature Theme Pack
- **Price**: $3.99 USD
- **Payment type**: One-time
- **Success URL**:
  ```
  http://localhost:5500/?purchase=success&pack=nature
  ```

#### Link 3: Neon Pack
- **Product name**: Neon Theme Pack
- **Price**: $3.99 USD
- **Payment type**: One-time
- **Success URL**:
  ```
  http://localhost:5500/?purchase=success&pack=neon
  ```

#### Link 4: All Themes Bundle
- **Product name**: All Themes Bundle
- **Price**: $12.99 USD
- **Payment type**: One-time
- **Success URL**:
  ```
  http://localhost:5500/?purchase=success&pack=bundle
  ```

### 2.3 Payment Link 생성 완료
각 링크를 생성하면 다음과 같은 URL을 받게 됩니다:
```
https://buy.stripe.com/test_XXXXXXXXXXXXX
```

이 URL들을 복사해서 보관하세요. (다음 단계에서 사용)

---

## 3단계: Payment Link URLs 코드에 반영

### 3.1 js/payment.js 파일 열기
```bash
code js/payment.js
```

### 3.2 PAYMENT_LINKS 객체 수정
파일의 7-12번째 줄에 있는 PAYMENT_LINKS 객체를 찾아서:

**수정 전:**
```javascript
const PAYMENT_LINKS = {
    luxury: 'https://buy.stripe.com/test_PLACEHOLDER_LUXURY',
    nature: 'https://buy.stripe.com/test_PLACEHOLDER_NATURE',
    neon: 'https://buy.stripe.com/test_PLACEHOLDER_NEON',
    bundle: 'https://buy.stripe.com/test_PLACEHOLDER_BUNDLE'
};
```

**수정 후:** (실제 Payment Link URLs 입력)
```javascript
const PAYMENT_LINKS = {
    luxury: 'https://buy.stripe.com/test_YOUR_ACTUAL_LUXURY_LINK',
    nature: 'https://buy.stripe.com/test_YOUR_ACTUAL_NATURE_LINK',
    neon: 'https://buy.stripe.com/test_YOUR_ACTUAL_NEON_LINK',
    bundle: 'https://buy.stripe.com/test_YOUR_ACTUAL_BUNDLE_LINK'
};
```

### 3.3 파일 저장
변경사항을 저장하고 Live Server를 재시작합니다.

---

## 4단계: 로컬 테스트

### 4.1 Live Server 실행
1. VSCode/Cursor에서 `index.html` 우클릭
2. "Open with Live Server" 선택
3. 브라우저에서 `http://localhost:5500` 열림

### 4.2 결제 플로우 테스트
1. **Settings (⚙)** 버튼 클릭
2. **Premium Themes** 섹션으로 스크롤
3. 원하는 팩의 **"Buy Pack"** 버튼 클릭
4. Stripe Checkout 페이지로 리다이렉트 확인

### 4.3 테스트 카드로 결제
Stripe Checkout 페이지에서 다음 테스트 카드 정보 입력:

- **카드 번호**: `4242 4242 4242 4242`
- **만료일**: 미래 날짜 (예: 12/34)
- **CVC**: 아무 3자리 숫자 (예: 123)
- **우편번호**: 아무 5자리 숫자 (예: 12345)

### 4.4 성공 확인
1. "Pay" 버튼 클릭
2. 다시 앱으로 리다이렉트
3. ✓ Success Modal 나타남
4. 프리미엄 테마 잠금 해제 확인
5. 테마 클릭해서 적용 가능 확인

---

## 5단계: 다양한 시나리오 테스트

### Test 1: 각 팩 개별 구매
- Luxury Pack 구매 → 3개 테마 잠금 해제
- Nature Pack 구매 → 3개 테마 잠금 해제
- Neon Pack 구매 → 3개 테마 잠금 해제

### Test 2: Bundle 구매
- Bundle 구매 → 9개 테마 모두 잠금 해제

### Test 3: 결제 취소
- "Buy Pack" 클릭 → Stripe 페이지에서 뒤로가기
- 테마가 잠긴 상태로 유지되는지 확인

### Test 4: 페이지 새로고침
- 테마 구매 후 페이지 새로고침 (F5)
- 구매한 테마가 여전히 잠금 해제된 상태인지 확인

### Test 5: localStorage 확인
브라우저 개발자 도구 Console에서:
```javascript
showPurchaseStatus()
```
구매 내역이 올바르게 표시되는지 확인

---

## 6단계: Production 배포 준비

### 6.1 Success URL 변경
Production 배포 시 Success URL을 실제 도메인으로 변경해야 합니다:

**로컬 (테스트용):**
```
http://localhost:5500/?purchase=success&pack=luxury
```

**Production (실제 서비스):**
```
https://yourdomain.com/?purchase=success&pack=luxury
```

Stripe Dashboard에서 각 Payment Link를 편집해서 Success URL을 업데이트하세요.

### 6.2 Test Mode → Live Mode 전환
1. Stripe Dashboard 왼쪽 상단 토글을 **"Live mode"**로 변경
2. 새로운 Payment Links 생성 (Live mode용)
3. `js/payment.js`의 PAYMENT_LINKS를 Live mode URL로 교체

⚠️ **주의**: Live mode에서는 실제 돈이 결제됩니다!

---

## 트러블슈팅

### 문제 1: "Payment system is not configured" 알림
**원인**: PAYMENT_LINKS에 PLACEHOLDER가 남아있음
**해결**: js/payment.js 파일에서 실제 Payment Link URLs로 교체

### 문제 2: Stripe로 리다이렉트 안 됨
**원인**: js/payment.js가 로드되지 않음
**해결**: 브라우저 Console에서 에러 확인, index.html에 script 태그 있는지 확인

### 문제 3: Success URL로 돌아왔는데 테마가 안 풀림
**원인**: URL 파라미터가 잘못됨
**해결**: Stripe Dashboard에서 Success URL 다시 확인, `?purchase=success&pack=팩ID` 형식 맞는지 확인

### 문제 4: 페이지 새로고침하면 구매가 사라짐
**원인**: localStorage가 동작하지 않음
**해결**: 브라우저 시크릿 모드 아닌지 확인, localStorage 권한 확인

---

## 추가 리소스

### Stripe 문서
- [Payment Links 가이드](https://stripe.com/docs/payment-links)
- [Test Cards 목록](https://stripe.com/docs/testing)
- [Success URL 설정](https://stripe.com/docs/payments/checkout/custom-success-page)

### 개발자 테스트 도구
브라우저 Console에서 사용 가능한 명령어:
```javascript
showPurchaseStatus()    // 구매 내역 확인
unlockPack('luxury')    // 특정 팩 강제 잠금 해제 (테스트용)
unlockAllPacks()        // 모든 팩 강제 잠금 해제 (테스트용)
resetPurchases()        // 모든 구매 초기화 (테스트용)
```

---

## 완료 체크리스트

결제 시스템이 제대로 설정되었는지 확인:

- [ ] Stripe 계정 생성 완료
- [ ] Test Mode 활성화
- [ ] 4개 Payment Links 생성 (luxury, nature, neon, bundle)
- [ ] js/payment.js에 실제 URLs 입력
- [ ] Live Server로 앱 실행
- [ ] "Buy Pack" 버튼 클릭 시 Stripe로 리다이렉트됨
- [ ] 테스트 카드 (4242...) 로 결제 성공
- [ ] Success Modal 나타남
- [ ] 프리미엄 테마 잠금 해제됨
- [ ] 페이지 새로고침 후에도 구매 유지됨
- [ ] 모든 4개 팩 개별 테스트 완료
- [ ] Console 에러 없음

모든 항목이 체크되면 결제 시스템 설정 완료입니다! 🎉

---

## 다음 단계

결제 시스템이 작동하면:
1. 프로덕션 배포 환경 준비 (Vercel, Netlify, GitHub Pages 등)
2. 실제 도메인으로 Success URL 업데이트
3. Test Mode → Live Mode 전환
4. 마케팅 시작 (ProductHunt, Reddit, Twitter 등)
5. 수익 모니터링 (Stripe Dashboard)

---

**문의사항이 있으면 WORKLOG.md에 기록하거나 Business Planner와 상의하세요.**
