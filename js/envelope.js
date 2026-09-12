/**
 * Akash & Pranshi Wedding (#APForever)
 * 3D Wax Seal Unsealing & Card Emergence Orchestration
 */

(function () {
  const sealWrapper = document.getElementById('wax-seal-wrapper');
  const envelope = document.getElementById('main-envelope');
  const envelopeScreen = document.getElementById('envelope-screen');
  const cardView = document.getElementById('wedding-card-view');

  // Crisp realistic paper unseal sound (1104.mp3)
  const unsealAudio = new Audio('./assets/audio/unseal.mp3');
  unsealAudio.preload = 'auto';

  function playUnsealSound() {
    try {
      unsealAudio.currentTime = 0;
      const playPromise = unsealAudio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    } catch (e) {
      // Audio autoplay may be restricted
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
