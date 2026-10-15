import { useState, useRef, useEffect, useCallback } from 'react';
import type { ShoeImage } from '../types/shoe';

interface SphereGalleryProps {
  images: ShoeImage[];
  onImageClick?: (image: ShoeImage) => void;
}

export default function SphereGallery({ images, onImageClick }: SphereGalleryProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState({ x: -20, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const velocity = useRef({ x: 0, y: 0 });
  const animationRef = useRef<number>();

  // Auto rotation
  useEffect(() => {
    if (isDragging) return;

    let lastTime = performance.now();
    const animate = (time: number) => {
      const delta = time - lastTime;
      lastTime = time;

      // Apply velocity with friction
      velocity.current.x *= 0.95;
      velocity.current.y *= 0.95;

      setRotation((prev) => ({
        x: Math.max(-60, Math.min(60, prev.x + velocity.current.y * delta * 0.05)),
        y: prev.y + 0.15 + velocity.current.x * delta * 0.05,
      }));

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isDragging]);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    velocity.current = { x: 0, y: 0 };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;

      const deltaX = e.clientX - lastPos.current.x;
      const deltaY = e.clientY - lastPos.current.y;

      velocity.current = { x: deltaX, y: deltaY };

      setRotation((prev) => ({
        x: Math.max(-60, Math.min(60, prev.x + deltaY * 0.5)),
        y: prev.y + deltaX * 0.5,
      }));

      lastPos.current = { x: e.clientX, y: e.clientY };
    },
    [isDragging]
  );

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  }, []);

  // Generate sphere positions using Fibonacci distribution
  const spherePositions = images.map((_, i) => {
    const n = images.length;
    const phi = Math.acos(1 - (2 * (i + 0.5)) / n);
    const theta = Math.PI * (1 + Math.sqrt(5)) * i;

    const x = Math.cos(theta) * Math.sin(phi);
    const y = Math.sin(theta) * Math.sin(phi);
    const z = Math.cos(phi);

    return { x, y, z };
  });

  const radius = typeof window !== 'undefined' && window.innerWidth < 768 ? 140 : 220;

  if (images.length === 0) {
    return (
      <div className="h-[400px] flex items-center justify-center border border-gray-200 bg-[#FAFAFA]">
        <p className="text-gray-400 text-sm">暂无 360° 视图数据</p>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[500px] md:h-[600px] cursor-grab active:cursor-grabbing select-none bg-[#FAFAFA]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      {/* Subtle grid background */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, black 1px, transparent 1px),
            linear-gradient(to bottom, black 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />

      {/* Sphere container */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          perspective: '1000px',
        }}
      >
        <div
          className="relative w-full h-full"
          style={{
            transformStyle: 'preserve-3d',
            transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
            transition: isDragging ? 'none' : 'transform 0.1s ease-out',
          }}
        >
          {images.map((image, i) => {
            const pos = spherePositions[i];
            const z = pos.z;
            const scale = 0.6 + (z + 1) * 0.4; // 0.6 to 1.0
            const opacity = 0.4 + (z + 1) * 0.3; // 0.4 to 0.7
            const zIndex = Math.round((z + 1) * 50);

            return (
              <div
                key={image.id}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300"
                style={{
                  transform: `translate3d(${pos.x * radius}px, ${-pos.y * radius}px, ${pos.z * radius}px) rotateY(${rotation.y * -0.3}deg) scale(${scale})`,
                  zIndex,
                  opacity,
                }}
              >
                <div
                  className={`w-20 h-20 md:w-24 md:h-24 overflow-hidden border transition-all duration-300 hover:scale-110 ${
                    z > 0
                      ? 'border-black shadow-lg'
                      : 'border-gray-300'
                  }`}
                  onClick={() => z > 0 && onImageClick?.(image)}
                  style={{ cursor: z > 0 ? 'pointer' : 'default' }}
                >
                  <img
                    src={image.url}
                    alt={image.alt}
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Center crosshair */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="w-16 h-px bg-gray-300" />
        <div className="h-16 w-px bg-gray-300 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      {/* Hint text */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-center">
        <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">
          Drag to Rotate · Click to View
        </p>
      </div>
    </div>
  );
}
