'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { DirectionalTransition } from './components/DirectionalTransition';

export default function HomePage() {
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  const handleClick = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    setTimeout(() => {
      router.push('/map', { transitionTypes: ['nav-forward'] });
    }, 600);
  };

  return (
    <DirectionalTransition>
      <main
        className="relative flex h-screen w-full cursor-pointer flex-col items-center justify-center overflow-hidden bg-white"
        onClick={handleClick}
      >
      <motion.div
        className="pointer-events-none absolute inset-0 opacity-[0.04]"
        initial={{ opacity: 0, scale: 1.1 }}
        animate={isLeaving ? { opacity: 0 } : { opacity: 0.04, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 1000 500"
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="currentColor"
            className="text-gray-900"
            d="M180,100 C220,90 260,110 300,130 C340,150 380,140 420,160 C460,180 500,170 540,190 C580,210 620,200 660,220 C700,240 740,230 780,250 C820,270 860,260 900,280 L900,400 C860,380 820,390 780,370 C740,350 700,360 660,340 C620,320 580,330 540,310 C500,290 460,300 420,280 C380,260 340,270 300,250 C260,230 220,240 180,220 C140,200 120,210 100,230 L100,120 C120,110 140,110 180,100 Z"
          />
        </svg>
      </motion.div>

      <motion.div
        className="z-10 text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={
          isLeaving
            ? { opacity: 0, y: -30, scale: 0.96 }
            : { opacity: 1, y: 0, scale: 1 }
        }
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <h1 className="text-4xl font-light tracking-wide text-gray-900 md:text-6xl">
          Where do you want to go?
        </h1>
        <p className="mt-6 text-sm tracking-[0.3em] text-gray-400">
          EXPLORE. BUILD. GO.
        </p>
      </motion.div>

      <motion.div
        className="absolute bottom-8 text-xs text-gray-300"
        initial={{ opacity: 0 }}
        animate={isLeaving ? { opacity: 0 } : { opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        Click anywhere to start
      </motion.div>
    </main>
    </DirectionalTransition>
  );
}
