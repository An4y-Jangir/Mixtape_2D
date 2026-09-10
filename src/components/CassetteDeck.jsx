import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Square, 
  RotateCcw, 
  RotateCw, 
  ArrowLeft, 
  Volume2, 
  VolumeX, 
  Radio, 
  Share2, 
  Sparkles,
  RefreshCw,
  Edit3,
  Sliders,
  Activity,
  Disc,
  FastForward,
  Rewind,
  Volume1
} from 'lucide-react';
import { audioEngine } from '../services/audioService';
import { getFontFamily, getFontClass } from '../data/defaultTapes';
import { STICKERS, DOODLES } from '../data/stickerData';

export default function CassetteDeck({
  tape,
  onBackToRack,
  onEditTape,
  onOpenShare,
}) {
  const [currentSide, setCurrentSide] = useState('A'); // 'A' or 'B'
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isHissOn, setIsHissOn] = useState(false);
  const [isDolbyOn, setIsDolbyOn] = useState(true);
  const [volume, setVolume] = useState(0.85);
  const [isMuted, setIsMuted] = useState(false);
  const [tapePitch, setTapePitch] = useState(1.0);
  const [isFastForwarding, setIsFastForwarding] = useState(false);
  const [isRewinding, setIsRewinding] = useState(false);
  const [isEjected, setIsEjected] = useState(false);
  const [vuMode, setVuMode] = useState('lcd'); // 'lcd' or 'needle'
  const [vuLevels, setVuLevels] = useState([0, 0, 0]);

  const activeTracklist = currentSide === 'A' ? (tape.sideA?.tracks || []) : (tape.sideB?.tracks || []);
  const currentTrack = activeTracklist[currentTrackIndex] || activeTracklist[0] || { title: 'No Track', artist: 'Unknown', duration: '0:00', durationSec: 180 };

  // Sync audio engine callbacks
  useEffect(() => {
    audioEngine.onTimeUpdate = (cur, dur) => {
      setCurrentTime(cur);
      setDuration(dur || currentTrack.durationSec || 180);
    };

    audioEngine.onTrackEnd = () => {
      // Advance to next track on current side
      if (currentTrackIndex + 1 < activeTracklist.length) {
        const nextIdx = currentTrackIndex + 1;
        setCurrentTrackIndex(nextIdx);
        audioEngine.playTrack(activeTracklist[nextIdx]);
      } else {
        // End of current side reached: auto-flip to other side!
        audioEngine.playTapeClick();
        if (currentSide === 'A' && (tape.sideB?.tracks?.length || 0) > 0) {
          setCurrentSide('B');
          setCurrentTrackIndex(0);
          audioEngine.playTrack(tape.sideB.tracks[0]);
        } else {
          audioEngine.pause();
          setIsPlaying(false);
        }
      }
    };

    audioEngine.onStateChange = (playing) => {
      setIsPlaying(playing);
    };

    const vuInterval = setInterval(() => {
      setVuLevels(audioEngine.getVULevels());
    }, 80);

    return () => {
      clearInterval(vuInterval);
      audioEngine.pause();
    };
  }, [currentTrackIndex, activeTracklist, currentSide, tape]);

  // Handle Play / Pause
  const handlePlayPause = () => {
    if (isEjected) {
      setIsEjected(false);
      audioEngine.playTapeClick();
    }
    if (isPlaying) {
      audioEngine.pause();
    } else {
      if (!audioEngine.currentTrack || audioEngine.currentTrack.id !== currentTrack.id) {
        audioEngine.playTrack(currentTrack);
      } else {
        audioEngine.resume();
      }
    }
  };

  const handleStop = () => {
    audioEngine.pause();
    audioEngine.seek(0);
    setCurrentTime(0);
  };

  const handleFlipSide = () => {
    audioEngine.playButtonTick();
    audioEngine.pause();
    const newSide = currentSide === 'A' ? 'B' : 'A';
    setCurrentSide(newSide);
    setCurrentTrackIndex(0);
    setCurrentTime(0);
  };

  const handleNextTrack = () => {
    audioEngine.playButtonTick();
    if (currentTrackIndex + 1 < activeTracklist.length) {
      const nextIdx = currentTrackIndex + 1;
      setCurrentTrackIndex(nextIdx);
      if (isPlaying) {
        audioEngine.playTrack(activeTracklist[nextIdx]);
      }
    }
  };

  const handlePrevTrack = () => {
    audioEngine.playButtonTick();
    if (currentTime > 3) {
      audioEngine.seek(0);
      setCurrentTime(0);
    } else if (currentTrackIndex > 0) {
      const prevIdx = currentTrackIndex - 1;
      setCurrentTrackIndex(prevIdx);
      if (isPlaying) {
        audioEngine.playTrack(activeTracklist[prevIdx]);
      }
    }
  };

  const handleRewindHold = (start) => {
    if (start) {
      setIsRewinding(true);
      audioEngine.startRewindWhir();
      audioEngine.seek(Math.max(0, currentTime - 6));
    } else {
      setIsRewinding(false);
      audioEngine.stopRewindWhir();
    }
  };

  const handleFastForwardHold = (start) => {
    if (start) {
      setIsFastForwarding(true);
      audioEngine.startRewindWhir();
      audioEngine.seek(Math.min(duration, currentTime + 6));
    } else {
      setIsFastForwarding(false);
      audioEngine.stopRewindWhir();
    }
  };

  const handleEjectToggle = () => {
    audioEngine.playEjectSound();
    if (isPlaying) audioEngine.pause();
    setIsEjected(prev => !prev);
  };

  const toggleTapeHiss = () => {
    audioEngine.playButtonTick();
    const next = !isHissOn;
    setIsHissOn(next);
    audioEngine.setTapeHiss(next);
  };

  const toggleDolby = () => {
    audioEngine.playButtonTick();
    const next = !isDolbyOn;
    setIsDolbyOn(next);
    audioEngine.setDolbyNR(next);
  };

  const handleVolumeChange = (newVal) => {
    setVolume(newVal);
    setIsMuted(newVal === 0);
    audioEngine.setVolume(newVal);
  };

  const handleToggleMute = () => {
    audioEngine.playButtonTick();
    if (isMuted) {
      setIsMuted(false);
      audioEngine.setVolume(volume || 0.8);
    } else {
      setIsMuted(true);
      audioEngine.setVolume(0);
    }
  };

  const handlePitchChange = (newPitch) => {
    setTapePitch(newPitch);
    audioEngine.setPlaybackRate(newPitch);
  };

  // Format mm:ss
  const formatTime = (secs) => {
    if (isNaN(secs)) return '00:00';
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Spool radius calculation
  const progressRatio = duration > 0 ? Math.min(1, Math.max(0, currentTime / duration)) : 0;
  const leftSpoolRadius = currentSide === 'A' ? 36 - progressRatio * 18 : 18 + progressRatio * 18;
  const rightSpoolRadius = currentSide === 'A' ? 18 + progressRatio * 18 : 36 - progressRatio * 18;

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center select-none animate-in fade-in duration-300">
      {/* Top Deck Navigation Bar */}
      <div className="w-full flex items-center justify-between px-4 py-2 mb-4 bg-black/40 rounded-xl backdrop-blur-md border border-white/10 text-xs font-['Space_Mono']">
        <button
          onClick={() => {
            audioEngine.playButtonTick();
            onBackToRack();
          }}
          className="flex items-center gap-1.5 text-amber-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>← BACK TO RACK</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              audioEngine.playButtonTick();
              onEditTape(tape);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-neutral-800 hover:bg-neutral-700 text-amber-200 rounded border border-amber-500/20 transition-all"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>CUSTOMIZE</span>
          </button>

          <button
            onClick={() => {
              audioEngine.playButtonTick();
              onOpenShare(tape);
            }}
            className="flex items-center gap-1.5 px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded shadow transition-all"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>SHARE</span>
          </button>
        </div>
      </div>

      {/* --- CASSETTE TAPE CASING --- */}
      <div 
        className={`relative w-full max-w-2xl aspect-[1.58/1] rounded-2xl p-5 shadow-tape border-2 border-white/10 transition-all duration-500 ${
          isEjected ? 'transform -translate-y-6 rotate-2 opacity-90 scale-95 shadow-2xl' : ''
        }`}
        style={{
          backgroundColor: tape.colors?.shell || '#18181b',
        }}
      >
        {/* Plastic Gloss Overlay */}
        <div className="absolute inset-0 rounded-2xl plastic-sheen pointer-events-none" />

        {/* 4 Corner Screws */}
        <div className="absolute top-3 left-3 w-3.5 h-3.5 rounded-full bg-neutral-600 border border-neutral-400 flex items-center justify-center shadow-inner">
          <div className="w-2 h-0.5 bg-neutral-900 rotate-45" />
        </div>
        <div className="absolute top-3 right-3 w-3.5 h-3.5 rounded-full bg-neutral-600 border border-neutral-400 flex items-center justify-center shadow-inner">
          <div className="w-2 h-0.5 bg-neutral-900 -rotate-12" />
        </div>
        <div className="absolute bottom-3 left-3 w-3.5 h-3.5 rounded-full bg-neutral-600 border border-neutral-400 flex items-center justify-center shadow-inner">
          <div className="w-2 h-0.5 bg-neutral-900 rotate-90" />
        </div>
        <div className="absolute bottom-3 right-3 w-3.5 h-3.5 rounded-full bg-neutral-600 border border-neutral-400 flex items-center justify-center shadow-inner">
          <div className="w-2 h-0.5 bg-neutral-900 rotate-30" />
        </div>

        {/* --- CASSETTE PAPER LABEL --- */}
        <div 
          className="relative w-full h-[62%] rounded-xl p-3 shadow-inner flex flex-col justify-between overflow-hidden"
          style={{
            backgroundColor: tape.colors?.paper || '#f4f4f5',
            color: tape.colors?.ink || '#09090b',
          }}
        >
          {/* Top Brand Stripe */}
          <div 
            className="w-full h-4 rounded px-2 flex items-center justify-between text-[9px] font-['Space_Mono'] font-bold text-white uppercase tracking-wider"
            style={{
              backgroundColor: tape.colors?.primary || '#d97706',
            }}
          >
            <span>NORMAL BIAS 120µs EQ</span>
            <span>{tape.format || 'CRX 40'}</span>
            <span>SCOOTCH PRO</span>
          </div>

          {/* Center Spine handwritten title & Side badge */}
          <div className="flex items-center justify-between px-2 py-1">
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-md flex items-center justify-center font-['Permanent_Marker'] text-lg font-black text-white shadow-sm"
                style={{
                  backgroundColor: tape.colors?.secondary || '#9a3412',
                }}
              >
                {currentSide}
              </div>

              <div>
                <h2 
                  className={`text-xl sm:text-2xl font-bold truncate leading-tight transition-transform ${getFontClass(tape.font)}`}
                  style={{ fontFamily: getFontFamily(tape.font) }}
                >
                  {tape.title}
                </h2>
                <span className="text-xs font-['Caveat'] font-bold text-neutral-600">
                  {currentSide === 'A' ? (tape.sideA?.title || 'Side A') : (tape.sideB?.title || 'Side B')} • {tape.author}
                </span>
              </div>
            </div>

            <div className="text-right">
              <span className="font-['Space_Mono'] text-xs font-bold px-2 py-0.5 bg-black/10 rounded">
                TYPE II
              </span>
            </div>
          </div>

          {/* Bottom Lined Area */}
          <div className="w-full border-t border-black/20 pt-1 flex justify-between text-[10px] font-['Space_Mono'] text-neutral-600">
            <span>INDEX: {activeTracklist.length} TRACKS</span>
            <span>DOLBY B-NR [{isDolbyOn ? 'ON' : 'OFF'}]</span>
          </div>
        </div>

        {/* --- CENTER CASSETTE WINDOW & ROTATING HUBS --- */}
        <div className="relative mt-2 w-[72%] mx-auto h-[26%] bg-black/80 rounded-lg border-2 border-white/20 p-2 flex items-center justify-between shadow-inner overflow-hidden">
          {/* Left Spool Reel */}
          <div className="relative flex items-center justify-center w-20 h-20">
            {/* Magnetic Tape Ribbon Roll (shrinks/grows) */}
            <div 
              className="absolute rounded-full bg-[#3d271d] shadow-sm transition-all duration-300"
              style={{
                width: `${leftSpoolRadius * 2}px`,
                height: `${leftSpoolRadius * 2}px`,
              }}
            />

            {/* Rotating White Plastic Hub */}
            <div 
              className={`relative z-10 w-11 h-11 rounded-full bg-neutral-100 border-2 border-neutral-400 flex items-center justify-center shadow-md ${
                isPlaying && !isEjected ? 'animate-spin-slow' : isFastForwarding ? 'animate-spin-fast' : isRewinding ? 'animate-spin-rewind' : ''
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-300 relative">
                <div className="absolute inset-0 m-auto w-1 h-3.5 bg-neutral-100" />
                <div className="absolute inset-0 m-auto w-3.5 h-1 bg-neutral-100" />
                <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-neutral-900" />
              </div>
            </div>
          </div>

          {/* Center Tape Window Gauge */}
          <div className="flex flex-col items-center justify-center px-4 py-1 bg-black/50 rounded border border-white/10">
            <div className="flex items-center gap-1 text-[9px] font-['Space_Mono'] text-neutral-400">
              <span>100</span>
              <span>50</span>
              <span>0</span>
            </div>
            <div className="w-16 h-1 bg-neutral-800 rounded-full my-1 relative overflow-hidden">
              <div 
                className="h-full bg-red-500 rounded-full transition-all duration-300"
                style={{ width: `${progressRatio * 100}%` }}
              />
            </div>
            <span className="text-[8px] font-['Space_Mono'] text-amber-400 uppercase">
              {isPlaying ? 'PLAYING' : isEjected ? 'EJECTED' : 'READY'}
            </span>
          </div>

          {/* Right Spool Reel */}
          <div className="relative flex items-center justify-center w-20 h-20">
            <div 
              className="absolute rounded-full bg-[#3d271d] shadow-sm transition-all duration-300"
              style={{
                width: `${rightSpoolRadius * 2}px`,
                height: `${rightSpoolRadius * 2}px`,
              }}
            />

            <div 
              className={`relative z-10 w-11 h-11 rounded-full bg-neutral-100 border-2 border-neutral-400 flex items-center justify-center shadow-md ${
                isPlaying && !isEjected ? 'animate-spin-slow' : isFastForwarding ? 'animate-spin-fast' : isRewinding ? 'animate-spin-rewind' : ''
              }`}
            >
              <div className="w-4 h-4 rounded-full bg-neutral-900 border border-neutral-300 relative">
                <div className="absolute inset-0 m-auto w-1 h-3.5 bg-neutral-100" />
                <div className="absolute inset-0 m-auto w-3.5 h-1 bg-neutral-100" />
                <div className="absolute inset-0 m-auto w-2.5 h-2.5 rounded-full bg-neutral-900" />
              </div>
            </div>
          </div>
        </div>

        {/* Placed Stickers Overlay */}
        {tape.stickers?.map((st) => {
          const stickerDef = STICKERS.find((s) => s.id === st.stickerId);
          if (!stickerDef) return null;
          return (
            <div
              key={st.id}
              className={`absolute pointer-events-none ${stickerDef.isHolographic ? 'holographic-shine' : ''}`}
              style={{
                left: `${st.x}%`,
                top: `${st.y}%`,
                transform: `translate(-50%, -50%) rotate(${st.rotation || 0}deg) scale(${st.scale || 1})`,
                width: '45px',
                height: '45px',
              }}
              dangerouslySetInnerHTML={{ __html: stickerDef.svg }}
            />
          );
        })}

        {/* Placed Doodles Overlay */}
        {tape.doodles?.map((d) => {
          const doodleDef = DOODLES.find((dood) => dood.id === d.doodleId);
          if (!doodleDef) return null;
          return (
            <div
              key={d.id}
              className="absolute pointer-events-none"
              style={{
                left: `${d.x}%`,
                top: `${d.y}%`,
                transform: `translate(-50%, -50%) rotate(${d.rotation || 0}deg) scale(${d.scale || 1})`,
                width: '40px',
                height: '40px',
                color: d.color || tape.colors?.ink || '#000000',
              }}
              dangerouslySetInnerHTML={{ __html: doodleDef.svg }}
            />
          );
        })}
      </div>

      {/* --- STEREO CASSETTE DECK HARDWARE CONSOLE --- */}
      <div className="relative w-full max-w-2xl mt-4 bg-gradient-to-b from-[#27272a] via-[#1c1917] to-[#0f0c0b] rounded-2xl p-4 sm:p-5 border-2 border-neutral-700 shadow-2xl">
        {/* Top Console Bar: Status LEDs, Dolby Switch & Brand */}
        <div className="flex flex-wrap items-center justify-between pb-3 border-b border-white/10 gap-2 text-xs font-['Space_Mono']">
          <div className="flex items-center gap-3">
            {/* Play Indicator Amber LED */}
            <div className="flex items-center gap-1.5">
              <div 
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  isPlaying 
                    ? 'bg-amber-400 shadow-glow-amber scale-110' 
                    : 'bg-neutral-700'
                }`}
              />
              <span className={`text-[10px] uppercase font-bold ${isPlaying ? 'text-amber-300' : 'text-neutral-500'}`}>
                PLAY
              </span>
            </div>

            {/* Tape Hiss Toggle */}
            <button
              onClick={toggleTapeHiss}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${isHissOn ? 'bg-cyan-400 shadow-glow-cyan' : 'bg-neutral-600'}`} />
              <span className={`text-[10px] ${isHissOn ? 'text-cyan-300' : 'text-neutral-400'}`}>
                HISS {isHissOn ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* Dolby B-NR Filter Toggle */}
            <button
              onClick={toggleDolby}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 border border-white/10 transition-colors"
            >
              <div className={`w-2 h-2 rounded-full ${isDolbyOn ? 'bg-amber-400 shadow-glow-amber' : 'bg-neutral-600'}`} />
              <span className={`text-[10px] ${isDolbyOn ? 'text-amber-300' : 'text-neutral-400'}`}>
                DOLBY B-NR {isDolbyOn ? 'ON' : 'OFF'}
              </span>
            </button>

            {/* VU Meter Mode Toggle */}
            <button
              onClick={() => setVuMode(prev => prev === 'lcd' ? 'needle' : 'lcd')}
              className="px-2 py-0.5 rounded bg-black/40 hover:bg-black/60 border border-white/10 text-[10px] text-neutral-300 hover:text-white"
            >
              VU: {vuMode.toUpperCase()}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-['Permanent_Marker'] text-sm tracking-widest text-amber-400">
              WERK
            </span>
            <span className="text-[9px] text-neutral-400 uppercase tracking-wider">
              STEREO CASSETTE DECK
            </span>
          </div>
        </div>

        {/* Digital Cyan LCD Display & Needle VU Meters */}
        <div className="my-3 px-4 py-3 bg-[#0a192f]/95 rounded-xl border border-cyan-500/40 shadow-inner flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto">
            <span className="px-2 py-0.5 bg-cyan-950/80 text-cyan-400 font-['VT323'] text-xl rounded border border-cyan-500/30">
              SIDE {currentSide}
            </span>
            <div className="min-w-0">
              <div className="font-['VT323'] text-xl sm:text-2xl text-cyan-300 truncate leading-tight tracking-wider">
                {currentTrack.artist} — {currentTrack.title}
              </div>
              <div className="text-[10px] font-['Space_Mono'] text-cyan-500 flex items-center gap-2">
                <span>Track {currentTrackIndex + 1} of {activeTracklist.length}</span>
                {tapePitch !== 1.0 && <span className="text-amber-400 font-bold">{tapePitch.toFixed(2)}x Speed</span>}
              </div>
            </div>
          </div>

          {/* Time Counter & VU Meter */}
          <div className="flex items-center gap-4">
            {/* VU Meter Display */}
            {vuMode === 'lcd' ? (
              <div className="flex items-end gap-1 h-6">
                {vuLevels.map((lvl, i) => (
                  <div key={i} className="w-1.5 bg-cyan-950 rounded-sm h-full flex flex-col justify-end overflow-hidden">
                    <div 
                      className="w-full bg-cyan-400 transition-all duration-75"
                      style={{ height: `${Math.max(10, lvl * 100)}%` }}
                    />
                  </div>
                ))}
              </div>
            ) : (
              /* Analog Dual Needle VU Meter */
              <div className="flex items-center gap-2 bg-[#ecd8a5] p-1 rounded border border-amber-900/40 shadow-inner">
                <div className="w-10 h-7 bg-amber-50 rounded relative overflow-hidden border border-black/20 flex flex-col justify-end items-center">
                  <div className="text-[6px] font-['Space_Mono'] text-black/60 font-bold -translate-y-1">VU L</div>
                  <div 
                    className="w-0.5 h-6 bg-red-600 origin-bottom transition-transform duration-75"
                    style={{ transform: `rotate(${-45 + (vuLevels[0] || 0.1) * 90}deg)` }}
                  />
                </div>
                <div className="w-10 h-7 bg-amber-50 rounded relative overflow-hidden border border-black/20 flex flex-col justify-end items-center">
                  <div className="text-[6px] font-['Space_Mono'] text-black/60 font-bold -translate-y-1">VU R</div>
                  <div 
                    className="w-0.5 h-6 bg-red-600 origin-bottom transition-transform duration-75"
                    style={{ transform: `rotate(${-45 + (vuLevels[1] || 0.1) * 90}deg)` }}
                  />
                </div>
              </div>
            )}

            {/* Time code */}
            <div className="font-['VT323'] text-2xl sm:text-3xl text-cyan-300 font-bold tracking-widest bg-cyan-950/60 px-3 py-0.5 rounded border border-cyan-500/30">
              {formatTime(currentTime)} / {formatTime(duration)}
            </div>
          </div>
        </div>

        {/* Audio Scrubber Bar */}
        <div className="my-2 px-1">
          <input
            type="range"
            min="0"
            max={duration || 180}
            value={currentTime}
            onChange={(e) => {
              const val = parseFloat(e.target.value);
              setCurrentTime(val);
              audioEngine.seek(val);
            }}
            className="w-full h-1.5 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-amber-500"
          />
        </div>

        {/* --- TACTILE DECK BUTTONS & VOLUME / PITCH SLIDERS --- */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          {/* Main Transport Controls */}
          <div className="flex items-center gap-2">
            {/* Play / Pause */}
            <button
              onClick={handlePlayPause}
              className={`deck-btn px-4 sm:px-6 py-2.5 rounded-lg font-['Space_Mono'] text-xs font-bold text-white flex items-center gap-2 ${
                isPlaying ? 'is-active text-amber-400 ring-1 ring-amber-400/50' : ''
              }`}
              title="Play / Pause"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
            </button>

            {/* Stop */}
            <button
              onClick={handleStop}
              className="deck-btn p-2.5 rounded-lg text-neutral-300 hover:text-white"
              title="Stop"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>

            {/* Previous Track */}
            <button
              onClick={handlePrevTrack}
              className="deck-btn p-2.5 rounded-lg text-neutral-300 hover:text-white"
              title="Previous Track"
            >
              <Rewind className="w-4 h-4 fill-current" />
            </button>

            {/* Next Track */}
            <button
              onClick={handleNextTrack}
              className="deck-btn p-2.5 rounded-lg text-neutral-300 hover:text-white"
              title="Next Track"
            >
              <FastForward className="w-4 h-4 fill-current" />
            </button>

            {/* Rewind Hold */}
            <button
              onMouseDown={() => handleRewindHold(true)}
              onMouseUp={() => handleRewindHold(false)}
              onMouseLeave={() => isRewinding && handleRewindHold(false)}
              onTouchStart={() => handleRewindHold(true)}
              onTouchEnd={() => handleRewindHold(false)}
              className={`deck-btn p-2.5 rounded-lg text-neutral-300 hover:text-white ${isRewinding ? 'is-active text-cyan-400' : ''}`}
              title="Hold to Rewind Motor"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Fast Forward Hold */}
            <button
              onMouseDown={() => handleFastForwardHold(true)}
              onMouseUp={() => handleFastForwardHold(false)}
              onMouseLeave={() => isFastForwarding && handleFastForwardHold(false)}
              onTouchStart={() => handleFastForwardHold(true)}
              onTouchEnd={() => handleFastForwardHold(false)}
              className={`deck-btn p-2.5 rounded-lg text-neutral-300 hover:text-white ${isFastForwarding ? 'is-active text-cyan-400' : ''}`}
              title="Hold to Fast Forward Motor"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            {/* Eject */}
            <button
              onClick={handleEjectToggle}
              className={`deck-btn px-3 py-2.5 rounded-lg font-['Space_Mono'] text-xs font-bold ${
                isEjected ? 'is-active text-red-400' : 'text-neutral-300 hover:text-white'
              }`}
              title="Eject Cassette Compartment"
            >
              <span>EJECT</span>
            </button>
          </div>

          {/* Flip Side & Hardware Sliders */}
          <div className="flex items-center gap-3">
            {/* Master Volume */}
            <div className="flex items-center gap-2 bg-black/40 px-3 py-1.5 rounded-lg border border-white/10">
              <button onClick={handleToggleMute} className="text-neutral-400 hover:text-amber-300">
                {isMuted ? <VolumeX className="w-4 h-4 text-red-400" /> : <Volume2 className="w-4 h-4" />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={isMuted ? 0 : volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-16 h-1.5 accent-amber-500 bg-neutral-800 rounded-lg cursor-pointer"
                title="Master Volume"
              />
            </div>

            {/* Tape Pitch / Speed Shift */}
            <div className="flex items-center gap-1.5 bg-black/40 px-2.5 py-1.5 rounded-lg border border-white/10 text-[10px] font-['Space_Mono'] text-neutral-400">
              <span>PITCH:</span>
              <input
                type="range"
                min="0.85"
                max="1.15"
                step="0.01"
                value={tapePitch}
                onChange={(e) => handlePitchChange(parseFloat(e.target.value))}
                className="w-14 h-1.5 accent-cyan-400 bg-neutral-800 rounded-lg cursor-pointer"
                title="Tape Pitch / Speed"
              />
              <button 
                onClick={() => handlePitchChange(1.0)} 
                className="text-[9px] hover:text-white underline"
                title="Reset Speed"
              >
                1x
              </button>
            </div>

            {/* Flip Side */}
            <button
              onClick={handleFlipSide}
              className="deck-btn px-3 sm:px-4 py-2.5 rounded-lg font-['Space_Mono'] text-xs font-bold text-amber-300 hover:text-amber-200 flex items-center gap-1.5"
              title="Flip Cassette Side"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>FLIP TO {currentSide === 'A' ? 'B' : 'A'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
