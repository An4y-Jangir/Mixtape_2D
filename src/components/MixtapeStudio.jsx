import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  Sparkles, 
  Upload, 
  MoveUp, 
  MoveDown, 
  RotateCw, 
  ArrowLeft,
  BookOpen,
  Disc,
  Palette,
  Layers,
  Heart,
  Mic,
  MicOff,
  Globe,
  Music2,
  Clock,
  Check,
  RefreshCw,
  ArrowRightLeft,
  Sliders,
  Maximize2,
  X,
  Radio,
  Link,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { audioEngine } from '../services/audioService';
import { GENRE_TRACK_LIBRARY, searchOnlineTracks, searchYouTubeMusic, extractYouTubeId, formatDuration, getFontFamily, getFontClass } from '../data/defaultTapes';
import { STICKER_CATEGORIES, STICKERS, DOODLE_CATEGORIES, DOODLES } from '../data/stickerData';
import JCardView from './JCardView';
import GuideModal from './GuideModal';

const TAPE_FORMATS = [
  { id: 'CRX 30', name: 'C-30 (2 x 15 min)', sideLimitSec: 900, label: '2 x 15 min' },
  { id: 'CRX 40', name: 'C-40 (2 x 20 min)', sideLimitSec: 1200, label: '2 x 20 min' },
  { id: 'CRX 46', name: 'C-46 (2 x 23 min)', sideLimitSec: 1380, label: '2 x 23 min' },
  { id: 'CRX 60', name: 'C-60 (2 x 30 min)', sideLimitSec: 1800, label: '2 x 30 min' },
  { id: 'CRX 90', name: 'C-90 (2 x 45 min)', sideLimitSec: 2700, label: '2 x 45 min' },
];

const CARD_PRESETS = [
  { id: 'scootch', name: 'SCOOTCH C-40', primary: '#d97706', secondary: '#9a3412', shell: '#18181b', paper: '#fbf7ee', ink: '#0c0a09' },
  { id: 'tokyo', name: 'TOKYO NEON', primary: '#1d4ed8', secondary: '#ec4899', shell: '#0f172a', paper: '#f3f4f6', ink: '#0f172a' },
  { id: 'vintage', name: 'VINTAGE GOLD', primary: '#b45309', secondary: '#78350f', shell: '#292524', paper: '#fefce8', ink: '#1c1917' },
  { id: 'grunge', name: '90s GRUNGE', primary: '#334155', secondary: '#0f172a', shell: '#18181b', paper: '#f5f5f4', ink: '#0f172a' },
  { id: 'sakura', name: 'SAKURA PINK', primary: '#ec4899', secondary: '#be185d', shell: '#fdf2f8', paper: '#fff1f2', ink: '#831843' },
  { id: 'ocean', name: 'DEEP OCEAN', primary: '#0284c7', secondary: '#0369a1', shell: '#082f49', paper: '#f0f9ff', ink: '#0c4a6e' },
  { id: 'smoke-clear', name: 'CLEAR SMOKE', primary: '#64748b', secondary: '#334155', shell: '#27272a', paper: '#f8fafc', ink: '#09090b' },
  { id: 'cyber', name: 'CYBER CYAN', primary: '#06b6d4', secondary: '#9333ea', shell: '#09090b', paper: '#0f172a', ink: '#06b6d4' },
  { id: 'coral', name: 'SUNSET CORAL', primary: '#f97316', secondary: '#ea580c', shell: '#1c1917', paper: '#fff7ed', ink: '#7c2d12' },
  { id: 'emerald', name: 'EMERALD TAPE', primary: '#059669', secondary: '#047857', shell: '#064e3b', paper: '#ecfdf5', ink: '#064e3b' },
  { id: 'ghost', name: 'GHOST WHITE', primary: '#71717a', secondary: '#3f3f46', shell: '#fafafa', paper: '#ffffff', ink: '#18181b' },
  { id: 'obsidian', name: 'OBSIDIAN', primary: '#ef4444', secondary: '#991b1b', shell: '#09090b', paper: '#18181b', ink: '#f4f4f5' },
];

const FONTS = [
  { id: 'rockford', name: 'Rockford (Marker)', font: "'Covered By Your Grace', cursive" },
  { id: 'slater', name: 'Slater (Messy Punk)', font: "'Walter Turncoat', cursive" },
  { id: 'caveat', name: 'Caveat (Cursive)', font: "'Caveat', cursive" },
  { id: 'permanent', name: 'Permanent Marker', font: "'Permanent Marker', cursive" },
  { id: 'kalam', name: 'Kalam (Handwritten)', font: "'Kalam', cursive" },
  { id: 'indie', name: 'Indie Flower', font: "'Indie Flower', cursive" },
  { id: 'patrick', name: 'Patrick Hand', font: "'Patrick Hand', cursive" },
];

const HIGHLIGHTER_COLORS = [
  { id: '#ec4899', name: 'Pink' },
  { id: '#fbbf24', name: 'Yellow' },
  { id: '#38bdf8', name: 'Cyan' },
  { id: '#a855f7', name: 'Purple' },
  { id: '#4ade80', name: 'Green' },
  { id: '#f97316', name: 'Orange' },
];

const GENRES = [
  'All',
  'Grunge',
  'Britpop',
  'Electronic',
  'Synthwave',
  'Indie Rock',
  'Dream Pop',
  'Pop Punk',
  'Lo-Fi',
  'City Pop',
  'Alternative'
];

