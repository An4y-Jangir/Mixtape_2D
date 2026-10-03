// Mixtape Share Service - Cloud Short Link (#s=key), Preset ID (#p=id), & Deflate Backup (#m=b64)
import { PRESET_TAPES, formatDuration } from '../data/defaultTapes';

// In-memory & localStorage cache for generated short keys
const CACHE_KEY = 'mixtape_short_urls_cache_v1';

function getShortUrlCache() {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};
  }
}

function setShortUrlCache(tapeId, url) {
  try {
    const cache = getShortUrlCache();
    cache[tapeId] = url;
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
  } catch (e) {}
}

// Base64URL encoding/decoding utilities (safe for URLs, hashes, and query params)
export function bytesToBase64Url(bytes) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export function base64UrlToBytes(base64url) {
  let base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

// Compress string with native browser CompressionStream (deflate-raw)
export async function compressStringToBase64Url(str) {
  try {
    if (typeof CompressionStream !== 'undefined') {
      const encoder = new TextEncoder();
      const data = encoder.encode(str);
      const cs = new CompressionStream('deflate-raw');
      const writer = cs.writable.getWriter();
      writer.write(data);
      writer.close();
      const arrayBuffer = await new Response(cs.readable).arrayBuffer();
      return bytesToBase64Url(new Uint8Array(arrayBuffer));
    }
  } catch (e) {
    console.warn('Native CompressionStream failed, fallback to base64url', e);
  }
  return bytesToBase64Url(new TextEncoder().encode(str));
}

// Decompress base64url string with native DecompressionStream (deflate-raw)
export async function decompressBase64UrlToString(base64url) {
  try {
    const bytes = base64UrlToBytes(base64url);
    if (typeof DecompressionStream !== 'undefined') {
      const ds = new DecompressionStream('deflate-raw');
      const writer = ds.writable.getWriter();
      writer.write(bytes);
      writer.close();
      return await new Response(ds.readable).text();
    }
  } catch (e) {
    try {
      const bytes = base64UrlToBytes(base64url);
      return new TextDecoder().decode(bytes);
    } catch (err) {
      return null;
    }
  }

  try {
    const bytes = base64UrlToBytes(base64url);
    return new TextDecoder().decode(bytes);
  } catch (err) {
    return null;
  }
}

// Compact Schema: Pack tape into minimal array representation to minimize payload
export function packTape(t) {
  return [
    t.title || '',
    t.author || '',
    t.format || 'CRX 40',
    t.cardDesign || 'scootch',
    t.font || 'rockford',
    t.colors ? [
      t.colors.primary || '#d97706',
      t.colors.secondary || '#9a3412',
      t.colors.shell || '#18181b',
      t.colors.ink || '#0c0a09',
      t.colors.highlighter || '#ec4899',
      t.colors.paper || '#fbf7ee'
    ] : null,
    t.sideA?.title || 'Side A',
    (t.sideA?.tracks || []).map(tr => [
      tr.title || '',
      tr.artist || '',
      tr.youtubeId || '',
      tr.durationSec || 0,
      tr.audioUrl || ''
    ]),
    t.sideB?.title || 'Side B',
    (t.sideB?.tracks || []).map(tr => [
      tr.title || '',
      tr.artist || '',
      tr.youtubeId || '',
      tr.durationSec || 0,
      tr.audioUrl || ''
    ]),
    (t.stickers || []).map(s => [s.stickerId, s.x, s.y, s.scale, s.rotation]),
    (t.doodles || []).map(d => [d.doodleId, d.x, d.y, d.scale, d.rotation, d.color]),
    t.linerNotes || ''
  ];
}

// Unpack minimal array representation back into full tape object
export function unpackTape(arr) {
  if (!Array.isArray(arr)) return null;
  const [
    title,
    author,
    format,
    cardDesign,
    font,
    colorsArr,
    sideATitle,
    sideATracksArr,
    sideBTitle,
    sideBTracksArr,
    stickersArr,
    doodlesArr,
    linerNotes
  ] = arr;

  const mapTrack = (raw, idx, prefix) => {
    const [tTitle, tArtist, youtubeId, durationSec, audioUrl] = raw;
    const durSec = durationSec || 210;
    const yId = youtubeId || '';
    return {
      id: `${prefix}-${idx + 1}-${Date.now()}`,
      title: tTitle || 'Untitled Track',
      artist: tArtist || 'Unknown Artist',
      youtubeId: yId,
      durationSec: durSec,
      duration: formatDuration(durSec),
      audioUrl: audioUrl || (yId ? `https://www.youtube.com/watch?v=${yId}` : ''),
      artworkUrl: yId ? `https://img.youtube.com/vi/${yId}/hqdefault.jpg` : '',
      album: 'YouTube Music',
      genre: 'Retro Mixtape',
      isFullSong: true,
      source: 'YouTube Music (Full Song)'
    };
  };

  const colors = colorsArr && Array.isArray(colorsArr) ? {
    primary: colorsArr[0] || '#d97706',
    secondary: colorsArr[1] || '#9a3412',
    shell: colorsArr[2] || '#18181b',
    ink: colorsArr[3] || '#0c0a09',
    highlighter: colorsArr[4] || '#ec4899',
    paper: colorsArr[5] || '#fbf7ee'
  } : {
    primary: '#d97706',
    secondary: '#9a3412',
    shell: '#18181b',
    ink: '#0c0a09',
    highlighter: '#ec4899',
    paper: '#fbf7ee'
  };

  return {
    id: `shared-tape-${Date.now()}`,
    title: title || 'Shared Mixtape',
    author: author || '@MixtapeCreator',
    format: format || 'CRX 40',
    durationLabel: '2 x 20 min',
    cardDesign: cardDesign || 'scootch',
    font: font || 'rockford',
    colors,
    sideA: {
      title: sideATitle || 'Side A',
      tracks: (sideATracksArr || []).map((t, i) => mapTrack(t, i, 'sA'))
    },
    sideB: {
      title: sideBTitle || 'Side B',
      tracks: (sideBTracksArr || []).map((t, i) => mapTrack(t, i, 'sB'))
    },
    stickers: (stickersArr || []).map((s, i) => ({
      id: `st-${i}-${Date.now()}`,
      stickerId: s[0],
      x: s[1],
      y: s[2],
      scale: s[3],
      rotation: s[4]
    })),
    doodles: (doodlesArr || []).map((d, i) => ({
      id: `do-${i}-${Date.now()}`,
      doodleId: d[0],
      x: d[1],
      y: d[2],
      scale: d[3],
      rotation: d[4],
      color: d[5]
    })),
    linerNotes: linerNotes || '',
    isUserCreated: true
  };
}

// Upload tape to cloud bytebin and return key
export async function uploadTapeToCloud(tape) {
  try {
    const res = await fetch('https://bytebin.lucko.me/post', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tape),
      signal: AbortSignal.timeout(3500)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.key) {
        return data.key;
      }
    }
  } catch (err) {
    console.warn('Primary cloud tape upload failed:', err.message);
  }
  return null;
}

