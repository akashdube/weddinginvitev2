/**
 * Royal Wedding Fireworks & Celebrate Button Engine
 * Pranshi & Akash (#APforever)
 * Multi-Rocket Salvo with Vivid, High-Intensity Blast Strictly Contained within Page Ratio
 */

(function () {
  'use strict';

  // --- Multi-Color Salvo Rocket Palettes ---
  const SALVO_CONFIGS = [
    {
      name: 'Sindoor & Ruby Rose',
      rocketColor: '#f43f5e',
      rocketTrailColor: 'rgba(244, 63, 94, 0.85)',
      burstType: 'peony',
      palette: [
        '#ef4444', '#f43f5e', '#fb7185', '#fda4af', '#fcd34d', '#ffffff', '#e11d48'
      ]
    },
    {
      name: 'Shahi Emerald & Molten Gold',
      rocketColor: '#10b981',
      rocketTrailColor: 'rgba(16, 185, 129, 0.85)',
      burstType: 'celestial',
      palette: [
        '#10b981', '#34d399', '#059669', '#ffd700', '#fef08a', '#ffffff', '#6ee7b7'
      ]
    },
    {
      name: 'Grand Royal Willow Finale',
      rocketColor: '#ffd700',
      rocketTrailColor: 'rgba(255, 215, 0, 0.85)',
      burstType: 'willow',
      palette: [
        '#ffd700', '#ffe066', '#dfbe7d', '#fff3b0', '#ffffff', '#eab308', '#f59e0b'
      ]
    },
    {
      name: 'Kesar Marigold & Saffron Spark',
      rocketColor: '#f97316',
      rocketTrailColor: 'rgba(249, 115, 22, 0.85)',
      burstType: 'chrysanthemum',
      palette: [
        '#f59e0b', '#fbbf24', '#f97316', '#ea580c', '#fef08a', '#ffffff', '#fb923c'
      ]
    },
    {
      name: 'Rainbow Jewel Celestial Bloom',
      rocketColor: '#c084fc',
      rocketTrailColor: 'rgba(192, 132, 252, 0.85)',
      burstType: 'rainbow',
      palette: [
        '#f43f5e', '#10b981', '#38bdf8', '#ffd700', '#c084fc', '#fb923c', '#ffffff'
      ]
    }
  ];

  // Helper to get current invitation container bounds
  function getContainerBounds() {
    const container = document.querySelector('.app-container');
    if (container) {
      const rect = container.getBoundingClientRect();
      return {
        left: rect.left,
        right: rect.right,
        width: rect.width,
        top: rect.top,
        bottom: rect.bottom
      };
    }
    return {
      left: 0,
      right: window.innerWidth,
      width: window.innerWidth,
      top: 0,
      bottom: window.innerHeight
    };
  }

  // --- Canvas System ---
  let canvas, ctx;
  let width = 0;
  let height = 0;
  const rockets = [];
  const particles = [];
  const flashBlooms = [];
  let animFrameId = null;

  function initCanvas() {
    canvas = document.getElementById('fireworks-canvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
  }

  function resizeCanvas() {
    if (!canvas) return;
    const dpr = window.devicePixelRatio || 1;
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.scale(dpr, dpr);
  }

  // --- Rocket Projectile ---
  class Rocket {
    constructor(startX, startY, targetX, targetY, config, durationFrames = 46) {
      this.x = startX;
      this.y = startY;
      this.targetX = targetX;
      this.targetY = targetY;
      this.config = config;
      this.trail = [];
      this.trailLength = 9;

      const dx = targetX - startX;
      const dy = targetY - startY;
      this.vx = dx / durationFrames;
      this.vy = dy / durationFrames;
      this.age = 0;
      this.maxAge = durationFrames;
    }

    update() {
      this.trail.push({ x: this.x, y: this.y });
      if (this.trail.length > this.trailLength) {
        this.trail.shift();
      }

      this.x += this.vx;
      this.y += this.vy;
      this.vy *= 0.992; // Natural deceleration near apex
      this.age++;

      // Keep rocket strictly within page ratio container horizontally
      const bounds = getContainerBounds();
      this.x = Math.max(bounds.left + 15, Math.min(bounds.right - 15, this.x));

      // Emitter spark particles falling behind rocket
      if (Math.random() < 0.75) {
        particles.push(new RocketSparks(this.x, this.y, this.config.rocketTrailColor));
      }

      return this.age >= this.maxAge || this.y <= this.targetY;
    }

    draw(ctx) {
      ctx.save();
      // Draw smooth trailing fire streak
      for (let i = 0; i < this.trail.length - 1; i++) {
        const pt1 = this.trail[i];
        const pt2 = this.trail[i + 1];
        const alpha = (i + 1) / this.trail.length;
        ctx.beginPath();
        ctx.strokeStyle = this.config.rocketTrailColor;
        ctx.globalAlpha = alpha * 0.92;
        ctx.lineWidth = 2.8 * alpha;
        ctx.lineCap = 'round';
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.stroke();
      }

      // Bright glowing rocket head
      ctx.beginPath();
      ctx.globalAlpha = 1;
      const radGrad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 7);
      radGrad.addColorStop(0, '#ffffff');
      radGrad.addColorStop(0.35, this.config.rocketColor);
      radGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = radGrad;
      ctx.arc(this.x, this.y, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }
  }

  // --- Ascending Spark Droplets ---
  class RocketSparks {
    constructor(x, y, color) {
      this.x = x + (Math.random() * 4 - 2);
      this.y = y + (Math.random() * 4 - 2);
      this.vx = (Math.random() - 0.5) * 1.5;
      this.vy = Math.random() * 2.2 + 1.2;
      this.color = color;
      this.alpha = 0.95;
      this.decay = Math.random() * 0.045 + 0.03;
      this.size = Math.random() * 2 + 1.2;
    }

    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.alpha -= this.decay;
      return this.alpha <= 0;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- Ambient Sky Flash Bloom (Page-Constrained) ---
  class FlashBloom {
    constructor(x, y, color) {
      this.x = x;
      this.y = y;
      this.color = color;
      this.alpha = 0.40;
      const bounds = getContainerBounds();
      this.maxRadius = Math.min(85, bounds.width * 0.22);
      this.radius = 20;
    }

    update() {
      this.alpha -= 0.038;
      this.radius += 5;
      return this.alpha <= 0 || this.radius >= this.maxRadius;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = Math.max(0, this.alpha);
      const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
      grad.addColorStop(0, this.color);
      grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // --- Exploded Firework Particle (Strictly Bound to Page Ratio) ---
  class FireworkParticle {
    constructor(x, y, color, burstType, isSecondary = false) {
      this.x = x;
      this.y = y;
      this.prevX = x;
      this.prevY = y;
      this.color = color;
      this.burstType = burstType;
      this.alpha = 1;

      const angle = Math.random() * Math.PI * 2;
      let speed;

      // Scaled speed tailored to fit within the container width
      switch (burstType) {
        case 'willow': // Golden weeping willow with heavy hanging curtain
          speed = Math.random() * 4.2 + 1.2;
          this.decay = Math.random() * 0.011 + 0.007; // Extra long-lasting
          this.gravity = 0.068;
          this.drag = 0.962;
          this.size = Math.random() * 2.5 + 1.2;
          break;
        case 'peony': // Auspicious floral ruby bloom
          speed = Math.random() * 5.2 + 2.0;
          this.decay = Math.random() * 0.016 + 0.011;
          this.gravity = 0.046;
          this.drag = 0.945;
          this.size = Math.random() * 2.5 + 1.3;
          break;
        case 'chrysanthemum': // Fast festive burst
          speed = Math.random() * 5.5 + 2.2;
          this.decay = Math.random() * 0.020 + 0.013;
          this.gravity = 0.050;
          this.drag = 0.938;
          this.size = Math.random() * 2.3 + 1.2;
          break;
        case 'celestial': // Emerald & gold ring
          speed = Math.random() * 4.8 + 1.8;
          this.decay = Math.random() * 0.015 + 0.01;
          this.gravity = 0.044;
          this.drag = 0.948;
          this.size = Math.random() * 2.4 + 1.2;
          break;
        case 'rainbow': // Full spectrum jewel burst
          speed = Math.random() * 5.4 + 2.0;
          this.decay = Math.random() * 0.014 + 0.009;
          this.gravity = 0.048;
          this.drag = 0.948;
          this.size = Math.random() * 2.6 + 1.3;
          break;
        default:
          speed = Math.random() * 4.6 + 1.8;
          this.decay = Math.random() * 0.016 + 0.011;
          this.gravity = 0.048;
          this.drag = 0.948;
          this.size = Math.random() * 2.3 + 1.2;
          break;
      }

      if (isSecondary) {
        speed *= 0.60;
        this.decay *= 0.85;
      }

      this.vx = Math.cos(angle) * speed;
      this.vy = Math.sin(angle) * speed;
      this.flicker = Math.random() > 0.3;
    }

    update() {
      this.prevX = this.x;
      this.prevY = this.y;
      this.vx *= this.drag;
      this.vy *= this.drag;
      this.vy += this.gravity;
      this.x += this.vx;
      this.y += this.vy;

      // Soft page boundary reflection: prevents particles from flying outside the container
      const bounds = getContainerBounds();
      const pad = 10;
      if (this.x < bounds.left + pad) {
        this.x = bounds.left + pad;
        this.vx = Math.abs(this.vx) * 0.3; // soft cushion bounce inward
      } else if (this.x > bounds.right - pad) {
        this.x = bounds.right - pad;
        this.vx = -Math.abs(this.vx) * 0.3; // soft cushion bounce inward
      }

      if (this.y < 35) {
        this.y = 35;
        this.vy = Math.abs(this.vy) * 0.3;
      }

      this.alpha -= this.decay;
      return this.alpha <= 0;
    }

    draw(ctx) {
      ctx.save();
      let currentAlpha = Math.max(0, this.alpha);
      if (this.flicker && Math.random() < 0.22) {
        currentAlpha *= 0.35;
      }

      ctx.globalAlpha = currentAlpha;
      ctx.strokeStyle = this.color;
      ctx.lineWidth = this.size;
      ctx.lineCap = 'round';

      // Draw light streak connecting previous coordinate
      ctx.beginPath();
      ctx.moveTo(this.prevX, this.prevY);
      ctx.lineTo(this.x, this.y);
      ctx.stroke();

      // Twinkling sparkling diamond tip
      if (this.alpha > 0.45 && Math.random() < 0.35) {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size * 0.85, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  // --- Explode Logic (Rich & Fulfilling Blast Intensity) ---
  function explodeRocket(x, y, config) {
    // 1. Ambient sky illumination bloom
    flashBlooms.push(new FlashBloom(x, y, config.rocketColor));

    // 2. Dense primary shell (115-135 particles per blast)
    const particleCount = config.burstType === 'willow' ? 135 : 115;
    for (let i = 0; i < particleCount; i++) {
      const color = config.palette[Math.floor(Math.random() * config.palette.length)];
      particles.push(new FireworkParticle(x, y, color, config.burstType, false));
    }

    // 3. Inner secondary sparkling core (25-30 stardust embers)
    const secondaryCount = 28;
    for (let i = 0; i < secondaryCount; i++) {
      const sparkColor = Math.random() > 0.4 ? '#ffffff' : '#ffd700';
      particles.push(new FireworkParticle(x, y, sparkColor, 'willow', true));
    }
  }

  // --- Main Animation Loop ---
  function loop() {
    if (!ctx) return;

    ctx.clearRect(0, 0, width, height);

    // 1. Draw sky flash blooms
    for (let i = flashBlooms.length - 1; i >= 0; i--) {
      if (flashBlooms[i].update()) {
        flashBlooms.splice(i, 1);
      } else {
        flashBlooms[i].draw(ctx);
      }
    }

    // 2. Draw rockets
    for (let i = rockets.length - 1; i >= 0; i--) {
      const r = rockets[i];
      if (r.update()) {
        explodeRocket(r.x, r.y, r.config);
        rockets.splice(i, 1);
      } else {
        r.draw(ctx);
      }
    }

    // 3. Draw particles
    for (let i = particles.length - 1; i >= 0; i--) {
      if (particles[i].update()) {
        particles.splice(i, 1);
      } else {
        particles[i].draw(ctx);
      }
    }

    // Keep loop active only when needed (0% battery drain when idle)
    if (rockets.length > 0 || particles.length > 0 || flashBlooms.length > 0) {
      animFrameId = requestAnimationFrame(loop);
    } else {
      animFrameId = null;
    }
  }

  function startLoop() {
    if (!animFrameId) {
      animFrameId = requestAnimationFrame(loop);
    }
  }

  // --- Launch Multi-Rocket Salvo strictly within Page Ratio ---
  window.launchCelebrateSalvo = function () {
    const btn = document.getElementById('btn-celebrate');
    if (!btn) return;

    const bounds = getContainerBounds();
    const btnRect = btn.getBoundingClientRect();
    const btnTop = btnRect.top; // Exact upper border of button
    const cLeft = bounds.left;
    const cWidth = bounds.width;

    // Salvo of 5 distinct rockets calculated strictly within the container ratio!
    // Horizontal fractions: 28%, 72%, 50%, 36%, 64% of container width
    const salvoSteps = [
      // Rocket 1: Left-center angle, Ruby & Rose Gold
      {
        delay: 0,
        startX: btnRect.left + btnRect.width * 0.28,
        targetX: cLeft + cWidth * (0.28 + (Math.random() * 0.04 - 0.02)),
        targetY: Math.max(70, window.innerHeight * (0.17 + Math.random() * 0.05)),
        config: SALVO_CONFIGS[0],
        duration: 44
      },
      // Rocket 2: Right-center angle, Shahi Emerald & Gold
      {
        delay: 90,
        startX: btnRect.left + btnRect.width * 0.72,
        targetX: cLeft + cWidth * (0.72 + (Math.random() * 0.04 - 0.02)),
        targetY: Math.max(65, window.innerHeight * (0.16 + Math.random() * 0.05)),
        config: SALVO_CONFIGS[1],
        duration: 46
      },
      // Rocket 3: Center Apex, Grand Royal Kamuro Gold Willow
      {
        delay: 220,
        startX: btnRect.left + btnRect.width * 0.50,
        targetX: cLeft + cWidth * (0.50 + (Math.random() * 0.04 - 0.02)),
        targetY: Math.max(55, window.innerHeight * (0.13 + Math.random() * 0.04)),
        config: SALVO_CONFIGS[2],
        duration: 48
      },
      // Rocket 4: Mid-left high angle, Kesar Marigold
      {
        delay: 360,
        startX: btnRect.left + btnRect.width * 0.38,
        targetX: cLeft + cWidth * (0.38 + (Math.random() * 0.04 - 0.02)),
        targetY: Math.max(80, window.innerHeight * (0.19 + Math.random() * 0.05)),
        config: SALVO_CONFIGS[3],
        duration: 45
      },
      // Rocket 5: Mid-right high angle, Rainbow Jewel Celestial
      {
        delay: 480,
        startX: btnRect.left + btnRect.width * 0.62,
        targetX: cLeft + cWidth * (0.62 + (Math.random() * 0.04 - 0.02)),
        targetY: Math.max(75, window.innerHeight * (0.18 + Math.random() * 0.05)),
        config: SALVO_CONFIGS[4],
        duration: 47
      }
    ];

    // Trigger staggered rocket launches
    salvoSteps.forEach((step) => {
      setTimeout(() => {
        rockets.push(
          new Rocket(step.startX, btnTop, step.targetX, step.targetY, step.config, step.duration)
        );
        startLoop();
      }, step.delay);
    });

    // Button micro-recoil pulse
    btn.style.transform = 'translateY(2px) scale(0.96)';
    setTimeout(() => {
      btn.style.transform = '';
    }, 180);

    // Safe Staggered Haptic Vibration on mobile devices
    if (navigator.vibrate) {
      try {
        navigator.vibrate([30, 45, 25, 45, 30, 50, 40]);
      } catch (e) {}
    }
  };

  // Backwards compatible alias
  window.launchCelebrateRocket = window.launchCelebrateSalvo;

  // --- DOM Setup on Load ---
  document.addEventListener('DOMContentLoaded', () => {
    initCanvas();

    const btn = document.getElementById('btn-celebrate');
    if (btn) {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        window.launchCelebrateSalvo();
      });
    }
  });
})();
