// Web Audio Synthesizer & Ad-Free YouTube Music Background Player

class AudioEngine {
  constructor() {
    this.ctx = null;
    this.hissGain = null;
    this.hissSource = null;
    this.isHissOn = false;
    this.rewindOsc = null;
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = 'anonymous';
    this.currentTrack = null;
    this.isPlaying = false;
    this.volume = 0.85;
    this.playbackRate = 1.0;
    this.isDolbyOn = true;
    this.currentMode = 'html5'; // 'youtube', 'html5', 'synth'
    this.onTimeUpdate = null;
    this.onTrackEnd = null;
    this.onStateChange = null;
    this.onVolumeChange = null;

    // Web Audio Nodes
    this.analyser = null;
    this.audioSourceNode = null;
    this.masterGainNode = null;
    this.dolbyFilterNode = null;
    this.bassNode = null;
    this.trebleNode = null;

    // Procedural Synthesizer State
    this.synthInterval = null;
    this.synthElapsed = 0;

    // YouTube Player State
    this.ytPlayer = null;
    this.ytReady = false;
    this.ytTimeInterval = null;
    this.pendingTrack = null;

    // Microphone Voice Recording
    this.mediaRecorder = null;
    this.recordedChunks = [];
    this.recordingStream = null;

    // Init YouTube IFrame API
    this.initYouTubeAPI();

    this.audioElement.addEventListener('timeupdate', () => {
      if (this.currentMode === 'html5' && this.onTimeUpdate) {
        this.onTimeUpdate(this.audioElement.currentTime, this.audioElement.duration || (this.currentTrack?.durationSec || 180));
      }
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.currentMode === 'html5' && this.onTrackEnd) {
        this.onTrackEnd();
      }
    });

