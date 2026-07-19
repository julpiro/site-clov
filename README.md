# site-clov

Portfolio website for **Constantin Ory-Lavollée** (Clov) — composer & producer.

Built from a Figma prototype as a static, no-build site and hosted on GitHub Pages.

## Live site

https://julpiro.github.io/site-clov/

## Stack

- Plain HTML / CSS / vanilla JS — no build step, no dependencies to install.
- [wavesurfer.js](https://wavesurfer.xyz/) (via CDN) for the audio waveform players.
- Self-hosted [Inter](https://rsms.me/inter/) variable font (free substitute for the Figma design's "Suisse Int'l").
- Spotify embed for the "Ananas Service" album.

## Project structure

```
index.html          Page markup
styles.css           All styling
main.js              Language toggle, audio players, back-to-top
assets/
  fonts/              Self-hosted Inter variable font
  img/                Images exported from the Figma prototype
  media/              Web-optimized audio/video (compressed from originals/)
originals/            Raw, uncompressed source media (git-ignored, kept locally only)
```

## Adding the remaining project videos

Two of the three project players (**Inani** and **-1.75**) are placeholders waiting on
their source video. Each player shows a `<video>` with the play button overlaid, and a
`wavesurfer.js` waveform underneath that is synced to the video and drawn from a
precomputed peaks file. To wire one up once you have the mp4:

1. Drop the file in `originals/` (e.g. `originals/inani.mp4`).
2. Re-encode the video for web, then generate the waveform peaks:
   ```bash
   ffmpeg -i originals/inani.mp4 -c:v libx264 -crf 26 -preset slow -vf scale=896:-2 \
     -c:a aac -b:a 128k -movflags +faststart assets/media/inani.mp4
   node tools/gen-peaks.mjs assets/media/inani.mp4 assets/media/inani.peaks.json 1000
   ```
3. In `index.html`, on that project's `.player`, add
   `data-peaks="assets/media/inani.peaks.json"` and `data-duration="<seconds>"`, put a
   `<source src="assets/media/inani.mp4" type="video/mp4">` inside its `<video>`, replace the
   static waveform (`.waveform-static` / `.waveform-bars`) with `<div class="waveform"></div>`,
   and make the overlay button active (remove `disabled`, `is-disabled`, the `player__note`,
   and `data-i18n-aria`). `main.js` picks up any `.player[data-peaks]` automatically.

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Deployment

The site is served directly from the `main` branch root via GitHub Pages
(`Settings → Pages → Source: Deploy from branch → main / root`). Any push to `main`
updates the live site — no build step required.
