# Ring Time Clock

A web-based clock that displays time as animated circular progress rings with comet trail effects. Built with vanilla JavaScript for smooth, emotionally pleasing visuals.

## Version 1.16.0 - Premium Themes & Payment System

## Features

### Core Clock
- **4 Animated Rings** - Hours, Minutes, Seconds, Milliseconds
- **Comet Trail Effect** - Arc-based animation with natural flowing motion
- **Smooth 60fps Animation** - Uses `requestAnimationFrame` for fluid motion
- **Premium Design** - Subtle gradients, glow effects, and calm aesthetics
- **Responsive** - Works on desktop, tablet, and mobile
- **Accessible** - Includes text-based time display

### Themes & Customization
- **14 Color Themes** - 5 free themes + 9 premium themes
  - **Free**: Classic, Warm Sunset, Ocean Breeze, Neon Night, Soft Pastel
  - **Premium**: Luxury Pack, Nature Pack, Neon Pack (3 themes each)
- **Premium Theme Packs** - Purchase exclusive theme collections
  - Luxury Pack ($4.99) - Golden Hour, Midnight Marble, Rose Gold Elegance
  - Nature Pack ($3.99) - Forest Twilight, Ocean Depths, Desert Dawn
  - Neon Pack ($3.99) - Cyberpunk Magenta, Electric Lime, Neon Ultraviolet
  - Bundle ($12.99) - All 9 premium themes (save 20%)
- **12h/24h Format Toggle** - Switch between 12-hour (AM/PM) and 24-hour time display
- **Animation Speed Control** - Adjust animation speed from 0.5x (calm) to 2.0x (energetic)
- **Theme Sharing** - Share your theme via URL
- **Settings Panel** - Easy customization with glassmorphic UI
- **Fullscreen Mode** - Distraction-free display

### Alarms & Timers
- **Recurring Alarms** - Once, Daily, Weekdays, Weekends, or Custom days
- **Visual Markers** - Alarm indicators displayed on clock rings
- **Timer System** - Countdown timer with progress bar
- **Notification Alerts** - Browser notifications when alarms trigger
- **Second Precision** - Set alarms with HH:MM:SS accuracy

### Advanced Features
- **World Clock** - Multi-timezone support with 20 major cities
- **Stopwatch** - Millisecond precision with lap timing
- **PWA Support** - Install as app, works offline
- **localStorage** - All settings and alarms persist across sessions

### Technical
- **No Framework** - Pure HTML, CSS, and JavaScript
- **Modular Architecture** - 9 focused modules for maintainability
- **60fps Performance** - Optimized rendering and animations

## Demo

Each time unit is represented as a circular progress ring:
- **Hour ring** (outermost) - Purple gradient
- **Minute ring** - Pink gradient
- **Second ring** - Blue gradient
- **Millisecond ring** (innermost) - Green gradient

## How to Run

1. Open the project folder in VSCode or Cursor
2. Install [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) if you haven't
3. Right-click on `index.html`
4. Select "Open with Live Server"
5. Your browser will open at `http://localhost:5500` (or similar)

Alternatively, use any static file server:
```bash
# Python
python -m http.server 8000

# Node.js
npx serve
```

## Tech Stack

- **HTML5** - SVG circles for ring rendering
- **CSS3** - CSS variables for theming, gradients, filters, responsive design
- **Vanilla JavaScript** - No frameworks or dependencies
- **Web APIs** - Notification API, Fullscreen API, Intl API, Service Worker

## Architecture

### Modular Structure
- `js/constants.js` - Theme definitions, city list, configuration
- `js/utils.js` - Helper functions (color conversion, formatting)
- `js/theme.js` - Theme system and settings UI
- `js/payment.js` - Payment system (Stripe integration)
- `js/clock.js` - Core clock rendering and animation loop
- `js/fullscreen.js` - Fullscreen mode functionality
- `js/pwa.js` - PWA service worker registration
- `js/alarm.js` - Alarm and timer system with visual markers
- `js/world-clock.js` - Multi-timezone world clock
- `js/stopwatch.js` - Stopwatch with lap timing
- `main.js` - Application initialization (39 lines)

### Core Systems
- **Time Calculation**: Uses `Date.now()` and `performance.now()` for accurate real-time values (no drift when tab is inactive)
- **Animation**: `requestAnimationFrame` loop updates SVG arc segments
- **Rendering**: Multiple arc segments per ring create comet trail effect
- **Persistence**: localStorage for themes, alarms, timezones, settings
- **Offline**: Service worker caches assets for offline functionality

## Browser Support

Works in all modern browsers that support:
- SVG filters
- CSS gradients
- `requestAnimationFrame`

## Development

See [CLAUDE.md](./CLAUDE.md) for development guidelines and architecture details.

### Git Workflow
- `dev` - Development branch (work here)
- `main` - Stable branch (merge after testing)

## License

MIT
