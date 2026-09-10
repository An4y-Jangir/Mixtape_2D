// Preset cassettes, Curated Retro Music Library, Ad-Free YouTube Music Streaming & Search

// Helper to format seconds into mm:ss
export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Handwriting font family resolver with robust fallbacks
export function getFontFamily(fontId) {
  switch (fontId) {
    case 'slater':
      return "'Walter Turncoat', cursive, sans-serif";
    case 'caveat':
      return "'Caveat', cursive, sans-serif";
    case 'permanent':
      return "'Permanent Marker', cursive, sans-serif";
    case 'kalam':
      return "'Kalam', cursive, sans-serif";
    case 'indie':
      return "'Indie Flower', cursive, sans-serif";
    case 'patrick':
      return "'Patrick Hand', cursive, sans-serif";
    case 'rockford':
    default:
      return "'Covered By Your Grace', cursive, sans-serif";
  }
}

export function getFontClass(fontId) {
  switch (fontId) {
    case 'slater': return 'font-slater';
    case 'caveat': return 'font-caveat';
    case 'permanent': return 'font-permanent';
    case 'kalam': return 'font-kalam';
    case 'indie': return 'font-indie';
    case 'patrick': return 'font-patrick';
    case 'rockford':
    default: return 'font-rockford';
  }
}

// Extract YouTube Video ID from any URL or raw string
export function extractYouTubeId(urlOrStr) {
  if (!urlOrStr || typeof urlOrStr !== 'string') return null;
  const str = urlOrStr.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(str)) return str;
  const match = str.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|music\.youtube\.com\/watch\?v=))([\w-]{11})/);
  return match ? match[1] : null;
}

