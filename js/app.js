/**
 * Akash & Pranshi Wedding (#APForever)
 * Melodious Indian Wedding Ambient Audio (Tanpura Drone + Celebratory Shehnai/Bansuri Melody)
 * Supports custom MP3 playback with automatic acoustic synthesis fallback
 */

(function () {
  const audioPill = document.getElementById('audio-pill');
  let audioContext = null;
  let isPlaying = false;
  let melodyTimer = null;
  let droneNodes = [];
  // Custom MP3 Audio support with automatic synthesis fallback
  let htmlAudio = null;
  let useSynthFallback = false;

  function setupHtmlAudio() {
    htmlAudio = document.getElementById('wedding-audio');
    if (!htmlAudio) {
      htmlAudio = new Audio('./assets/audio/wedding_music.mp3');
      htmlAudio.loop = true;
    }
    htmlAudio.volume = 0.65;
  }
  setupHtmlAudio();

  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
  }

  // =========================================================================
  // Traditional Indian Tanpura Drone (Sa - Pa - Sa Acoustic Resonator)
  // Base root: D3 (146.83 Hz), Pa: A3 (220.00 Hz), Sa2: D4 (293.66 Hz)
  // =========================================================================
  function startTanpuraDrone() {
    if (!audioContext || droneNodes.length > 0) return;

    const droneFreqs = [146.83, 220.0, 293.66, 147.2]; // Slight detune for natural acoustic shimmer
    const masterGain = audioContext.createGain();
    masterGain.gain.setValueAtTime(0.001, audioContext.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.045, audioContext.currentTime + 2.5);

    droneFreqs.forEach((freq, idx) => {
      const osc = audioContext.createOscillator();
      const filter = audioContext.createBiquadFilter();
      const pan = audioContext.createStereoPanner ? audioContext.createStereoPanner() : null;

      osc.type = idx % 2 === 0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(freq, audioContext.currentTime);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320 + idx * 80, audioContext.currentTime);

      if (pan) {
        pan.pan.setValueAtTime((idx % 2 === 0 ? -0.4 : 0.4), audioContext.currentTime);
        osc.connect(filter);
        filter.connect(pan);
        pan.connect(masterGain);
      } else {
        osc.connect(filter);
        filter.connect(masterGain);
      }

      osc.start();
      droneNodes.push(osc);
    });

    masterGain.connect(audioContext.destination);
    droneNodes.push(masterGain);
  }

  function stopTanpuraDrone() {
    if (droneNodes.length > 0) {
      droneNodes.forEach((node) => {
        try {
          if (node.stop) node.stop();
          if (node.disconnect) node.disconnect();
        } catch (e) {}
      });
      droneNodes = [];
    }
  }

  // =========================================================================
  // Melodious Indian Wedding Shehnai / Bansuri Phrasing (Raag Yaman / Bilawal)
  // Natural legato phrasing, pitch vibrato (meend), and warm resonance
  // =========================================================================
  const yamanNotes = {
    Sa: 293.66,  // D4
    Re: 329.63,  // E4
    Ga: 369.99,  // F#4
    Ma: 415.30,  // G#4 (Teevra Ma)
    Pa: 440.00,  // A4
    Dha: 493.88, // B4
    Ni: 554.37,  // C#5
    Sa2: 587.33  // D5
  };

  // Celebratory wedding bandish phrase sequence (durations in seconds)
  const weddingMelody = [
    { freq: yamanNotes.Sa, dur: 1.2 },
    { freq: yamanNotes.Ga, dur: 1.4 },
    { freq: yamanNotes.Re, dur: 0.9 },
    { freq: yamanNotes.Ga, dur: 1.5 },
    { freq: yamanNotes.Pa, dur: 2.2 }, // Long soulful breath
    { freq: yamanNotes.Dha, dur: 0.9 },
    { freq: yamanNotes.Ni, dur: 1.1 },
    { freq: yamanNotes.Sa2, dur: 2.6 }, // Celebratory peak note!
    { freq: yamanNotes.Ni, dur: 0.8 },
    { freq: yamanNotes.Dha, dur: 1.0 },
    { freq: yamanNotes.Pa, dur: 1.8 },
    { freq: yamanNotes.Ma, dur: 0.9 },
    { freq: yamanNotes.Ga, dur: 1.3 },
    { freq: yamanNotes.Re, dur: 1.1 },
    { freq: yamanNotes.Sa, dur: 2.5 }
  ];

  function playShehnaiNote(note, prevFreq = null) {
    if (!audioContext || audioContext.state === 'suspended') return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    // Natural Vibrato LFO for traditional Indian vocal/instrument meend
    const vibratoLfo = audioContext.createOscillator();
    const vibratoGain = audioContext.createGain();
    vibratoLfo.frequency.setValueAtTime(5.2, audioContext.currentTime); // 5.2 Hz gentle vibrato
    vibratoGain.gain.setValueAtTime(4.5, audioContext.currentTime); // Subtle pitch bend
    vibratoLfo.connect(osc.frequency);
    vibratoLfo.start(audioContext.currentTime + 0.2); // Vibrato blossoms after onset

    // Rich dual-harmonic shehnai/flute timbre
    osc.type = 'triangle';
    if (prevFreq) {
      // Meend (glide) between notes
      osc.frequency.setValueAtTime(prevFreq, audioContext.currentTime);
      osc.frequency.exponentialRampToValueAtTime(note.freq, audioContext.currentTime + 0.25);
    } else {
      osc.frequency.setValueAtTime(note.freq, audioContext.currentTime);
    }

    // Warm resonant acoustic filter
    filter.type = 'bandpass';
    filter.frequency.setValueAtTime(note.freq * 1.5, audioContext.currentTime);
    filter.Q.setValueAtTime(2.2, audioContext.currentTime);

    // Expressive swell envelope
    const now = audioContext.currentTime;
    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.065, now + 0.35); // Soft natural swelling attack
    gain.gain.setValueAtTime(0.065, now + note.dur - 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, now + note.dur); // Lingering gentle decay

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc.start(now);
    osc.stop(now + note.dur + 0.1);
    vibratoLfo.stop(now + note.dur + 0.1);
  }

  function startIndianMelody() {
    let index = 0;
    let prevFreq = null;

    function nextNote() {
      if (!isPlaying) return;
      const current = weddingMelody[index];
      playShehnaiNote(current, prevFreq);
      prevFreq = current.freq;

      melodyTimer = setTimeout(() => {
        index = (index + 1) % weddingMelody.length;
        if (index === 0) prevFreq = null;
        nextNote();
      }, current.dur * 950);
    }

    nextNote();
  }

  function stopIndianMelody() {
    if (melodyTimer) {
      clearTimeout(melodyTimer);
      melodyTimer = null;
    }
  }

  // =========================================================================
  // Public Controls & Lifecycle (Audio Pill, Unseal Trigger & Visibility)
  // =========================================================================
  let wasPlayingBeforeHidden = false;

  function updatePillUI(playing) {
    if (!audioPill) return;
    if (playing) {
      audioPill.className = 'audio-control-pill playing';
      audioPill.title = 'Click to Mute Music';
      audioPill.innerHTML = `
        <div class="music-bars">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <span class="audio-label">♫ Music</span>
      `;
    } else {
      audioPill.className = 'audio-control-pill muted';
      audioPill.title = 'Click to Play Music';
      audioPill.innerHTML = `
        <span class="audio-icon-muted">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#b54a55" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
        </span>
        <span class="audio-label">Muted</span>
      `;
    }
  }

  function startSynthesizerMusic() {
    initAudioContext();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    startTanpuraDrone();
    startIndianMelody();
  }

  window.startAmbientMusic = function () {
    if (isPlaying) return;
    isPlaying = true;
    updatePillUI(true);

    if (!htmlAudio) {
      setupHtmlAudio();
    }

    if (htmlAudio && !useSynthFallback) {
      const playPromise = htmlAudio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          // Custom MP3 playing
        }).catch((err) => {
          console.warn('MP3 playback failed or blocked, falling back to synthesizer:', err);
          useSynthFallback = true;
          startSynthesizerMusic();
        });
      }
    } else {
      startSynthesizerMusic();
    }
  };

  function pauseAudio() {
    isPlaying = false;
    updatePillUI(false);

    if (htmlAudio) {
      try {
        htmlAudio.pause();
      } catch (e) {}
    }

    stopTanpuraDrone();
    stopIndianMelody();
    if (audioContext && audioContext.state === 'running') {
      audioContext.suspend().catch(() => {});
    }
  }

  function toggleAudio() {
    if (isPlaying) {
      wasPlayingBeforeHidden = false; // User explicitly muted
      pauseAudio();
    } else {
      window.startAmbientMusic();
    }
  }

  if (audioPill) {
    audioPill.addEventListener('click', toggleAudio);
  }

  // =========================================================================
  // Auto-pause when user minimizes browser, switches tabs, or locks phone screen
  // =========================================================================
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      // Tab minimized or moved to background
      if (isPlaying) {
        wasPlayingBeforeHidden = true;
        pauseAudio();
      }
    } else {
      // User returned to tab
      if (wasPlayingBeforeHidden) {
        wasPlayingBeforeHidden = false;
        window.startAmbientMusic();
      }
    }
  });

  // Mobile App Switch / Screen Lock handling
  window.addEventListener('pagehide', () => {
    if (isPlaying) {
      wasPlayingBeforeHidden = true;
      pauseAudio();
    }
  });

  window.addEventListener('blur', () => {
    // Check if tab is actually hidden before pausing on blur
    if (document.hidden && isPlaying) {
      wasPlayingBeforeHidden = true;
      pauseAudio();
    }
  });
})();

