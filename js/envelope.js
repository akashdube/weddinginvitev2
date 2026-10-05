/**
 * Pranshi & Akash Wedding (#APforever)
 * Style 3: Royal Gatefold Palace Doors & Full-Screen Immersion
 * Orchestrated with GSAP 60fps Animation Engine
 */

(function () {
  const sealWrapper = document.getElementById('wax-seal-wrapper');
  const sealStamp = document.getElementById('wax-seal-stamp');
  const sealPrompt = document.getElementById('seal-prompt');
  const gateLeft = document.getElementById('gatefold-left');
  const gateRight = document.getElementById('gatefold-right');
  const ribbonBand = document.getElementById('envelope-ribbon-band');
  const sealWings = document.getElementById('seal-wings');
  const innerCard = document.getElementById('envelope-card');
  const envelope = document.getElementById('main-envelope');
  const envelopeScreen = document.getElementById('envelope-screen');
  const cardView = document.getElementById('wedding-card-view');

  // Crisp realistic paper unseal sound
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

  let isUnsealed = false;

  function openEnvelope() {
    if (isUnsealed) return;
    isUnsealed = true;

    // Immediately kill CSS animation and hide prompt so it never floats in front of card
    if (sealPrompt) {
      sealPrompt.style.animation = 'none';
      sealPrompt.style.display = 'none';
      sealPrompt.classList.add('hide-prompt');
    }
    if (sealWrapper) {
      sealWrapper.classList.add('unsealed', 'cracked', 'opening');
      sealWrapper.style.pointerEvents = 'none';
    }

    // 1. Play tactile acoustic feedback
    playUnsealSound();

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();

      tl.to(sealStamp, {
        scale: 1.15,
        rotation: 6,
        duration: 0.12,
        ease: 'power1.out'
      }, 0);

      tl.to(sealStamp, {
        scale: 0,
        rotation: -14,
        opacity: 0,
        duration: 0.32,
        ease: 'back.in(1.8)'
      }, 0.12);

      // Ribbon and botanical wings fade as seal unlocks
      tl.to([ribbonBand, sealWings], {
        opacity: 0,
        scaleY: 0.8,
        duration: 0.35,
        ease: 'power2.in'
      }, 0.15);
      tl.set([sealWrapper, ribbonBand, sealWings], { display: 'none' }, 0.45);

      // Stage 2: Royal Gatefold Palace Doors swing open in 3D (0.32s - 1.45s)
      tl.to(gateLeft, {
        rotateY: -125,
        duration: 1.15,
        ease: 'power2.inOut',
        transformOrigin: 'left center'
      }, 0.32);

      tl.to(gateRight, {
        rotateY: 125,
        duration: 1.15,
        ease: 'power2.inOut',
        transformOrigin: 'right center'
      }, 0.32);

      // Stage 3: Celebration Petals shower down as gates swing open
      tl.call(() => {
        if (window.showerBlessingsPetals) {
          window.showerBlessingsPetals();
        }
      }, null, 0.55);

      // Inner card floats forward from within the royal chamber
      tl.to(innerCard, {
        scale: 1.05,
        duration: 1.0,
        ease: 'power2.out',
        boxShadow: '0 25px 60px rgba(117, 82, 27, 0.25)'
      }, 0.55);

      // Stage 4: Settle & Admire (1.45s - 1.85s)
      // Guests see the golden Lord Ganesha crest, shloka, #APforever, and couple names

      // Stage 5: Card "Falls into the screen filling it" (1.85s - 2.85s)
      // Prepare main wedding card view at top of viewport
      tl.call(() => {
        if (cardView) {
          cardView.style.display = 'block';
          cardView.style.opacity = '0';
          cardView.style.transform = 'translateY(28px) scale(0.96)';
          cardView.style.pointerEvents = 'none';
        }
        window.scrollTo(0, 0);
      }, null, 1.8);

      // Inner card zooms forward, expanding into full view
      tl.to(innerCard, {
        scale: 1.8,
        y: 20,
        opacity: 0,
        duration: 0.85,
        ease: 'power2.inOut'
      }, 1.85);

      // Envelope body, doors, and background header softly fade out
      tl.to([envelope, '.envelope-intro-header', '.screen-floral-corner'], {
        opacity: 0,
        scale: 0.9,
        y: 20,
        duration: 0.7,
        ease: 'power2.in'
      }, 1.85);

      // The full wedding card view blooms into the screen filling it
      tl.to(cardView, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.85,
        ease: 'power2.out',
        onStart: () => {
          if (window.startAmbientMusic) {
            window.startAmbientMusic();
          }
        }
      }, 1.95);

      // Clean cleanup
      tl.call(() => {
        if (envelopeScreen) {
          envelopeScreen.style.display = 'none';
        }
        if (cardView) {
          cardView.classList.add('active');
          cardView.style.pointerEvents = 'auto';
          cardView.style.transform = '';
        }
        window.scrollTo(0, 0);
      }, null, 2.9);

    } else {
      // Direct Fallback if GSAP is unavailable
      if (sealWrapper) sealWrapper.style.display = 'none';
      if (gateLeft) gateLeft.style.transform = 'rotateY(-125deg)';
      if (gateRight) gateRight.style.transform = 'rotateY(125deg)';
      if (window.showerBlessingsPetals) window.showerBlessingsPetals();
      setTimeout(() => {
        if (envelopeScreen) envelopeScreen.style.display = 'none';
        if (cardView) cardView.classList.add('active');
        if (window.startAmbientMusic) window.startAmbientMusic();
        window.scrollTo(0, 0);
      }, 1800);
    }
  }

  if (sealWrapper) {
    sealWrapper.addEventListener('click', openEnvelope);
    sealWrapper.addEventListener('touchend', (e) => {
      e.preventDefault();
      openEnvelope();
    });
  }
})();
