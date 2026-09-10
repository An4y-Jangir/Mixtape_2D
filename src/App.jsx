import React, { useState, useEffect } from 'react';
import { audioEngine } from './services/audioService';
import { PRESET_TAPES } from './data/defaultTapes';
import Header from './components/Header';
import Hero from './components/Hero';
import TapeRack from './components/TapeRack';
import CassetteDeck from './components/CassetteDeck';
import JCardView from './components/JCardView';
import MixtapeStudio from './components/MixtapeStudio';
import SignInModal from './components/SignInModal';
import ShareModal from './components/ShareModal';
import GuideModal from './components/GuideModal';

export default function App() {
  const [currentView, setCurrentView] = useState('home'); // 'home', 'player', 'studio'
  const [tapes, setTapes] = useState(() => {
    const saved = localStorage.getItem('mixtape_rack_v3');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {}
    }
    localStorage.setItem('mixtape_rack_v3', JSON.stringify(PRESET_TAPES));
    return PRESET_TAPES;
  });

  const [selectedTape, setSelectedTape] = useState(PRESET_TAPES[0]);
  const [draftTape, setDraftTape] = useState(null);
  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('mixtape_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.username && parsed.username !== '@mixtape_head' && parsed.username !== '@cassette_lover') {
          return parsed;
        }
      } catch (e) {}
    }
    const defaultProfile = { username: 'AnayJ', bio: 'Mixtape creator & 90s cassette collector' };
    localStorage.setItem('mixtape_user', JSON.stringify(defaultProfile));
    return defaultProfile;
  });

  // Modal States
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareTape, setShareTape] = useState(null);

  // Check URL Hash for shared tape
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#tape=')) {
      try {
        const jsonStr = decodeURIComponent(hash.substring(6));
        const sharedTape = JSON.parse(jsonStr);
        if (sharedTape && sharedTape.title) {
          setSelectedTape(sharedTape);
          setCurrentView('player');
          setTapes(prev => {
            if (prev.some(t => t.id === sharedTape.id)) return prev;
            const updated = [sharedTape, ...prev];
            localStorage.setItem('mixtape_rack_v3', JSON.stringify(updated));
            return updated;
          });
        }
      } catch (e) {
        console.error('Failed to parse shared tape from URL', e);
      }
    }
  }, []);

  // Save tapes to localStorage
  const saveTapesToStorage = (updatedTapes) => {
    setTapes(updatedTapes);
    localStorage.setItem('mixtape_rack_v3', JSON.stringify(updatedTapes));
  };

  // Select tape from rack to load into deck player
  const handleSelectTapeFromRack = (tape) => {
    setSelectedTape(tape);
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Open Studio to create a brand new tape
  const handleStartNewTape = () => {
    audioEngine.playButtonTick();
    const newTape = {
      id: `user-tape-${Date.now()}`,
      title: 'My 90s Mixtape',
      author: userProfile?.username ? `@${userProfile.username.replace(/^@/, '')}` : '@AnayJ',
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
        title: 'Side A: Daytime Grooves',
        tracks: [
          { id: 'usr-1', title: 'Smells Like Teen Spirit', artist: 'Nirvana', duration: '5:01', durationSec: 301, genre: 'Grunge', youtubeId: 'hTWKbfoikeg' },
          { id: 'usr-2', title: '1979', artist: 'The Smashing Pumpkins', duration: '4:26', durationSec: 266, genre: 'Alternative', youtubeId: '4aeETEoNfOg' },
        ]
      },
      sideB: {
        title: 'Side B: Late Night Drive',
        tracks: [
          { id: 'usr-3', title: 'Everlong', artist: 'Foo Fighters', duration: '4:10', durationSec: 250, genre: 'Alternative', youtubeId: 'eBG7P-K-r1Y' },
        ]
      },
      stickers: [
        { id: 'st-d1', stickerId: 'holo-star', x: 74, y: 14, scale: 1.1, rotation: 8 },
      ],
      doodles: [
        { id: 'do-d1', doodleId: 'lightning-bolt', x: 20, y: 80, scale: 0.9, rotation: -10, color: '#0c0a09' },
      ],
      linerNotes: 'Side A for the open road. Side B for the fire escape.',
      isUserCreated: true
    };

    setDraftTape(newTape);
    setSelectedTape(newTape);
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Edit existing tape in Studio
  const handleEditTape = (tapeToEdit) => {
    audioEngine.playButtonTick();
    setDraftTape(tapeToEdit);
    setCurrentView('studio');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save tape from Studio
  const handleSaveTapeFromStudio = (savedTape) => {
    audioEngine.playButtonTick();
    const existingIndex = tapes.findIndex(t => t.id === savedTape.id);
    let updated;
    if (existingIndex >= 0) {
      updated = [...tapes];
      updated[existingIndex] = savedTape;
    } else {
      updated = [savedTape, ...tapes];
    }
    saveTapesToStorage(updated);
    setSelectedTape(savedTape);
    setDraftTape(null);
    setCurrentView('player');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Duplicate tape in Rack
  const handleDuplicateTape = (tapeToDup) => {
    const duplicated = {
      ...tapeToDup,
      id: `user-tape-${Date.now()}`,
      title: `${tapeToDup.title} (Copy)`,
      author: userProfile?.username ? `@${userProfile.username.replace(/^@/, '')}` : '@AnayJ',
      isUserCreated: true,
      sideA: {
        ...tapeToDup.sideA,
        tracks: (tapeToDup.sideA?.tracks || []).map(t => ({ ...t, id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` }))
      },
      sideB: {
        ...tapeToDup.sideB,
        tracks: (tapeToDup.sideB?.tracks || []).map(t => ({ ...t, id: `t-${Date.now()}-${Math.random().toString(36).substr(2, 4)}` }))
      }
    };
    const updated = [duplicated, ...tapes];
    saveTapesToStorage(updated);
  };

  // Delete tape from Rack
  const handleDeleteTape = (tapeId) => {
    const updated = tapes.filter(t => t.id !== tapeId);
    saveTapesToStorage(updated);
    if (selectedTape?.id === tapeId) {
      setSelectedTape(updated[0] || PRESET_TAPES[0]);
    }
  };

  // Add shared tape to user's rack
  const handleAddTapeToRack = (tapeToAdd) => {
    if (!tapes.some(t => t.id === tapeToAdd.id)) {
      const updated = [tapeToAdd, ...tapes];
      saveTapesToStorage(updated);
    }
  };

  // Save creator profile
  const handleSaveProfile = (profile) => {
    setUserProfile(profile);
    localStorage.setItem('mixtape_user', JSON.stringify(profile));
  };

  return (
    <div className="relative min-h-screen bg-[#0c0a09] text-white flex flex-col justify-between overflow-x-hidden">
      {/* 90s Halftone Dot Overlay Background */}
      <div className="fixed inset-0 halftone-overlay pointer-events-none z-0" />

      {/* Main Container */}
      <div className="relative z-10 flex flex-col flex-1">
        {/* Header */}
        <Header
          onOpenSignIn={() => setIsSignInOpen(true)}
          userProfile={userProfile}
          onOpenStudio={handleStartNewTape}
        />

        {/* View Routing */}
        <main className="flex-1 py-4">
          {currentView === 'home' && (
            <div className="space-y-6 animate-in fade-in duration-300">
              <Hero
                onStartNewTape={handleStartNewTape}
                onContinueTape={() => setCurrentView('studio')}
                currentDraftTape={draftTape}
                onOpenStudio={handleStartNewTape}
              />

              <TapeRack
                tapes={tapes}
                selectedTapeId={selectedTape?.id}
                onSelectTape={handleSelectTapeFromRack}
                onCreateNew={handleStartNewTape}
                onDuplicateTape={handleDuplicateTape}
                onDeleteTape={handleDeleteTape}
              />
            </div>
          )}

          {currentView === 'player' && selectedTape && (
            <div className="space-y-6 animate-in fade-in duration-300 px-3 sm:px-6">
              <CassetteDeck
                tape={selectedTape}
                onBackToRack={() => setCurrentView('home')}
                onEditTape={handleEditTape}
                onOpenShare={(t) => {
                  setShareTape(t);
                  setIsShareOpen(true);
                }}
              />

              {/* Unfolded J-Card below the deck */}
              <JCardView
                tape={selectedTape}
                onPlayTrack={(track) => {
                  audioEngine.playTrack(track);
                }}
              />
            </div>
          )}

          {currentView === 'studio' && (
            <MixtapeStudio
              initialTape={draftTape || selectedTape}
              onSaveTape={handleSaveTapeFromStudio}
              onBackToRack={() => setCurrentView('home')}
              userProfile={userProfile}
            />
          )}
        </main>
      </div>

      {/* Retro Footer */}
      <footer className="relative z-10 w-full max-w-7xl mx-auto px-4 py-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-['Space_Mono'] text-neutral-400 select-none">
        <div className="flex items-center gap-3">
          <span className="font-['Permanent_Marker'] text-sm text-amber-400 tracking-wider">
            MIXTAPE CREATOR
          </span>
          <span>• Making mixtapes is a ritual.</span>
        </div>

        <div className="flex items-center gap-4 text-[11px]">
          <span className="text-amber-300 font-bold">Curated by {userProfile?.username || 'AnayJ'}</span>
          <span>•</span>
          <span>YouTube Music Ad-Free Audio Engine</span>
        </div>
      </footer>

      {/* Modals */}
      <SignInModal
        isOpen={isSignInOpen}
        onClose={() => setIsSignInOpen(false)}
        userProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      <ShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        tape={shareTape || selectedTape}
        onAddToRack={handleAddTapeToRack}
      />
    </div>
  );
}
