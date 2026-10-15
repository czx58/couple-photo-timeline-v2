'use client';
import { ReactLenis } from 'lenis/react';
import React, { useEffect, useState } from 'react';

/**
 * PhotoGallery — 基于 sticky-scroll 组件改造的沉浸式画廊
 * 三列布局，中间 sticky，左右流动。Lenis 丝滑滚动。
 * props.photos 是后端返回的某天的照片 URL 数组
 */
interface PhotoGalleryProps {
  photos: string[];
  dateLabel: string; // 比如 "2026-01-24"
  onBack: () => void;
}

export default function PhotoGallery({ photos, dateLabel, onBack }: PhotoGalleryProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // 没照片时的兜底
  if (photos.length === 0) {
    return (
      <main className="min-h-screen bg-slate-950 text-white grid place-content-center px-6">
        <div className="text-center">
          <h1 className="text-4xl font-semibold mb-4">这天没有照片 🥲</h1>
          <p className="text-slate-400 mb-8">{dateLabel}</p>
          <button
            onClick={onBack}
            className="px-6 py-3 rounded-full border border-white/20 hover:border-white/60 transition"
          >
            ← 回到热力图
          </button>
        </div>
      </main>
    );
  }

  // 三列分：左、中（sticky）、右
  // 简单按索引分配：0,3,6... = 左，1,4,7... = 中，2,5,8... = 右
  const leftCol = photos.filter((_, i) => i % 3 === 0);
  const midCol = photos.filter((_, i) => i % 3 === 1);
  const rightCol = photos.filter((_, i) => i % 3 === 2);

  const Photo = ({ src, className = '' }: { src: string; className?: string }) => (
    <figure className={`w-full ${className}`}>
      <img
        src={src}
        alt=""
        loading="lazy"
        className="transition-all duration-500 w-full h-full object-cover rounded-md"
      />
    </figure>
  );

  return (
    <ReactLenis root>
      <main className="bg-black min-h-screen">
        {/* 顶部标题区 */}
        <section className="text-white h-screen w-full bg-slate-950 grid place-content-center sticky top-0 z-20">
          <div
            className="absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:54px_54px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"
          />
          <button
            onClick={onBack}
            className="absolute top-6 left-6 z-10 px-4 py-2 rounded-full border border-white/20 hover:border-white/60 transition text-sm"
          >
            ← 回到热力图
          </button>
          <div className="relative z-10 px-8 text-center">
            <div className="text-sm tracking-widest text-slate-400 uppercase mb-3">{dateLabel}</div>
            <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[120%]">
              {photos.length} {photos.length === 1 ? '张照片' : '张照片'}
              <br />
              <span className="text-slate-400 text-3xl sm:text-4xl font-normal">Scroll ↓</span>
            </h1>
          </div>
        </section>

        {/* 画廊：手机单列，桌面三列 sticky-scroll */}
        <section className="text-white w-full bg-slate-950">
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 px-2 sm:px-4 py-2">
            {/* 左列（手机上变成第一组） */}
            <div className="grid gap-2 col-span-12 sm:col-span-4">
              {leftCol.map((url, i) => (
                <Photo
                  key={`l-${i}`}
                  src={url}
                  className={i % 2 === 0 ? 'h-[22rem] sm:h-[22rem]' : 'h-[18rem] sm:h-[18rem]'}
                />
              ))}
            </div>

            {/* 中列 — 桌面 sticky，手机普通流动 */}
            <div className="sm:sticky sm:top-0 sm:h-screen w-full col-span-12 sm:col-span-4 gap-2 grid grid-cols-1 sm:grid-rows-3">
              {midCol.length === 0 ? (
                <div className="col-span-12 sm:col-span-4 flex items-center justify-center text-slate-500 py-12">
                  中间这列这天刚好没有，滚动看左右吧 💕
                </div>
              ) : (
                midCol.map((url, i) => (
                  <Photo key={`m-${i}`} src={url} className="w-full sm:h-full" />
                ))
              )}
            </div>

            {/* 右列（手机上变成第三组，因为左→中→右 顺序在桌面是好的，但手机混排更爽） */}
            <div className="grid gap-2 col-span-12 sm:col-span-4">
              {rightCol.map((url, i) => (
                <Photo
                  key={`r-${i}`}
                  src={url}
                  className={i % 2 === 0 ? 'h-[18rem] sm:h-[18rem]' : 'h-[22rem] sm:h-[22rem]'}
                />
              ))}
            </div>
          </div>
        </section>

        {/* 底部大字 */}
        <footer className="group bg-slate-950">
          <h1 className="text-[16vw] translate-y-20 leading-[100%] uppercase font-semibold text-center bg-gradient-to-r from-gray-400 to-gray-800 bg-clip-text text-transparent transition-all ease-linear">
            我们的 2026
          </h1>
          <div className="bg-black h-40 relative z-10 grid place-content-center text-2xl rounded-tr-full rounded-tl-full" />
        </footer>
      </main>
    </ReactLenis>
  );
}
