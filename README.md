# Ring Time Clock

A web-based clock that displays time as animated circular progress rings. Built with vanilla JavaScript for smooth, emotionally pleasing visuals.

## Features

- **4 Animated Rings** - Hours, Minutes, Seconds, Milliseconds
- **Smooth 60fps Animation** - Uses `requestAnimationFrame` for fluid motion
- **Premium Design** - Subtle gradients, glow effects, and calm aesthetics
- **Responsive** - Works on desktop, tablet, and mobile
- **Accessible** - Includes text-based time display
- **No Framework** - Pure HTML, CSS, and JavaScript

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
- **CSS3** - Gradients, filters, responsive design
- **Vanilla JavaScript** - No frameworks or dependencies

## Architecture

- **Time Calculation**: Uses `Date.now()` for accurate real-time values (no drift when tab is inactive)
- **Animation**: `requestAnimationFrame` loop updates SVG `stroke-dashoffset`
- **Rendering**: 4 SVG circles with `stroke-dasharray` progress indicators

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
