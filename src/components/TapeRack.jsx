import React, { useState } from 'react';
import { Plus, Disc, Search, Sparkles, Filter, Copy, Trash2, Play } from 'lucide-react';
import { audioEngine } from '../services/audioService';
import { getFontFamily, getFontClass } from '../data/defaultTapes';

export default function TapeRack({ 
  tapes, 
  onSelectTape, 
  onCreateNew, 
  onDuplicateTape,
  onDeleteTape,
  selectedTapeId 
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'user', 'featured', 'electronic', 'rock', 'synthwave'

  const filteredTapes = tapes.filter((tape) => {
    const matchesSearch = tape.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          tape.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (tape.format || '').toLowerCase().includes(searchQuery.toLowerCase());
    if (!matchesSearch) return false;
    if (activeFilter === 'all') return true;
    if (activeFilter === 'user') return tape.isUserCreated;
    if (activeFilter === 'featured') return !tape.isUserCreated;
    return true;
  });

  return (
    <section className="relative z-20 w-full max-w-4xl mx-auto px-4 py-8 select-none">
      {/* Rack Title & Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="font-['Permanent_Marker'] text-3xl sm:text-4xl text-amber-200 tracking-wide drop-shadow-md">
            THE RACK
          </h2>
          <span className="text-xs font-['Space_Mono'] bg-black/60 text-amber-400 px-2.5 py-1 rounded-full border border-amber-500/30">
            {filteredTapes.length} TAPES
          </span>
        </div>

        {/* Filter and Search */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {/* Filter Pills */}
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-lg border border-white/10 text-[10px] font-['Space_Mono']">
            <button
              onClick={() => setActiveFilter('all')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeFilter === 'all' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              ALL
            </button>
            <button
              onClick={() => setActiveFilter('featured')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeFilter === 'featured' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              FEATURED
            </button>
            <button
              onClick={() => setActiveFilter('user')}
              className={`px-2.5 py-1 rounded transition-all ${
                activeFilter === 'user' ? 'bg-amber-500 text-black font-bold' : 'text-neutral-400 hover:text-white'
              }`}
            >
              MY TAPES
            </button>
          </div>

          <div className="relative flex-1 sm:w-56">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search rack..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-black/60 border border-amber-500/30 rounded-lg text-sm text-white placeholder:text-neutral-500 font-['Space_Mono'] focus:outline-none focus:border-amber-400"
            />
          </div>

          <button
            onClick={() => {
              audioEngine.playButtonTick();
              onCreateNew();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#f59e0b] hover:bg-[#fbbf24] text-black font-['Permanent_Marker'] text-xs rounded-lg shadow hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>NEW TAPE</span>
          </button>
        </div>
      </div>

      {/* Vertical Cassette Rack Box */}
      <div className="relative p-4 sm:p-6 bg-gradient-to-b from-[#1c1917]/95 via-[#0c0a09]/95 to-[#1c1917]/95 rounded-2xl border-4 border-[#3f3f46]/60 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
        <div className="space-y-3">
          {filteredTapes.map((tape) => {
            const isSelected = tape.id === selectedTapeId;
            return (
              <div
                key={tape.id}
                onMouseEnter={() => audioEngine.playRackSlideSound()}
                className={`group relative flex items-center h-14 sm:h-16 px-4 rounded-xl cursor-pointer transition-all duration-300 transform ${
                  isSelected
                    ? 'translate-x-4 sm:translate-x-6 scale-[1.02] shadow-[0_10px_30px_rgba(245,158,11,0.35)] ring-2 ring-amber-400'
                    : 'hover:translate-x-3 hover:scale-[1.01] hover:shadow-2xl shadow-md'
                }`}
                style={{
                  backgroundColor: tape.colors?.paper || '#f4f4f5',
                  color: tape.colors?.ink || '#09090b',
                }}
              >
                {/* Plastic Jewel Case Bevel */}
                <div 
                  onClick={() => {
                    audioEngine.playTapeClick();
                    onSelectTape(tape);
                  }}
                  className="absolute inset-0 rounded-xl plastic-sheen pointer-events-none border border-black/10" 
                />

                {/* Left Side: Tape format badge */}
                <div 
                  onClick={() => {
                    audioEngine.playTapeClick();
                    onSelectTape(tape);
                  }}
                  className="flex flex-col items-center justify-center px-3 py-1 mr-4 rounded border-r border-black/15 min-w-[56px] text-center"
                  style={{
                    backgroundColor: tape.colors?.primary || '#d97706',
                    color: '#ffffff'
                  }}
                >
                  <span className="font-['Space_Mono'] font-bold text-xs sm:text-sm tracking-tighter leading-tight">
                    {tape.format || 'CRX'}
                  </span>
                  <span className="text-[8px] tracking-tighter opacity-80 uppercase leading-tight font-['Space_Mono']">
                    {tape.durationLabel || '2 x 20m'}
                  </span>
                </div>

                {/* Center: Spine handwritten title */}
                <div 
                  onClick={() => {
                    audioEngine.playTapeClick();
                    onSelectTape(tape);
                  }}
                  className="flex-1 min-w-0 pr-4"
                >
                  <h3 
                    className={`text-xl sm:text-2xl font-bold truncate leading-tight transition-transform group-hover:translate-x-1 ${getFontClass(tape.font)}`}
                    style={{ fontFamily: getFontFamily(tape.font) }}
                  >
                    {tape.title}
                  </h3>
                </div>

                {/* Right Side: Creator tag, Actions & Annapurna badge */}
                <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                  <span className="font-['Caveat'] text-base sm:text-lg font-bold text-neutral-600 truncate max-w-[100px] sm:max-w-[130px]">
                    {tape.author}
                  </span>

                  {/* Tape Actions: Duplicate & Delete (if user created) */}
                  {onDuplicateTape && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audioEngine.playButtonTick();
                        onDuplicateTape(tape);
                      }}
                      className="p-1 rounded bg-black/10 hover:bg-black/20 text-neutral-700 hover:text-black transition-colors"
                      title="Duplicate Mixtape"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}

                  {tape.isUserCreated && onDeleteTape && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        audioEngine.playButtonTick();
                        if (window.confirm(`Delete mixtape "${tape.title}" from your rack?`)) {
                          onDeleteTape(tape.id);
                        }
                      }}
                      className="p-1 rounded bg-black/10 hover:bg-red-500 hover:text-white text-neutral-700 transition-colors"
                      title="Delete Tape"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <div 
                    onClick={() => {
                      audioEngine.playTapeClick();
                      onSelectTape(tape);
                    }}
                    className="w-7 h-7 sm:w-8 sm:h-8 rounded flex items-center justify-center font-['Permanent_Marker'] text-sm font-bold text-white shadow-sm"
                    style={{
                      backgroundColor: tape.colors?.secondary || '#9a3412',
                    }}
                  >
                    A
                  </div>
                </div>

                {/* Play hover flag */}
                <div 
                  onClick={() => {
                    audioEngine.playTapeClick();
                    onSelectTape(tape);
                  }}
                  className="absolute -right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-amber-500 text-black font-['Permanent_Marker'] text-[10px] px-2 py-0.5 rounded shadow"
                >
                  PLAY
                </div>
              </div>
            );
          })}

          {filteredTapes.length === 0 && (
            <div className="text-center py-12 text-neutral-400 font-['Space_Mono'] text-sm">
              No tapes found matching your filter or search.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
