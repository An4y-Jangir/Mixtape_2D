import React, { useState } from 'react';
import { X, User, Sparkles, Check } from 'lucide-react';
import { audioEngine } from '../services/audioService';

export default function SignInModal({ isOpen, onClose, userProfile, onSaveProfile }) {
  const [handle, setHandle] = useState(userProfile?.username || 'AnayJ');
  const [bio, setBio] = useState(userProfile?.bio || 'Mixtape creator & 90s cassette collector');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    audioEngine.playButtonTick();
    const cleanHandle = handle.trim() || 'AnayJ';
    onSaveProfile({ username: cleanHandle, bio });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#1c1917] border-2 border-amber-600/50 rounded-2xl overflow-hidden shadow-2xl paper-texture text-neutral-900">
        <div className="flex items-center justify-between px-6 py-4 border-b border-amber-900/20 bg-[#ebdcb7]">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-amber-800" />
            <h3 className="font-['Permanent_Marker'] text-xl text-neutral-900 tracking-wide">
              YOUR MIXTAPE IDENTITY
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

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-['Space_Mono'] uppercase tracking-wider text-neutral-700 font-bold mb-1">
              Your Creator Tag / Handle
            </label>
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="@username"
              required
              className="w-full px-4 py-2 bg-white border-2 border-amber-900/30 rounded-lg text-neutral-900 font-['Caveat'] text-2xl focus:outline-none focus:border-amber-600"
            />
            <p className="text-[11px] text-neutral-600 mt-1">
              This handle will appear on your cassette spines and J-cards!
            </p>
          </div>

          <div>
            <label className="block text-xs font-['Space_Mono'] uppercase tracking-wider text-neutral-700 font-bold mb-1">
              Bio / Note
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={2}
              className="w-full px-4 py-2 bg-white border-2 border-amber-900/30 rounded-lg text-neutral-900 font-['Caveat'] text-xl focus:outline-none focus:border-amber-600"
            />
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-['Space_Mono'] text-neutral-700 hover:text-black uppercase"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-[#8f1d14] hover:bg-[#a8201a] text-white font-['Permanent_Marker'] rounded-lg shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>SAVE IDENTITY</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
