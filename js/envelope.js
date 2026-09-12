/**
 * Akash & Pranshi Wedding (#APForever)
 * 3D Wax Seal Unsealing & Card Emergence Orchestration
 */

(function () {
  const sealWrapper = document.getElementById('wax-seal-wrapper');
  const envelope = document.getElementById('main-envelope');
  const envelopeScreen = document.getElementById('envelope-screen');
  const cardView = document.getElementById('wedding-card-view');

  // Web Audio Synthesizer for tactile wax crack & chime sound
  function playUnsealSound() {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      // Sound 1: Crisp click/crack
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(450, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.15);
      gain1.gain.setValueAtTime(0.4, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.16);

      // Sound 2: Auspicious celebratory chime
      setTimeout(() => {
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(659.25, ctx.currentTime); // E5 note
        osc2.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.4); // A5 note
        gain2.gain.setValueAtTime(0.3, ctx.currentTime);
        gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.8);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start();
        osc2.stop(ctx.currentTime + 0.85);
      }, 100);
    } catch (e) {
      // Audio context may be restricted by browser policy
    }
  }

  function openEnvelope() {
    if (!sealWrapper || sealWrapper.classList.contains('cracked')) return;

    // 1. Play tactile acoustic feedback
    playUnsealSound();

    // 2. Animate wax seal cracking
    sealWrapper.classList.add('cracked');

    // 3. Unfold envelope flaps & slide inner card
    setTimeout(() => {
      envelope.classList.add('unsealed');
      if (window.showerBlessingsPetals) {
        window.showerBlessingsPetals();
      }
    }, 300);

    // 4. Smooth transition into full mobile card view
    setTimeout(() => {
      envelopeScreen.classList.add('opened');
      cardView.classList.add('active');

      // Scroll smoothly to top of the card
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Start ambient music if app music controller exists
      if (window.startAmbientMusic) {
        window.startAmbientMusic();
      }
    }, 1500);
  }

  if (sealWrapper) {
    sealWrapper.addEventListener('click', openEnvelope);
    sealWrapper.addEventListener('touchend', (e) => {
      e.preventDefault();
      openEnvelope();
    });
  }
})();
