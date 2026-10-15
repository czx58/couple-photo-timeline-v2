import {
  Layers,
  Zap,
  Hexagon,
  MapPin,
  MoveVertical,
  Link,
  type LucideIcon,
} from 'lucide-react';
import type { ShoeSpec } from '../types/shoe';

interface SpecsProps {
  specs: ShoeSpec[];
}

const iconMap: Record<string, LucideIcon> = {
  layers: Layers,
  zap: Zap,
  hexagon: Hexagon,
  'map-pin': MapPin,
  'move-vertical': MoveVertical,
  link: Link,
};

export default function Specs({ specs }: SpecsProps) {
  return (
    <section className="border border-gray-200 p-6 md:p-8 bg-white">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-px bg-black" />
        <h2 className="font-display text-xl font-bold text-black tracking-[0.1em] uppercase">
          规格参数
        </h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-gray-200 border border-gray-200">
        {specs.map((spec, index) => {
          const IconComponent = iconMap[spec.icon] || Layers;
          return (
            <div
              key={spec.label}
              className="bg-[#FAFAFA] p-4 flex items-center gap-4 hover:bg-white transition-all duration-300 group"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex-shrink-0 w-10 h-10 border border-gray-200 flex items-center justify-center group-hover:border-black transition-all duration-300">
                <IconComponent size={18} className="text-gray-600" />
              </div>
              <div>
                <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase mb-0.5">{spec.label}</p>
                <p className="text-black font-medium text-sm">{spec.value}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
