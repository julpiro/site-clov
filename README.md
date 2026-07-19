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
their source video. To wire one up once you have the mp4:

1. Drop the file in `originals/` (e.g. `originals/inani.mp4`).
2. Extract a compressed audio track and re-encode the video for web:
   ```bash
   ffmpeg -i originals/inani.mp4 -vn -acodec libmp3lame -q:a 3 assets/media/inani.mp3
   ffmpeg -i originals/inani.mp4 -c:v libx264 -crf 26 -preset slow -c:a aac -b:a 128k -movflags +faststart assets/media/inani.mp4
   ```
3. In `index.html`, on that project's `.player` element, add `data-audio="assets/media/inani.mp3"`,
   swap in the real project image, remove the `disabled` attribute from its `.play-btn`, and
   remove the `data-i18n-aria="coming_soon"` attribute. `main.js` will automatically pick up
   the new `data-audio` player and wire the waveform + play button.

## Local preview

```bash
python3 -m http.server 8080
```

Then open http://localhost:8080.

## Deployment

The site is served directly from the `main` branch root via GitHub Pages
(`Settings → Pages → Source: Deploy from branch → main / root`). Any push to `main`
updates the live site — no build step required.
