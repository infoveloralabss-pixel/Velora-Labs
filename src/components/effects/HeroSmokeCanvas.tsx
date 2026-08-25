import React, { useEffect, useRef } from 'react';

// Curated vibrant luxury color palette for cursor smoke puffs
const SMOKE_COLOR_PALETTES = [
  { r: 6, g: 182, b: 212, name: 'Cyan Glow' },       // #06b6d4 Electric Cyan
  { r: 168, g: 85, b: 247, name: 'Neon Purple' },   // #a855f7 Vivid Violet
  { r: 16, g: 185, b: 129, name: 'Emerald Fire' },   // #10b981 Mint / Emerald
  { r: 245, g: 158, b: 11, name: 'Solar Amber' },    // #f59e0b Golden Amber
  { r: 244, g: 63, b: 94, name: 'Crimson Rose' },    // #f43f5e Hot Coral / Rose
  { r: 99, g: 102, b: 241, name: 'Cobalt Indigo' },  // #6366f1 Electric Indigo
  { r: 236, g: 72, b: 153, name: 'Magenta Mist' },   // #ec4899 Neon Pink
  { r: 56, g: 189, b: 248, name: 'Sky Azure' },      // #38bdf8 Sky Blue
  { r: 132, g: 204, b: 22, name: 'Cyber Lime' },     // #84cc16 Cyber Lime
  { r: 251, g: 146, b: 60, name: 'Sunset Peach' },   // #fb923c Warm Tangerine
  { r: 20, g: 241, b: 217, name: 'Aquamarine' },     // #14f1d9 Aquamarine
  { r: 217, g: 70, b: 239, name: 'Fuchsia Beam' },   // #d946ef Fuchsia
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
  color: { r: number; g: number; b: number };
  opacity: number;
  angle: number;
  angularSpeed: number;
  scaleX: number;
  scaleY: number;
}

export const HeroSmokeCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  const lastPosRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const currentColorIndexRef = useRef<number>(0);
  const strokeDistanceRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width || window.innerWidth;
      height = rect.height || 750;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;

      ctx.scale(dpr, dpr);
    };

    resize();
    const resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    window.addEventListener('resize', resize);

    const pickNextColor = () => {
      // Pick a distinct color different from current
      const current = currentColorIndexRef.current;
      let next = Math.floor(Math.random() * SMOKE_COLOR_PALETTES.length);
      if (next === current) {
        next = (current + 1) % SMOKE_COLOR_PALETTES.length;
      }
      currentColorIndexRef.current = next;
      return SMOKE_COLOR_PALETTES[next];
    };

    const spawnSmokePuff = (x: number, y: number, vx: number, vy: number) => {
      const color = SMOKE_COLOR_PALETTES[currentColorIndexRef.current];
      // Create a cluster of soft smoke cloud particles
      const count = Math.floor(Math.random() * 2) + 2;

      for (let i = 0; i < count; i++) {
        const speedMultiplier = 0.35 + Math.random() * 0.55;
        const spreadAngle = Math.random() * Math.PI * 2;
        const spreadDistance = Math.random() * 12;

        const particleVx = (vx * 0.18 + Math.cos(spreadAngle) * 0.7) * speedMultiplier;
        const particleVy = (vy * 0.18 + Math.sin(spreadAngle) * 0.7 - 0.25) * speedMultiplier; // slight upward draft

        const initialRadius = 18 + Math.random() * 20;
        const maxRadius = initialRadius * (2.6 + Math.random() * 1.8);
        const maxLife = 55 + Math.floor(Math.random() * 45);

        particlesRef.current.push({
          x: x + Math.cos(spreadAngle) * spreadDistance,
          y: y + Math.sin(spreadAngle) * spreadDistance,
          vx: particleVx,
          vy: particleVy,
          radius: initialRadius,
          maxRadius,
          life: 0,
          maxLife,
          color,
          opacity: 0.42 + Math.random() * 0.18, // luminous ethereal opacity
          angle: Math.random() * Math.PI * 2,
          angularSpeed: (Math.random() - 0.5) * 0.035,
          scaleX: 0.85 + Math.random() * 0.3,
          scaleY: 0.85 + Math.random() * 0.3,
        });
      }

      // Limit particle pool to maintain steady 60fps
      if (particlesRef.current.length > 280) {
        particlesRef.current.splice(0, particlesRef.current.length - 280);
      }
    };

    const handlePointerMove = (clientX: number, clientY: number) => {
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      // Ensure cursor is within vertical boundaries of the hero area
      if (y < -40 || y > rect.height + 40 || x < -40 || x > rect.width + 40) {
        lastPosRef.current = null;
        return;
      }

      const now = Date.now();
      if (!lastPosRef.current) {
        lastPosRef.current = { x, y, time: now };
        pickNextColor();
        spawnSmokePuff(x, y, 0, 0);
        return;
      }

      const dx = x - lastPosRef.current.x;
      const dy = y - lastPosRef.current.y;
      const dt = Math.max(now - lastPosRef.current.time, 16);
      const dist = Math.sqrt(dx * dx + dy * dy);

      // If user paused and moved again (dt > 160ms) or jumped positions, trigger a new unique color
      if (dt > 160 || dist > 120) {
        pickNextColor();
        strokeDistanceRef.current = 0;
      } else {
        strokeDistanceRef.current += dist;
        // Shift to next color smoothly along long continuous strokes (~140px)
        if (strokeDistanceRef.current > 140) {
          pickNextColor();
          strokeDistanceRef.current = 0;
        }
      }

      // Interpolate puffs along fast cursor sweeps
      const steps = Math.min(Math.max(Math.floor(dist / 12), 1), 7);
      const vx = (dx / dt) * 10;
      const vy = (dy / dt) * 10;

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
      if (e.touches.length > 0) {
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

    // Render loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      if (particles.length > 0) {
        ctx.save();
        // Screen blend mode produces vibrant ethereal luminescence without blocking dark text
        ctx.globalCompositeOperation = 'screen';

        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.life++;

          if (p.life >= p.maxLife) {
            particles.splice(i, 1);
            continue;
          }

          // Physics update: air drag + soft thermal ascension
          p.x += p.vx;
          p.y += p.vy;
          p.vx *= 0.95;
          p.vy *= 0.95;
          p.vy -= 0.06;
          p.angle += p.angularSpeed;

          // Normalized progress
          const progress = p.life / p.maxLife;

          // Radial expansion curve
          const currentRadius = p.radius + (p.maxRadius - p.radius) * Math.sin((progress * Math.PI) / 2);

          // Alpha curve: fast bloom, slow atmospheric dissipation
          let alpha = 0;
          if (progress < 0.14) {
            alpha = (progress / 0.14) * p.opacity;
          } else {
            alpha = p.opacity * Math.pow(1 - progress, 1.7);
          }

          if (alpha <= 0.001) {
            particles.splice(i, 1);
            continue;
          }

          // Render radial multi-stop smoke gradient
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.angle);
          ctx.scale(p.scaleX, p.scaleY);

          const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, currentRadius);
          const { r, g, b } = p.color;

          gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.95})`);
          gradient.addColorStop(0.3, `rgba(${r}, ${g}, ${b}, ${alpha * 0.55})`);
          gradient.addColorStop(0.65, `rgba(${r}, ${g}, ${b}, ${alpha * 0.18})`);
          gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`);

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.arc(0, 0, currentRadius, 0, Math.PI * 2);
          ctx.fill();
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
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', resize);
      document.removeEventListener('mouseleave', onMouseLeave);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      <canvas
        ref={canvasRef}
        className="w-full h-full block opacity-90"
      />
    </div>
  );
};
