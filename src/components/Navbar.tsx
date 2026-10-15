import { useState, useEffect } from 'react';
import { Search, Menu, X, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAFAFA]/90 backdrop-blur-md border-b border-gray-200 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 border border-black flex items-center justify-center">
              <span className="font-display font-bold text-black text-lg tracking-tighter">
                SA
              </span>
            </div>
            <div className="hidden sm:block">
              <span className="font-display text-lg font-bold tracking-[0.15em] text-black uppercase">
                Sneaker Archive
              </span>
              <span className="block text-[10px] tracking-[0.3em] text-gray-500 uppercase">
                Est. 2024
              </span>
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: '档案', href: '#archive' },
              { label: '关于', href: '#about' },
            ].map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="text-xs tracking-[0.2em] text-gray-600 hover:text-black transition-colors duration-300 uppercase font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Icons */}
          <div className="flex items-center gap-2">
            <Link
              to="/admin"
              className="hidden md:flex items-center gap-2 px-4 py-2 text-xs tracking-[0.15em] text-gray-600 hover:text-black hover:bg-black/5 transition-all duration-300 uppercase"
              title="管理后台"
            >
              <Settings size={16} />
              <span>管理</span>
            </Link>
            <button className="p-2 text-gray-600 hover:text-black transition-all duration-300">
              <Search size={20} />
            </button>
            <button
              className="md:hidden p-2 text-gray-600 hover:text-black transition-all"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 bg-[#FAFAFA] border-t border-gray-200">
            <div className="flex flex-col gap-1 py-4">
              {['档案', '关于'].map((item) => (
                <a
                  key={item}
                  href={`#${item === '档案' ? 'archive' : 'about'}`}
                  className="text-gray-700 hover:text-black hover:bg-black/5 transition-all py-3 px-4 text-xs tracking-[0.2em] uppercase font-medium"
                >
                  {item}
                </a>
              ))}
              <Link
                to="/admin"
                className="text-gray-700 hover:text-black hover:bg-black/5 transition-all py-3 px-4 text-xs tracking-[0.2em] uppercase font-medium"
              >
                管理
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
