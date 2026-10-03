# Hyperframes Composition Brief: Mixtape 2D

## Objective
Create a short, polished, shareable launch video for Mixtape 2D that showcases the skeuomorphic 90s cassette deck, real-time VU ballistics, dynamic tape ribbon physics, and the unfolded 3-panel J-Card studio.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080 (16:9)
- Duration: 18.0 seconds

## Source Material
- Project root: `d:/Anay/CODES/Mixtape Creator 2D`
- Primary files read: `README.md`, `index.html`, `src/components/CassetteDeck.jsx`, `src/components/JCardView.jsx`, `src/components/MixtapeStudio.jsx`, `src/data/defaultTapes.js`, `src/data/stickerData.js`
- Product name: Mixtape 2D
- Tagline / strongest claim: "Build Something Worth Rewinding."
- Key UI or visual moment to recreate:
  - Skeuomorphic Cassette Deck with dual spinning tape reels, magnetic ribbon width changing dynamically, dual analog VU needle meters swinging, glowing Dolby B-NR indicator, and amber LCD track info.
  - 3-Panel Unfolded J-Card with authentic handwriting typography, format badges (`CRX 60 • 2 x 30 min`), highlighter number markers, and shiny holographic foil stickers.
- Copy that must appear verbatim:
  - "STREAMING ALGORITHMS STOLE THE SOUL OF MUSIC."
  - "Remember when making a mixtape took real effort?"
  - "MIXTAPE 2D"
  - "Build Something Worth Rewinding."
  - "An authentic 90s Cassette Deck & J-Card Studio in your browser"

## Creative Direction
- Tone preset: `default`
- Creative direction: 90s analog nostalgia meets modern streaming perfection
- Interpretation: Warm, tactile, energetic, and playful with high visual fidelity and authentic retro hardware details.
- Angle: Reclaim the intentional warmth and tactile satisfaction of crafting custom cassette mixtapes with modern streaming capabilities.
- Hook: A bold critique of algorithmic playlist clutter, transitioning into nostalgic analog craft.
- Outro / punchline: "MIXTAPE 2D. Build Something Worth Rewinding."
- Avoid:
  - Generic SaaS language
  - Abstract filler graphics
  - Mismatched modern minimalist tropes that destroy the 90s skeuomorphic soul

## Visual Identity
- Background: `#0c0a09` (Onyx Chassis), `#0f0c0b` (Deep Dark Background)
- Accent: `#f59e0b` (Studio Amber LED), `#0284c7` (Deep Ocean CRX), `#06b6d4` (Cyber Cyan LCD)
- Paper & Ink: `#fefce8` (Vintage Cardstock), `#0c0a09` (Charcoal Ink)
- Display font: `Permanent Marker`, `Space Mono`, `Caveat`
- Body font: `Inter`, `Space Mono`
- Visual references from the project:
  - Cassette chassis with screws, smoked acrylic window, reel spindles, tape guide rollers, tape ribbon bridge
  - Dual analog VU meters with dB tick marks (-20 to +3 dB) and red peak zones
  - Unfolded J-card with fold crease gradients, header spine band, lined tracklist slots

## Storyboard
Use `brag-output/brag-plan.md` as the creative contract:
1. **Scene 1: The Nostalgia Hook** (0.0s – 3.5s) — Dark CRT vibe, bold statement + question.
2. **Scene 2: The Skeuomorphic Cassette Deck** (3.5s – 8.0s) — Cassette player in action, rotating reels, dancing VU meters, hardware specs.
3. **Scene 3: The Unfolded 3-Panel J-Card Studio** (8.0s – 13.5s) — 3-panel paper cardstock with handwriting, tracklist pop-ins, holographic stickers, and duration meter.
4. **Scene 4: The Outro & Share Callout** (13.5s – 18.0s) — Final tape reveal, big bold title slam, tagline, author badge, and share link.

## Audio
- Audio role: Warm upbeat groove with tactile mechanical hardware sounds.
- Audio arc: Opens energetic, builds through deck playback and crafting, peaks at the final logo slam, then fades out.
- Music: `assets/music/happy-beats-business-moves-vol-1-by-ende-dot-app.mp3`
- Music treatment: Starts at 0.0s, volume 0.35, smooth fade from 16.5s to 18.0s.
- Music cue guidance: Major reveals aligned to strong cues (~3.52s, ~8.02s, ~14.02s).
- Audio-reactive treatment: Subtle amber VU glow and meter peak accents modulated with music energy.
- Audio-coupled moments:
  - 3.6s: `assets/sfx/interface/click_001.ogg` on [▶ PLAY] button press
  - 8.1s: `assets/sfx/casino/card-slide-1.ogg` on J-Card unfold transition
  - 11.2s: `assets/sfx/interface/drop_001.ogg` on holographic foil sticker placement
  - 14.0s: `assets/sfx/impact/impactBell_heavy_000.ogg` on logo impact
- Exact SFX choice: Copied directly into `brag-output/composition/assets/`.

## Hyperframes Instructions
- Implement in `brag-output/composition/` using standard Hyperframes conventions.
- Use `data-track-index`, `data-volume`, `data-start`, and `data-duration` on `<audio>` elements.
- Use Google Fonts via `<link>` (`Permanent Marker`, `Space Mono`, `Caveat`, `Patrick Hand`, `Inter`).
- Animate with smooth CSS transitions / timeline keyframes, ensuring seek-safe playback for headless rendering.
- Run `npx hyperframes check` and ensure zero errors.
