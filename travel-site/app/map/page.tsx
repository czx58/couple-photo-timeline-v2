'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import ExploreMap, { MapLocation } from '../components/ExploreMap';
import PuzzleCard from '../components/PuzzleCard';
import TripTray from '../components/TripTray';
import { DirectionalTransition } from '../components/DirectionalTransition';

export default function MapPage() {
  const router = useRouter();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [tripItems, setTripItems] = useState<MapLocation[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('puzzle-trip-items');
    if (saved) {
      try {
        setTripItems(JSON.parse(saved));
      } catch {
        setTripItems([]);
      }
    }
    setIsLoaded(true);
  }, []);

  const handleAddToTrip = () => {
    if (!selectedLocation) return;
    const newItems = [...tripItems, selectedLocation];
    setTripItems(newItems);
    localStorage.setItem('puzzle-trip-items', JSON.stringify(newItems));
    setSelectedLocation(null);
  };

  return (
    <DirectionalTransition>
      <main className="relative h-screen w-full overflow-hidden">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          className="h-full w-full"
        >
          <ExploreMap onSelectLocation={setSelectedLocation} />
        </motion.div>

        <AnimatePresence>
          {selectedLocation && (
            <PuzzleCard
              location={selectedLocation}
              onAdd={handleAddToTrip}
              onClose={() => setSelectedLocation(null)}
            />
          )}
        </AnimatePresence>

        <TripTray
          items={tripItems}
          onExpand={() => router.push('/plan', { transitionTypes: ['nav-forward'] })}
        />
      </main>
    </DirectionalTransition>
  );
}
