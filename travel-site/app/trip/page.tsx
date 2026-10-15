'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { MapLocation } from '../components/ExploreMap';
import { DirectionalTransition } from '../components/DirectionalTransition';

export default function TripPage() {
  const [items, setItems] = useState<MapLocation[]>([]);
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('puzzle-trip-items');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setItems(parsed);
        generateTrip(parsed);
      } catch {
        setLoading(false);
        setError('读取行程失败');
      }
    } else {
      setLoading(false);
      setError('还没有选择任何地点');
    }
  }, []);

  const generateTrip = async (tripItems: MapLocation[]) => {
    try {
      const res = await fetch('/api/generate-trip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: tripItems }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || '生成失败');
      } else if (data.data?.result) {
        setResult(data.data.result);
      } else {
        setError('返回数据异常');
      }
    } catch {
      setError('网络错误，请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DirectionalTransition>
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-white px-6 py-10"
      >
      <Link
        href="/plan"
        transitionTypes={['nav-back']}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-600 transition hover:bg-gray-50"
      >
        ← Back to Compose
      </Link>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="mb-6 mt-8 text-3xl font-light text-gray-900"
      >
        Your Trip
      </motion.h1>

      <AnimatePresence mode="wait">
        {items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-5"
          >
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-gray-500">
              Route
            </h2>
            <div className="flex flex-wrap items-center gap-2 text-lg text-gray-800">
              {items.map((item, index) => (
                <span key={index} className="flex items-center gap-2">
                  <span>🧩 {item.name}</span>
                  {index < items.length - 1 && <span className="text-gray-400">→</span>}
                </span>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="py-12 text-center text-gray-500"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
              className="mx-auto mb-4 h-8 w-8 rounded-full border-2 border-gray-200 border-t-blue-600"
            />
            <p className="text-lg">AI is planning your trip...</p>
            <p className="mt-2 text-sm text-gray-400">把你在地图上拼出来的路线变成真实计划</p>
          </motion.div>
        )}
      </AnimatePresence>

      {error && <p className="py-8 text-center text-red-500">{error}</p>}

      <AnimatePresence>
        {result && (
          <motion.article
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="prose prose-lg max-w-none text-gray-800"
          >
            <ReactMarkdown>{result}</ReactMarkdown>
          </motion.article>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {result && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-12 flex gap-4"
          >
            <button className="rounded-full bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700">
              Save
            </button>
            <button className="rounded-full border border-gray-300 px-6 py-2 text-gray-700 transition hover:bg-gray-50">
              Share
            </button>
            <button className="rounded-full border border-gray-300 px-6 py-2 text-gray-700 transition hover:bg-gray-50">
              Export
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.main>
    </DirectionalTransition>
  );
}
