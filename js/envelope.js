/**
 * Akash & Pranshi Wedding (#APforever)
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

    // 1. Play tactile acoustic feedback & prime audio context in user gesture
    playUnsealSound();
    if (window.prepareAudioUnlock) {
      window.prepareAudioUnlock();
    }

    if (typeof gsap !== 'undefined') {
      const tl = gsap.timeline();

      // Stage 1: Wax seal softens and dissolves with elegant ease (0 - 0.38s)
      tl.to(sealStamp, {
        scale: 1.08,
        rotation: 3,
        duration: 0.16,
        ease: 'power2.out',
        force3D: true
      }, 0);

      tl.to(sealStamp, {
        scale: 0.75,
        rotation: -8,
        opacity: 0,
        duration: 0.28,
        ease: 'power2.inOut',
        force3D: true
      }, 0.12);

      // Ribbon and botanical wings dissolve softly like mist
      tl.to([ribbonBand, sealWings], {
        opacity: 0,
        scale: 0.96,
        duration: 0.32,
        ease: 'power1.out',
        force3D: true
      }, 0.10);
      tl.set([sealWrapper, ribbonBand, sealWings], { visibility: 'hidden', pointerEvents: 'none' }, 0.42);

      // Reveal inner card as doors begin swinging gracefully
      tl.set(innerCard, { visibility: 'visible', pointerEvents: 'auto' }, 0.18);
      tl.fromTo(innerCard,
        { opacity: 0, scale: 0.98 },
        { opacity: 1, scale: 1.02, y: 0, duration: 0.85, ease: 'power2.out', boxShadow: '0 24px 55px rgba(117, 82, 27, 0.28)', force3D: true },
        0.18
      );

      // Stage 2: Royal Gatefold Palace Doors swing open in silky 3D (0.18s - 1.15s)
      tl.to(gateLeft, {
        rotateY: -128,
        duration: 0.95,
        ease: 'power2.out',
        transformOrigin: '0% 50% 0px',
        force3D: true
      }, 0.18);

      tl.to(gateRight, {
        rotateY: 128,
        duration: 0.95,
        ease: 'power2.out',
        transformOrigin: '100% 50% 0px',
        force3D: true
      }, 0.18);

      // Music starts with exact 0.5s delay as the royal doors swing open
      tl.call(() => {
        if (window.startAmbientMusic) {
          window.startAmbientMusic();
        }
      }, null, 0.50);

      // Stage 3: Celebration Petals drift gracefully
      tl.call(() => {
        if (window.showerBlessingsPetals) {
          window.showerBlessingsPetals();
        }
      }, null, 0.30);

      // Main envelope pullback zoom out smoothly
      tl.to('#main-envelope', {
        scale: 0.94,
        duration: 0.90,
        ease: 'power2.out',
        force3D: true
      }, 0.18);

      // Natural settle on the hands cutout within the frame
      const handsCutout = document.getElementById('divine-hands-cutout');
      if (handsCutout) {
        tl.fromTo(handsCutout,
          { scale: 1.04, opacity: 0.85 },
          { scale: 1.0, opacity: 1, duration: 0.80, ease: 'power2.out', force3D: true },
          0.22
        );
      }

      // AP logo and couple names softly glide into view
      tl.fromTo(['#active-divine-card .framed-logo', '#active-divine-card .framed-footer'],
        { opacity: 0, y: 8 },
        { opacity: 1, y: 0, duration: 0.65, ease: 'power2.out' },
        0.38
      );

      // Stage 4: Settle & Admire (1.15s - 2.25s)
      // Guests admire the framed Shiva-Parvati Vivah hands, AP monogram, and couple names

      // Stage 5: Silky Cross-Fade Transition to Full Wedding Card View (2.25s - 3.05s)
      tl.call(() => {
        if (cardView) {
          cardView.style.display = 'block';
          cardView.style.opacity = '0';
          cardView.style.transform = 'translateY(18px) scale(0.985)';
          cardView.style.pointerEvents = 'none';
        }
      }, null, 2.20);

      // Envelope body, doors, and background header softly dissolve upward together
      tl.to([envelope, innerCard, '.envelope-intro-header', '.screen-floral-corner'], {
        opacity: 0,
        scale: 0.95,
        y: -12,
        duration: 0.72,
        ease: 'power2.inOut',
        force3D: true
      }, 2.25);

      // The full wedding card view smoothly blooms into view
      tl.to(cardView, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.80,
        ease: 'power2.out',
        force3D: true
      }, 2.30);

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
      }, null, 3.05);

    } else {
      // Direct Fallback if GSAP is unavailable (with 0.5s music delay)
      if (sealWrapper) sealWrapper.style.display = 'none';
      if (gateLeft) gateLeft.style.transform = 'rotateY(-125deg)';
      if (gateRight) gateRight.style.transform = 'rotateY(125deg)';
      if (window.showerBlessingsPetals) window.showerBlessingsPetals();
      setTimeout(() => {
        if (window.startAmbientMusic) window.startAmbientMusic();
      }, 500);
      setTimeout(() => {
        if (envelopeScreen) envelopeScreen.style.display = 'none';
        if (cardView) cardView.classList.add('active');
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
