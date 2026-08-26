import React, { useEffect, useRef } from 'react';

// Curated vibrant luxury color palette for cursor smoke puffs & ambient wisps
const SMOKE_COLOR_PALETTES = [
  { r: 6, g: 182, b: 212, hex: '#06b6d4', name: 'Electric Cyan' },
  { r: 168, g: 85, b: 247, hex: '#a855f7', name: 'Neon Purple' },
  { r: 16, g: 185, b: 129, hex: '#10b981', name: 'Emerald Fire' },
  { r: 245, g: 158, b: 11, hex: '#f59e0b', name: 'Solar Amber' },
  { r: 244, g: 63, b: 94, hex: '#f43f5e', name: 'Crimson Rose' },
  { r: 99, g: 102, b: 241, hex: '#6366f1', name: 'Cobalt Indigo' },
  { r: 236, g: 72, b: 153, hex: '#ec4899', name: 'Magenta Mist' },
  { r: 56, g: 189, b: 248, hex: '#38bdf8', name: 'Sky Azure' },
  { r: 132, g: 204, b: 22, hex: '#84cc16', name: 'Cyber Lime' },
  { r: 251, g: 146, b: 60, hex: '#fb923c', name: 'Sunset Peach' },
  { r: 20, g: 241, b: 217, hex: '#14f1d9', name: 'Aquamarine' },
  { r: 217, g: 70, b: 239, hex: '#d946ef', name: 'Fuchsia Beam' },
];

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  maxRadius: number;
  life: number;
  maxLife: number;
  spriteIndex: number;
  baseOpacity: number;
  angle: number;
  angularSpeed: number;
  scaleX: number;
  scaleY: number;
  isAmbient?: boolean;
}

