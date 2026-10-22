/**
 * Pranshi & Akash Wedding Invitation (#APforever)
 * Canvas Petals & Celebratory Confetti Engine
 */

(function () {
  const canvas = document.getElementById('petal-canvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const ambientPetalCount = 26;
  const petals = [];
  const celebrationPetals = [];

  const petalColors = [
    'rgba(240, 192, 195, 0.65)', // Blush rose
    'rgba(235, 175, 180, 0.55)', // Soft pink
    'rgba(142, 169, 146, 0.50)', // Sage eucalyptus
    'rgba(223, 190, 125, 0.55)', // Gold shimmer
    'rgba(255, 235, 238, 0.70)'  // Warm cream petal
  ];

  const softBubbleColors = [
    'rgba(240, 206, 210, 0.40)', // Soft rose mist
    'rgba(235, 212, 165, 0.42)', // Soft champagne gold
    'rgba(175, 200, 180, 0.32)', // Translucent sage mist
    'rgba(255, 246, 235, 0.48)', // Warm pearl glow
    'rgba(245, 225, 215, 0.38)'  // Soft peach blush
  ];

  function createPetal(isBurst = false) {
    return {
      x: isBurst ? width * 0.5 + (Math.random() * 60 - 30) : Math.random() * width,
      y: isBurst ? height * 0.58 : Math.random() * height - height,
      r: isBurst ? Math.random() * 8 + 5 : Math.random() * 9 + 6,
      d: Math.random() * 30,
      color: isBurst ? softBubbleColors[Math.floor(Math.random() * softBubbleColors.length)] : petalColors[Math.floor(Math.random() * petalColors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.04,
      tiltAngle: 0,
      vx: isBurst ? (Math.random() - 0.5) * 5.2 : 0,
      vy: isBurst ? -Math.random() * 5.5 - 3.6 : 0,
      alpha: isBurst ? 0.70 : 1,
      isBurst: isBurst
    };
  }

  // Initialize ambient drifting petals
  for (let i = 0; i < ambientPetalCount; i++) {
    petals.push(createPetal(false));
  }

  // Expose global celebration shower function for "Shower Blessings"
  window.showerBlessingsPetals = function () {
    const burstCount = 30; // Soft ethereal count for silky-smooth performance
    for (let i = 0; i < burstCount; i++) {
      celebrationPetals.push(createPetal(true));
    }
  };

  function updateAndDraw() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw ambient floating petals
    for (let i = 0; i < ambientPetalCount; i++) {
      const p = petals[i];
      ctx.beginPath();
      ctx.fillStyle = p.color;

      ctx.moveTo(p.x + p.tilt + p.r / 4, p.y);
      ctx.quadraticCurveTo(p.x + p.tilt, p.y + p.r, p.x + p.tilt - p.r / 4, p.y + p.r * 1.5);
      ctx.quadraticCurveTo(p.x + p.tilt + p.r / 2, p.y + p.r * 2, p.x + p.tilt + p.r / 4, p.y);
      ctx.fill();

      p.tiltAngle += p.tiltAngleIncremental;
      p.y += (Math.cos(p.d) + 1.2 + p.r / 4) * 0.55;
      p.x += Math.sin(p.d) * 0.75;
      p.tilt = Math.sin(p.tiltAngle - i / 3) * 12;

      if (p.y > height + 20) {
        petals[i] = createPetal(false);
      }
    }

    // 2. Draw soft ethereal celebratory floating bubbles / orbs
    for (let i = celebrationPetals.length - 1; i >= 0; i--) {
      const cp = celebrationPetals[i];
      ctx.save();
      ctx.globalAlpha = Math.max(0, cp.alpha);
      
      // Soft radial glow gradient for a gentle, dreamy bubble appearance
      const grad = ctx.createRadialGradient(cp.x, cp.y, cp.r * 0.15, cp.x, cp.y, cp.r);
      grad.addColorStop(0, cp.color);
      grad.addColorStop(0.7, cp.color);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(cp.x, cp.y, cp.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      cp.x += cp.vx;
      cp.y += cp.vy;
      cp.vy += 0.20; // Lively natural gravity matching website tempo
      cp.vx *= 0.982; // Gentle air resistance
      cp.alpha -= 0.015; // Smooth lively fade out (~1.1s duration)

      if (cp.alpha <= 0 || cp.y > height + 40) {
        celebrationPetals.splice(i, 1);
      }
    }

    requestAnimationFrame(updateAndDraw);
  }

  // Interactive touch reaction: petals flutter on touch
  window.addEventListener('touchmove', (e) => {
    if (e.touches && e.touches[0]) {
      const touchX = e.touches[0].clientX;
      const touchY = e.touches[0].clientY;
      for (let i = 0; i < petals.length; i++) {
        const dx = petals[i].x - touchX;
        const dy = petals[i].y - touchY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 80) {
          petals[i].x += dx * 0.2;
          petals[i].y += dy * 0.2;
        }
      }
    }
  }, { passive: true });

  updateAndDraw();
})();
