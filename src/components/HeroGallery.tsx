import { useState } from 'react';
import { ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import type { ShoeImage } from '../types/shoe';

interface HeroGalleryProps {
  images: ShoeImage[];
}

export default function HeroGallery({ images }: HeroGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
    setImageLoaded(false);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    setImageLoaded(false);
  };

  const selectImage = (index: number) => {
    setCurrentIndex(index);
    setImageLoaded(false);
  };

  const angleLabels: Record<string, string> = {
    front: '正面',
    side: '侧面',
    back: '后跟',
    sole: '鞋底',
    detail: '细节',
    top: '俯视',
  };

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-[#F3F3F3] border border-gray-200 flex items-center justify-center">
        <p className="text-gray-400 text-sm">暂无图片</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Main Image */}
      <div className="relative aspect-square bg-white border border-gray-200 overflow-hidden">
        {/* Main shoe image */}
        <div className="absolute inset-0 flex items-center justify-center p-8 md:p-12">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border border-gray-300 border-t-black animate-spin" />
            </div>
          )}
          <img
            src={images[currentIndex].url}
            alt={images[currentIndex].alt}
            className={`max-w-full max-h-full object-contain transition-all duration-700 hover:scale-105 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            onLoad={() => setImageLoaded(true)}
          />
        </div>

        {/* Navigation arrows - desktop */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300 hidden md:flex"
              aria-label="上一张"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/90 border border-gray-200 text-gray-600 flex items-center justify-center hover:bg-black hover:text-white hover:border-black transition-all duration-300 hidden md:flex"
              aria-label="下一张"
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {/* Zoom button */}
        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 border border-gray-200 text-gray-500 flex items-center justify-center hover:text-black hover:border-black transition-all duration-300">
          <ZoomIn size={18} />
        </button>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-4 px-3 py-1.5 bg-black text-white">
            <span className="text-xs tracking-[0.1em] font-medium">
              {String(currentIndex + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </span>
          </div>
        )}

        {/* Angle label */}
        <div className="absolute top-4 left-4 px-3 py-1.5 bg-white border border-gray-200">
          <span className="text-[10px] tracking-[0.15em] text-gray-600 uppercase font-medium">
            {angleLabels[images[currentIndex].angle] || images[currentIndex].angle}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="mt-4">
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-thin">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => selectImage(index)}
                className={`relative flex-shrink-0 w-20 h-20 md:w-24 md:h-24 overflow-hidden transition-all duration-300 border ${
                  index === currentIndex
                    ? 'border-black'
                    : 'border-gray-200 hover:border-gray-400 opacity-70 hover:opacity-100'
                }`}
              >
                <img
                  src={image.url}
                  alt={image.alt}
                  className="w-full h-full object-cover"
                />
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-black/5" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