// 1. YouTube Music Full Song Search API (Free, Ad-Free, Open High Quality Streaming)
export async function searchYouTubeMusic(query) {
  if (!query || query.trim().length < 2) return [];
  const cleanQ = query.trim();

  // If user directly pasted a YouTube or YouTube Music URL or video ID
  const directId = extractYouTubeId(cleanQ);
  if (directId) {
    return [{
      id: `yt-${directId}`,
      youtubeId: directId,
      title: cleanQ.length === 11 ? `YouTube Track (${cleanQ})` : 'Custom YouTube Music Track',
      artist: 'YouTube Music Stream',
      album: 'YouTube Audio',
      duration: '3:30',
      durationSec: 210,
      audioUrl: `https://www.youtube.com/watch?v=${directId}`,
      artworkUrl: `https://img.youtube.com/vi/${directId}/hqdefault.jpg`,
      genre: 'YouTube Music',
      isFullSong: true,
      source: 'YouTube Music (Full Song)'
    }];
  }

  const mirrors = [
    'https://api.piped.private.coffee',
    'https://pipedapi.ducks.party'
  ];

  for (const base of mirrors) {
    try {
      const url = `${base}/search?q=${encodeURIComponent(cleanQ)}&filter=music_songs`;
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' }, signal: AbortSignal.timeout(3500) });
      if (res.ok) {
        const data = await res.json();
        const items = data.items || (Array.isArray(data) ? data : []);
        if (items.length > 0) {
          return items
            .filter(item => item.url && (item.type === 'stream' || item.type === 'music_song' || item.type === 'video' || !item.type))
            .map(item => {
              const ytId = item.url.replace('/watch?v=', '').split('&')[0];
              const durationSec = item.duration > 0 ? item.duration : 210;
              return {
                id: `yt-${ytId}`,
                youtubeId: ytId,
                title: item.title || 'Untitled Song',
                artist: item.uploaderName || item.artist || item.uploader || 'YouTube Artist',
                album: item.album || 'YouTube Music',
                duration: formatDuration(durationSec),
                durationSec: durationSec,
                audioUrl: `https://www.youtube.com/watch?v=${ytId}`,
                artworkUrl: item.thumbnail || `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
                genre: 'YouTube Music',
                isFullSong: true,
                source: 'YouTube Music (Full Song)'
              };
            });
        }
      }
    } catch (e) {
      console.warn(`YouTube Music search mirror ${base} error:`, e.message);
    }
  }

  // Fallback: iTunes search metadata with YouTube stream capability
  try {
    const itunesTracks = await searchiTunesTracks(cleanQ);
    return itunesTracks;
  } catch (e) {
    return [];
  }
}

// 2. Global Commercial Catalog Search via iTunes API (30s official previews with album art)
export async function searchiTunesTracks(query) {
  if (!query || query.trim().length < 2) return [];
  try {
    const url = `https://itunes.apple.com/search?term=${encodeURIComponent(query.trim())}&entity=song&limit=25`;
    const response = await fetch(url);
    if (!response.ok) return [];
    const data = await response.json();
    if (!data.results || !Array.isArray(data.results)) return [];

    return data.results.map((item) => {
      const durationSec = Math.round((item.trackTimeMillis || 180000) / 1000);
      return {
        id: `itunes-${item.trackId || Math.random().toString(36).substr(2, 9)}`,
        title: item.trackName || 'Unknown Title',
        artist: item.artistName || 'Unknown Artist',
        album: item.collectionName || '',
        duration: formatDuration(durationSec),
        durationSec: durationSec,
        audioUrl: item.previewUrl || '',
        artworkUrl: item.artworkUrl100 || item.artworkUrl60 || '',
        genre: item.primaryGenreName || 'Alternative',
        isFullSong: false,
        source: 'Apple (30s Preview)'
      };
    });
  } catch (err) {
    console.warn('iTunes search error:', err);
    return [];
  }
}

// 3. Online Track Search (defaults to YouTube Music Full Songs)
export async function searchOnlineTracks(query, mode = 'full') {
  if (mode === 'preview') {
    return await searchiTunesTracks(query);
  }
  const ytResults = await searchYouTubeMusic(query);
  if (ytResults.length > 0) return ytResults;
  return await searchiTunesTracks(query);
}

// 56 Curated Retro & Nostalgic Tracks across 10 Genres with YouTube Music IDs
export const GENRE_TRACK_LIBRARY = [
  // 90s Alternative & Grunge
  { id: 'lib-1', title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: '5:01', durationSec: 301, genre: 'Grunge', youtubeId: 'hTWKbfoikeg' },
  { id: 'lib-2', title: '1979', artist: 'The Smashing Pumpkins', duration: '4:26', durationSec: 266, genre: 'Alternative', youtubeId: '4aeETEoNfOg' },
  { id: 'lib-3', title: 'Everlong', artist: 'Foo Fighters', duration: '4:10', durationSec: 250, genre: 'Alternative', youtubeId: 'eBG7P-K-r1Y' },
  { id: 'lib-4', title: 'Black Hole Sun', artist: 'Soundgarden', duration: '5:18', durationSec: 318, genre: 'Grunge', youtubeId: '3mbBbFH9fAg' },
  { id: 'lib-5', title: 'Zombie', artist: 'The Cranberries', duration: '5:06', durationSec: 306, genre: 'Alternative', youtubeId: '6Ejga4kJUts' },
  { id: 'lib-6', title: 'Linger', artist: 'The Cranberries', duration: '4:34', durationSec: 274, genre: 'Alternative', youtubeId: 'G6Kspj3OO0s' },

  // Britpop & 90s UK
  { id: 'lib-7', title: 'Wonderwall', artist: 'Oasis', duration: '4:18', durationSec: 258, genre: 'Britpop', youtubeId: '6hzrDeceEKc' },
  { id: 'lib-8', title: 'Don’t Look Back in Anger', artist: 'Oasis', duration: '4:48', durationSec: 288, genre: 'Britpop', youtubeId: 'r8OipmKFDeM' },
  { id: 'lib-9', title: 'Bitter Sweet Symphony', artist: 'The Verve', duration: '5:58', durationSec: 358, genre: 'Britpop', youtubeId: '1lyu1KKwC74' },
  { id: 'lib-10', title: 'Song 2', artist: 'Blur', duration: '2:01', durationSec: 121, genre: 'Britpop', youtubeId: 'SSbBvKaM6sk' },
  { id: 'lib-11', title: 'Parklife', artist: 'Blur', duration: '3:05', durationSec: 185, genre: 'Britpop', youtubeId: 'YSuHrTfcikU' },
  { id: 'lib-12', title: 'There Is a Light That Never Goes Out', artist: 'The Smiths', duration: '4:04', durationSec: 244, genre: 'Britpop', youtubeId: 'siO6dkqidc4' },

  // 90s Electronic & Big Beat
  { id: 'lib-13', title: 'Da Funk', artist: 'Daft Punk', duration: '5:29', durationSec: 329, genre: 'Electronic', youtubeId: 'm4cgLL8JaCo' },
  { id: 'lib-14', title: 'Around The World', artist: 'Daft Punk', duration: '7:09', durationSec: 429, genre: 'Electronic', youtubeId: 'dwDns8x3Jb4' },
  { id: 'lib-15', title: 'Block Rockin’ Beats', artist: 'The Chemical Brothers', duration: '4:53', durationSec: 293, genre: 'Electronic', youtubeId: 'tpKCqp9EFSk' },
  { id: 'lib-16', title: 'Praise You', artist: 'Fatboy Slim', duration: '5:23', durationSec: 323, genre: 'Big Beat', youtubeId: 'ruAi46TNWgc' },
  { id: 'lib-17', title: 'The Rockafeller Skank', artist: 'Fatboy Slim', duration: '3:59', durationSec: 239, genre: 'Big Beat', youtubeId: 'FMrIy9zv7QY' },
  { id: 'lib-18', title: 'Firestarter', artist: 'The Prodigy', duration: '4:15', durationSec: 255, genre: 'Electronic', youtubeId: 'wmin5WkOuPw' },
  { id: 'lib-19', title: 'Breathe', artist: 'The Prodigy', duration: '5:35', durationSec: 335, genre: 'Electronic', youtubeId: 'rmhdKEz_VbQ' },
  { id: 'lib-20', title: 'Teardrop', artist: 'Massive Attack', duration: '5:31', durationSec: 331, genre: 'Trip Hop', youtubeId: 'u7K72X4eo_s' },

  // Synthwave & Retrowave
  { id: 'lib-21', title: 'Midnight City', artist: 'M83', duration: '4:03', durationSec: 243, genre: 'Synthwave', youtubeId: 'dX3k_QDnzHE' },
  { id: 'lib-22', title: 'Nightcall', artist: 'Kavinsky', duration: '4:19', durationSec: 259, genre: 'Synthwave', youtubeId: 'MV_3Dpw-BRY' },
  { id: 'lib-23', title: 'Resonance', artist: 'HOME', duration: '3:32', durationSec: 212, genre: 'Synthwave', youtubeId: '8GW6sLrK40k' },
  { id: 'lib-24', title: 'Sunset', artist: 'The Midnight', duration: '5:26', durationSec: 326, genre: 'Synthwave', youtubeId: 'rDE42K0u_Qk' },
  { id: 'lib-25', title: 'Tech Noir', artist: 'GUNSHIP', duration: '4:57', durationSec: 297, genre: 'Synthwave', youtubeId: '-ED36A8109s' },
  { id: 'lib-26', title: 'A Real Hero', artist: 'College & Electric Youth', duration: '4:27', durationSec: 267, genre: 'Synthwave', youtubeId: 'wcV1UpdaFbA' },

  // Indie Rock & 2000s Anthems
  { id: 'lib-27', title: '1901', artist: 'Phoenix', duration: '3:13', durationSec: 193, genre: 'Indie Rock', youtubeId: 'HL548cHH3OY' },
  { id: 'lib-28', title: 'Lisztomania', artist: 'Phoenix', duration: '4:01', durationSec: 241, genre: 'Indie Rock', youtubeId: '4BJDNw7o6so' },
  { id: 'lib-29', title: 'Electric Feel', artist: 'MGMT', duration: '3:49', durationSec: 229, genre: 'Indie Rock', youtubeId: 'MmZexg8sxyk' },
  { id: 'lib-30', title: 'Kids', artist: 'MGMT', duration: '5:02', durationSec: 302, genre: 'Indie Rock', youtubeId: 'fe4EK4HSPkI' },
  { id: 'lib-31', title: 'Tongue Tied', artist: 'GROUPLOVE', duration: '3:38', durationSec: 218, genre: 'Indie Rock', youtubeId: '1x1wjGKHjBI' },
  { id: 'lib-32', title: 'Feel Good Inc.', artist: 'Gorillaz', duration: '3:43', durationSec: 223, genre: 'Alternative', youtubeId: 'HyHNuVaZJ-k' },
  { id: 'lib-33', title: 'Clint Eastwood', artist: 'Gorillaz', duration: '5:41', durationSec: 341, genre: 'Alternative', youtubeId: '1V_xRb0x9aw' },
  { id: 'lib-34', title: 'Float On', artist: 'Modest Mouse', duration: '3:28', durationSec: 208, genre: 'Indie Rock', youtubeId: 'CTAud5O7Qqk' },

  // Dream Pop & Shoegaze
  { id: 'lib-35', title: 'Fade Into You', artist: 'Mazzy Star', duration: '4:55', durationSec: 295, genre: 'Dream Pop', youtubeId: 'ImKY6TZEyrI' },
  { id: 'lib-36', title: 'Space Song', artist: 'Beach House', duration: '5:20', durationSec: 320, genre: 'Dream Pop', youtubeId: 'RBtlPT23PTM' },
  { id: 'lib-37', title: 'Apocalypse', artist: 'Cigarettes After Sex', duration: '4:50', durationSec: 290, genre: 'Dream Pop', youtubeId: 'sElE_BfQ67s' },
  { id: 'lib-38', title: 'K.', artist: 'Cigarettes After Sex', duration: '5:18', durationSec: 318, genre: 'Dream Pop', youtubeId: 'L4sbDxR22z4' },
  { id: 'lib-39', title: 'Just Like Honey', artist: 'The Jesus and Mary Chain', duration: '3:03', durationSec: 183, genre: 'Shoegaze', youtubeId: '7EgB__YratE' },
  { id: 'lib-40', title: 'When the Sun Hits', artist: 'Slowdive', duration: '4:47', durationSec: 287, genre: 'Shoegaze', youtubeId: '2Zjr2_Z_zF0' },

  // Pop Punk & 90s Skate Punk
  { id: 'lib-41', title: 'Basket Case', artist: 'Green Day', duration: '3:01', durationSec: 181, genre: 'Pop Punk', youtubeId: 'NUTGr5t3Mo8' },
  { id: 'lib-42', title: 'Wake Me Up When September Ends', artist: 'Green Day', duration: '4:46', durationSec: 286, genre: 'Pop Punk', youtubeId: 'NU9JoFK5PZZ' },
  { id: 'lib-43', title: 'What’s My Age Again?', artist: 'Blink-182', duration: '2:28', durationSec: 148, genre: 'Pop Punk', youtubeId: 'K7l5ZeVVoCA' },
  { id: 'lib-44', title: 'All The Small Things', artist: 'Blink-182', duration: '2:48', durationSec: 168, genre: 'Pop Punk', youtubeId: '9Ht58X0426w' },
  { id: 'lib-45', title: 'Santeria', artist: 'Sublime', duration: '3:03', durationSec: 183, genre: 'Ska Punk', youtubeId: 'AEYN5w4T_aM' },
  { id: 'lib-46', title: 'The Middle', artist: 'Jimmy Eat World', duration: '2:46', durationSec: 166, genre: 'Pop Punk', youtubeId: 'oKsxPW6i3pM' },

  // Lo-Fi & Indie Bedroom Pop
  { id: 'lib-47', title: 'Coffee', artist: 'beabadoobee', duration: '2:06', durationSec: 126, genre: 'Lo-Fi', youtubeId: '2b918m2E1oM' },
  { id: 'lib-48', title: 'Skinny Love', artist: 'Bon Iver', duration: '3:59', durationSec: 239, genre: 'Indie Folk', youtubeId: 'ssdgFoPU728' },
  { id: 'lib-49', title: 'Holocene', artist: 'Bon Iver', duration: '5:37', durationSec: 337, genre: 'Indie Folk', youtubeId: 'TWcyIpul8OE' },
  { id: 'lib-50', title: 'First Day of My Life', artist: 'Bright Eyes', duration: '3:08', durationSec: 188, genre: 'Indie Folk', youtubeId: 'o5bA53u_l4U' },
  { id: 'lib-51', title: 'Home', artist: 'Edward Sharpe & The Magnetic Zeros', duration: '5:03', durationSec: 303, genre: 'Indie Folk', youtubeId: 'DHEOF_rcND8' },
  { id: 'lib-52', title: 'Riptide', artist: 'Vance Joy', duration: '3:24', durationSec: 204, genre: 'Indie Folk', youtubeId: 'uJ_1HMAGb4k' },

  // 80s City Pop & Retro Funk
  { id: 'lib-53', title: 'Plastic Love', artist: 'Mariya Takeuchi', duration: '4:54', durationSec: 294, genre: 'City Pop', youtubeId: '3bNITQR4Uso' },
  { id: 'lib-54', title: 'Stay With Me', artist: 'Miki Matsubara', duration: '5:03', durationSec: 303, genre: 'City Pop', youtubeId: 'M0qMgoChzGI' },
  { id: 'lib-55', title: 'Sparkle', artist: 'Tatsuro Yamashita', duration: '4:16', durationSec: 256, genre: 'City Pop', youtubeId: '7ijMDQgvW0o' },
  { id: 'lib-56', title: 'Flyday Chinatown', artist: 'Yasuha', duration: '3:28', durationSec: 208, genre: 'City Pop', youtubeId: 'X9F5Q7h5PzQ' },
];

// Curated Mixtape by @AnayJ
export const PRESET_TAPES = [
  {
    id: 'mixtape-for-tanisha',
    title: 'A Mixtape FOR TANISHA',
    author: '@AnayJ',
    format: 'CRX 60',
    durationLabel: '2 x 30 min',
    cardDesign: 'ocean',
    font: 'patrick',
    colors: {
      primary: '#0284c7',
      secondary: '#0369a1',
      shell: '#082f49',
      ink: '#0c4a6e',
      highlighter: '#38bdf8',
      paper: '#f0f9ff'
    },
    sideA: {
      title: 'Side A: Tanishaaaaa',
      tracks: [
        {
          id: 't-1',
          youtubeId: 'yr1-AxyzIGE',
          title: 'Tera Rastaa Chhodoon Na',
          artist: 'Vishal-Shekhar',
          album: 'YouTube Music',
          duration: '4:13',
          durationSec: 253,
          audioUrl: 'https://www.youtube.com/watch?v=yr1-AxyzIGE',
          artworkUrl: 'https://img.youtube.com/vi/yr1-AxyzIGE/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        },
        {
          id: 't-2',
          youtubeId: 'Z25GNhpajyY',
          title: 'Qayde Se',
          artist: 'Arijit Singh',
          album: 'YouTube Music',
          duration: '3:36',
          durationSec: 216,
          audioUrl: 'https://www.youtube.com/watch?v=Z25GNhpajyY',
          artworkUrl: 'https://img.youtube.com/vi/Z25GNhpajyY/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        },
        {
          id: 't-3',
          youtubeId: 'wfSPYgJpJ4c',
          title: 'Kashmir Main Tu Kanyakumari',
          artist: 'Vishal-Shekhar',
          album: 'YouTube Music',
          duration: '5:08',
          durationSec: 308,
          audioUrl: 'https://www.youtube.com/watch?v=wfSPYgJpJ4c',
          artworkUrl: 'https://img.youtube.com/vi/wfSPYgJpJ4c/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        },
        {
          id: 't-4',
          youtubeId: 'DGgz_C2rn68',
          title: 'Dildaara (Stand By Me)',
          artist: 'Vishal-Shekhar',
          album: 'YouTube Music',
          duration: '4:10',
          durationSec: 250,
          audioUrl: 'https://www.youtube.com/watch?v=DGgz_C2rn68',
          artworkUrl: 'https://img.youtube.com/vi/DGgz_C2rn68/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        },
        {
          id: 't-5',
          youtubeId: 'BKQzhPLIqps',
          title: 'Maaeri',
          artist: 'Palash Sen',
          album: 'YouTube Music',
          duration: '5:33',
          durationSec: 333,
          audioUrl: 'https://www.youtube.com/watch?v=BKQzhPLIqps',
          artworkUrl: 'https://img.youtube.com/vi/BKQzhPLIqps/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        }
      ]
    },
    sideB: {
      title: 'Side B: Anay',
      tracks: [
        {
          id: 't-6',
          youtubeId: 'pyeDcL6dLeY',
          title: 'I Think I Left the Stove On',
          artist: 'Hotel Ugly',
          album: 'YouTube Music',
          duration: '3:23',
          durationSec: 203,
          audioUrl: 'https://www.youtube.com/watch?v=pyeDcL6dLeY',
          artworkUrl: 'https://img.youtube.com/vi/pyeDcL6dLeY/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        },
        {
          id: 't-7',
          youtubeId: 'a24EUd0zeqI',
          title: 'Shut up My Moms Calling',
          artist: 'Hotel Ugly',
          album: 'YouTube Music',
          duration: '2:45',
          durationSec: 165,
          audioUrl: 'https://www.youtube.com/watch?v=a24EUd0zeqI',
          artworkUrl: 'https://img.youtube.com/vi/a24EUd0zeqI/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        },
        {
          id: 't-8',
          youtubeId: 'nNN88hijp-o',
          title: 'Roommates',
          artist: 'Malcolm Todd',
          album: 'YouTube Music',
          duration: '3:35',
          durationSec: 215,
          audioUrl: 'https://www.youtube.com/watch?v=nNN88hijp-o',
          artworkUrl: 'https://img.youtube.com/vi/nNN88hijp-o/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        },
        {
          id: 't-9',
          youtubeId: 'RSHjMQeSfQY',
          title: 'Kho Sa Gaya Hoon',
          artist: 'OutStation',
          album: 'YouTube Music',
          duration: '2:08',
          durationSec: 128,
          audioUrl: 'https://www.youtube.com/watch?v=RSHjMQeSfQY',
          artworkUrl: 'https://img.youtube.com/vi/RSHjMQeSfQY/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        },
        {
          id: 't-10',
          youtubeId: 'NMRhx71bGo4',
          title: 'Let It Happen',
          artist: 'Tame Impala',
          album: 'YouTube Music',
          duration: '7:48',
          durationSec: 468,
          audioUrl: 'https://www.youtube.com/watch?v=NMRhx71bGo4',
          artworkUrl: 'https://img.youtube.com/vi/NMRhx71bGo4/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        },
        {
          id: 't-11',
          youtubeId: 'ecYrTGNfqEg',
          title: 'Piece Of Heaven',
          artist: 'Tame Impala',
          album: 'YouTube Music',
          duration: '4:45',
          durationSec: 285,
          audioUrl: 'https://www.youtube.com/watch?v=ecYrTGNfqEg',
          artworkUrl: 'https://img.youtube.com/vi/ecYrTGNfqEg/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        },
        {
          id: 't-12',
          youtubeId: 'tPQR3ckPRis',
          title: 'Consume (feat. Goon Des Garcons)',
          artist: 'Chase Atlantic',
          album: 'YouTube Music',
          duration: '4:28',
          durationSec: 268,
          audioUrl: 'https://www.youtube.com/watch?v=tPQR3ckPRis',
          artworkUrl: 'https://img.youtube.com/vi/tPQR3ckPRis/hqdefault.jpg',
          genre: 'YouTube Music',
          isFullSong: true,
          source: 'YouTube Music (Full Song)'
        }
      ]
    },
    stickers: [],
    doodles: [],
    linerNotes: 'Side A for w hindi song, Side B for mid songs genreXD',
    isUserCreated: true
  }
];