export const HeroSmokeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const currentColorIndexRef = useRef<number>(0);
  const strokeDistanceRef = useRef<number>(0);
  const ambientTimerRef = useRef<number>(0);
  const spritesRef = useRef<HTMLCanvasElement[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    // 1. PRE-RENDER SPRITES:
    // Generate offscreen canvas sprites for every color palette once.
    // This avoids calling createRadialGradient in every animation frame,
    // eliminating garbage collection stalls, skips, and FPS drops.
    const SPRITE_SIZE = 128;
    const sprites: HTMLCanvasElement[] = SMOKE_COLOR_PALETTES.map((color) => {
      const spriteCanvas = document.createElement('canvas');
      spriteCanvas.width = SPRITE_SIZE;
      spriteCanvas.height = SPRITE_SIZE;
      const sCtx = spriteCanvas.getContext('2d');
      if (sCtx) {
        const half = SPRITE_SIZE / 2;
        const grad = sCtx.createRadialGradient(half, half, 0, half, half, half);
        grad.addColorStop(0, `rgba(${color.r}, ${color.g}, ${color.b}, 1)`);
        grad.addColorStop(0.25, `rgba(${color.r}, ${color.g}, ${color.b}, 0.7)`);
        grad.addColorStop(0.55, `rgba(${color.r}, ${color.g}, ${color.b}, 0.28)`);
        grad.addColorStop(0.82, `rgba(${color.r}, ${color.g}, ${color.b}, 0.08)`);
        grad.addColorStop(1, `rgba(${color.r}, ${color.g}, ${color.b}, 0)`);

        sCtx.fillStyle = grad;
        sCtx.beginPath();
        sCtx.arc(half, half, half, 0, Math.PI * 2);
        sCtx.fill();
      }
      return spriteCanvas;
    });
    spritesRef.current = sprites;

    let width = 0;
    let height = 0;
    let dpr = 1;

    const resize = () => {
      if (!container || !canvas) return;
      const rect = container.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(rect.width || window.innerWidth, 320);
      height = Math.max(rect.height || 750, 400);

      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };

    resize();

    let resizeTimeout: any = null;
    const onResize = () => {
      if (resizeTimeout) clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        resize();
      }, 60);
    };

    window.addEventListener('resize', onResize, { passive: true });

    const pickNextColor = () => {
      const current = currentColorIndexRef.current;
      let next = Math.floor(Math.random() * SMOKE_COLOR_PALETTES.length);
      if (next === current) {
        next = (current + 1) % SMOKE_COLOR_PALETTES.length;
      }
      currentColorIndexRef.current = next;
      return next;
    };

    // Fast particle spawner for cursor interactions
    const spawnSmokePuff = (x: number, y: number, vx: number, vy: number) => {
      const spriteIndex = currentColorIndexRef.current;
      const count = Math.random() < 0.65 ? 2 : 1;

      for (let i = 0; i < count; i++) {
        const speedMult = 0.85 + Math.random() * 0.85;
        const spreadAngle = Math.random() * Math.PI * 2;
        const spreadDist = Math.random() * 14;

        const particleVx = (vx * 0.32 + Math.cos(spreadAngle) * 1.8) * speedMult;
        const particleVy = (vy * 0.32 + Math.sin(spreadAngle) * 1.8 - 0.9) * speedMult; // snappy thermal rise

        const initialRadius = 28 + Math.random() * 26;
        const maxRadius = initialRadius * (2.2 + Math.random() * 1.3);
        const maxLife = 26 + Math.floor(Math.random() * 18); // Snappy ~0.45s life cycle

        particlesRef.current.push({
          x: x + Math.cos(spreadAngle) * spreadDist,
          y: y + Math.sin(spreadAngle) * spreadDist,
          vx: particleVx,
          vy: particleVy,
          radius: initialRadius,
          maxRadius,
          life: 0,
          maxLife,
          spriteIndex,
          baseOpacity: 0.75 + Math.random() * 0.25,
          angle: Math.random() * Math.PI * 2,
          angularSpeed: (Math.random() - 0.5) * 0.08,
          scaleX: 0.9 + Math.random() * 0.2,
          scaleY: 0.9 + Math.random() * 0.2,
          isAmbient: false,
        });
      }
    };

    // Ambient floating wisps to keep the hero dynamically alive and breathing even when idle
    const spawnAmbientWisp = () => {
      if (width <= 0 || height <= 0) return;
      const spriteIndex = Math.floor(Math.random() * SMOKE_COLOR_PALETTES.length);
      const startX = width * 0.12 + Math.random() * (width * 0.76);
      const startY = height * 0.2 + Math.random() * (height * 0.6);

      const angle = (Math.random() - 0.5) * Math.PI * 0.85 - Math.PI / 2; // mostly upward
      const speed = 0.8 + Math.random() * 0.85;

      const initialRadius = 50 + Math.random() * 60;
      const maxRadius = initialRadius * (1.8 + Math.random() * 1.2);
      const maxLife = 55 + Math.floor(Math.random() * 40);

      particlesRef.current.push({
        x: startX,
        y: startY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: initialRadius,
        maxRadius,
        life: 0,
        maxLife,
        spriteIndex,
        baseOpacity: 0.35 + Math.random() * 0.2,
        angle: Math.random() * Math.PI * 2,
        angularSpeed: (Math.random() - 0.5) * 0.035,
        scaleX: 1 + Math.random() * 0.3,
        scaleY: 0.8 + Math.random() * 0.3,
        isAmbient: true,
      });
    };

    // Seed initial ambient wisps
    for (let k = 0; k < 7; k++) {
      spawnAmbientWisp();
      // Fast-forward initial particles so they appear immediately on screen
      if (particlesRef.current[k]) {
        particlesRef.current[k].life = Math.floor(Math.random() * 30);
      }
    }

    const handlePointerMove = (clientX: number, clientY: number) => {
      if (!container) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Vertical/horizontal bounds check
      if (y < -30 || y > rect.height + 30 || x < -30 || x > rect.width + 30) {
        lastPosRef.current = null;
        return;
      }

      const now = performance.now();
      if (!lastPosRef.current) {
        lastPosRef.current = { x, y, time: now };
        pickNextColor();
        spawnSmokePuff(x, y, 0, 0);
        return;
      }

      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dt = Math.max(now - lastPosRef.current.time, 8);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // Fast, responsive color progression on stroke distance or movement pauses
      if (dt > 70 || dist > 60) {
        pickNextColor();
        strokeDistanceRef.current = 0;
      } else {
        strokeDistanceRef.current += dist;
        if (strokeDistanceRef.current > 42) {
          pickNextColor();
          strokeDistanceRef.current = 0;
        }
      }

      // Smooth interpolation for fast sweeps without skipping
      const steps = Math.min(Math.max(Math.floor(dist / 10), 1), 6);
      const vx = (dx / dt) * 16;
      const vy = (dy / dt) * 16;

      for (let s = 1; s <= steps; s++) {
        const px = lastPosRef.current.x + (dx * s) / steps;
        const py = lastPosRef.current.y + (dy * s) / steps;
        spawnSmokePuff(px, py, vx, vy);
      }

      lastPosRef.current = { x, y, time: now };
    };

    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientX, e.clientY);
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        handlePointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const onMouseLeave = () => {
      lastPosRef.current = null;
      strokeDistanceRef.current = 0;
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);

    // Render loop with high-performance Sprite Blitting & Delta-Time normalization
    let lastTime = performance.now();

    const render = (currentTime: number) => {
      const delta = Math.min((currentTime - lastTime) / 16.666, 2.5); // normalized frame step
      lastTime = currentTime;

      // Spawn subtle ambient wisps periodically at a dynamic pace
      ambientTimerRef.current += delta;
      if (ambientTimerRef.current > 14) {
        ambientTimerRef.current = 0;
        const ambientCount = particlesRef.current.filter((p) => p.isAmbient).length;
        if (ambientCount < 12) {
          spawnAmbientWisp();
        }
      }

      // Clear Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const particles = particlesRef.current;
      const spritesList = spritesRef.current;

      if (particles.length > 0) {
        ctx.save();
        ctx.scale(dpr, dpr);
        // Lighter / Screen composite mode gives glowing luxury mist without blocking background elements
        ctx.globalCompositeOperation = 'screen';

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life += delta;

          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }

          // Physics update with snappy velocity and responsive drift
          p.x += p.vx * delta;
          p.y += p.vy * delta;
          p.vx *= Math.pow(0.91, delta);
          p.vy *= Math.pow(0.91, delta);
          p.vy -= 0.12 * delta; // brisk thermal drift
          p.angle += p.angularSpeed * delta;

          const progress = Math.min(Math.max(p.life / p.maxLife, 0), 1);

          // Smooth radius expansion
          const currentRadius = p.radius + (p.maxRadius - p.radius) * Math.sin((progress * Math.PI) / 2);

          // Smooth bloom & dissipation curve
          let alpha = 0;
          if (progress < 0.14) {
            alpha = (progress / 0.14) * p.baseOpacity;
          } else {
            alpha = p.baseOpacity * Math.pow(1 - progress, 1.5);
          }

          if (alpha <= 0.002) {
            particles.splice(i, 1);
            continue;
          }

          const sprite = spritesList[p.spriteIndex];
          if (!sprite) continue;

          // Blit offscreen pre-rendered sprite with GPU transformation
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.scale(p.scaleX, p.scaleY);
          ctx.globalAlpha = alpha;

          ctx.drawImage(
            sprite,
            -currentRadius,
            -currentRadius,
            currentRadius * 2,
            currentRadius * 2
          );

          ctx.restore();
        }

        ctx.restore();
      }

      animationFrameRef.current = requestAnimationFrame(render);
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (resizeTimeout) clearTimeout(resizeTimeout);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden select-none"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-95 will-change-transform"
      />
    </div>
  );
};
