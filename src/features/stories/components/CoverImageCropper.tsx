import { ArrowsOutCardinalIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import Button from '@/components/core/button/Button';

type Props = {
  src: string;
  disabled?: boolean;
  onCancel: () => void;
  onSave: (src: string) => void;
};

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function CoverImageCropper({ src, onCancel, onSave, disabled = false }: Props) {
  const t = useTranslations('Common');
  const [zoom, setZoom] = useState(1);
  const [x, setX] = useState(50);
  const [y, setY] = useState(50);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const frameRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{ x: number; y: number } | null>(null);

  const minSide = Math.min(dimensions.width, dimensions.height);
  const width = minSide ? dimensions.width / minSide * zoom * 100 : 100;
  const height = minSide ? dimensions.height / minSide * zoom * 100 : 100;

  const moveImage = (dx: number, dy: number) => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }
    const size = frame.getBoundingClientRect().width;
    const overflowX = (width / 100 - 1) * size;
    const overflowY = (height / 100 - 1) * size;
    if (overflowX > 0) {
      setX(value => clamp(value - dx / overflowX * 100, 0, 100));
    }
    if (overflowY > 0) {
      setY(value => clamp(value - dy / overflowY * 100, 0, 100));
    }
  };

  const save = () => {
    const image = new window.Image();
    image.onload = () => {
      const size = Math.min(image.naturalWidth, image.naturalHeight) / zoom;
      const left = (image.naturalWidth - size) * x / 100;
      const top = (image.naturalHeight - size) * y / 100;
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const context = canvas.getContext('2d');
      if (!context) {
        return;
      }
      context.drawImage(image, left, top, size, size, 0, 0, 512, 512);
      onSave(canvas.toDataURL('image/png'));
    };
    image.src = src;
  };

  return (
    <div className="flex w-[min(84vw,560px)] flex-col bg-[#242526] text-white">
      <h2 className="px-6 pt-5 text-xl font-semibold">{t('cover_crop_title')}</h2>
      <div className="relative mx-auto flex aspect-square w-full max-w-[400px] items-center justify-center overflow-hidden">
        <div
          ref={frameRef}
          role="button"
          tabIndex={0}
          aria-label={t('cover_crop_move')}
          className="relative aspect-square w-3/4 cursor-move touch-none outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          onPointerDown={(event) => {
            event.currentTarget.setPointerCapture(event.pointerId);
            dragRef.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerMove={(event) => {
            if (!dragRef.current) {
              return;
            }
            moveImage(event.clientX - dragRef.current.x, event.clientY - dragRef.current.y);
            dragRef.current = { x: event.clientX, y: event.clientY };
          }}
          onPointerUp={() => {
            dragRef.current = null;
          }}
          onPointerCancel={() => {
            dragRef.current = null;
          }}
          onKeyDown={(event) => {
            const moves: Record<string, [number, number]> = { ArrowLeft: [-10, 0], ArrowRight: [10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
            const move = moves[event.key];
            if (move) {
              event.preventDefault();
              moveImage(...move);
            }
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={src}
            alt=""
            draggable={false}
            onLoad={event => setDimensions({ width: event.currentTarget.naturalWidth, height: event.currentTarget.naturalHeight })}
            className="pointer-events-none absolute max-w-none select-none"
            style={{ width: `${width}%`, height: `${height}%`, left: `${(100 - width) * x / 100}%`, top: `${(100 - height) * y / 100}%` }}
          />
          <div aria-hidden className="pointer-events-none absolute inset-0 border border-white/80 shadow-[0_0_0_999px_rgba(0,0,0,0.6)]" />
          <div className="pointer-events-none absolute inset-x-2 top-2 flex items-center gap-2 rounded-lg bg-black/60 px-3 py-2 text-sm font-medium">
            <ArrowsOutCardinalIcon size={20} className="shrink-0" />
            {t('cover_crop_move')}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-8 pb-7 pt-3">
        <button type="button" aria-label={t('cover_crop_zoom_out')} onClick={() => setZoom(value => clamp(value - 0.1, 1, 3))}><MinusIcon size={20} /></button>
        <input aria-label={t('cover_crop_zoom')} className="w-full accent-blue-500" type="range" min={1} max={3} step={0.01} value={zoom} onChange={event => setZoom(Number(event.target.value))} />
        <button type="button" aria-label={t('cover_crop_zoom_in')} onClick={() => setZoom(value => clamp(value + 0.1, 1, 3))}><PlusIcon size={20} /></button>
      </div>
      <div className="flex justify-end gap-3 border-t border-white/20 p-4">
        <Button variant="ghost" size="lg" onClick={onCancel}>{t('cancel')}</Button>
        <Button size="lg" onClick={save} disabled={!minSide || disabled}>{t('done')}</Button>
      </div>
    </div>
  );
}