// Fetch tape from cloud bytebin by key
export async function fetchTapeFromCloud(key) {
  try {
    const res = await fetch(`https://bytebin.lucko.me/${encodeURIComponent(key)}`, {
      signal: AbortSignal.timeout(4000)
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.title) {
        return data;
      }
      if (Array.isArray(data)) {
        return unpackTape(data);
      }
    }
  } catch (err) {
    console.warn('Cloud tape fetch failed:', err.message);
  }
  return null;
}

// Generate the shortest possible share link for any mixtape
export async function generateShareUrl(tape) {
  if (!tape) return window.location.href;

  const origin = window.location.origin;
  const pathname = window.location.pathname;

  // 1. If it matches an original preset tape, generate a tiny link: #p=preset_id (e.g. #p=mixtape-for-tanisha)
  const matchingPreset = PRESET_TAPES.find(p => p.id === tape.id && !tape.isUserCreated);
  if (matchingPreset) {
    return `${origin}${pathname}#p=${encodeURIComponent(matchingPreset.id)}`;
  }

  // 2. Check local short URL cache
  const cacheKey = `${tape.id || ''}_${tape.title || ''}_${(tape.sideA?.tracks?.length || 0)}_${(tape.sideB?.tracks?.length || 0)}`;
  const cache = getShortUrlCache();
  if (cache[cacheKey]) {
    return cache[cacheKey];
  }

  // 3. Upload to cloud bytebin for an ultra-short 10-character key (#s=key)
  try {
    const cloudKey = await uploadTapeToCloud(tape);
    if (cloudKey) {
      const shortUrl = `${origin}${pathname}#s=${cloudKey}`;
      setShortUrlCache(cacheKey, shortUrl);
      return shortUrl;
    }
  } catch (e) {
    console.warn('Cloud short URL generation fallback', e);
  }

  // 4. Fallback to compact Deflate + Base64URL (#m=base64url)
  try {
    const packed = packTape(tape);
    const jsonStr = JSON.stringify(packed);
    const compressedB64 = await compressStringToBase64Url(jsonStr);
    return `${origin}${pathname}#m=${compressedB64}`;
  } catch (e) {
    const fallbackStr = encodeURIComponent(JSON.stringify(tape));
    return `${origin}${pathname}#tape=${fallbackStr}`;
  }
}

