'use client';

import { motion } from 'framer-motion';
import { MapLocation } from './ExploreMap';

interface PuzzleCardProps {
  location: MapLocation;
  onAdd: () => void;
  onClose: () => void;
}

export default function PuzzleCard({ location, onAdd, onClose }: PuzzleCardProps) {
  const subtitle = [location.district, location.city, location.province]
    .filter(Boolean)
    .join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.85, y: 20 }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
      className="absolute left-1/2 top-1/2 z-20 w-64 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-gray-200 bg-white p-5 shadow-xl"
    >
      <button
        onClick={onClose}
        className="absolute right-3 top-2 text-xl text-gray-400 transition hover:text-gray-600"
      >
        ×
      </button>
      <motion.div
        initial={{ rotate: -10, scale: 0.8 }}
        animate={{ rotate: 0, scale: 1 }}
        transition={{ delay: 0.1, duration: 0.4, type: 'spring', stiffness: 200 }}
        className="mb-3 text-3xl"
      >
        🧩
      </motion.div>
      <h3 className="text-lg font-semibold text-gray-900">{location.name}</h3>
      <p className="text-sm text-gray-500">{subtitle || 'Selected location'}</p>
      <div className="mt-4 text-xs text-gray-400">Recommended 2–3 days</div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={onAdd}
        className="mt-4 w-full rounded-lg bg-blue-600 py-2 text-sm font-medium text-white hover:bg-blue-700"
      >
        Add to Trip
      </motion.button>
    </motion.div>
  );
}
