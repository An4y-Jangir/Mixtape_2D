import React from 'react';
import { X } from 'lucide-react';
import { audioEngine } from '../services/audioService';

export default function TrailerModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#18181b] border-2 border-red-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#27272a] border-b border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <h3 className="font-['Permanent_Marker'] text-lg text-amber-200 tracking-wide">
              MIXTAPE — Official Reveal Trailer
            </h3>
          </div>
          <button
            onClick={() => {
              audioEngine.playButtonTick();
              onClose();
            }}
            className="p-1 rounded-lg bg-black/40 hover:bg-red-600/80 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Frame */}
        <div className="relative aspect-video w-full bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/Z0jQoZ_qD7I?autoplay=1&rel=0"
            title="Mixtape Official Trailer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Footer info */}
        <div className="px-4 py-3 bg-[#0c0a09] text-xs text-neutral-400 flex flex-col sm:flex-row justify-between items-center gap-2">
          <span>By Beethoven & Dinosaur / Annapurna Interactive</span>
          <span className="text-amber-400 font-['Space_Mono']">Coming to Steam, Xbox, PlayStation & Switch 2</span>
        </div>
      </div>
    </div>
  );
}
