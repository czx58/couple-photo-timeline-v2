import { useCallback, useState, useRef } from 'react';

interface UploadZoneProps {
  person: 'me' | 'ta';
  label: string;
  accent: string; // tailwind color class
  onUploaded: () => void; // 上传成功后刷新热力图
}

const PERSON_INFO = {
  me: { emoji: '👤', title: '我的相册', hint: '拖入你的照片，或点这里选' },
  ta: { emoji: '💝', title: 'ta 的相册', hint: '拖入 ta 的照片，或点这里选' },
};

export default function UploadZone({ person, label, accent, onUploaded }: UploadZoneProps) {
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });
  const [result, setResult] = useState<{ ok: number; err: number; dates: Record<string, number> } | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const info = PERSON_INFO[person];

  const submitFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => /^image\//.test(f.type));
      if (arr.length === 0) return;

      setUploading(true);
      setProgress({ done: 0, total: arr.length });
      setResult(null);

      // 前端先做一层压缩（双保险）：1920px / q=0.82
      const compressed: Blob[] = [];
      for (const file of arr) {
        try {
          const blob = await compressImage(file);
          compressed.push(blob);
        } catch {
          compressed.push(file); // 压缩失败就用原图
        }
      }

      // 分批上传（每次 20 张，避免 multer 一次挂）
      const BATCH = 20;
      let allOk = 0;
      let allErr = 0;
      const allDates: Record<string, number> = {};

      for (let b = 0; b < compressed.length; b += BATCH) {
        const batch = compressed.slice(b, b + BATCH);
        const form = new FormData();
        form.append('person', person);
        for (const blob of batch) {
          // 保持原文件名让 multer 读 EXIF
          const idx = compressed.indexOf(blob);
          const origName = arr[idx]?.name || `img_${Date.now()}.jpg`;
          form.append('files', blob, origName);
        }

        try {
          const res = await fetch('/api/photos/upload', { method: 'POST', body: form });
          const json = await res.json();
          allOk += json.uploaded || 0;
          allErr += json.errors || 0;
          for (const [d, c] of Object.entries(json.dateCounts || {})) {
            allDates[d] = (allDates[d] || 0) + (c as number);
          }
        } catch (e) {
          allErr += batch.length;
        }
        setProgress({ done: Math.min(b + BATCH, compressed.length), total: compressed.length });
      }

      setResult({ ok: allOk, err: allErr, dates: allDates });
      setUploading(false);
      setProgress({ done: 0, total: 0 });
      onUploaded();
    },
    [person, onUploaded],
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    // 可能拖的是文件夹
    const items = e.dataTransfer.items;
    if (items && items.length > 0) {
      const files: File[] = [];
      const promises: Promise<void>[] = [];
      for (let i = 0; i < items.length; i++) {
        const entry = (items[i] as any).webkitGetAsEntry?.();
        if (entry) promises.push(traverse(entry, files));
        else if (items[i].kind === 'file') {
          const f = items[i].getAsFile();
          if (f) files.push(f);
        }
      }
      Promise.all(promises).then(() => submitFiles(files));
    } else {
      submitFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="relative">
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => !uploading && inputRef.current?.click()}
        className={`
          relative cursor-pointer rounded-xl border-2 border-solid transition-all duration-200 bg-white
          px-4 py-4 text-center overflow-hidden
          ${dragging ? 'border-neutral-900 bg-neutral-50 scale-[1.02]' : 'border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50'}
          ${uploading ? 'pointer-events-none' : ''}
        `}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files && submitFiles(e.target.files)}
        />

        <div className="font-medium text-neutral-900">{info.title}</div>
        <div className="text-xs text-neutral-500 mt-1">{info.hint}</div>

        {/* 进度 */}
        {uploading && (
          <div className="mt-4">
            <div className="h-2 rounded-full bg-neutral-100 overflow-hidden">
              <div
                className={`h-full transition-all ${accent}`}
                style={{ width: `${(progress.done / Math.max(1, progress.total)) * 100}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-neutral-500">
              {progress.done} / {progress.total}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// 遍历文件夹（webkit API）
async function traverse(entry: any, files: File[]): Promise<void> {
  return new Promise((resolve) => {
    if (entry.isFile) {
      entry.file((f: File) => {
        if (/^image\//.test(f.type)) files.push(f);
        resolve();
      }, () => resolve());
    } else if (entry.isDirectory) {
      const reader = entry.createReader();
      const readAll = () => {
        reader.readEntries(async (entries: any[]) => {
          if (entries.length === 0) return resolve();
          await Promise.all(entries.map((e) => traverse(e, files)));
          readAll();
        }, () => resolve());
      };
      readAll();
    } else resolve();
  });
}

// 前端压缩：File → Blob (1920px, q=0.82)
async function compressImage(file: File): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const maxW = 1920;
      const w = Math.min(maxW, img.width);
      const h = Math.round((img.height * w) / img.width);
      const canvas = document.createElement('canvas');
      canvas.width = w;
      canvas.height = h;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, w, h);
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error('blob fail'))),
        'image/jpeg',
        0.82,
      );
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}
