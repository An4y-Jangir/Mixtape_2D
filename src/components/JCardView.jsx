import React from 'react';
import { Play, Sparkles } from 'lucide-react';
import { audioEngine } from '../services/audioService';
import { getFontFamily, getFontClass } from '../data/defaultTapes';
import { STICKERS, DOODLES } from '../data/stickerData';

export default function JCardView({ tape, onPlayTrack, activeTrackId }) {
  const fontClass = getFontClass(tape?.font);
  const handwritingStyle = { fontFamily: getFontFamily(tape?.font) };

  return (
    <div className="relative w-full max-w-3xl mx-auto my-6 select-none animate-in fade-in duration-300">
      {/* 3-Panel Unfolded J-Card Container */}
      <div 
        className="relative rounded-2xl p-6 shadow-jcard paper-texture border-2 border-amber-900/20 overflow-hidden"
        style={{
          backgroundColor: tape.colors?.paper || '#f7f4ea',
          color: tape.colors?.ink || '#0c0a09',
        }}
      >
        {/* Subtle Fold Line Shadows */}
        <div className="absolute top-[28%] left-0 right-0 h-1 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />
        <div className="absolute top-[48%] left-0 right-0 h-1 bg-gradient-to-b from-black/15 to-transparent pointer-events-none" />

        {/* --- PANEL 1: TOP BRAND HEADER (Folded Back Cover) --- */}
        <div 
          className="w-full rounded-lg p-3 text-white flex items-center justify-between shadow-sm mb-4"
          style={{
            backgroundColor: tape.colors?.primary || '#d97706',
          }}
        >
          <div className="flex items-center gap-2">
            <span className="font-['Permanent_Marker'] text-base tracking-wider uppercase">
              AUDIO CASSETTE
            </span>
            <span className="text-[10px] font-['Space_Mono'] bg-black/20 px-2 py-0.5 rounded">
              NORMAL BIAS 120µs EQ
            </span>
          </div>
          <div className="font-['Space_Mono'] font-extrabold text-xl tracking-tighter">
            {tape.format || 'CRX'} 40
          </div>
        </div>

        {/* --- PANEL 2: CASSETTE SPINE (Center Spine) --- */}
        <div className="relative my-4 py-3 px-4 bg-white/60 rounded-xl border border-black/10 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-4">
            {/* Format code box */}
            <div 
              className="px-2.5 py-1 rounded text-white font-['Space_Mono'] font-bold text-sm text-center"
              style={{ backgroundColor: tape.colors?.secondary || '#9a3412' }}
            >
              <div className="text-[8px] leading-tight">2 x 20 min</div>
              <div className="text-base leading-none">40</div>
            </div>

            <h2 className={`text-2xl sm:text-3xl font-bold truncate ${fontClass}`} style={handwritingStyle}>
              {tape.title}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-['Caveat'] text-lg font-bold text-neutral-600">
              {tape.author}
            </span>
            <div className="w-6 h-6 rounded bg-neutral-900 text-white font-['Permanent_Marker'] flex items-center justify-center text-xs">
              A
            </div>
          </div>
        </div>

        {/* --- PANEL 3: TRACKLIST (Side A & Side B) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-4">
          {/* Side A */}
          <div className="bg-white/40 p-4 rounded-xl border border-black/10 relative paper-lined">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/20">
              <div className="flex items-center gap-2">
                <span 
                  className="w-6 h-6 rounded flex items-center justify-center font-['Permanent_Marker'] text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: tape.colors?.primary || '#d97706' }}
                >
                  A
                </span>
                <span className={`text-xl font-bold ${fontClass}`} style={handwritingStyle}>
                  {tape.sideA?.title || 'Side A Title'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {tape.sideA?.tracks?.map((track, i) => {
                const isActive = activeTrackId === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      audioEngine.playTapeClick();
                      if (onPlayTrack) onPlayTrack(track, 'A', i);
                    }}
                    className={`group flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                      isActive ? 'bg-amber-400/30 font-bold' : 'hover:bg-black/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      {/* Highlighted Circle Marker */}
                      <span 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0"
                        style={{ backgroundColor: tape.colors?.highlighter || '#ec4899' }}
                      >
                        {i + 1}
                      </span>
                      <span className={`text-lg truncate ${fontClass}`} style={handwritingStyle}>
                        {track.title} {track.artist ? `– ${track.artist}` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-['Space_Mono'] text-neutral-600">
                        {track.duration}
                      </span>
                      <Play className={`w-3 h-3 text-amber-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Side B */}
          <div className="bg-white/40 p-4 rounded-xl border border-black/10 relative paper-lined">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-black/20">
              <div className="flex items-center gap-2">
                <span 
                  className="w-6 h-6 rounded flex items-center justify-center font-['Permanent_Marker'] text-xs font-bold text-white shadow-sm"
                  style={{ backgroundColor: tape.colors?.secondary || '#9a3412' }}
                >
                  B
                </span>
                <span className={`text-xl font-bold ${fontClass}`} style={handwritingStyle}>
                  {tape.sideB?.title || 'Side B Title'}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              {tape.sideB?.tracks?.map((track, i) => {
                const isActive = activeTrackId === track.id;
                return (
                  <div
                    key={track.id}
                    onClick={() => {
                      audioEngine.playTapeClick();
                      if (onPlayTrack) onPlayTrack(track, 'B', i);
                    }}
                    className={`group flex items-center justify-between p-1.5 rounded-lg cursor-pointer transition-colors ${
                      isActive ? 'bg-amber-400/30 font-bold' : 'hover:bg-black/5'
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0 pr-2">
                      <span 
                        className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-sm shrink-0"
                        style={{ backgroundColor: tape.colors?.highlighter || '#ec4899' }}
                      >
                        {i + 1}
                      </span>
                      <span className={`text-lg truncate ${fontClass}`} style={handwritingStyle}>
                        {track.title} {track.artist ? `– ${track.artist}` : ''}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-xs font-['Space_Mono'] text-neutral-600">
                        {track.duration}
                      </span>
                      <Play className={`w-3 h-3 text-amber-600 transition-opacity ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* --- PERSONAL LINER NOTES / LETTER --- */}
        {tape.linerNotes && (
          <div className="mt-4 p-3 bg-white/50 rounded-xl border border-dashed border-black/20 text-center">
            <p className={`text-xl italic text-neutral-700 ${fontClass}`} style={handwritingStyle}>
              "{tape.linerNotes}"
            </p>
          </div>
        )}

        {/* Placed Stickers on J-Card */}
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

        {/* Placed Doodles on J-Card */}
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
    </div>
  );
}
