/**
 * Akash & Pranshi Wedding (#APForever)
 * Main App Controller & Ambient Acoustic Melodies
 */

(function () {
  const audioPill = document.getElementById('audio-pill');
  let audioContext = null;
  let isPlaying = false;
  let melodyInterval = null;

  // Indian classical pentatonic scale frequencies (Raga Bhupali: Sa, Re, Ga, Pa, Dha)
  const notes = [
    261.63, // C4 (Sa)
    293.66, // D4 (Re)
    329.63, // E4 (Ga)
    392.00, // G4 (Pa)
    440.00, // A4 (Dha)
    523.25, // C5 (Taar Sa)
    587.33  // D5 (Taar Re)
  ];

  function initAudioContext() {
    if (!audioContext) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioContext = new AudioCtx();
      }
    }
  }

  // Play a soft, breathy flute note
  function playFluteNote(freq, duration = 1.6) {
    if (!audioContext || audioContext.state === 'suspended') return;

    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    const filter = audioContext.createBiquadFilter();

    // Warm, rounded flute tone
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, audioContext.currentTime);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(850, audioContext.currentTime);

    // Soft, natural envelope attack and gentle decay
    gain.gain.setValueAtTime(0.001, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.08, audioContext.currentTime + 0.35);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioContext.destination);

    osc.start();
    osc.stop(audioContext.currentTime + duration + 0.05);
  }

  function startMelody() {
    if (melodyInterval) clearInterval(melodyInterval);

    let step = 0;
    const melodySeq = [0, 1, 2, 4, 3, 2, 1, 0, 2, 4, 5, 4, 2, 0];

    // Play immediate first note
    playFluteNote(notes[melodySeq[0]]);

    melodyInterval = setInterval(() => {
      step = (step + 1) % melodySeq.length;
      playFluteNote(notes[melodySeq[step]], 1.8);
    }, 1200);
  }

  function stopMelody() {
    if (melodyInterval) {
      clearInterval(melodyInterval);
      melodyInterval = null;
    }
  }

  window.startAmbientMusic = function () {
    initAudioContext();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }
    isPlaying = true;
    if (audioPill) audioPill.classList.add('playing');
    startMelody();
  };

  function toggleAudio() {
    initAudioContext();
    if (audioContext && audioContext.state === 'suspended') {
      audioContext.resume();
    }

    if (isPlaying) {
      stopMelody();
      isPlaying = false;
      if (audioPill) audioPill.classList.remove('playing');
    } else {
      isPlaying = true;
      if (audioPill) audioPill.classList.add('playing');
      startMelody();
    }
  }

  if (audioPill) {
    audioPill.addEventListener('click', toggleAudio);
  }
})();
