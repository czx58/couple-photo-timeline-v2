'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { MapLocation } from '../components/ExploreMap';
import { DirectionalTransition } from '../components/DirectionalTransition';

export default function PlanPage() {
  const [items, setItems] = useState<MapLocation[]>([]);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('puzzle-trip-items');
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch {
        setItems([]);
      }
    }
  }, []);

  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === index) return;
    const newItems = [...items];
    const [moved] = newItems.splice(draggedIndex, 1);
    newItems.splice(index, 0, moved);
    setDraggedIndex(index);
    setItems(newItems);
    localStorage.setItem('puzzle-trip-items', JSON.stringify(newItems));
  };

  const handleRemove = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    localStorage.setItem('puzzle-trip-items', JSON.stringify(newItems));
  };

  return (
    <DirectionalTransition>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="flex min-h-screen flex-col items-center bg-white px-6 py-12"
      >
      <Link
        href="/map"
        transitionTypes={['nav-back']}
        className="absolute left-6 top-6 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
      >
        ← Back to Map
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-4 text-3xl font-light text-gray-900"
      >
        Compose Your Trip
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-10 text-sm text-gray-400"
      >
        Drag the pieces to arrange your route
      </motion.p>

      <motion.div
        layout
        className="flex min-h-[200px] flex-wrap items-center justify-center gap-4"
      >
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <motion.div
              key={`${item.name}-${index}`}
              layout
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              initial={{ opacity: 0, scale: 0.6, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.6 }}
              whileHover={{ y: -4, boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
              transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
              className="flex cursor-move items-center gap-3 rounded-xl border border-gray-200 bg-white px-5 py-4 shadow-sm"
            >
              <span className="text-2xl">🧩</span>
              <div>
                <p className="font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500">{item.city || item.province}</p>
              </div>
              <button
                onClick={() => handleRemove(index)}
                className="ml-2 text-xl text-gray-400 transition hover:text-red-500"
              >
                ×
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {items.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="mt-8 text-gray-400"
          >
            No pieces yet.{' '}
            <Link href="/map" transitionTypes={['nav-back']} className="text-blue-600 hover:underline">
              Go back to the map
            </Link>{' '}
            to explore.
          </motion.p>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ delay: 0.2, duration: 0.4 }}
          >
            <Link
              href="/trip"
              transitionTypes={['nav-forward']}
              className="mt-12 inline-block rounded-full bg-green-600 px-8 py-3 text-center font-medium text-white transition hover:bg-green-700 hover:scale-105"
            >
              Build My Trip
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
    </DirectionalTransition>
  );
}
