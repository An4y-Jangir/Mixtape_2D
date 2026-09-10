import React from 'react';
import { Plus, RotateCcw, Disc, Sparkles, Music } from 'lucide-react';
import { audioEngine } from '../services/audioService';

export default function Hero({ onStartNewTape, onContinueTape, currentDraftTape, onOpenStudio }) {
  return (
    <section className="relative z-30 w-full pt-6 pb-4 px-4 flex flex-col items-center select-none text-center">
      {/* Action Bar (CONTINUE YOUR TAPE / MAKE A MIXTAPE) */}
      <div className="mb-6 flex flex-wrap items-center justify-center gap-3">
        {currentDraftTape ? (
          <div className="flex items-center gap-2 bg-[#1c1917]/90 border border-amber-500/40 p-1.5 pl-3 rounded-full shadow-xl backdrop-blur-md">
            <span className="text-xs font-['Permanent_Marker'] text-amber-300">
              CURRENT TAPE:
            </span>
            <span className="text-sm font-['Caveat'] font-bold text-white bg-black/40 px-3 py-0.5 rounded-full">
              {currentDraftTape.title || 'Untitled Mixtape'}
            </span>
            <button
              onClick={() => {
                audioEngine.playButtonTick();
                onContinueTape();
              }}
              className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-black font-['Permanent_Marker'] text-xs rounded-full shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              CONTINUE YOUR TAPE
            </button>
            <button
              onClick={() => {
                audioEngine.playButtonTick();
                onStartNewTape();
              }}
              className="p-1.5 text-neutral-400 hover:text-red-400 transition-colors"
              title="Start Over"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => {
              audioEngine.playButtonTick();
              onOpenStudio();
            }}
            className="flex items-center gap-2 px-7 py-3 bg-[#f59e0b] hover:bg-[#fbbf24] text-black font-['Permanent_Marker'] text-base sm:text-lg rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
          >
            <Disc className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            <span>MAKE A MIXTAPE</span>
          </button>
        )}
      </div>

      {/* Hero Typography & Character Badges Stage */}
      <div className="relative max-w-4xl mx-auto w-full py-6 flex items-center justify-center">
        {/* Jenny Character Head with Heart Sunglasses */}
        <div className="absolute -top-4 left-4 sm:left-12 z-20 transform -rotate-12 hover:rotate-0 hover:scale-110 transition-transform duration-200 cursor-pointer">
          <div className="w-20 h-24 sm:w-28 sm:h-32 bg-amber-100 rounded-2xl p-1.5 shadow-2xl border-2 border-black/80 flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-b from-amber-50 to-orange-100">
            {/* Sunglasses illustration */}
            <div className="w-14 sm:w-18 h-12 relative flex items-center justify-center">
              <span className="text-3xl sm:text-4xl">🕶️</span>
            </div>
            <div className="text-[10px] font-['Permanent_Marker'] text-neutral-900 bg-amber-300 px-2 py-0.5 rounded shadow-sm mt-1">
              JENNY
            </div>
          </div>
        </div>

        {/* Camille Character Head */}
        <div className="absolute -bottom-4 z-20 transform rotate-6 hover:scale-110 transition-transform duration-200 cursor-pointer">
          <div className="w-18 h-22 sm:w-24 sm:h-28 bg-rose-100 rounded-2xl p-1.5 shadow-2xl border-2 border-black/80 flex flex-col items-center justify-center relative bg-gradient-to-b from-rose-50 to-pink-100">
            <span className="text-3xl sm:text-4xl">🎧</span>
            <div className="text-[10px] font-['Permanent_Marker'] text-neutral-900 bg-pink-300 px-2 py-0.5 rounded shadow-sm mt-1">
              CAMILLE
            </div>
          </div>
        </div>

        {/* Slater Character Head with Beanie */}
        <div className="absolute -top-2 right-4 sm:right-12 z-20 transform rotate-12 hover:rotate-0 hover:scale-110 transition-transform duration-200 cursor-pointer">
          <div className="w-20 h-24 sm:w-28 sm:h-32 bg-amber-100 rounded-2xl p-1.5 shadow-2xl border-2 border-black/80 flex flex-col items-center justify-center relative bg-gradient-to-b from-amber-50 to-yellow-100">
            <span className="text-3xl sm:text-4xl">🛹</span>
            <div className="text-[10px] font-['Permanent_Marker'] text-neutral-900 bg-amber-400 px-2 py-0.5 rounded shadow-sm mt-1">
              SLATER
            </div>
          </div>
        </div>

        {/* Main "MAKE YOUR OWN MIXTAPE .COM" Layered Logo */}
        <div className="relative z-10 flex flex-col items-center justify-center">
          {/* Top arched subtitle */}
          <div className="font-['Permanent_Marker'] text-xl sm:text-3xl md:text-4xl tracking-widest text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.9)] transform -rotate-2">
            MAKE YOUR OWN
          </div>

          {/* Huge Main "MIXTAPE" text */}
          <h1 className="font-['Permanent_Marker'] text-6xl sm:text-8xl md:text-9xl text-white tracking-tight leading-none drop-shadow-[0_8px_20px_rgba(0,0,0,0.9)] my-1 select-none">
            MIXTAPE
          </h1>

          {/* Bottom .COM badge */}
          <div className="font-['Permanent_Marker'] text-2xl sm:text-4xl text-amber-300 tracking-wider transform rotate-3 drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)]">
            .COM
          </div>
        </div>
      </div>
    </section>
  );
}
