// Stickers and Hand-drawn Doodles Database

export const STICKER_CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'badges', label: 'BADGES & STAMPS' },
  { id: 'retro', label: 'RETRO GEAR' },
  { id: 'smileys', label: 'SMILEYS' },
  { id: 'stars', label: 'HOLO & STARS' },
  { id: 'dots', label: 'POSTAGE & DOTS' },
];

export const STICKERS = [
  // --- BADGES & STAMPS ---
  {
    id: 'annapurna-badge',
    category: 'badges',
    name: 'Annapurna Video',
    type: 'svg',
    svg: `<svg viewBox="0 0 100 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="100" height="50" rx="6" fill="#1e1b4b" stroke="#f43f5e" stroke-width="3"/>
      <text x="50" y="28" font-family="'Permanent Marker', sans-serif" font-size="13" fill="#fbbf24" text-anchor="middle" font-weight="bold">ANNAPURNA</text>
      <text x="50" y="42" font-family="'Space Mono', monospace" font-size="9" fill="#38bdf8" text-anchor="middle" letter-spacing="2">VIDEO</text>
    </svg>`
  },
  {
    id: 'parental-advisory',
    category: 'badges',
    name: 'Explicit Tape',
    type: 'svg',
    svg: `<svg viewBox="0 0 90 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="55" rx="3" fill="#000" stroke="#fff" stroke-width="3"/>
      <text x="45" y="22" font-family="'Space Mono', monospace" font-size="9" fill="#fff" text-anchor="middle" font-weight="bold" letter-spacing="1">PARENTAL</text>
      <text x="45" y="38" font-family="'Permanent Marker', sans-serif" font-size="14" fill="#fff" text-anchor="middle" letter-spacing="1">ADVISORY</text>
      <text x="45" y="49" font-family="'Space Mono', monospace" font-size="7" fill="#cbd5e1" text-anchor="middle" letter-spacing="1">EXPLICIT TRACKS</text>
    </svg>`
  },
  {
    id: 'dolby-nr-badge',
    category: 'badges',
    name: 'Dolby B-NR Stamp',
    type: 'svg',
    svg: `<svg viewBox="0 0 85 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="85" height="45" rx="4" fill="#09090b" stroke="#e4e4e7" stroke-width="2"/>
      <rect x="10" y="10" width="12" height="25" rx="2" fill="#e4e4e7"/>
      <rect x="25" y="10" width="12" height="25" rx="2" fill="#e4e4e7"/>
      <text x="60" y="24" font-family="'Space Mono', monospace" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">DOLBY</text>
      <text x="60" y="36" font-family="'Space Mono', monospace" font-size="8" fill="#fbbf24" text-anchor="middle">B-NR</text>
    </svg>`
  },
  {
    id: 'radio-snack',
    category: 'badges',
    name: 'Radio Snack',
    type: 'svg',
    svg: `<svg viewBox="0 0 90 45" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="90" height="45" rx="6" fill="#dc2626" stroke="#fff" stroke-width="2"/>
      <text x="45" y="20" font-family="'Permanent Marker'" font-size="12" fill="#fff" text-anchor="middle">RADIO</text>
      <text x="45" y="36" font-family="'Permanent Marker'" font-size="16" fill="#facc15" text-anchor="middle">SNACK</text>
    </svg>`
  },
  {
    id: 'wasted-badge',
    category: 'badges',
    name: 'Wasted Badge',
    type: 'svg',
    svg: `<svg viewBox="0 0 90 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="2" y="2" width="86" height="36" rx="4" fill="#000" stroke="#dc2626" stroke-width="3"/>
      <text x="45" y="27" font-family="'Permanent Marker'" font-size="18" fill="#dc2626" text-anchor="middle" letter-spacing="2">WASTED</text>
    </svg>`
  },
  {
    id: 'kanji-music',
    category: 'badges',
    name: 'Tokyo Sound Stamp',
    type: 'svg',
    svg: `<svg viewBox="0 0 55 55" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="55" height="55" rx="28" fill="#dc2626" stroke="#fff" stroke-width="3"/>
      <text x="28" y="38" font-family="sans-serif" font-size="28" fill="#fff" text-anchor="middle" font-weight="bold">音</text>
    </svg>`
  },
  {
    id: 'barcode-stamp',
    category: 'badges',
    name: 'Vintage Barcode',
    type: 'svg',
    svg: `<svg viewBox="0 0 80 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="40" rx="3" fill="#ffffff" stroke="#000000" stroke-width="1.5"/>
      <line x1="8" y1="6" x2="8" y2="28" stroke="#000" stroke-width="3"/>
      <line x1="14" y1="6" x2="14" y2="28" stroke="#000" stroke-width="1.5"/>
      <line x1="18" y1="6" x2="18" y2="28" stroke="#000" stroke-width="4"/>
      <line x1="26" y1="6" x2="26" y2="28" stroke="#000" stroke-width="2"/>
      <line x1="32" y1="6" x2="32" y2="28" stroke="#000" stroke-width="1"/>
      <line x1="36" y1="6" x2="36" y2="28" stroke="#000" stroke-width="3"/>
      <line x1="43" y1="6" x2="43" y2="28" stroke="#000" stroke-width="2"/>
      <line x1="48" y1="6" x2="48" y2="28" stroke="#000" stroke-width="4"/>
      <line x1="56" y1="6" x2="56" y2="28" stroke="#000" stroke-width="1.5"/>
      <line x1="62" y1="6" x2="62" y2="28" stroke="#000" stroke-width="3"/>
      <line x1="70" y1="6" x2="70" y2="28" stroke="#000" stroke-width="2"/>
      <text x="40" y="36" font-family="'Space Mono', monospace" font-size="7" fill="#000" text-anchor="middle">9 780201 37962</text>
    </svg>`
  },

  // --- RETRO GEAR ---
  {
    id: 'retro-gameboy',
    category: 'retro',
    name: 'Mixtape Player',
    type: 'svg',
    svg: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="5" y="5" width="50" height="70" rx="8" fill="#e2e8f0" stroke="#0f172a" stroke-width="3"/>
      <rect x="12" y="12" width="36" height="26" rx="4" fill="#84cc16" stroke="#0f172a" stroke-width="2"/>
      <text x="30" y="28" font-family="'Permanent Marker'" font-size="8" fill="#14532d" text-anchor="middle">MIXTAPE</text>
      <circle cx="20" cy="54" r="5" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
      <circle cx="40" cy="54" r="5" fill="#3b82f6" stroke="#0f172a" stroke-width="2"/>
      <rect x="26" y="65" width="8" height="3" rx="1.5" fill="#64748b"/>
    </svg>`
  },
  {
    id: 'mini-cassette-gear',
    category: 'retro',
    name: 'Mini Tape C-90',
    type: 'svg',
    svg: `<svg viewBox="0 0 70 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="3" y="3" width="64" height="44" rx="6" fill="#18181b" stroke="#facc15" stroke-width="2.5"/>
      <rect x="12" y="10" width="46" height="24" rx="3" fill="#fef08a"/>
      <circle cx="24" cy="22" r="6" fill="#18181b"/>
      <circle cx="46" cy="22" r="6" fill="#18181b"/>
      <rect x="28" y="18" width="14" height="8" rx="1" fill="#3f3f46"/>
      <text x="35" y="42" font-family="'Space Mono'" font-size="7" fill="#fff" text-anchor="middle">TYPE II</text>
    </svg>`
  },
  {
    id: 'cool-s',
    category: 'retro',
    name: 'Super S',
    type: 'svg',
    svg: `<svg viewBox="0 0 60 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 20 L30 10 L40 20 L40 35 L30 45 L20 35 Z M20 45 L30 35 L40 45 L40 60 L30 70 L20 60 Z" stroke="#38bdf8" stroke-width="5" fill="none" stroke-linejoin="round"/>
      <line x1="30" y1="10" x2="30" y2="70" stroke="#f43f5e" stroke-width="2" stroke-dasharray="3 3"/>
    </svg>`
  },
  {
    id: 'headphones-sticker',
    category: 'retro',
    name: 'Walkman Headphones',
    type: 'svg',
    svg: `<svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 40 C15 20 55 20 55 40" stroke="#0f172a" stroke-width="4" fill="none" stroke-linecap="round"/>
      <rect x="8" y="36" width="14" height="22" rx="7" fill="#f97316" stroke="#0f172a" stroke-width="2.5"/>
      <rect x="48" y="36" width="14" height="22" rx="7" fill="#f97316" stroke="#0f172a" stroke-width="2.5"/>
      <circle cx="15" cy="47" r="3" fill="#fdba74"/>
      <circle cx="55" cy="47" r="3" fill="#fdba74"/>
    </svg>`
  },

  // --- SMILEYS ---
  {
    id: 'holo-flower',
    category: 'smileys',
    name: 'Daisy Smile',
    type: 'svg',
    isHolographic: true,
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g fill="#67e8f9" stroke="#0f172a" stroke-width="2.5">
        <circle cx="40" cy="18" r="12"/>
        <circle cx="58" cy="28" r="12"/>
        <circle cx="58" cy="52" r="12"/>
        <circle cx="40" cy="62" r="12"/>
        <circle cx="22" cy="52" r="12"/>
        <circle cx="22" cy="28" r="12"/>
      </g>
      <circle cx="40" cy="40" r="16" fill="#facc15" stroke="#0f172a" stroke-width="3"/>
      <circle cx="34" cy="36" r="2.5" fill="#0f172a"/>
      <circle cx="46" cy="36" r="2.5" fill="#0f172a"/>
      <path d="M34 44 Q40 50 46 44" stroke="#0f172a" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'acid-smiley',
    category: 'smileys',
    name: 'Acid 90s Smiley',
    type: 'svg',
    svg: `<svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="35" r="30" fill="#facc15" stroke="#000" stroke-width="3"/>
      <ellipse cx="26" cy="28" rx="3.5" ry="6" fill="#000"/>
      <ellipse cx="44" cy="28" rx="3.5" ry="6" fill="#000"/>
      <path d="M22 42 Q35 56 48 42" stroke="#000" stroke-width="4" fill="none" stroke-linecap="round"/>
    </svg>`
  },
  {
    id: 'dizzy-smiley',
    category: 'smileys',
    name: 'Dizzy Smiley',
    type: 'svg',
    svg: `<svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="35" cy="35" r="30" fill="#ec4899" stroke="#000" stroke-width="3"/>
      <text x="26" y="32" font-family="'Permanent Marker'" font-size="14" fill="#000" text-anchor="middle">X</text>
      <text x="44" y="32" font-family="'Permanent Marker'" font-size="14" fill="#000" text-anchor="middle">X</text>
      <ellipse cx="35" cy="48" rx="7" ry="5" fill="#000"/>
    </svg>`
  },
  {
    id: 'spooky-skull',
    category: 'smileys',
    name: 'Punk Skull',
    type: 'svg',
    svg: `<svg viewBox="0 0 70 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 35 C15 15 55 15 55 35 C55 45 50 55 48 65 L22 65 C20 55 15 45 15 35 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
      <ellipse cx="26" cy="36" rx="7" ry="9" fill="#0f172a"/>
      <ellipse cx="44" cy="36" rx="7" ry="9" fill="#0f172a"/>
      <path d="M35 48 L32 54 L38 54 Z" fill="#0f172a"/>
      <line x1="28" y1="60" x2="28" y2="65" stroke="#0f172a" stroke-width="2"/>
      <line x1="35" y1="60" x2="35" y2="65" stroke="#0f172a" stroke-width="2"/>
      <line x1="42" y1="60" x2="42" y2="65" stroke="#0f172a" stroke-width="2"/>
    </svg>`
  },

  // --- HOLO & STARS ---
  {
    id: 'holo-star',
    category: 'stars',
    name: 'Sparkle Star',
    type: 'svg',
    isHolographic: true,
    svg: `<svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M40 5 L49 28 L74 30 L54 46 L60 70 L40 56 L20 70 L26 46 L6 30 L31 28 Z" fill="#fde047" stroke="#18181b" stroke-width="3" stroke-linejoin="round"/>
      <circle cx="33" cy="38" r="3" fill="#18181b"/>
      <circle cx="47" cy="38" r="3" fill="#18181b"/>
      <path d="M33 48 Q40 54 47 48" stroke="#18181b" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="30" cy="42" r="2" fill="#f43f5e" opacity="0.6"/>
      <circle cx="50" cy="42" r="2" fill="#f43f5e" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'star-red',
    category: 'stars',
    name: 'Red Star',
    type: 'svg',
    svg: `<svg viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 4 L37 20 L55 22 L41 34 L45 52 L30 42 L15 52 L19 34 L5 22 L23 20 Z" fill="#ef4444" stroke="#991b1b" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'glitter-heart',
    category: 'stars',
    name: 'Glitter Heart',
    type: 'svg',
    isHolographic: true,
    svg: `<svg viewBox="0 0 70 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M35 60 C15 45 5 30 5 18 C5 8 15 2 25 2 C30 2 35 6 35 6 C35 6 40 2 45 2 C55 2 65 8 65 18 C65 30 55 45 35 60 Z" fill="#f43f5e" stroke="#000" stroke-width="3"/>
      <circle cx="22" cy="18" r="4" fill="#fff" opacity="0.8"/>
      <circle cx="28" cy="24" r="2" fill="#fff" opacity="0.8"/>
    </svg>`
  },
  {
    id: 'fire-flame',
    category: 'stars',
    name: 'Fire Flame',
    type: 'svg',
    svg: `<svg viewBox="0 0 60 70" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 5 C35 20 50 25 50 45 C50 58 40 65 30 65 C20 65 10 58 10 45 C10 32 22 22 25 15 C25 25 32 30 35 32 C35 25 30 15 30 5 Z" fill="#f97316" stroke="#000" stroke-width="2.5"/>
      <path d="M30 35 C35 42 40 45 40 54 C40 60 35 62 30 62 C25 62 20 60 20 54 C20 48 26 44 30 35 Z" fill="#facc15"/>
    </svg>`
  },

  // --- POSTAGE & DOTS ---
  {
    id: 'dot-blue',
    category: 'dots',
    name: 'Blue Dot',
    type: 'svg',
    svg: `<svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="22" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
      <circle cx="20" cy="18" r="5" fill="#60a5fa" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'dot-pink',
    category: 'dots',
    name: 'Pink Dot',
    type: 'svg',
    svg: `<svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="22" fill="#ec4899" stroke="#db2777" stroke-width="2"/>
      <circle cx="20" cy="18" r="5" fill="#f472b6" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'dot-yellow',
    category: 'dots',
    name: 'Yellow Dot',
    type: 'svg',
    svg: `<svg viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="25" cy="25" r="22" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
      <circle cx="20" cy="18" r="5" fill="#fef08a" opacity="0.6"/>
    </svg>`
  },
  {
    id: 'air-mail-stamp',
    category: 'dots',
    name: 'Air Mail Stamp',
    type: 'svg',
    svg: `<svg viewBox="0 0 80 50" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="80" height="50" rx="3" fill="#f8fafc" stroke="#dc2626" stroke-width="2" stroke-dasharray="4 2"/>
      <rect x="5" y="5" width="70" height="40" fill="#1e3a8a"/>
      <text x="40" y="24" font-family="'Space Mono'" font-size="10" fill="#fff" text-anchor="middle" font-weight="bold">AIR MAIL</text>
      <text x="40" y="36" font-family="'Space Mono'" font-size="8" fill="#facc15" text-anchor="middle">PAR AVION</text>
    </svg>`
  }
];

export const DOODLE_CATEGORIES = [
  { id: 'all', label: 'ALL' },
  { id: 'starter', label: 'STARTER PACK' },
  { id: 'drawer', label: 'JUNK DRAWER' },
  { id: 'micro', label: 'MICRO MARKS' },
  { id: 'moods', label: 'MOODS' }
];

export const DOODLES = [
  {
    id: 'broken-heart',
    category: 'moods',
    name: 'Broken Heart',
    svg: `<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M30 18 C25 8 10 10 10 25 C10 40 30 50 30 50 L30 35 L26 28 L34 22 L30 18 Z"/>
      <path d="M30 18 C35 8 50 10 50 25 C50 40 30 50 30 50 L30 35 L34 28 L26 22 L30 18 Z"/>
    </svg>`
  },
  {
    id: 'crying-ghost',
    category: 'moods',
    name: 'Crying Ghost',
    svg: `<svg viewBox="0 0 60 60" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 35 C15 15 45 15 45 35 C45 45 40 50 30 50 C20 50 15 45 15 35 Z"/>
      <circle cx="23" cy="30" r="2" fill="currentColor"/>
      <circle cx="37" cy="30" r="2" fill="currentColor"/>
      <path d="M26 38 Q30 35 34 38"/>
      <line x1="21" y1="36" x2="21" y2="44"/>
      <line x1="39" y1="36" x2="39" y2="44"/>
    </svg>`
  },
  {
    id: 'sleepy-eyes',
    category: 'moods',
    name: 'Sleepy Lashes',
    svg: `<svg viewBox="0 0 60 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 20 Q20 30 30 20"/>
      <line x1="14" y1="26" x2="11" y2="33"/>
      <line x1="20" y1="28" x2="20" y2="35"/>
      <line x1="26" y1="26" x2="29" y2="33"/>
      <path d="M35 20 Q45 30 55 20"/>
      <line x1="39" y1="26" x2="36" y2="33"/>
      <line x1="45" y1="28" x2="45" y2="35"/>
      <line x1="51" y1="26" x2="54" y2="33"/>
    </svg>`
  },
  {
    id: 'scribble-arrow',
    category: 'micro',
    name: 'Scribble Arrow',
    svg: `<svg viewBox="0 0 60 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 20 C18 10 25 30 45 15"/>
      <path d="M38 12 L47 14 L44 24"/>
    </svg>`
  },
  {
    id: 'lightning-bolt',
    category: 'starter',
    name: 'Lightning',
    svg: `<svg viewBox="0 0 40 60" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M22 6 L10 32 L20 32 L16 54 L32 26 L22 26 Z"/>
    </svg>`
  },
  {
    id: 'cool-alien',
    category: 'starter',
    name: 'Beanie Alien',
    svg: `<svg viewBox="0 0 50 60" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="25" cy="35" rx="16" ry="18"/>
      <ellipse cx="18" cy="34" rx="5" ry="7" fill="currentColor"/>
      <ellipse cx="32" cy="34" rx="5" ry="7" fill="currentColor"/>
      <path d="M12 24 Q25 12 38 24"/>
      <path d="M10 24 L40 24 L38 18 L12 18 Z"/>
    </svg>`
  },
  {
    id: 'music-notes',
    category: 'drawer',
    name: 'Melody Notes',
    svg: `<svg viewBox="0 0 50 50" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <ellipse cx="14" cy="38" rx="6" ry="4" fill="currentColor"/>
      <ellipse cx="36" cy="32" rx="6" ry="4" fill="currentColor"/>
      <line x1="20" y1="38" x2="20" y2="12"/>
      <line x1="42" y1="32" x2="42" y2="8"/>
      <line x1="20" y1="12" x2="42" y2="8"/>
    </svg>`
  },
  {
    id: 'crown-doodle',
    category: 'drawer',
    name: 'Mini Crown',
    svg: `<svg viewBox="0 0 50 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 32 L12 12 L25 24 L38 12 L42 32 Z"/>
      <line x1="8" y1="32" x2="42" y2="32"/>
    </svg>`
  },
  {
    id: 'under-scribble',
    category: 'micro',
    name: 'Underline Scribble',
    svg: `<svg viewBox="0 0 80 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M5 10 Q20 4 35 12 T65 8 T75 14"/>
    </svg>`
  },
  {
    id: 'coffee-cup',
    category: 'drawer',
    name: 'Late Night Coffee',
    svg: `<svg viewBox="0 0 50 50" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 18 L35 18 L32 40 L13 40 Z"/>
      <path d="M35 22 Q44 22 44 29 Q44 36 33 36"/>
      <path d="M18 12 Q20 6 22 12"/>
      <path d="M26 12 Q28 6 30 12"/>
    </svg>`
  },
  {
    id: 'sparkle-doodle',
    category: 'micro',
    name: 'Sparkle Cross',
    svg: `<svg viewBox="0 0 40 40" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">
      <line x1="20" y1="4" x2="20" y2="36"/>
      <line x1="4" y1="20" x2="36" y2="20"/>
      <circle cx="20" cy="20" r="3" fill="currentColor"/>
    </svg>`
  }
];
