import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: '份量翻译器 · 做饭不翻车',
  description: '选几个人吃，给你一份量刚好的菜谱',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="min-h-screen bg-kitchen-cream">
        <div className="mx-auto max-w-md px-4 py-6">{children}</div>
      </body>
    </html>
  );
}
