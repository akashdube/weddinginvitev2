/**
 * Akash & Pranshi Wedding Invitation (#APForever)
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

  function createPetal(isBurst = false) {
    return {
      x: isBurst ? width * 0.5 + (Math.random() * 80 - 40) : Math.random() * width,
      y: isBurst ? height * 0.6 : Math.random() * height - height,
      r: Math.random() * 9 + 6,
      d: Math.random() * 30,
      color: petalColors[Math.floor(Math.random() * petalColors.length)],
      tilt: Math.floor(Math.random() * 10) - 10,
      tiltAngleIncremental: Math.random() * 0.07 + 0.04,
      tiltAngle: 0,
      vx: isBurst ? (Math.random() - 0.5) * 12 : 0,
      vy: isBurst ? -Math.random() * 15 - 5 : 0,
      alpha: 1,
      isBurst: isBurst
    };
  }

  // Initialize ambient drifting petals
  for (let i = 0; i < ambientPetalCount; i++) {
    petals.push(createPetal(false));
  }

  // Expose global celebration shower function for "Shower Blessings"
  window.showerBlessingsPetals = function () {
    const burstCount = 65;
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

    // 2. Draw celebratory shower burst petals
    for (let i = celebrationPetals.length - 1; i >= 0; i--) {
      const cp = celebrationPetals[i];
      ctx.save();
      ctx.globalAlpha = cp.alpha;
      ctx.beginPath();
      ctx.fillStyle = cp.color;

      ctx.arc(cp.x, cp.y, cp.r * 0.7, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      cp.x += cp.vx;
      cp.y += cp.vy;
      cp.vy += 0.35; // Gravity
      cp.vx *= 0.98; // Air resistance
      cp.alpha -= 0.012;

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
