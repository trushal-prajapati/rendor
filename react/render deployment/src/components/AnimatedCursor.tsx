import React, { useEffect, useRef, useState } from 'react';
import { useCursor, PageTheme } from '../context/CursorContext';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  color: string;
  decay: number;
  maxLife: number;
  life: number;
}

export const AnimatedCursor: React.FC = () => {
  const { cursorType, pageTheme, cursorLabel } = useCursor();
  
  // Custom pointer coordinates (target + smoothed display positions)
  const mousePos = useRef({ x: 0, y: 0 });
  const cursorPos = useRef({ x: 0, y: 0 });
  const trailPos = useRef({ x: 0, y: 0 });
  const glowPos = useRef({ x: 0, y: 0 });
  const lastFrameTime = useRef(0);

  const cursorRef = useRef<HTMLDivElement>(null);
  const outerRingRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<Particle[]>([]);
  const hasMoved = useRef(false);

  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === 'undefined') return false;
    return !window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  });

  // Clinic theme configuration palette
  const getThemeConfig = (theme: PageTheme) => {
    switch (theme) {
      case 'registration':
        return {
          particleColor: 'rgba(99, 102, 241, 0.35)', // Indigo
          cursorColor: 'rgb(99, 102, 241)',
          particleCount: 0.8,
          speed: 0.6,
          type: 'precision'
        };
      case 'booking':
        return {
          particleColor: 'rgba(14, 165, 233, 0.4)', // Sky blue
          cursorColor: 'rgb(14, 165, 233)',
          particleCount: 1.2,
          speed: 1.0,
          type: 'checklist'
        };
      case 'consultation':
        return {
          particleColor: 'rgba(139, 92, 246, 0.45)', // Violet
          cursorColor: 'rgb(139, 92, 246)',
          particleCount: 1.8,
          speed: 1.5,
          type: 'network'
        };
      case 'home':
      default:
        return {
          particleColor: 'rgba(16, 185, 129, 0.4)', // Sage/Emerald Green
          cursorColor: 'rgb(16, 185, 129)',
          particleCount: 0.7,
          speed: 0.5,
          type: 'botanical'
        };
    }
  };

  const themeConfig = getThemeConfig(pageTheme);

  const smoothStep = (current: number, target: number, factor: number, deltaSeconds: number) => {
    const t = 1 - Math.pow(1 - factor, deltaSeconds * 60);
    return current + (target - current) * t;
  };

  // Monitor device pointer type (match CSS cursor:none rule)
  useEffect(() => {
    const media = window.matchMedia('(hover: hover) and (pointer: fine)');
    const checkDevice = () => setIsMobile(!media.matches);
    checkDevice();
    media.addEventListener('change', checkDevice);
    return () => media.removeEventListener('change', checkDevice);
  }, []);

  // Sync cursor positioning
  useEffect(() => {
    if (isMobile) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!hasMoved.current) {
        hasMoved.current = true;
        cursorPos.current = { x: e.clientX, y: e.clientY };
        trailPos.current = { x: e.clientX, y: e.clientY };
        glowPos.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseDown = () => {
      if (cursorRef.current) {
        const inner = cursorRef.current.firstElementChild as HTMLElement | null;
        if (inner) inner.dataset.pressed = 'true';
      }
    };
    const handleMouseUp = () => {
      if (cursorRef.current) {
        const inner = cursorRef.current.firstElementChild as HTMLElement | null;
        if (inner) inner.dataset.pressed = 'false';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isMobile]);

  // RequestAnimationFrame loop for cursor trails and canvas animation
  useEffect(() => {
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle Canvas Resizing
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initial floating particles
    const initFloatingParticles = () => {
      const config = getThemeConfig(pageTheme);
      particles.current = [];
      const count = config.type === 'botanical' ? 25 : 35;
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * config.speed * 0.4,
          vy: (Math.random() - 0.5) * config.speed * 0.4 - (config.type === 'botanical' ? 0.15 : 0), // slow lift for organic feel
          size: config.type === 'botanical' ? Math.random() * 8 + 4 : Math.random() * 4 + 2,
          alpha: Math.random() * 0.35 + 0.05,
          color: config.particleColor,
          decay: 0.0005,
          maxLife: 250,
          life: Math.random() * 150,
        });
      }
    };
    initFloatingParticles();

    // Render loop
    const tick = (time: number) => {
      const config = getThemeConfig(pageTheme);
      const deltaSeconds = lastFrameTime.current
        ? Math.min((time - lastFrameTime.current) / 1000, 0.05)
        : 1 / 60;
      lastFrameTime.current = time;

      // 1. Frame-rate independent cursor smoothing
      if (!isMobile) {
        cursorPos.current.x = smoothStep(cursorPos.current.x, mousePos.current.x, 0.42, deltaSeconds);
        cursorPos.current.y = smoothStep(cursorPos.current.y, mousePos.current.y, 0.42, deltaSeconds);

        trailPos.current.x = smoothStep(trailPos.current.x, mousePos.current.x, 0.14, deltaSeconds);
        trailPos.current.y = smoothStep(trailPos.current.y, mousePos.current.y, 0.14, deltaSeconds);

        glowPos.current.x = smoothStep(glowPos.current.x, mousePos.current.x, 0.08, deltaSeconds);
        glowPos.current.y = smoothStep(glowPos.current.y, mousePos.current.y, 0.08, deltaSeconds);

        if (cursorRef.current) {
          cursorRef.current.style.transform = `translate3d(${cursorPos.current.x}px, ${cursorPos.current.y}px, 0)`;
        }
        if (outerRingRef.current) {
          outerRingRef.current.style.transform = `translate3d(${trailPos.current.x}px, ${trailPos.current.y}px, 0)`;
        }
        if (glowRef.current) {
          glowRef.current.style.transform = `translate3d(${glowPos.current.x}px, ${glowPos.current.y}px, 0)`;
        }
      }

      // 2. Render Canvas Generative Background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Emit new particles at cursor location when moving
      if (!isMobile && Math.random() < config.particleCount) {
        particles.current.push({
          x: mousePos.current.x + (Math.random() - 0.5) * 12,
          y: mousePos.current.y + (Math.random() - 0.5) * 12,
          vx: (Math.random() - 0.5) * config.speed * 0.8,
          vy: (Math.random() - 0.5) * config.speed * 0.8 - (config.type === 'botanical' ? 0.2 : 0),
          size: config.type === 'botanical' ? Math.random() * 6 + 3 : Math.random() * 3 + 1.5,
          alpha: 0.8,
          color: config.particleColor,
          decay: config.type === 'botanical' ? 0.005 : 0.012,
          maxLife: 120,
          life: 0,
        });
      }

      // Process and draw particles
      const pArray = particles.current;
      for (let i = pArray.length - 1; i >= 0; i--) {
        const p = pArray[i];
        p.life++;
        p.alpha -= p.decay;

        // Apply page-specific physical movements
        if (config.type === 'botanical') {
          // Floating plant cell: slow upward floating, horizontal wave motion
          p.y += p.vy * 0.8;
          p.x += p.vx * 0.8 + Math.sin(p.life * 0.02) * 0.15;
        } else {
          // Standard drift
          p.x += p.vx;
          p.y += p.vy;
        }

        // Mouse magnetic attractions/repulsions
        if (!isMobile) {
          const dx = mousePos.current.x - p.x;
          const dy = mousePos.current.y - p.y;
          const dist = Math.hypot(dx, dy);

          if (dist < 180) {
            const force = (180 - dist) / 180;
            if (config.type === 'network') {
              // Magnetically attract purple nodes to cursor coordinates
              p.x += (dx / dist) * force * 1.8;
              p.y += (dy / dist) * force * 1.8;
            } else if (config.type === 'botanical') {
              // Gently push green cell molecules away (organically floating around cursor)
              p.x -= (dx / dist) * force * 0.6;
              p.y -= (dy / dist) * force * 0.6;
            }
          }
        }

        // Draw particle
        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.beginPath();

        if (config.type === 'botanical') {
          // Botanical: Render ringed/cellular organic circles
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          // Inner nucleus
          ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
          ctx.beginPath();
          ctx.arc(p.x - p.size * 0.2, p.y - p.size * 0.2, p.size * 0.3, 0, Math.PI * 2);
          ctx.fill();
        } else if (config.type === 'precision') {
          // Precision: small circular dust nodes
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          // Custom small dots
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // Telemedicine Network Nodes connection lines
        if (config.type === 'network') {
          for (let j = i - 1; j >= 0; j--) {
            const p2 = pArray[j];
            const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
            if (dist < 100) {
              ctx.strokeStyle = config.particleColor;
              ctx.lineWidth = (1 - dist / 100) * 0.45;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }

        ctx.restore();

        // Bounce/Wrap initial floating particles
        if (p.life > p.maxLife || p.alpha <= 0) {
          if (p.maxLife > 150) {
            // Respawn floating background particle
            pArray[i] = {
              x: Math.random() * canvas.width,
              y: Math.random() * canvas.height,
              vx: (Math.random() - 0.5) * config.speed * 0.4,
              vy: (Math.random() - 0.5) * config.speed * 0.4 - (config.type === 'botanical' ? 0.15 : 0),
              size: config.type === 'botanical' ? Math.random() * 8 + 4 : Math.random() * 4 + 2,
              alpha: Math.random() * 0.35 + 0.05,
              color: config.particleColor,
              decay: 0.0005,
              maxLife: 250,
              life: 0,
            };
          } else {
            pArray.splice(i, 1);
          }
        }
      }

      animId = requestAnimationFrame(tick);
    };

    animId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [pageTheme, isMobile]);

  if (isMobile) {
    return (
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 bg-slate-50 transition-colors duration-1000"
      />
    );
  }

  const isHovered = cursorType === 'hover';
  const isClicked = cursorType === 'click';
  const isPrecision = pageTheme === 'registration' || pageTheme === 'booking';
  const ringSize = isHovered ? (isPrecision ? 52 : 68) : (isPrecision ? 28 : 44);
  const cursorScale = isClicked ? 0.88 : isHovered ? 1.12 : 1;

  return (
    <>
      {/* Background Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0 bg-[#fafcfb] transition-colors duration-1000"
      />

      {/* Custom Cursor DOM Overlays */}
      <div className="fixed inset-0 pointer-events-none z-[9999]">
        {/* Soft trailing glow */}
        <div
          ref={glowRef}
          className="absolute pointer-events-none will-change-transform"
          style={{
            width: ringSize + 24,
            height: ringSize + 24,
            marginTop: -(ringSize + 24) / 2,
            marginLeft: -(ringSize + 24) / 2,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${themeConfig.cursorColor.replace('rgb', 'rgba').replace(')', ', 0.14)')} 0%, transparent 70%)`,
            transform: 'translate3d(0px, 0px, 0)',
          }}
        />

        {/* Outer ring */}
        <div
          ref={outerRingRef}
          className="absolute pointer-events-none flex items-center justify-center will-change-transform transition-[width,height,background-color,box-shadow] duration-300 ease-out"
          style={{
            width: ringSize,
            height: ringSize,
            marginTop: -ringSize / 2,
            marginLeft: -ringSize / 2,
            borderRadius: '50%',
            border: `1.5px solid ${themeConfig.cursorColor}`,
            backgroundColor: isHovered
              ? `${themeConfig.cursorColor.replace('rgb', 'rgba').replace(')', ', 0.1)')}`
              : 'transparent',
            transform: 'translate3d(0px, 0px, 0)',
            boxShadow: isHovered ? `0 0 24px ${themeConfig.cursorColor}30` : 'none',
          }}
        >
          {isHovered && cursorLabel && (
            <span
              className="absolute left-full ml-4 px-3 py-1.5 text-[10px] font-bold text-white rounded-lg shadow-md animate-fade-in backdrop-blur-md tracking-wider uppercase whitespace-nowrap"
              style={{ backgroundColor: themeConfig.cursorColor }}
            >
              {cursorLabel}
            </span>
          )}
        </div>

        {/* Main pointer icon */}
        <div
          ref={cursorRef}
          className="absolute top-0 left-0 pointer-events-none will-change-transform"
          style={{ transform: 'translate3d(0px, 0px, 0)' }}
        >
          <div
            className="transition-transform duration-200 ease-out data-[pressed=true]:scale-90"
            style={{
              marginTop: isPrecision ? -13 : -4,
              marginLeft: isPrecision ? -13 : -5,
              transform: `scale(${cursorScale})`,
            }}
          >
            <svg
            width={isPrecision ? 26 : 24}
            height={isPrecision ? 26 : 24}
            viewBox={isPrecision ? '0 0 26 26' : '0 0 24 24'}
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            style={{
              filter: `drop-shadow(0 2px 6px ${themeConfig.cursorColor}55)`,
            }}
          >
            {isPrecision ? (
              <>
                <circle cx="13" cy="13" r="10" stroke={themeConfig.cursorColor} strokeWidth="1.5" fill="rgba(255,255,255,0.92)" />
                <line x1="13" y1="5" x2="13" y2="21" stroke={themeConfig.cursorColor} strokeWidth="1.25" strokeLinecap="round" />
                <line x1="5" y1="13" x2="21" y2="13" stroke={themeConfig.cursorColor} strokeWidth="1.25" strokeLinecap="round" />
                <circle cx="13" cy="13" r="2.5" fill={themeConfig.cursorColor} />
              </>
            ) : (
              <path
                d="M5 2.5L5 18.5L9.75 14.25L13.25 21.5L15.75 20.25L12.25 13L18.5 13L5 2.5Z"
                fill={themeConfig.cursorColor}
                stroke="white"
                strokeWidth="1.4"
                strokeLinejoin="round"
              />
            )}
          </svg>
          </div>
        </div>
      </div>
    </>
  );
};
