import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, BookOpen, Music, Disc } from 'lucide-react';
import { audioEngine } from '../services/audioService';

const GUIDE_STEPS = [
  {
    step: 1,
    title: 'The Art of the Mixtape',
    icon: '📼',
    content: 'Making a mixtape was never just about compiling songs. It was a tactile ritual — an act of deep intentionality and emotional expression.'
  },
  {
    step: 2,
    title: 'Picking Your Vibe',
    icon: '✨',
    content: 'Every great tape has a soul. Whether it is a midnight roadtrip, a rainy Sunday morning, or a secret confession, anchor your playlist to a mood.'
  },
  {
    step: 3,
    title: 'The 20-Minute Rule',
    icon: '⏱️',
    content: 'Real cassettes had physical capacity limits — typically 20 minutes per side for a C-40. Choose your songs carefully to fit without wasting tape!'
  },
  {
    step: 4,
    title: 'Side A: The Hook',
    icon: '🅰️',
    content: 'Side A should grab the listener right away. Start with your strongest, most anthemic track and build momentum.'
  },
  {
    step: 5,
    title: 'Side B: The Deep Dive',
    icon: '🅱️',
    content: 'Side B is where the intimate, vulnerable, and unexpected deep cuts belong. Leave them with a lingering thought.'
  },
  {
    step: 6,
    title: 'The Pencil Rewind Trick',
    icon: '✏️',
    content: 'Save your Walkman battery by jamming a standard hexagonal pencil into the tape reel hub and spinning it by hand.'
  },
  {
    step: 7,
    title: 'Designing the J-Card',
    icon: '🎨',
    content: 'The J-card is the fold-out paper sleeve inside the jewel case. Write your tracklist with care, choose your pen color, and number each song.'
  },
  {
    step: 8,
    title: 'Doodles & Stickers',
    icon: '⭐',
    content: 'Cover your tape with smiley badges, holographic stars, band stamps, and hand-drawn doodles to give it personality.'
  },
  {
    step: 9,
    title: 'The Secret Liner Note',
    icon: '💌',
    content: 'Folded inside the J-card is room for a personal message. A few heartfelt words turn a plastic cassette into a cherished keepsake.'
  },
  {
    step: 10,
    title: 'The Recording Ritual',
    icon: '🔴',
    content: 'Hit REC + PLAY together. Watch the magnetic spools turn and listen to the warm tape saturation as the audio prints to magnetic ribbon.'
  },
  {
    step: 11,
    title: 'Giving it Away',
    icon: '🎁',
    content: 'Hand it over in person. Tell them to listen on headphones with the lights dimmed.'
  }
];

export default function GuideModal({ isOpen, onClose }) {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    audioEngine.playButtonTick();
    if (currentStep < GUIDE_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onClose();
    }
  };

  const handlePrev = () => {
    audioEngine.playButtonTick();
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepData = GUIDE_STEPS[currentStep];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-[#1c1917] border-2 border-amber-500/40 rounded-2xl overflow-hidden shadow-2xl paper-texture text-neutral-900">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#ecdcb7] border-b border-amber-900/20">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-800" />
            <h3 className="font-['Permanent_Marker'] text-xl text-neutral-900 tracking-wide">
              THE MIXTAPE RITUAL GUIDE
            </h3>
          </div>
          <button
            onClick={() => {
              audioEngine.playButtonTick();
              onClose();
            }}
            className="p-1 rounded bg-black/10 hover:bg-black/20 text-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Content */}
        <div className="p-6 sm:p-8 flex flex-col items-center text-center">
          <div className="w-20 h-20 rounded-2xl bg-amber-100 border-2 border-amber-800/20 flex items-center justify-center text-4xl shadow-inner mb-4">
            {stepData.icon}
          </div>

          <div className="font-['Space_Mono'] text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">
            Step {stepData.step} of {GUIDE_STEPS.length}
          </div>

          <h4 className="font-['Permanent_Marker'] text-2xl sm:text-3xl text-neutral-900 mb-3">
            {stepData.title}
          </h4>

          <p className="font-['Caveat'] text-2xl sm:text-3xl text-neutral-800 leading-snug max-w-sm mb-6">
            {stepData.content}
          </p>

          {/* Step Progress dots */}
          <div className="flex items-center gap-1.5 mb-6">
            {GUIDE_STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => {
                  audioEngine.playButtonTick();
                  setCurrentStep(i);
                }}
                className={`h-2 rounded-full cursor-pointer transition-all ${
                  i === currentStep ? 'w-6 bg-red-600' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                }`}
              />
            ))}
          </div>

          {/* Navigation buttons */}
          <div className="w-full flex items-center justify-between gap-4 pt-2 border-t border-black/10">
            <button
              onClick={handlePrev}
              disabled={currentStep === 0}
              className={`flex items-center gap-1 text-xs font-['Space_Mono'] uppercase font-bold text-neutral-700 px-3 py-2 rounded ${
                currentStep === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:bg-black/10'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#8f1d14] hover:bg-[#a8201a] text-white font-['Permanent_Marker'] rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <span>{currentStep === GUIDE_STEPS.length - 1 ? 'GOT IT!' : 'NEXT STEP'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
