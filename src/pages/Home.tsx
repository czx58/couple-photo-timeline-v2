import { useState, useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import HeroGallery from '../components/HeroGallery';
import ProductInfo from '../components/ProductInfo';
import ProductStory from '../components/ProductStory';
import Specs from '../components/Specs';
import SphereGallery from '../components/SphereGallery';
import { shoesApi } from '../services/api';
import type { Shoe, ShoeImage } from '../types/shoe';

export default function Home() {
  const [shoes, setShoes] = useState<Shoe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [mainImage, setMainImage] = useState<ShoeImage | undefined>(undefined);

  const currentShoe = shoes[currentIndex];

  useEffect(() => {
    async function loadShoes() {
      try {
        setLoading(true);
        const data = await shoesApi.getAll();
        setShoes(data);
        if (data.length > 0) {
          setCurrentIndex(0);
          setMainImage(data[0].images[0]);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : '加载数据失败');
      } finally {
        setLoading(false);
      }
    }

    loadShoes();
  }, []);

  const handlePrev = () => {
    if (shoes.length <= 1) return;
    const newIndex = currentIndex === 0 ? shoes.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setMainImage(shoes[newIndex].images[0]);
  };

  const handleNext = () => {
    if (shoes.length <= 1) return;
    const newIndex = currentIndex === shoes.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setMainImage(shoes[newIndex].images[0]);
  };

  const handleSphereImageClick = (image: ShoeImage) => {
    setMainImage(image);
    const gallery = document.getElementById('hero-gallery');
    if (gallery) {
      gallery.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const sphereImages: ShoeImage[] = currentShoe
    ? Array.from({ length: 20 }, (_, i) => ({
        id: `sphere-${i}`,
        url: currentShoe.images[0]?.url || '',
        alt: `${currentShoe.name} ${i + 1}`,
        angle: 'side' as const,
      }))
    : [];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-xs tracking-[0.3em] text-gray-400 uppercase mb-2">Loading</p>
          <p className="text-gray-900 font-display text-2xl">SNEAKER ARCHIVE</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">加载失败: {error}</p>
          <p className="text-gray-500 text-sm">
            请确保后端服务器已启动（npm run server）
          </p>
        </div>
      </div>
    );
  }

  if (shoes.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
        <p className="text-gray-500">暂无鞋款数据</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />

      <main>
        {/* Hero - Magazine Cover Style */}
        <section className="min-h-screen pt-24 pb-16 flex flex-col justify-center relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
              {/* Left: Typography */}
              <div className="lg:col-span-5 order-2 lg:order-1 space-y-8">
                <div className="space-y-2">
                  <p className="text-[10px] tracking-[0.4em] text-gray-500 uppercase">
                    Current Exhibit / 当期展品
                  </p>
                  <div className="inline-flex items-center gap-2 border border-black px-3 py-1">
                    <span className="text-xs tracking-[0.2em] uppercase font-medium">
                      No. {String(currentIndex + 1).padStart(3, '0')}
                    </span>
                  </div>
                </div>

                <div>
                  <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-bold text-black leading-[0.9] tracking-tight uppercase">
                    Sneaker<br />Archive
                  </h1>
                  <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-md">
                    {currentShoe.description}
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="h-px bg-gray-200 w-full" />
                  <div className="flex items-baseline justify-between">
                    <div>
                      <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase mb-1">Model</p>
                      <p className="text-xl font-medium text-black">{currentShoe.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase mb-1">Colorway</p>
                      <p className="text-sm text-gray-700">{currentShoe.colorway}</p>
                    </div>
                  </div>
                  <div className="h-px bg-gray-200 w-full" />
                </div>

                <div className="flex items-center gap-4">
                  <button
                    onClick={handlePrev}
                    className="w-14 h-14 border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                    aria-label="上一款"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleNext}
                    className="w-14 h-14 border border-black flex items-center justify-center text-black hover:bg-black hover:text-white transition-all duration-300"
                    aria-label="下一款"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <span className="ml-4 text-xs tracking-[0.2em] text-gray-500 uppercase">
                    {String(currentIndex + 1).padStart(2, '0')} / {String(shoes.length).padStart(2, '0')}
                  </span>
                </div>
              </div>

              {/* Right: Image */}
              <div className="lg:col-span-7 order-1 lg:order-2 relative">
                <div className="relative aspect-square max-w-2xl mx-auto bg-white">
                  {currentShoe.images[0] ? (
                    <img
                      src={currentShoe.images[0].url}
                      alt={currentShoe.images[0].alt}
                      className="w-full h-full object-contain transition-transform duration-700 hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      暂无图片
                    </div>
                  )}
                </div>
                
                {/* Floating archive label */}
                <div className="absolute bottom-4 right-4 lg:bottom-8 lg:right-8 bg-black text-white px-4 py-2">
                  <p className="text-[10px] tracking-[0.3em] uppercase">Archive Entry</p>
                  <p className="text-sm font-medium">{currentShoe.brand}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2">
            <span className="text-[10px] tracking-[0.3em] text-gray-500 uppercase">Scroll</span>
            <div className="w-px h-8 bg-gray-300" />
          </div>
        </section>

        {/* Archive Entries */}
        <section id="archive" className="py-24 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="flex items-end justify-between mb-16">
              <div>
                <p className="text-[10px] tracking-[0.4em] text-gray-500 uppercase mb-3">Exhibit</p>
                <h2 className="font-display text-4xl md:text-5xl font-bold text-black uppercase tracking-tight">
                  Archive Entry
                </h2>
              </div>
              <p className="hidden md:block text-xs tracking-[0.2em] text-gray-500 uppercase">
                No. 001
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-gray-200 border border-gray-200">
              {/* Main exhibit card */}
              <div className="group bg-[#FAFAFA] p-6 text-left hover:bg-white transition-all duration-500">
                <div className="aspect-[4/3] bg-white mb-6 overflow-hidden">
                  {currentShoe.images[0] ? (
                    <img
                      src={currentShoe.images[0].url}
                      alt={currentShoe.images[0].alt}
                      className="w-full h-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      暂无图片
                    </div>
                  )}
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase mb-2">
                      {currentShoe.brand}
                    </p>
                    <h3 className="text-lg font-medium text-black leading-tight">
                      {currentShoe.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{currentShoe.colorway}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs tracking-[0.15em] text-gray-400 uppercase">
                      No. 001
                    </span>
                  </div>
                </div>
              </div>

              {/* Release info card */}
              <div className="group bg-[#FAFAFA] p-6 text-left hover:bg-white transition-all duration-500">
                <div className="aspect-[4/3] bg-white mb-6 overflow-hidden flex items-center justify-center">
                  <div className="text-center p-6">
                    <p className="text-[10px] tracking-[0.3em] text-gray-400 uppercase mb-4">Release Date</p>
                    <p className="font-display text-3xl md:text-4xl font-bold text-black tracking-tight">
                      {currentShoe.releaseDate ? new Date(currentShoe.releaseDate).getFullYear() : '—'}
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      {currentShoe.releaseDate
                        ? new Date(currentShoe.releaseDate).toLocaleDateString('zh-CN')
                        : '待定'}
                    </p>
                  </div>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase mb-2">Style Code</p>
                    <h3 className="text-lg font-medium text-black leading-tight font-mono">
                      {currentShoe.styleCode}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">参考价 ¥{currentShoe.price.toLocaleString()}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs tracking-[0.15em] text-gray-400 uppercase">Data</span>
                  </div>
                </div>
              </div>

              {/* Story card */}
              <div className="group bg-[#FAFAFA] p-6 text-left hover:bg-white transition-all duration-500">
                <div className="aspect-[4/3] bg-white mb-6 overflow-hidden p-6">
                  <p className="text-gray-600 text-sm leading-relaxed line-clamp-4">
                    {currentShoe.story.split('\n\n')[0]}
                  </p>
                </div>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase mb-2">Documentation</p>
                    <h3 className="text-lg font-medium text-black leading-tight">
                      设计故事
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">{currentShoe.collab ? `× ${currentShoe.collab}` : currentShoe.brand}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs tracking-[0.15em] text-gray-400 uppercase">Story</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detail Content */}
        <section className="py-24 bg-[#FAFAFA]">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-16">
              <p className="text-[10px] tracking-[0.4em] text-gray-500 uppercase mb-3">Documentation</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-black uppercase tracking-tight">
                Exhibit Notes
              </h2>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16">
              <div id="hero-gallery" className="lg:sticky lg:top-28 lg:self-start">
                <HeroGallery images={mainImage ? [mainImage] : []} />
              </div>

              <div className="space-y-8">
                <ProductInfo shoe={currentShoe} />
                <ProductStory story={currentShoe.story} />
                <Specs specs={currentShoe.specs} />
              </div>
            </div>
          </div>
        </section>

        {/* Sphere Gallery Section */}
        <section className="py-24 bg-white border-t border-gray-200">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="mb-16">
              <p className="text-[10px] tracking-[0.4em] text-gray-500 uppercase mb-3">Interactive</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold text-black uppercase tracking-tight">
                360° View
              </h2>
            </div>
            <div className="bg-[#FAFAFA] border border-gray-200">
              <SphereGallery
                images={sphereImages}
                onImageClick={handleSphereImageClick}
              />
            </div>
          </div>
        </section>

        {/* About */}
        <section id="about" className="py-24 bg-black text-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-3xl">
              <p className="text-[10px] tracking-[0.4em] text-gray-500 uppercase mb-6">About</p>
              <h2 className="font-display text-4xl md:text-5xl font-bold uppercase tracking-tight mb-8">
                记录每一双鞋背后的故事
              </h2>
              <p className="text-lg text-gray-400 leading-relaxed">
                Sneaker Archive 是一个专注于球鞋文化的数字档案馆。我们不卖鞋，只记录。
                从球场到街头，从设计草图到发售历史，每一双鞋都承载着属于它的时代记忆。
              </p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-black text-white border-t border-gray-800 py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <p className="font-display text-xl font-bold tracking-[0.15em] uppercase">
                Sneaker Archive
              </p>
              <p className="text-[10px] tracking-[0.3em] text-gray-500 uppercase mt-1">
                Est. 2024
              </p>
            </div>
            <p className="text-gray-500 text-sm">
              本站仅供学习交流使用，图片版权归原作者所有
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
