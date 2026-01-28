# Ambient Sound Files

This directory contains audio files for the Ambient Sound feature.

## Required Audio Files

To enable all sounds, add the following audio files to this directory:

### Lofi Beats
- `lofi-chill.mp3` - Chill Lofi beats
- `lofi-jazzy.mp3` - Jazzy Lofi beats
- `lofi-ambient.mp3` - Ambient Lofi beats

### Nature Sounds
- `rain.mp3` - Rain sounds
- `ocean.mp3` - Ocean waves
- `forest.mp3` - Forest ambience
- `fire.mp3` - Fireplace crackling

## Note on Noise Sounds

White/Brown/Pink Noise are **generated programmatically** using Web Audio API and do not require audio files. They will work immediately!

## Where to Get Royalty-Free Audio

### Free Sources
1. **Freesound.org** - Creative Commons licensed sounds
2. **YouTube Audio Library** - Free music and sound effects
3. **Incompetech.com** - Royalty-free music by Kevin MacLeod
4. **Free Music Archive** - CC-licensed music

### Paid Sources (High Quality)
1. **Epidemic Sound** - $15/month subscription
2. **AudioJungle** - One-time purchase per track ($1-20)
3. **PremiumBeat** - High-quality music ($49-199 per track)

## File Format Requirements

- **Format:** MP3 (recommended) or OGG
- **Sample Rate:** 44.1 kHz or 48 kHz
- **Bitrate:** 128 kbps or higher (192 kbps recommended)
- **Loop-friendly:** Ensure seamless looping (no clicks at start/end)

## Tips for Loop-Friendly Audio

1. Use audio editing software (Audacity, GarageBand)
2. Trim silence from start/end
3. Apply crossfade at loop point
4. Ensure consistent volume throughout

## Example: Adding Your Own Files

1. Download a royalty-free rain sound from Freesound.org
2. Rename it to `rain.mp3`
3. Copy it to this directory (`assets/audio/rain.mp3`)
4. Reload the app - Rain sound will now work!

## Copyright Notice

**Important:** Only use audio files that you have the rights to use. Do not add copyrighted music without permission. The default file paths are placeholders - you must provide your own audio files.

## Testing

After adding files:
1. Open the app in Live Server
2. Click the Sound button (🎵)
3. Try playing each sound
4. If you see an error, check:
   - File name matches exactly (case-sensitive)
   - File is in correct format (MP3/OGG)
   - File path is `assets/audio/filename.mp3`
