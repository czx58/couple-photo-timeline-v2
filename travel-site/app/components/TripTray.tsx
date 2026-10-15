'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapLocation } from './ExploreMap';

interface TripTrayProps {
  items: MapLocation[];
  onExpand: () => void;
}

export default function TripTray({ items, onExpand }: TripTrayProps) {
  return (
    <motion.div
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed bottom-0 left-0 right-0 z-30 cursor-pointer border-t border-gray-200 bg-white px-6 py-4 shadow-lg"
      onClick={onExpand}
    >
      <div className="mx-auto flex max-w-4xl items-center gap-4">
        <span className="text-sm font-semibold text-gray-900">My Trip</span>
        <AnimatePresence mode="popLayout">
          {items.length === 0 ? (
            <motion.span
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-gray-400"
            >
              No pieces yet. Click the map to explore.
            </motion.span>
          ) : (
            <div className="flex flex-1 items-center gap-3 overflow-x-auto">
              {items.map((item, index) => (
                <motion.div
                  key={`${item.name}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.6, x: -20 }}
                  animate={{ opacity: 1, scale: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 25 }}
                  className="flex shrink-0 items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-sm text-blue-700"
                >
                  <span>🧩</span>
                  <span>{item.name}</span>
                </motion.div>
              ))}
            </div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
