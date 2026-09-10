import React from 'react';
import { User, Sparkles, Disc, Plus } from 'lucide-react';
import { audioEngine } from '../services/audioService';

export default function Header({ onOpenSignIn, userProfile, onOpenStudio }) {
  const profileName = userProfile?.username || 'AnayJ';

  return (
    <header className="relative z-40 w-full pt-4 pb-2 px-4 sm:px-8 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
      {/* Brand Logo & 90s Cassette Title Badge */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center bg-[#8f1d14] text-white px-4 py-2 rounded shadow-lg border border-red-900/40 transform -rotate-1 hover:rotate-0 transition-transform duration-200">
          {/* Top left and right faux tape strips */}
          <div className="absolute -top-3 left-4 w-8 h-4 bg-[#edd8a4]/80 -rotate-12 shadow-sm pointer-events-none" />
          <div className="absolute -top-3 right-4 w-8 h-4 bg-[#edd8a4]/80 rotate-6 shadow-sm pointer-events-none" />
          
          <div className="flex items-center gap-2">
            <span className="font-['Permanent_Marker'] text-sm sm:text-base tracking-wider uppercase text-amber-200">
              MIXTAPE CREATOR
            </span>
            <span className="text-[10px] font-['Space_Mono'] bg-black/40 text-amber-300 px-2 py-0.5 rounded border border-amber-400/30">
              STUDIO 2D
            </span>
          </div>
        </div>
      </div>

      {/* Right Controls: User Profile (AnayJ) & Quick Studio */}
      <div className="flex items-center gap-3">
        {onOpenStudio && (
          <button
            onClick={() => {
              audioEngine.playButtonTick();
              onOpenStudio();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#f59e0b] hover:bg-[#fbbf24] text-black font-['Permanent_Marker'] text-xs shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>NEW TAPE</span>
          </button>
        )}

        {/* User Profile Badge */}
        <button
          onClick={() => {
            audioEngine.playButtonTick();
            onOpenSignIn();
          }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-amber-300 border border-amber-500/40 text-xs font-['Space_Mono'] uppercase tracking-wider transition-all shadow-md group hover:border-amber-400"
          title="Edit Creator Profile"
        >
          <div className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500 group-hover:text-black transition-colors">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="font-bold">{profileName}</span>
        </button>
      </div>
    </header>
  );
}
