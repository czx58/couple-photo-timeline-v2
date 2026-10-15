import { Quote } from 'lucide-react';

interface ProductStoryProps {
  story: string;
}

export default function ProductStory({ story }: ProductStoryProps) {
  const paragraphs = story.split('\n\n').filter((p) => p.trim());

  return (
    <section className="border border-gray-200 p-6 md:p-8 bg-white">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-8 h-px bg-black" />
        <h2 className="font-display text-xl font-bold text-black tracking-[0.1em] uppercase">
          产品故事
        </h2>
      </div>

      <div className="space-y-6">
        {paragraphs.map((paragraph, index) => (
          <p
            key={index}
            className="text-gray-600 leading-relaxed text-base"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            {index === 0 && (
              <Quote
                size={20}
                className="float-left mr-3 mt-1 text-gray-300"
              />
            )}
            {paragraph}
          </p>
        ))}
      </div>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 border border-black flex items-center justify-center">
            <span className="font-display font-bold text-black text-sm">KB</span>
          </div>
          <div>
            <p className="text-black font-medium">Kobe Bryant 系列</p>
            <p className="text-gray-400 text-sm">致敬黑曼巴精神</p>
          </div>
        </div>
      </div>
    </section>
  );
}