// Legacy export alias
export const generateDirectShareUrl = generateShareUrl;
export async function shortenShareUrl(url) {
  return url;
}

// Parse tape from current window location (hash or query params)
export async function parseTapeFromUrl() {
  try {
    const hash = window.location.hash || '';
    const searchParams = new URLSearchParams(window.location.search || '');

    // 1. Cloud Short Link: #s=KEY or ?s=KEY
    let shortKey = null;
    if (hash.startsWith('#s=')) shortKey = decodeURIComponent(hash.substring(3));
    else if (hash.startsWith('#short=')) shortKey = decodeURIComponent(hash.substring(7));
    else if (searchParams.get('s')) shortKey = searchParams.get('s');
    else if (searchParams.get('short')) shortKey = searchParams.get('short');

    if (shortKey) {
      const cloudTape = await fetchTapeFromCloud(shortKey);
      if (cloudTape && cloudTape.title) {
        return cloudTape;
      }
    }

    // 2. Preset Tape: #p=... or ?p=... or #preset=... or ?preset=...
    let presetId = null;
    if (hash.startsWith('#p=')) presetId = decodeURIComponent(hash.substring(3));
    else if (hash.startsWith('#preset=')) presetId = decodeURIComponent(hash.substring(8));
    else if (searchParams.get('p')) presetId = searchParams.get('p');
    else if (searchParams.get('preset')) presetId = searchParams.get('preset');

    if (presetId) {
      const found = PRESET_TAPES.find(t => t.id === presetId);
      if (found) return found;
    }

    // 3. Compact Compressed Tape: #m=... or ?m=...
    let compressedData = null;
    if (hash.startsWith('#m=')) compressedData = hash.substring(3);
    else if (searchParams.get('m')) compressedData = searchParams.get('m');

    if (compressedData) {
      const decompressedJson = await decompressBase64UrlToString(compressedData);
      if (decompressedJson) {
        const parsedArray = JSON.parse(decompressedJson);
        const restoredTape = unpackTape(parsedArray);
        if (restoredTape && restoredTape.title) {
          return restoredTape;
        }
      }
    }

    // 4. Legacy Full JSON Tape: #tape=... or ?tape=...
    let legacyData = null;
    if (hash.startsWith('#tape=')) legacyData = hash.substring(6);
    else if (searchParams.get('tape')) legacyData = searchParams.get('tape');

    if (legacyData) {
      try {
        const decoded = decodeURIComponent(legacyData);
        if (decoded.startsWith('{') || decoded.startsWith('[')) {
          const tapeObj = JSON.parse(decoded);
          if (Array.isArray(tapeObj)) return unpackTape(tapeObj);
          return tapeObj;
        }
      } catch (e) {}

      const decompressed = await decompressBase64UrlToString(legacyData);
      if (decompressed) {
        const parsed = JSON.parse(decompressed);
        if (Array.isArray(parsed)) return unpackTape(parsed);
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error parsing tape from URL:', err);
  }

  return null;
}
