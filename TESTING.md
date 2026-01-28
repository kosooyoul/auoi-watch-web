# Testing Guide - Premium Themes Lock/Unlock System

## Quick Test (Browser Console)

Open browser console (F12) and run these commands:

### 1. Check current purchase status
```javascript
showPurchaseStatus()
```

### 2. Unlock a specific pack
```javascript
unlockPack('luxury')  // Unlocks Luxury Pack
unlockPack('nature')  // Unlocks Nature Pack
unlockPack('neon')    // Unlocks Neon Pack
unlockPack('bundle')  // Unlocks all themes
```

### 3. Unlock all packs at once
```javascript
unlockAllPacks()
```

### 4. Reset all purchases (lock everything again)
```javascript
resetPurchases()
```

### 5. Check localStorage data
```javascript
getPurchases()
```

## Manual Testing Checklist

### Test 1: Initial State (All Locked)
1. ✅ Open Settings modal
2. ✅ Scroll to Premium Themes section
3. ✅ Verify all themes show lock icon (🔒)
4. ✅ Verify all "Buy Pack" buttons are enabled
5. ✅ Click a locked theme → should show alert message

### Test 2: Purchase Flow (Test Mode)
1. ✅ Click "Buy Pack" button
2. ✅ Confirm the test purchase dialog
3. ✅ Verify success message appears
4. ✅ Verify lock icons removed from purchased pack themes
5. ✅ Verify "Buy Pack" button changes to "✓ Purchased" (disabled)
6. ✅ Click an unlocked theme → should apply theme

### Test 3: Persistence
1. ✅ Unlock a pack (e.g., Luxury Pack)
2. ✅ Refresh the page (F5)
3. ✅ Open Settings modal
4. ✅ Verify purchased pack is still unlocked
5. ✅ Verify themes can be applied

### Test 4: Theme Application
1. ✅ Unlock any pack
2. ✅ Click on an unlocked premium theme
3. ✅ Verify theme applies to clock (colors change)
4. ✅ Verify theme persists after page refresh
5. ✅ Verify URL updates with theme parameter

### Test 5: Bundle Purchase
1. ✅ Reset purchases: `resetPurchases()`
2. ✅ Unlock bundle: `unlockPack('bundle')`
3. ✅ Verify ALL premium themes are unlocked
4. ✅ Verify all "Buy Pack" buttons show "✓ Purchased"

### Test 6: Edge Cases
1. ✅ Unlock a pack twice → should not cause errors
2. ✅ Apply premium theme → lock it → unlock again → theme still works
3. ✅ Open multiple Settings modals → state consistent

## Expected Behavior

### Locked Theme
- Shows lock icon overlay (🔒)
- Has reduced opacity (0.7)
- Click shows alert: "This theme is part of the [pack] pack..."
- Cannot be applied

### Unlocked Theme
- No lock icon
- Full opacity
- Click applies theme
- Normal hover effects

### Purchased Pack
- Button shows "✓ Purchased"
- Button is disabled (cursor: not-allowed)
- All themes in pack are unlocked

## localStorage Structure

```javascript
// Key: ringClockPurchases
{
  "luxury": {
    "purchased": true,
    "date": "2026-01-19T10:00:00Z",
    "price": 4.99,
    "receipt": null
  },
  "nature": {
    "purchased": false
  },
  "neon": {
    "purchased": false
  },
  "bundle": {
    "purchased": false
  }
}
```

## Console Helpers Reference

| Function | Description |
|----------|-------------|
| `showPurchaseStatus()` | Show current purchase status |
| `unlockPack('packId')` | Unlock specific pack |
| `unlockAllPacks()` | Unlock all packs |
| `resetPurchases()` | Reset all purchases |
| `getPurchases()` | Get raw purchase data |

## Known Limitations (Task 2)

- ❌ No real payment integration (Task 4)
- ❌ No receipt URLs (Task 4)
- ❌ No email validation (Task 4)
- ❌ No server-side verification (Task 4)
- ✅ localStorage only (per-device)
- ✅ Manual unlock via console or "Buy Pack" button

## Next Steps

**Task 3**: Premium Gallery UI improvements (optional)
**Task 4**: Stripe payment integration (critical)