    this.audioElement.addEventListener('error', () => {
      if (this.isPlaying && this.currentTrack && this.currentMode === 'html5') {
        if (this.currentTrack.youtubeId) {
          this.playYouTubeTrack(this.currentTrack.youtubeId, this.audioElement.currentTime || 0);
        } else {
          this.playSynthesizedTrack(this.currentTrack, this.audioElement.currentTime || 0);
        }
      }
    });
  }

  initYouTubeAPI() {
    const setupPlayer = () => {
      if (window.YT && window.YT.Player) {
        try {
          const mountEl = document.getElementById('yt-audio-player-mount');
          if (mountEl) {
            this.ytPlayer = new window.YT.Player('yt-audio-player-mount', {
              height: '200',
              width: '200',
              playerVars: {
                playsinline: 1,
                controls: 0,
                disablekb: 1,
                fs: 0,
                rel: 0,
                modestbranding: 1,
                iv_load_policy: 3,
                enablejsapi: 1,
                autoplay: 0,
                origin: window.location.origin
              },
              events: {
                onReady: () => {
                  this.ytReady = true;
                  if (this.ytPlayer && this.ytPlayer.setVolume) {
                    this.ytPlayer.setVolume(Math.round(this.volume * 100));
                  }
                  if (this.pendingTrack) {
                    const track = this.pendingTrack;
                    this.pendingTrack = null;
                    this.playTrack(track);
                  }
                },
                onStateChange: (event) => {
                  // YT.PlayerState: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
                  if (event.data === window.YT.PlayerState.PLAYING) {
                    this.isPlaying = true;
                    if (this.onStateChange) this.onStateChange(true);
                  } else if (event.data === window.YT.PlayerState.PAUSED) {
                    this.isPlaying = false;
                    if (this.onStateChange) this.onStateChange(false);
                  } else if (event.data === window.YT.PlayerState.ENDED) {
                    if (this.onTrackEnd) this.onTrackEnd();
                  }
                },
                onError: (err) => {
                  console.warn('YouTube Player error, falling back to synth:', err);
                  if (this.currentTrack) {
                    this.playSynthesizedTrack(this.currentTrack, 0);
                  }
                }
              }
            });
          }
        } catch (e) {
          console.warn('Could not initialize YouTube player:', e);
        }
      }
    };

    if (window.YT && window.YT.Player) {
      setupPlayer();
    } else {
      const prevCallback = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prevCallback) prevCallback();
        setupPlayer();
      };
    }
  }

  initContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();

      // Master Gain
      this.masterGainNode = this.ctx.createGain();
      this.masterGainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);

      // Dolby Noise Reduction Biquad High-Shelf Filter
      this.dolbyFilterNode = this.ctx.createBiquadFilter();
      this.dolbyFilterNode.type = 'highshelf';
      this.dolbyFilterNode.frequency.value = 3200;
      this.dolbyFilterNode.gain.value = this.isDolbyOn ? -4.5 : 0;

      // Bass EQ
      this.bassNode = this.ctx.createBiquadFilter();
      this.bassNode.type = 'lowshelf';
      this.bassNode.frequency.value = 250;
      this.bassNode.gain.value = 2.0;

      // Treble EQ
      this.trebleNode = this.ctx.createBiquadFilter();
      this.trebleNode.type = 'highshelf';
      this.trebleNode.frequency.value = 6000;
      this.trebleNode.gain.value = 1.0;

      // Analyser for LCD / Needle VU Meter
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = 64;

      this.dolbyFilterNode.connect(this.bassNode);
      this.bassNode.connect(this.trebleNode);
      this.trebleNode.connect(this.masterGainNode);
      this.masterGainNode.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);

      try {
        if (!this.audioSourceNode) {
          this.audioSourceNode = this.ctx.createMediaElementSource(this.audioElement);
          this.audioSourceNode.connect(this.dolbyFilterNode);
        }
      } catch (e) {}
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // --- VOLUME & CONTROLS ---

  setVolume(val) {
    this.volume = Math.max(0, Math.min(1, val));
    if (this.masterGainNode && this.ctx) {
      this.masterGainNode.gain.setValueAtTime(this.volume, this.ctx.currentTime);
    }
    this.audioElement.volume = this.volume;
    if (this.ytPlayer && this.ytPlayer.setVolume) {
      this.ytPlayer.setVolume(Math.round(this.volume * 100));
    }
    if (this.onVolumeChange) this.onVolumeChange(this.volume);
  }

  setPlaybackRate(rate) {
    this.playbackRate = Math.max(0.75, Math.min(1.25, rate));
    this.audioElement.playbackRate = this.playbackRate;
    if (this.ytPlayer && this.ytPlayer.setPlaybackRate) {
      this.ytPlayer.setPlaybackRate(this.playbackRate);
    }
  }

  setDolbyNR(enabled) {
    this.isDolbyOn = enabled;
    if (this.dolbyFilterNode && this.ctx) {
      this.dolbyFilterNode.gain.setValueAtTime(enabled ? -4.5 : 0, this.ctx.currentTime);
    }
  }

  // --- MECHANICAL SOUNDS ---

  playTapeClick() {
    this.initContext();
    const now = this.ctx.currentTime;
    const osc1 = this.ctx.createOscillator();
    const gain1 = this.ctx.createGain();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(140, now);
    osc1.frequency.exponentialRampToValueAtTime(30, now + 0.08);
    gain1.gain.setValueAtTime(0.6 * this.volume, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    osc1.connect(gain1);
    gain1.connect(this.ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.09);

    const noiseBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.04), this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      output[i] = Math.random() * 2 - 1;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3200;
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.4 * this.volume, now + 0.02);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    noise.start(now + 0.02);
  }

  playStopClick() {
    this.initContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(25, now + 0.06);
    gain.gain.setValueAtTime(0.5 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  }

  playEjectSound() {
    this.initContext();
    const now = this.ctx.currentTime;
    const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.15), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / buffer.length);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.35 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);

    setTimeout(() => {
      this.playStopClick();
    }, 60);
  }

  playRackSlideSound() {
    this.initContext();
    const now = this.ctx.currentTime;
    const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.08), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / buffer.length);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2400;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.2 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);
    noise.start(now);
  }

  playButtonTick() {
    this.initContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.02);
    gain.gain.setValueAtTime(0.15 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  playRecordSound() {
    this.initContext();
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(440, now);
    osc.frequency.setValueAtTime(880, now + 0.1);
    gain.gain.setValueAtTime(0.18 * this.volume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }

  startRewindWhir() {
    this.initContext();
    if (this.rewindOsc) return;

    this.rewindOsc = this.ctx.createOscillator();
    this.rewindGain = this.ctx.createGain();
    this.rewindOsc.type = 'sawtooth';
    this.rewindOsc.frequency.setValueAtTime(220, this.ctx.currentTime);
    this.rewindOsc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.4);

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.value = 1400;

    this.rewindGain.gain.setValueAtTime(0.12 * this.volume, this.ctx.currentTime);
    this.rewindOsc.connect(filter);
    filter.connect(this.rewindGain);
    this.rewindGain.connect(this.ctx.destination);
    this.rewindOsc.start();
  }

  stopRewindWhir() {
    if (this.rewindOsc) {
      try {
        const now = this.ctx.currentTime;
        this.rewindGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        setTimeout(() => {
          if (this.rewindOsc) {
            this.rewindOsc.stop();
            this.rewindOsc.disconnect();
            this.rewindOsc = null;
          }
        }, 120);
      } catch (e) {
        this.rewindOsc = null;
      }
    }
  }

  setTapeHiss(enabled) {
    this.initContext();
    this.isHissOn = enabled;

    if (!enabled) {
      if (this.hissSource) {
        try {
          this.hissGain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.2);
          setTimeout(() => {
            if (this.hissSource) {
              this.hissSource.stop();
              this.hissSource.disconnect();
              this.hissSource = null;
            }
          }, 250);
        } catch (e) {
          this.hissSource = null;
        }
      }
      return;
    }

    if (this.hissSource) return;

    const bufferSize = this.ctx.sampleRate * 5;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 0.15;
    }

    this.hissSource = this.ctx.createBufferSource();
    this.hissSource.buffer = buffer;
    this.hissSource.loop = true;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 3500;
    filter.Q.value = 0.8;

    this.hissGain = this.ctx.createGain();
    this.hissGain.gain.setValueAtTime(0.04 * this.volume, this.ctx.currentTime);

    this.hissSource.connect(filter);
    filter.connect(this.hissGain);
    this.hissGain.connect(this.ctx.destination);
    this.hissSource.start();
  }

  // --- UNIFIED PLAYBACK (YouTube Music, HTML5 Stream, Procedural Synth) ---

  playTrack(track, startTime = 0) {
    this.initContext();
    this.stopAllAudio();
    this.currentTrack = track;
    this.isPlaying = true;
    this.playTapeClick();

    // 1. Check if track is a YouTube Music Track
    const ytId = track.youtubeId || this.extractYouTubeId(track.audioUrl);
    if (ytId) {
      this.playYouTubeTrack(ytId, startTime);
      return;
    }

    // 2. Check if track has a direct audio stream URL (MP3 / WAV)
    if (track.audioUrl && typeof track.audioUrl === 'string' && track.audioUrl.startsWith('http')) {
      this.currentMode = 'html5';
      this.audioElement.src = track.audioUrl;
      this.audioElement.playbackRate = this.playbackRate;
      this.audioElement.currentTime = startTime;

      const playPromise = this.audioElement.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          this.playSynthesizedTrack(track, startTime);
        });
      }
    } else {
      // 3. Fallback to rich procedural retro music synthesis
      this.playSynthesizedTrack(track, startTime);
    }

    if (this.onStateChange) this.onStateChange(true);
  }

  playYouTubeTrack(videoId, startTime = 0) {
    this.currentMode = 'youtube';
    if (!this.ytReady || !this.ytPlayer) {
      this.pendingTrack = this.currentTrack;
      // Start polling YouTube API readiness
      setTimeout(() => {
        if (this.currentTrack && this.currentMode === 'youtube') {
          this.playYouTubeTrack(videoId, startTime);
        }
      }, 500);
      return;
    }

    try {
      this.ytPlayer.loadVideoById({
        videoId: videoId,
        startSeconds: startTime || 0
      });
      this.ytPlayer.playVideo();
      this.ytPlayer.setVolume(Math.round(this.volume * 100));
      this.ytPlayer.setPlaybackRate(this.playbackRate);

      if (this.ytTimeInterval) clearInterval(this.ytTimeInterval);
      this.ytTimeInterval = setInterval(() => {
        if (this.isPlaying && this.ytPlayer && this.ytPlayer.getCurrentTime) {
          const cur = this.ytPlayer.getCurrentTime() || 0;
          const dur = this.ytPlayer.getDuration() || (this.currentTrack?.durationSec || 180);
          if (this.onTimeUpdate) {
            this.onTimeUpdate(cur, dur);
          }
        }
      }, 150);

      if (this.onStateChange) this.onStateChange(true);
    } catch (e) {
      console.warn('YouTube loadVideoById failed:', e);
      this.playSynthesizedTrack(this.currentTrack, startTime);
    }
  }

  extractYouTubeId(url) {
    if (!url || typeof url !== 'string') return null;
    if (url.startsWith('youtube:')) return url.replace('youtube:', '').trim();
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|music\.youtube\.com\/watch\?v=))([\w-]{11})/);
    return match ? match[1] : null;
  }

  pause() {
    this.isPlaying = false;
    this.playStopClick();

    if (this.currentMode === 'youtube' && this.ytPlayer && this.ytPlayer.pauseVideo) {
      try { this.ytPlayer.pauseVideo(); } catch (e) {}
    } else if (this.currentMode === 'html5') {
      this.audioElement.pause();
    } else {
      this.stopSynthesizer();
    }

    if (this.onStateChange) this.onStateChange(false);
  }

  resume() {
    if (!this.currentTrack) return;
    this.initContext();
    this.isPlaying = true;
    this.playTapeClick();

    if (this.currentMode === 'youtube' && this.ytPlayer && this.ytPlayer.playVideo) {
      try { this.ytPlayer.playVideo(); } catch (e) {}
    } else if (this.currentMode === 'html5' && this.audioElement.src) {
      this.audioElement.play().catch(() => {
        this.playSynthesizedTrack(this.currentTrack, this.audioElement.currentTime || 0);
      });
    } else {
      this.playSynthesizedTrack(this.currentTrack, this.synthElapsed);
    }

    if (this.onStateChange) this.onStateChange(true);
  }

  seek(seconds) {
    if (this.currentMode === 'youtube' && this.ytPlayer && this.ytPlayer.seekTo) {
      try { this.ytPlayer.seekTo(seconds, true); } catch (e) {}
    } else if (this.currentMode === 'html5' && this.audioElement.src) {
      this.audioElement.currentTime = Math.max(0, Math.min(seconds, this.audioElement.duration || 999));
    } else if (this.currentMode === 'synth') {
      this.synthElapsed = seconds;
      if (this.onTimeUpdate && this.currentTrack) {
        this.onTimeUpdate(this.synthElapsed, this.currentTrack.durationSec || 180);
      }
    }
  }

  stopAllAudio() {
    this.audioElement.pause();
    if (this.ytPlayer && this.ytPlayer.pauseVideo) {
      try { this.ytPlayer.pauseVideo(); } catch (e) {}
    }
    if (this.ytTimeInterval) {
      clearInterval(this.ytTimeInterval);
      this.ytTimeInterval = null;
    }
    this.stopSynthesizer();
  }

  // --- PROCEDURAL MULTI-INSTRUMENT RETRO MUSIC SYNTHESIZER ---

  playSynthesizedTrack(track, startOffset = 0) {
    this.currentMode = 'synth';
    this.stopSynthesizer();
    this.initContext();

    const duration = track.durationSec || 180;
    this.synthElapsed = startOffset;

    const seedString = `${track.title || ''}_${track.artist || ''}_${track.genre || ''}`;
    let hash = 0;
    for (let i = 0; i < seedString.length; i++) {
      hash = (hash << 5) - hash + seedString.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash) + 1;

    const bpm = 85 + (seed % 45);
    const stepIntervalMs = (60 / bpm / 4) * 1000;
    const rootNotes = [65.41, 73.42, 82.41, 87.31, 98.00, 110.00, 123.47];
    const rootFreq = rootNotes[seed % rootNotes.length];

    const scaleModes = [
      [0, 3, 5, 7, 10, 12, 15, 17],
      [0, 2, 4, 7, 9, 12, 14, 16],
      [0, 2, 3, 5, 7, 8, 10, 12],
      [0, 2, 4, 5, 7, 9, 11, 12],
      [0, 3, 5, 6, 7, 10, 12, 15],
    ];
    const mode = scaleModes[seed % scaleModes.length];

    const progressions = [
      [0, 5, 3, 4],
      [0, 3, 4, 0],
      [0, 4, 5, 3],
      [0, 2, 3, 4],
      [0, 5, 2, 4],
    ];
    const prog = progressions[seed % progressions.length];

    let currentStep = Math.floor((startOffset * 1000) / stepIntervalMs);

    this.synthInterval = setInterval(() => {
      if (!this.isPlaying) return;

      this.synthElapsed += (stepIntervalMs / 1000) * this.playbackRate;
      if (this.onTimeUpdate) {
        this.onTimeUpdate(this.synthElapsed, duration);
      }

      if (this.synthElapsed >= duration) {
        this.stopSynthesizer();
        if (this.onTrackEnd) this.onTrackEnd();
        return;
      }

      const now = this.ctx.currentTime;
      const barStep = currentStep % 16;
      const chordIdx = Math.floor((currentStep % 64) / 16);
      const chordRootDegree = prog[chordIdx];
      const chordRootFreq = rootFreq * Math.pow(2, chordRootDegree / 12);

      // Drum sequencer
      if (barStep === 0 || barStep === 8 || (barStep === 10 && seed % 2 === 0)) {
        this.synthKick(now);
      }
      if (barStep === 4 || barStep === 12) {
        this.synthSnare(now);
      }
      if (barStep % 2 === 0) {
        this.synthHiHat(now, barStep % 4 === 2);
      }

      // Bassline
      if (barStep % 2 === 0 && (barStep !== 6 || seed % 3 !== 0)) {
        const bassFreq = chordRootFreq * (barStep === 14 ? 1.5 : 1);
        this.synthBass(bassFreq, now, stepIntervalMs / 1000 * 1.5);
      }

      // Chord Pad
      if (barStep === 0 || barStep === 8) {
        const chordNotes = [
          chordRootFreq * 2,
          chordRootFreq * 2 * Math.pow(2, (mode[2] || 4) / 12),
          chordRootFreq * 2 * Math.pow(2, (mode[4] || 7) / 12)
        ];
        this.synthChord(chordNotes, now, (stepIntervalMs / 1000) * 7.5);
      }

      // Lead Melody
      const shouldPlayLead = (barStep % 2 === 1 && (seed + currentStep) % 3 !== 0) || barStep === 0 || barStep === 6;
      if (shouldPlayLead) {
        const noteOffset = mode[(seed + currentStep * 3) % mode.length];
        const leadFreq = rootFreq * 4 * Math.pow(2, noteOffset / 12);
        this.synthLead(leadFreq, now, (stepIntervalMs / 1000) * 1.8);
      }

      currentStep++;
    }, stepIntervalMs / this.playbackRate);
  }

  synthKick(time) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.frequency.setValueAtTime(130, time);
    osc.frequency.exponentialRampToValueAtTime(38, time + 0.09);
    gain.gain.setValueAtTime(0.4 * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    osc.connect(gain);
    gain.connect(this.masterGainNode || this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.13);
  }

  synthSnare(time) {
    if (!this.ctx) return;
    const noiseBuffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * 0.12), this.ctx.sampleRate);
    const data = noiseBuffer.getChannelData(0);
    for (let i = 0; i < noiseBuffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / noiseBuffer.length);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = noiseBuffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 1000;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.25 * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + 0.12);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGainNode || this.ctx.destination);
    noise.start(time);

    const osc = this.ctx.createOscillator();
    const oscGain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(180, time);
    osc.frequency.exponentialRampToValueAtTime(80, time + 0.06);
    oscGain.gain.setValueAtTime(0.2 * this.volume, time);
    oscGain.gain.exponentialRampToValueAtTime(0.001, time + 0.06);
    osc.connect(oscGain);
    oscGain.connect(this.masterGainNode || this.ctx.destination);
    osc.start(time);
    osc.stop(time + 0.07);
  }

  synthHiHat(time, isOpen = false) {
    if (!this.ctx) return;
    const dur = isOpen ? 0.08 : 0.03;
    const buffer = this.ctx.createBuffer(1, Math.floor(this.ctx.sampleRate * dur), this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < buffer.length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / buffer.length);
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 7500;
    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime((isOpen ? 0.12 : 0.07) * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGainNode || this.ctx.destination);
    noise.start(time);
  }

  synthBass(freq, time, dur) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const filter = this.ctx.createBiquadFilter();
    const gain = this.ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(freq, time);
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(450, time);
    filter.frequency.exponentialRampToValueAtTime(120, time + dur);
    gain.gain.setValueAtTime(0.22 * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(this.masterGainNode || this.ctx.destination);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  synthChord(notes, time, dur) {
    if (!this.ctx) return;
    notes.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      filter.type = 'lowpass';
      filter.frequency.value = 1200;
      gain.gain.setValueAtTime(0.001, time);
      gain.gain.linearRampToValueAtTime(0.06 * this.volume, time + 0.15);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGainNode || this.ctx.destination);
      osc.start(time);
      osc.stop(time + dur + 0.05);
    });
  }

  synthLead(freq, time, dur) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, time);
    osc.frequency.setValueAtTime(freq * 1.008, time + dur * 0.4);
    osc.frequency.setValueAtTime(freq * 0.995, time + dur * 0.7);
    gain.gain.setValueAtTime(0.09 * this.volume, time);
    gain.gain.exponentialRampToValueAtTime(0.0001, time + dur);
    osc.connect(gain);
    gain.connect(this.masterGainNode || this.ctx.destination);
    osc.start(time);
    osc.stop(time + dur + 0.02);
  }

  stopSynthesizer() {
    if (this.synthInterval) {
      clearInterval(this.synthInterval);
      this.synthInterval = null;
    }
  }

  // --- MICROPHONE VOICE MEMO RECORDING ---

  async startVoiceRecording() {
    try {
      this.recordedChunks = [];
      this.recordingStream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(this.recordingStream);
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          this.recordedChunks.push(e.data);
        }
      };
      this.mediaRecorder.start();
      return true;
    } catch (err) {
      console.error('Microphone access failed:', err);
      throw err;
    }
  }

  stopVoiceRecording() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder) {
        reject(new Error('No recording in progress'));
        return;
      }
      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
        const audioUrl = URL.createObjectURL(blob);
        if (this.recordingStream) {
          this.recordingStream.getTracks().forEach(track => track.stop());
        }
        resolve({ blob, audioUrl });
      };
      this.mediaRecorder.stop();
    });
  }

  // --- VU METER LEVELS ---

  getVULevels() {
    if (this.currentMode === 'youtube' && this.isPlaying) {
      // Dynamic simulated peak VU meter matching tempo & volume for YouTube player
      const t = Date.now() / 150;
      const l = (Math.sin(t * 1.2) * 0.35 + 0.55) * this.volume;
      const m = (Math.cos(t * 0.9) * 0.3 + 0.6) * this.volume;
      const h = (Math.sin(t * 2.1) * 0.3 + 0.5) * this.volume;
      return [Math.max(0.1, l), Math.max(0.1, m), Math.max(0.1, h)];
    }

    if (!this.analyser) {
      return this.isPlaying
        ? [Math.random() * 0.75 + 0.2, Math.random() * 0.65 + 0.25, Math.random() * 0.85 + 0.15]
        : [0, 0, 0];
    }
    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);
    const low = (dataArray[1] || 0) / 255;
    const mid = (dataArray[6] || 0) / 255;
    const high = (dataArray[14] || 0) / 255;
    return this.isPlaying
      ? [Math.max(low, 0.08) * (this.volume || 1), Math.max(mid, 0.08) * (this.volume || 1), Math.max(high, 0.08) * (this.volume || 1)]
      : [0, 0, 0];
  }
}

export const audioEngine = new AudioEngine();
