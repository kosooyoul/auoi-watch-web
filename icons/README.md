# Ring Clock PWA Icons

This directory contains the app icons for the Ring Clock PWA.

## Required Icons

For the PWA to work properly, you need the following PNG files:

- `icon-192.png` - 192x192 pixels (required for PWA)
- `icon-512.png` - 512x512 pixels (required for PWA)

## How to Generate PNG Icons

You have several options to create PNG icons from the provided `icon.svg`:

### Option 1: Online Converter
1. Open https://svgtopng.com or https://cloudconvert.com/svg-to-png
2. Upload `icon.svg`
3. Set output size to 192x192 pixels, download as `icon-192.png`
4. Repeat with 512x512 pixels, download as `icon-512.png`
5. Place both files in this `icons/` directory

### Option 2: Using ImageMagick (CLI)
```bash
# Install ImageMagick first (if not installed)
# macOS: brew install imagemagick
# Ubuntu: sudo apt install imagemagick

# Generate icons
convert icon.svg -resize 192x192 icon-192.png
convert icon.svg -resize 512x512 icon-512.png
```

### Option 3: Using Inkscape (GUI)
1. Install Inkscape (https://inkscape.org)
2. Open `icon.svg`
3. File → Export PNG Image
4. Set width/height to 192, export as `icon-192.png`
5. Repeat with 512, export as `icon-512.png`

### Option 4: Using Figma/Adobe Illustrator
1. Import `icon.svg`
2. Export as PNG at 192x192 and 512x512 sizes

## Current Status

- ✅ `icon.svg` - Source SVG file (complete)
- ⚠️ `icon-192.png` - **Needs to be generated**
- ⚠️ `icon-512.png` - **Needs to be generated**

## Note

The SVG icon represents the Ring Clock design with:
- 4 concentric rings (hour, minute, second, millisecond)
- Gradient colors matching the app's Classic theme
- Comet trail effect visualization

Once you generate the PNG files, the PWA will be fully functional and installable on all devices.