export default function MixtapeStudio({
  initialTape,
  onSaveTape,
  onBackToRack,
  userProfile
}) {
  const [activeTab, setActiveTab] = useState('build'); // 'build', 'style', 'guide'
  const [trackSourceTab, setTrackSourceTab] = useState('online'); // 'online', 'library', 'custom', 'voice'
  const [onlineSearchMode, setOnlineSearchMode] = useState('full'); // 'full' (YouTube Music), 'preview' (iTunes)
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [styleSubTab, setStyleSubTab] = useState('jcard'); // 'jcard', 'stickers', 'doodles', 'notes'
  const [selectedStickerCat, setSelectedStickerCat] = useState('all');
  const [selectedDoodleCat, setSelectedDoodleCat] = useState('all');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  // Selected Placed Item (for repositioning/scaling/deleting)
  const [selectedPlacedItem, setSelectedPlacedItem] = useState(null);

  // Voice recording state
  const [isVoiceRecording, setIsVoiceRecording] = useState(false);
  const [voiceRecordDuration, setVoiceRecordDuration] = useState(0);
  const voiceTimerRef = useRef(null);

  // Custom direct URL or manual song inputs
  const [directAudioUrl, setDirectAudioUrl] = useState('');
  const [customSongTitle, setCustomSongTitle] = useState('');
  const [customSongArtist, setCustomSongArtist] = useState('');
  const [customSongDuration, setCustomSongDuration] = useState('3:30');

  // Tape Draft State
  const [tape, setTape] = useState(initialTape || {
    id: `user-tape-${Date.now()}`,
    title: 'My Ultimate Mixtape',
    author: userProfile?.username || 'AnayJ',
    format: 'CRX 40',
    durationLabel: '2 x 20 min',
    cardDesign: 'scootch',
    font: 'rockford',
    colors: {
      primary: '#d97706',
      secondary: '#9a3412',
      shell: '#18181b',
      ink: '#0c0a09',
      highlighter: '#ec4899',
      paper: '#fbf7ee',
    },
    sideA: {
      title: 'A Side Title',
      tracks: [
        { id: 'usr-1', title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: '5:01', durationSec: 301, genre: 'Grunge' },
        { id: 'usr-2', title: '1979', artist: 'The Smashing Pumpkins', duration: '4:26', durationSec: 266, genre: 'Alternative' },
      ]
    },
    sideB: {
      title: 'B Side Title',
      tracks: [
        { id: 'usr-3', title: 'Everlong', artist: 'Foo Fighters', duration: '4:10', durationSec: 250, genre: 'Alternative' },
      ]
    },
    stickers: [
      { id: 'st-d1', stickerId: 'holo-star', x: 74, y: 14, scale: 1.1, rotation: 8 },
    ],
    doodles: [
      { id: 'do-d1', doodleId: 'lightning-bolt', x: 20, y: 80, scale: 0.9, rotation: -10, color: '#0c0a09' },
    ],
    linerNotes: 'Side A for the drive. Side B for the rooftop.',
    isUserCreated: true
  });

  // Track Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [onlineResults, setOnlineResults] = useState([]);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [previewingTrackId, setPreviewingTrackId] = useState(null);
  const fileInputRef = useRef(null);

  // Get current side limit based on tape format
  const currentFormatObj = TAPE_FORMATS.find(f => f.id === tape.format) || TAPE_FORMATS[1];
  const sideLimitSec = currentFormatObj.sideLimitSec;

  // Running Times
  const sideATimeSec = (tape.sideA?.tracks || []).reduce((acc, t) => acc + (t.durationSec || 180), 0);
  const sideBTimeSec = (tape.sideB?.tracks || []).reduce((acc, t) => acc + (t.durationSec || 180), 0);

  // Debounced Online Track Search (Audius Full Songs / iTunes)
  useEffect(() => {
    if (trackSourceTab !== 'online' || !searchQuery.trim() || searchQuery.trim().length < 2) {
      if (!searchQuery.trim()) setOnlineResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearchingOnline(true);
      const results = await searchOnlineTracks(searchQuery, onlineSearchMode);
      setOnlineResults(results);
      setIsSearchingOnline(false);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchQuery, trackSourceTab, onlineSearchMode]);

  // Handle Track Preview
  const handleTogglePreview = (track) => {
    if (previewingTrackId === track.id) {
      audioEngine.pause();
      setPreviewingTrackId(null);
    } else {
      setPreviewingTrackId(track.id);
      audioEngine.playTrack(track);
    }
  };

  // Add track to side
  const handleAddTrack = (trackDef, targetSide) => {
    audioEngine.playButtonTick();
    const newTrack = {
      ...trackDef,
      id: `track-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    };

    if (targetSide === 'A') {
      setTape(prev => ({
        ...prev,
        sideA: { ...prev.sideA, tracks: [...(prev.sideA?.tracks || []), newTrack] }
      }));
    } else {
      setTape(prev => ({
        ...prev,
        sideB: { ...prev.sideB, tracks: [...(prev.sideB?.tracks || []), newTrack] }
      }));
    }
  };

  // Remove track
  const handleRemoveTrack = (side, index) => {
    audioEngine.playButtonTick();
    if (side === 'A') {
      const updated = [...tape.sideA.tracks];
      updated.splice(index, 1);
      setTape(prev => ({ ...prev, sideA: { ...prev.sideA, tracks: updated } }));
    } else {
      const updated = [...tape.sideB.tracks];
      updated.splice(index, 1);
      setTape(prev => ({ ...prev, sideB: { ...prev.sideB, tracks: updated } }));
    }
  };

  // Move track within side
  const handleMoveTrack = (side, index, direction) => {
    audioEngine.playButtonTick();
    const list = side === 'A' ? [...tape.sideA.tracks] : [...tape.sideB.tracks];
    const targetIdx = index + direction;
    if (targetIdx < 0 || targetIdx >= list.length) return;
    const temp = list[index];
    list[index] = list[targetIdx];
    list[targetIdx] = temp;
    if (side === 'A') {
      setTape(prev => ({ ...prev, sideA: { ...prev.sideA, tracks: list } }));
    } else {
      setTape(prev => ({ ...prev, sideB: { ...prev.sideB, tracks: list } }));
    }
  };

  // Transfer track to other side
  const handleSwapTrackSide = (side, index) => {
    audioEngine.playButtonTick();
    if (side === 'A') {
      const track = tape.sideA.tracks[index];
      const updatedA = [...tape.sideA.tracks];
      updatedA.splice(index, 1);
      setTape(prev => ({
        ...prev,
        sideA: { ...prev.sideA, tracks: updatedA },
        sideB: { ...prev.sideB, tracks: [...(prev.sideB?.tracks || []), track] }
      }));
    } else {
      const track = tape.sideB.tracks[index];
      const updatedB = [...tape.sideB.tracks];
      updatedB.splice(index, 1);
      setTape(prev => ({
        ...prev,
        sideB: { ...prev.sideB, tracks: updatedB },
        sideA: { ...prev.sideA, tracks: [...(prev.sideA?.tracks || []), track] }
      }));
    }
  };

  // Custom Audio File Upload
  const handleCustomAudioUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    audioEngine.playButtonTick();
    const url = URL.createObjectURL(file);
    const fileName = file.name.replace(/\.[^/.]+$/, "");
    const parts = fileName.split('-');
    const artist = parts.length > 1 ? parts[0].trim() : 'Local Audio';
    const title = parts.length > 1 ? parts.slice(1).join('-').trim() : parts[0].trim();

    const tempAudio = new Audio();
    tempAudio.src = url;
    tempAudio.addEventListener('loadedmetadata', () => {
      const durSec = Math.round(tempAudio.duration) || 210;
      const customTrack = {
        id: `upload-${Date.now()}`,
        title: title || 'Custom Track',
        artist: artist || 'Local Artist',
        duration: formatDuration(durSec),
        durationSec: durSec,
        audioUrl: url,
        genre: 'Custom',
        isFullSong: true
      };

      if (sideATimeSec < sideLimitSec) {
        handleAddTrack(customTrack, 'A');
      } else {
        handleAddTrack(customTrack, 'B');
      }
    });
  };

  // Direct Audio URL Link Submission (Supports YouTube / YouTube Music / MP3 Streams)
  const handleAddDirectUrl = (targetSide) => {
    if (!directAudioUrl.trim()) return;
    audioEngine.playButtonTick();
    const cleanUrl = directAudioUrl.trim();
    const ytId = extractYouTubeId(cleanUrl);

    const title = customSongTitle.trim() || (ytId ? 'YouTube Music Track' : 'Web Stream Track');
    const artist = customSongArtist.trim() || (ytId ? 'YouTube Stream' : 'Direct Link');
    const parts = customSongDuration.split(':');
    let durSec = 210;
    if (parts.length === 2) {
      durSec = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }

    const urlTrack = {
      id: `url-${Date.now()}`,
      title,
      artist,
      duration: formatDuration(durSec),
      durationSec: durSec || 210,
      audioUrl: cleanUrl,
      youtubeId: ytId || undefined,
      artworkUrl: ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : '',
      genre: ytId ? 'YouTube Music' : 'Direct URL',
      isFullSong: true,
      source: ytId ? 'YouTube Music (Full Song)' : 'Web Stream'
    };
    handleAddTrack(urlTrack, targetSide);
    setDirectAudioUrl('');
    setCustomSongTitle('');
    setCustomSongArtist('');
  };

  // Manual Custom Song Submission
  const handleAddManualSong = (targetSide) => {
    if (!customSongTitle.trim()) return;
    audioEngine.playButtonTick();
    const parts = customSongDuration.split(':');
    let durSec = 210;
    if (parts.length === 2) {
      durSec = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10);
    }
    const manualTrack = {
      id: `manual-${Date.now()}`,
      title: customSongTitle.trim(),
      artist: customSongArtist.trim() || 'Custom Artist',
      duration: formatDuration(durSec),
      durationSec: durSec || 210,
      genre: 'Custom',
      isFullSong: true
    };
    handleAddTrack(manualTrack, targetSide);
    setCustomSongTitle('');
    setCustomSongArtist('');
  };

  // Microphone Voice Recording Flow
  const handleStartVoiceRecording = async () => {
    try {
      audioEngine.playRecordSound();
      await audioEngine.startVoiceRecording();
      setIsVoiceRecording(true);
      setVoiceRecordDuration(0);
      voiceTimerRef.current = setInterval(() => {
        setVoiceRecordDuration(prev => prev + 1);
      }, 1000);
    } catch (err) {
      alert('Microphone access was denied or not supported on this browser.');
    }
  };

  const handleStopVoiceRecording = async (targetSide = 'A') => {
    if (voiceTimerRef.current) clearInterval(voiceTimerRef.current);
    try {
      audioEngine.playStopClick();
      const { audioUrl } = await audioEngine.stopVoiceRecording();
      setIsVoiceRecording(false);
      const voiceTrack = {
        id: `voice-${Date.now()}`,
        title: `Voice Liner Note #${(tape.sideA?.tracks?.length || 0) + (tape.sideB?.tracks?.length || 0) + 1}`,
        artist: tape.author || userProfile?.username || 'You',
        duration: formatDuration(voiceRecordDuration || 5),
        durationSec: voiceRecordDuration || 5,
        audioUrl: audioUrl,
        genre: 'Spoken Word',
        isFullSong: true
      };
      handleAddTrack(voiceTrack, targetSide);
      setVoiceRecordDuration(0);
    } catch (e) {
      console.error(e);
      setIsVoiceRecording(false);
    }
  };

  // --- STICKER / DOODLE PLACEMENT & CONTROLS ---
  const handlePlaceSticker = (stickerId) => {
    audioEngine.playButtonTick();
    const newSticker = {
      id: `st-${Date.now()}`,
      stickerId,
      x: 30 + Math.random() * 40,
      y: 25 + Math.random() * 50,
      scale: 1,
      rotation: Math.round((Math.random() - 0.5) * 25)
    };
    setTape(prev => ({
      ...prev,
      stickers: [...(prev.stickers || []), newSticker]
    }));
    setSelectedPlacedItem({ type: 'sticker', id: newSticker.id });
  };

  const handlePlaceDoodle = (doodleId) => {
    audioEngine.playButtonTick();
    const newDoodle = {
      id: `do-${Date.now()}`,
      doodleId,
      x: 30 + Math.random() * 40,
      y: 30 + Math.random() * 40,
      scale: 1,
      rotation: Math.round((Math.random() - 0.5) * 20),
      color: tape.colors?.ink || '#000000'
    };
    setTape(prev => ({
      ...prev,
      doodles: [...(prev.doodles || []), newDoodle]
    }));
    setSelectedPlacedItem({ type: 'doodle', id: newDoodle.id });
  };

  const handleUpdateSelectedItem = (updates) => {
    if (!selectedPlacedItem) return;
    if (selectedPlacedItem.type === 'sticker') {
      setTape(prev => ({
        ...prev,
        stickers: prev.stickers.map(s => s.id === selectedPlacedItem.id ? { ...s, ...updates } : s)
      }));
    } else {
      setTape(prev => ({
        ...prev,
        doodles: prev.doodles.map(d => d.id === selectedPlacedItem.id ? { ...d, ...updates } : d)
      }));
    }
  };

  const handleDeleteSelectedItem = () => {
    if (!selectedPlacedItem) return;
    audioEngine.playButtonTick();
    if (selectedPlacedItem.type === 'sticker') {
      setTape(prev => ({
        ...prev,
        stickers: prev.stickers.filter(s => s.id !== selectedPlacedItem.id)
      }));
    } else {
      setTape(prev => ({
        ...prev,
        doodles: prev.doodles.filter(d => d.id !== selectedPlacedItem.id)
      }));
    }
    setSelectedPlacedItem(null);
  };

  const handleClearDecorations = () => {
    audioEngine.playButtonTick();
    setTape(prev => ({ ...prev, stickers: [], doodles: [] }));
    setSelectedPlacedItem(null);
  };

  // --- RECORD TAPE FLOW ---
  const handleRecordTape = () => {
    audioEngine.playRecordSound();
    setIsRecording(true);

    setTimeout(() => {
      setIsRecording(false);
      confetti({ particleCount: 90, spread: 80, origin: { y: 0.6 } });
      onSaveTape(tape);
    }, 2200);
  };

  const currentItemData = selectedPlacedItem
    ? selectedPlacedItem.type === 'sticker'
      ? tape.stickers?.find(s => s.id === selectedPlacedItem.id)
      : tape.doodles?.find(d => d.id === selectedPlacedItem.id)
    : null;

  return (
    <div className="relative w-full max-w-7xl mx-auto px-3 sm:px-6 py-4 select-none animate-in fade-in duration-300">
      {/* Top Studio Header & Navigation Tabs */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioEngine.playButtonTick();
              onBackToRack();
            }}
            className="flex items-center gap-1.5 text-xs font-['Space_Mono'] text-amber-400 hover:text-white transition-colors px-3 py-1.5 bg-black/40 rounded-lg border border-white/10"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>← RACK</span>
          </button>
          <span className="text-white/20">|</span>
          <h2 className="font-['Permanent_Marker'] text-2xl sm:text-3xl text-white tracking-wide">
            MIXTAPE STUDIO
          </h2>
        </div>

        {/* Primary Tabs (BUILD, STYLE, GUIDE) */}
        <div className="flex items-center gap-1.5 p-1 bg-black/60 rounded-xl border border-amber-500/30 backdrop-blur-md">
          <button
            onClick={() => {
              audioEngine.playButtonTick();
              setActiveTab('build');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-['Permanent_Marker'] text-xs sm:text-sm tracking-wider transition-all ${
              activeTab === 'build' ? 'bg-amber-500 text-black shadow-md' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>BUILD</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playButtonTick();
              setActiveTab('style');
            }}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg font-['Permanent_Marker'] text-xs sm:text-sm tracking-wider transition-all ${
              activeTab === 'style' ? 'bg-amber-500 text-black shadow-md' : 'text-neutral-300 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>STYLE</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playButtonTick();
              setIsGuideOpen(true);
            }}
            className="flex items-center gap-2 px-4 py-2 rounded-lg font-['Permanent_Marker'] text-xs sm:text-sm tracking-wider text-neutral-300 hover:text-white transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>GUIDE</span>
          </button>
        </div>
      </div>

      {/* Main Studio Grid: Left Controls (5 Cols) & Right J-Card Live Preview (7 Cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: BUILD / STYLE CONTROLS */}
        <div className="lg:col-span-5 bg-gradient-to-b from-[#1c1917]/95 via-[#0c0a09]/95 to-[#1c1917]/95 rounded-2xl p-4 sm:p-5 border-2 border-amber-600/30 shadow-2xl backdrop-blur-md">
          {activeTab === 'build' && (
            <div className="space-y-4">
              {/* Music Source Sub-Tabs */}
              <div className="flex items-center gap-1 p-1 bg-black/60 rounded-xl border border-white/10">
                <button
                  onClick={() => setTrackSourceTab('online')}
                  className={`flex-1 py-1.5 rounded-lg font-['Space_Mono'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-all ${
                    trackSourceTab === 'online' ? 'bg-amber-500 text-black shadow' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Globe className="w-3.5 h-3.5" />
                  <span>ONLINE</span>
                </button>

                <button
                  onClick={() => setTrackSourceTab('library')}
                  className={`flex-1 py-1.5 rounded-lg font-['Space_Mono'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-all ${
                    trackSourceTab === 'library' ? 'bg-amber-500 text-black shadow' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Music2 className="w-3.5 h-3.5" />
                  <span>RETRO</span>
                </button>

                <button
                  onClick={() => setTrackSourceTab('voice')}
                  className={`flex-1 py-1.5 rounded-lg font-['Space_Mono'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-all ${
                    trackSourceTab === 'voice' ? 'bg-amber-500 text-black shadow' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Mic className="w-3.5 h-3.5" />
                  <span>VOICE</span>
                </button>

                <button
                  onClick={() => setTrackSourceTab('custom')}
                  className={`flex-1 py-1.5 rounded-lg font-['Space_Mono'] text-[11px] font-bold uppercase flex items-center justify-center gap-1.5 transition-all ${
                    trackSourceTab === 'custom' ? 'bg-amber-500 text-black shadow' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>CUSTOM</span>
                </button>
              </div>

              {/* Tape Capacity Running Time Gauge */}
              <div className="p-3 bg-black/50 rounded-xl border border-white/10 space-y-2">
                <div className="text-[11px] font-['Space_Mono'] text-neutral-400 uppercase font-bold flex justify-between">
                  <span>FORMAT: {tape.format || 'CRX 40'}</span>
                  <span>TOTAL: {formatDuration(sideATimeSec + sideBTimeSec)} / {formatDuration(sideLimitSec * 2)}</span>
                </div>

                {/* Side A Gauge */}
                <div>
                  <div className="flex justify-between text-xs font-['Space_Mono'] text-neutral-300 mb-0.5">
                    <span className="font-bold text-amber-400">SIDE A</span>
                    <span className={sideATimeSec > sideLimitSec ? 'text-red-400 font-bold' : ''}>
                      {formatDuration(sideATimeSec)} / {formatDuration(sideLimitSec)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        sideATimeSec > sideLimitSec ? 'bg-red-500' : 'bg-gradient-to-r from-amber-500 to-pink-500'
                      }`}
                      style={{ width: `${Math.min(100, (sideATimeSec / sideLimitSec) * 100)}%` }}
                    />
                  </div>
                </div>

                {/* Side B Gauge */}
                <div>
                  <div className="flex justify-between text-xs font-['Space_Mono'] text-neutral-300 mb-0.5">
                    <span className="font-bold text-pink-400">SIDE B</span>
                    <span className={sideBTimeSec > sideLimitSec ? 'text-red-400 font-bold' : ''}>
                      {formatDuration(sideBTimeSec)} / {formatDuration(sideLimitSec)}
                    </span>
                  </div>
                  <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        sideBTimeSec > sideLimitSec ? 'bg-red-500' : 'bg-gradient-to-r from-pink-500 to-purple-500'
                      }`}
                      style={{ width: `${Math.min(100, (sideBTimeSec / sideLimitSec) * 100)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* TAB 1: ONLINE MUSIC SEARCH (YOUTUBE MUSIC AD-FREE FULL SONGS) */}
              {trackSourceTab === 'online' && (
                <div className="space-y-3">
                  {/* Search Mode Switcher */}
                  <div className="flex items-center justify-between gap-2 text-[10px] font-['Space_Mono']">
                    <span className="text-neutral-400 uppercase">ENGINE:</span>
                    <div className="flex items-center gap-1 bg-black/40 p-0.5 rounded border border-white/10">
                      <button
                        onClick={() => setOnlineSearchMode('full')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          onlineSearchMode === 'full' ? 'bg-red-600 text-white font-bold' : 'text-neutral-400 hover:text-white'
                        }`}
                        title="Search Full Songs via YouTube Music Open API"
                      >
                        YOUTUBE MUSIC (FULL)
                      </button>
                      <button
                        onClick={() => setOnlineSearchMode('preview')}
                        className={`px-2 py-0.5 rounded transition-colors ${
                          onlineSearchMode === 'preview' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
                        }`}
                        title="Search Apple/iTunes Commercial Previews"
                      >
                        ITUNES (30s)
                      </button>
                    </div>
                  </div>

                  <div className="relative">
                    <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search YouTube Music (e.g. Daft Punk, Nirvana, Queen) or paste link..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 bg-black/60 border border-red-500/30 rounded-lg text-sm text-white placeholder:text-neutral-500 font-['Space_Mono'] focus:outline-none focus:border-red-400"
                    />
                  </div>

                  {isSearchingOnline && (
                    <div className="text-center py-4 text-red-400 font-['Space_Mono'] text-xs animate-pulse">
                      Searching YouTube Music API (Ad-Free Full Songs)...
                    </div>
                  )}

                  {!isSearchingOnline && onlineResults.length === 0 && searchQuery.trim().length > 1 && (
                    <div className="text-center py-4 text-neutral-400 font-['Space_Mono'] text-xs">
                      No matching tracks found. Try searching by artist or song title!
                    </div>
                  )}

                  {!isSearchingOnline && onlineResults.length === 0 && !searchQuery.trim() && (
                    <div className="text-center py-5 text-neutral-400 font-['Space_Mono'] text-xs space-y-1.5 bg-black/20 p-3 rounded-lg border border-white/5">
                      <div className="text-red-400 font-bold flex items-center justify-center gap-1.5">
                        <Zap className="w-3.5 h-3.5 text-red-400" />
                        <span>AD-FREE YOUTUBE MUSIC FULL SONGS</span>
                      </div>
                      <div className="text-neutral-400">Search any track to stream complete songs without interruptions!</div>
                    </div>
                  )}

                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {onlineResults.map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-black/70 border border-white/5 transition-colors group"
                      >
                        <div className="flex items-center gap-2.5 min-w-0 pr-2">
                          {t.artworkUrl ? (
                            <img src={t.artworkUrl} alt="" className="w-9 h-9 rounded object-cover shrink-0 border border-white/10" />
                          ) : (
                            <div className="w-9 h-9 rounded bg-neutral-800 flex items-center justify-center shrink-0">
                              <Music2 className="w-4 h-4 text-neutral-400" />
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-['Covered_By_Your_Grace'] text-white font-bold truncate">
                                {t.title}
                              </span>
                              {t.isFullSong || t.youtubeId ? (
                                <span className="px-1.5 py-0.2 bg-red-950 text-red-300 border border-red-500/40 text-[9px] font-['Space_Mono'] font-bold rounded shrink-0">
                                  FULL SONG
                                </span>
                              ) : (
                                <span className="px-1.5 py-0.2 bg-amber-950 text-amber-300 border border-amber-500/40 text-[9px] font-['Space_Mono'] font-bold rounded shrink-0">
                                  30s PREVIEW
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] font-['Space_Mono'] text-neutral-400 truncate">
                              {t.artist} • {t.duration} {t.source ? <span className="text-neutral-500">({t.source})</span> : null}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          {/* Audio Preview Play Button */}
                          <button
                            onClick={() => handleTogglePreview(t)}
                            className={`p-1.5 rounded-full border transition-all ${
                              previewingTrackId === t.id
                                ? 'bg-red-600 text-white border-red-400 animate-pulse'
                                : 'bg-black/40 text-neutral-300 hover:text-white border-white/10'
                            }`}
                            title="Play Audio"
                          >
                            {previewingTrackId === t.id ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                          </button>

                          {/* Add to A */}
                          <button
                            onClick={() => handleAddTrack(t, 'A')}
                            className="px-2 py-1 bg-amber-600/80 hover:bg-amber-500 text-white font-['Permanent_Marker'] text-[10px] rounded transition-transform active:scale-95"
                            title="Add to Side A"
                          >
                            + A
                          </button>

                          {/* Add to B */}
                          <button
                            onClick={() => handleAddTrack(t, 'B')}
                            className="px-2 py-1 bg-pink-600/80 hover:bg-pink-500 text-white font-['Permanent_Marker'] text-[10px] rounded transition-transform active:scale-95"
                            title="Add to Side B"
                          >
                            + B
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: CURATED RETRO & GENRE LIBRARY */}
              {trackSourceTab === 'library' && (
                <div className="space-y-3">
                  {/* Genre Pills */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {GENRES.map((genre) => (
                      <button
                        key={genre}
                        onClick={() => setSelectedGenre(genre)}
                        className={`px-2.5 py-1 rounded text-[10px] font-['Space_Mono'] font-bold uppercase whitespace-nowrap transition-all ${
                          selectedGenre === genre ? 'bg-amber-500 text-black' : 'bg-black/40 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
                    {GENRE_TRACK_LIBRARY.filter(t => selectedGenre === 'All' || t.genre === selectedGenre).map((t) => (
                      <div
                        key={t.id}
                        className="flex items-center justify-between p-2 rounded-lg bg-black/40 hover:bg-black/70 border border-white/5 transition-colors group"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="text-sm font-['Covered_By_Your_Grace'] text-white font-bold truncate">
                            {t.title}
                          </div>
                          <div className="text-[11px] font-['Space_Mono'] text-neutral-400 truncate">
                            {t.artist} • {t.duration} <span className="text-amber-500/80">({t.genre})</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            onClick={() => handleTogglePreview(t)}
                            className={`p-1.5 rounded-full border transition-all ${
                              previewingTrackId === t.id
                                ? 'bg-amber-500 text-black border-amber-400 animate-pulse'
                                : 'bg-black/40 text-neutral-300 hover:text-white border-white/10'
                            }`}
                            title="Preview Synth Audio"
                          >
                            {previewingTrackId === t.id ? <Pause className="w-3 h-3 fill-current" /> : <Play className="w-3 h-3 fill-current" />}
                          </button>

                          <button
                            onClick={() => handleAddTrack(t, 'A')}
                            className="px-2 py-1 bg-amber-600/80 hover:bg-amber-500 text-white font-['Permanent_Marker'] text-[10px] rounded transition-transform active:scale-95"
                            title="Add to Side A"
                          >
                            + A
                          </button>

                          <button
                            onClick={() => handleAddTrack(t, 'B')}
                            className="px-2 py-1 bg-pink-600/80 hover:bg-pink-500 text-white font-['Permanent_Marker'] text-[10px] rounded transition-transform active:scale-95"
                            title="Add to Side B"
                          >
                            + B
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: VOICE MEMO RECORDER */}
              {trackSourceTab === 'voice' && (
                <div className="space-y-4 p-4 bg-black/40 rounded-xl border border-white/10 text-center">
                  <div className="font-['Permanent_Marker'] text-lg text-amber-300">
                    RECORD VOICE DEDICATION / LINER NOTE
                  </div>
                  <p className="font-['Caveat'] text-lg text-neutral-300 leading-tight">
                    Record a personal voice message, intro, or story to put on magnetic ribbon.
                  </p>

                  <div className="flex flex-col items-center justify-center py-4">
                    {isVoiceRecording ? (
                      <div className="space-y-3">
                        <div className="w-16 h-16 rounded-full bg-red-600 flex items-center justify-center animate-ping text-white shadow-glow-red mx-auto">
                          <Mic className="w-8 h-8" />
                        </div>
                        <div className="font-['Space_Mono'] text-2xl text-red-400 font-bold tracking-widest">
                          {formatDuration(voiceRecordDuration)}
                        </div>
                        <div className="flex items-center gap-3 pt-2">
                          <button
                            onClick={() => handleStopVoiceRecording('A')}
                            className="px-4 py-2 bg-amber-500 text-black font-['Permanent_Marker'] text-xs rounded-lg shadow"
                          >
                            SAVE TO SIDE A
                          </button>
                          <button
                            onClick={() => handleStopVoiceRecording('B')}
                            className="px-4 py-2 bg-pink-500 text-white font-['Permanent_Marker'] text-xs rounded-lg shadow"
                          >
                            SAVE TO SIDE B
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={handleStartVoiceRecording}
                        className="flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-500 text-white font-['Permanent_Marker'] text-base rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all"
                      >
                        <Mic className="w-5 h-5" />
                        <span>START RECORDING MIC</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 4: CUSTOM DIRECT AUDIO URL & LOCAL FILE */}
              {trackSourceTab === 'custom' && (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {/* Direct MP3 / Audio Stream URL input */}
                  <div className="p-3 bg-black/50 rounded-xl border border-cyan-500/30 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-['Space_Mono'] text-cyan-300 font-bold">
                      <Link className="w-3.5 h-3.5 text-cyan-400" />
                      <span>PASTE DIRECT AUDIO / MP3 URL</span>
                    </div>
                    <input
                      type="url"
                      placeholder="https://example.com/song.mp3"
                      value={directAudioUrl}
                      onChange={(e) => setDirectAudioUrl(e.target.value)}
                      className="w-full px-3 py-1.5 bg-black/60 border border-white/10 rounded text-xs text-white placeholder:text-neutral-500 font-['Space_Mono'] focus:outline-none focus:border-cyan-400"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        placeholder="Song Title"
                        value={customSongTitle}
                        onChange={(e) => setCustomSongTitle(e.target.value)}
                        className="px-3 py-1.5 bg-black/60 border border-white/10 rounded text-xs text-white placeholder:text-neutral-500 font-['Space_Mono']"
                      />
                      <input
                        type="text"
                        placeholder="Artist Name"
                        value={customSongArtist}
                        onChange={(e) => setCustomSongArtist(e.target.value)}
                        className="px-3 py-1.5 bg-black/60 border border-white/10 rounded text-xs text-white placeholder:text-neutral-500 font-['Space_Mono']"
                      />
                    </div>
                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1 text-xs text-neutral-400 font-['Space_Mono']">
                        <Clock className="w-3.5 h-3.5" />
                        <input
                          type="text"
                          value={customSongDuration}
                          onChange={(e) => setCustomSongDuration(e.target.value)}
                          className="w-14 px-1.5 py-0.5 bg-black/60 border border-white/10 rounded text-center text-xs text-white"
                        />
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleAddDirectUrl('A')}
                          className="px-3 py-1 bg-cyan-600 hover:bg-cyan-500 text-white font-['Permanent_Marker'] text-xs rounded"
                        >
                          + Side A
                        </button>
                        <button
                          onClick={() => handleAddDirectUrl('B')}
                          className="px-3 py-1 bg-pink-600 hover:bg-pink-500 text-white font-['Permanent_Marker'] text-xs rounded"
                        >
                          + Side B
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Local File Upload Button */}
                  <div className="p-3 bg-black/40 rounded-xl border border-dashed border-amber-500/40 text-center space-y-1.5">
                    <Upload className="w-5 h-5 text-amber-400 mx-auto" />
                    <div className="text-xs font-['Space_Mono'] text-white font-bold">
                      UPLOAD LOCAL AUDIO FILE
                    </div>
                    <p className="text-[10px] text-neutral-400">
                      Select MP3, WAV, M4A, or FLAC from your device.
                    </p>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-['Permanent_Marker'] text-xs rounded-lg shadow transition-all"
                    >
                      BROWSE FILE
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      accept="audio/*"
                      onChange={handleCustomAudioUpload}
                      className="hidden"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-4">
              {/* Style Sub-Tabs */}
              <div className="flex items-center gap-1 p-1 bg-black/60 rounded-lg border border-white/10">
                <button
                  onClick={() => setStyleSubTab('jcard')}
                  className={`flex-1 py-1.5 rounded font-['Space_Mono'] text-xs uppercase font-bold transition-all ${
                    styleSubTab === 'jcard' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  J-Card & Shell
                </button>
                <button
                  onClick={() => setStyleSubTab('stickers')}
                  className={`flex-1 py-1.5 rounded font-['Space_Mono'] text-xs uppercase font-bold transition-all ${
                    styleSubTab === 'stickers' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Stickers
                </button>
                <button
                  onClick={() => setStyleSubTab('doodles')}
                  className={`flex-1 py-1.5 rounded font-['Space_Mono'] text-xs uppercase font-bold transition-all ${
                    styleSubTab === 'doodles' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Doodles
                </button>
                <button
                  onClick={() => setStyleSubTab('notes')}
                  className={`flex-1 py-1.5 rounded font-['Space_Mono'] text-xs uppercase font-bold transition-all ${
                    styleSubTab === 'notes' ? 'bg-amber-500 text-black' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Notes
                </button>
              </div>

              {/* Sub-tab 1: J-Card, Format, Themes & Fonts */}
              {styleSubTab === 'jcard' && (
                <div className="space-y-4 max-h-96 overflow-y-auto pr-1">
                  {/* Cassette Tape Length / Format */}
                  <div>
                    <label className="block text-xs font-['Space_Mono'] uppercase tracking-wider text-amber-300 font-bold mb-2">
                      Cassette Length / Capacity
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TAPE_FORMATS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            audioEngine.playButtonTick();
                            setTape(prev => ({
                              ...prev,
                              format: f.id,
                              durationLabel: f.label
                            }));
                          }}
                          className={`p-2 rounded-lg border text-center transition-all ${
                            tape.format === f.id
                              ? 'border-amber-400 bg-amber-500/20 ring-1 ring-amber-400'
                              : 'border-white/10 bg-black/40 hover:bg-black/60'
                          }`}
                        >
                          <div className="font-['Space_Mono'] text-xs font-bold text-white">
                            {f.id}
                          </div>
                          <div className="text-[10px] text-neutral-400">
                            {f.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Design Presets */}
                  <div>
                    <label className="block text-xs font-['Space_Mono'] uppercase tracking-wider text-amber-300 font-bold mb-2">
                      Card & Shell Design Preset
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {CARD_PRESETS.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => {
                            audioEngine.playButtonTick();
                            setTape(prev => ({
                              ...prev,
                              cardDesign: p.id,
                              colors: {
                                ...prev.colors,
                                primary: p.primary,
                                secondary: p.secondary,
                                shell: p.shell,
                                paper: p.paper,
                                ink: p.ink
                              }
                            }));
                          }}
                          className={`flex items-center gap-2 p-2 rounded-lg border text-left transition-all ${
                            tape.cardDesign === p.id 
                              ? 'border-amber-400 bg-amber-500/20 ring-1 ring-amber-400' 
                              : 'border-white/10 bg-black/40 hover:bg-black/60'
                          }`}
                        >
                          <div 
                            className="w-5 h-5 rounded-full shrink-0 shadow-sm border border-black/20"
                            style={{ backgroundColor: p.primary }}
                          />
                          <span className="font-['Space_Mono'] text-[11px] font-bold text-white truncate">
                            {p.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Handwriting Font */}
                  <div>
                    <label className="block text-xs font-['Space_Mono'] uppercase tracking-wider text-amber-300 font-bold mb-2">
                      Handwriting Style
                    </label>
                    <div className="space-y-1.5">
                      {FONTS.map((f) => (
                        <button
                          key={f.id}
                          onClick={() => {
                            audioEngine.playButtonTick();
                            setTape(prev => ({ ...prev, font: f.id }));
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-left transition-all ${
                            tape.font === f.id
                              ? 'border-amber-400 bg-amber-500/20 ring-1 ring-amber-400'
                              : 'border-white/10 bg-black/40 hover:bg-black/60'
                          }`}
                        >
                          <span 
                            className={`text-xl text-white font-bold ${getFontClass(f.id)}`} 
                            style={{ fontFamily: getFontFamily(f.id) }}
                          >
                            The Quick Brown Fox
                          </span>
                          <span className="text-[10px] font-['Space_Mono'] text-neutral-400 uppercase">
                            {f.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Highlighter Color */}
                  <div>
                    <label className="block text-xs font-['Space_Mono'] uppercase tracking-wider text-amber-300 font-bold mb-2">
                      Highlighter Marker Color
                    </label>
                    <div className="flex items-center gap-3">
                      {HIGHLIGHTER_COLORS.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => {
                            audioEngine.playButtonTick();
                            setTape(prev => ({
                              ...prev,
                              colors: { ...prev.colors, highlighter: c.id }
                            }));
                          }}
                          className={`w-8 h-8 rounded-full transition-transform ${
                            tape.colors?.highlighter === c.id ? 'scale-125 ring-2 ring-white shadow-lg' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: c.id }}
                          title={c.name}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Sub-tab 2: Stickers */}
              {styleSubTab === 'stickers' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-['Space_Mono'] text-neutral-400">
                    <span>TAP TO STICK • CLICK ITEM TO TWEAK</span>
                    <button
                      onClick={handleClearDecorations}
                      className="text-red-400 hover:text-red-300 uppercase"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Item Transform Controls when an item is selected */}
                  {selectedPlacedItem && currentItemData && (
                    <div className="p-3 bg-neutral-900 rounded-xl border border-amber-400/50 space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-center justify-between text-xs font-['Space_Mono'] text-amber-300 font-bold">
                        <span>EDIT SELECTED {selectedPlacedItem.type.toUpperCase()}</span>
                        <button onClick={() => setSelectedPlacedItem(null)} className="p-0.5 hover:text-white">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-3 text-[11px] font-['Space_Mono']">
                        <div>
                          <span>Scale: {Math.round((currentItemData.scale || 1) * 100)}%</span>
                          <input
                            type="range"
                            min="0.5"
                            max="2.0"
                            step="0.05"
                            value={currentItemData.scale || 1}
                            onChange={(e) => handleUpdateSelectedItem({ scale: parseFloat(e.target.value) })}
                            className="w-full accent-amber-500"
                          />
                        </div>

                        <div>
                          <span>Rotate: {Math.round(currentItemData.rotation || 0)}°</span>
                          <input
                            type="range"
                            min="-180"
                            max="180"
                            step="5"
                            value={currentItemData.rotation || 0}
                            onChange={(e) => handleUpdateSelectedItem({ rotation: parseInt(e.target.value, 10) })}
                            className="w-full accent-amber-500"
                          />
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <button
                          onClick={handleDeleteSelectedItem}
                          className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-['Space_Mono']"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete Sticker</span>
                        </button>
                        <span className="text-[10px] text-neutral-400">Position on Tape preview</span>
                      </div>
                    </div>
                  )}

                  {/* Sticker Category Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {STICKER_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedStickerCat(cat.id)}
                        className={`px-3 py-1 rounded text-[10px] font-['Space_Mono'] font-bold uppercase transition-all whitespace-nowrap ${
                          selectedStickerCat === cat.id ? 'bg-amber-500 text-black' : 'bg-black/40 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Sticker Grid */}
                  <div className="grid grid-cols-4 gap-3 max-h-72 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/10">
                    {STICKERS.filter(s => selectedStickerCat === 'all' || s.category === selectedStickerCat).map((st) => (
                      <button
                        key={st.id}
                        onClick={() => handlePlaceSticker(st.id)}
                        className="p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform"
                        title={st.name}
                      >
                        <div
                          className="w-10 h-10 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: st.svg }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 3: Doodles */}
              {styleSubTab === 'doodles' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs font-['Space_Mono'] text-neutral-400">
                    <span>TAP TO ADD HAND-DRAWN INK</span>
                    <button
                      onClick={handleClearDecorations}
                      className="text-red-400 hover:text-red-300 uppercase"
                    >
                      Clear All
                    </button>
                  </div>

                  {/* Doodle Category Tabs */}
                  <div className="flex items-center gap-1 overflow-x-auto pb-1">
                    {DOODLE_CATEGORIES.map((cat) => (
                      <button
                        key={cat.id}
                        onClick={() => setSelectedDoodleCat(cat.id)}
                        className={`px-3 py-1 rounded text-[10px] font-['Space_Mono'] font-bold uppercase transition-all whitespace-nowrap ${
                          selectedDoodleCat === cat.id ? 'bg-amber-500 text-black' : 'bg-black/40 text-neutral-400 hover:text-white'
                        }`}
                      >
                        {cat.label}
                      </button>
                    ))}
                  </div>

                  {/* Doodle Grid */}
                  <div className="grid grid-cols-4 gap-3 max-h-72 overflow-y-auto p-2 bg-black/40 rounded-xl border border-white/10">
                    {DOODLES.filter(d => selectedDoodleCat === 'all' || d.category === selectedDoodleCat).map((d) => (
                      <button
                        key={d.id}
                        onClick={() => handlePlaceDoodle(d.id)}
                        className="p-2 rounded-lg bg-neutral-900/80 hover:bg-neutral-800 border border-white/10 flex items-center justify-center hover:scale-110 active:scale-95 transition-transform text-white"
                        title={d.name}
                      >
                        <div
                          className="w-8 h-8 flex items-center justify-center"
                          dangerouslySetInnerHTML={{ __html: d.svg }}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Sub-tab 4: Notes & Titles */}
              {styleSubTab === 'notes' && (
                <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                  <div>
                    <label className="block text-xs font-['Space_Mono'] uppercase tracking-wider text-amber-300 font-bold mb-1">
                      Mixtape Spine Title
                    </label>
                    <input
                      type="text"
                      value={tape.title}
                      onChange={(e) => setTape(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3 py-1.5 bg-black/60 border border-amber-500/30 rounded-lg text-white font-['Caveat'] text-2xl focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-['Space_Mono'] uppercase tracking-wider text-amber-300 font-bold mb-1">
                        Side A Title
                      </label>
                      <input
                        type="text"
                        value={tape.sideA?.title || ''}
                        onChange={(e) => setTape(prev => ({ ...prev, sideA: { ...prev.sideA, title: e.target.value } }))}
                        className="w-full px-3 py-1.5 bg-black/60 border border-amber-500/30 rounded-lg text-white font-['Caveat'] text-xl focus:outline-none focus:border-amber-400"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-['Space_Mono'] uppercase tracking-wider text-amber-300 font-bold mb-1">
                        Side B Title
                      </label>
                      <input
                        type="text"
                        value={tape.sideB?.title || ''}
                        onChange={(e) => setTape(prev => ({ ...prev, sideB: { ...prev.sideB, title: e.target.value } }))}
                        className="w-full px-3 py-1.5 bg-black/60 border border-amber-500/30 rounded-lg text-white font-['Caveat'] text-xl focus:outline-none focus:border-amber-400"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-['Space_Mono'] uppercase tracking-wider text-amber-300 font-bold mb-1">
                      Secret Liner Note / Personal Dedication
                    </label>
                    <textarea
                      rows={2}
                      value={tape.linerNotes || ''}
                      onChange={(e) => setTape(prev => ({ ...prev, linerNotes: e.target.value }))}
                      placeholder="Folded inside the J-card..."
                      className="w-full px-3 py-1.5 bg-black/60 border border-amber-500/30 rounded-lg text-white font-['Caveat'] text-xl focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: LIVE J-CARD PREVIEW & TRACK SEQUENCE */}
        <div className="lg:col-span-7 flex flex-col items-center">
          {/* Live J-Card Unfolded View */}
          <JCardView
            tape={tape}
            onPlayTrack={(track, side, idx) => {
              audioEngine.playTrack(track);
            }}
          />

          {/* Quick Track Sequence Strip */}
          <div className="w-full max-w-3xl bg-black/40 rounded-xl p-3 border border-white/10 mt-2 space-y-2">
            <div className="text-xs font-['Space_Mono'] text-neutral-400 uppercase font-bold flex justify-between">
              <span>MANAGE TRACK SEQUENCE & SIDES</span>
              <span>{tape.sideA?.tracks?.length || 0} on A • {tape.sideB?.tracks?.length || 0} on B</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-52 overflow-y-auto pr-1">
              {/* Side A List */}
              <div className="space-y-1">
                <div className="text-[10px] font-['Space_Mono'] text-amber-400 font-bold flex justify-between">
                  <span>SIDE A ({formatDuration(sideATimeSec)})</span>
                  <span>{tape.sideA?.tracks?.length || 0} tracks</span>
                </div>
                {tape.sideA?.tracks?.map((t, idx) => (
                  <div key={t.id} className="flex items-center justify-between p-1.5 bg-black/60 rounded text-xs">
                    <span className="truncate pr-2 font-['Caveat'] text-base text-white">
                      {idx + 1}. {t.title}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleSwapTrackSide('A', idx)} className="p-1 text-neutral-400 hover:text-amber-300" title="Move to Side B">
                        <ArrowRightLeft className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleMoveTrack('A', idx, -1)} className="p-1 text-neutral-400 hover:text-white" title="Move Up">
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleMoveTrack('A', idx, 1)} className="p-1 text-neutral-400 hover:text-white" title="Move Down">
                        <MoveDown className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleRemoveTrack('A', idx)} className="p-1 text-red-400 hover:text-red-300" title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Side B List */}
              <div className="space-y-1">
                <div className="text-[10px] font-['Space_Mono'] text-pink-400 font-bold flex justify-between">
                  <span>SIDE B ({formatDuration(sideBTimeSec)})</span>
                  <span>{tape.sideB?.tracks?.length || 0} tracks</span>
                </div>
                {tape.sideB?.tracks?.map((t, idx) => (
                  <div key={t.id} className="flex items-center justify-between p-1.5 bg-black/60 rounded text-xs">
                    <span className="truncate pr-2 font-['Caveat'] text-base text-white">
                      {idx + 1}. {t.title}
                    </span>
                    <div className="flex items-center gap-1 shrink-0">
                      <button onClick={() => handleSwapTrackSide('B', idx)} className="p-1 text-neutral-400 hover:text-pink-300" title="Move to Side A">
                        <ArrowRightLeft className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleMoveTrack('B', idx, -1)} className="p-1 text-neutral-400 hover:text-white" title="Move Up">
                        <MoveUp className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleMoveTrack('B', idx, 1)} className="p-1 text-neutral-400 hover:text-white" title="Move Down">
                        <MoveDown className="w-3 h-3" />
                      </button>
                      <button onClick={() => handleRemoveTrack('B', idx)} className="p-1 text-red-400 hover:text-red-300" title="Delete">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM RECORD TAPE BAR */}
      <div className="sticky bottom-4 z-40 w-full max-w-4xl mx-auto mt-6 p-4 bg-gradient-to-r from-[#1c1917] via-[#0c0a09] to-[#1c1917] rounded-2xl border-2 border-amber-500/40 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500 animate-ping" />
          <div>
            <div className="font-['Permanent_Marker'] text-sm sm:text-base text-amber-300">
              READY TO PRINT TAPE?
            </div>
            <div className="text-[11px] font-['Space_Mono'] text-neutral-400">
              {(tape.sideA?.tracks?.length || 0) + (tape.sideB?.tracks?.length || 0)} tracks loaded • Side A: {formatDuration(sideATimeSec)} • Side B: {formatDuration(sideBTimeSec)}
            </div>
          </div>
        </div>

        <button
          onClick={handleRecordTape}
          disabled={isRecording}
          className="flex items-center gap-2 px-8 py-3.5 bg-[#dc2626] hover:bg-[#ef4444] text-white font-['Permanent_Marker'] text-lg sm:text-xl rounded-xl shadow-[0_0_25px_rgba(220,38,38,0.6)] hover:scale-105 active:scale-95 transition-all"
        >
          <div className="w-3.5 h-3.5 rounded-full bg-white animate-pulse" />
          <span>{isRecording ? 'RECORDING TO TAPE...' : 'RECORD TAPE'}</span>
        </button>
      </div>

      {/* Guide Modal */}
      <GuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />

      {/* Recording Screen Overlay */}
      {isRecording && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="w-24 h-24 rounded-full border-4 border-red-500 border-t-transparent animate-spin mb-6" />
          <div className="flex items-center gap-3 text-red-500 font-['Permanent_Marker'] text-3xl sm:text-4xl animate-pulse">
            <span className="w-6 h-6 rounded-full bg-red-600" />
            <span>RECORDING AUDIO TO MAGNETIC TAPE...</span>
          </div>
          <p className="font-['Space_Mono'] text-neutral-400 text-sm mt-3">
            Printing Side A & Side B to {tape.format || 'CRX 40'}...
          </p>
        </div>
      )}
    </div>
  );
}
