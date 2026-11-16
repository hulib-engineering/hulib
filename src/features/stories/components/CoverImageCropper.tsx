import { ArrowsOutCardinalIcon, MinusIcon, PlusIcon } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useRef, useState } from 'react';

import { applyCropGesture, clamp } from './coverCropGesture';
import type { CropPoint, CropPosition } from './coverCropGesture';

import Button from '@/components/core/button/Button';

type Props = {
  src: string;
  disabled?: boolean;
  onCancel: () => void;
  onSave: (src: string) => void;
};

export function CoverImageCropper({ src, onCancel, onSave, disabled = false }: Props) {
  const t = useTranslations('Common');
  const [crop, setCrop] = useState<CropPosition>({ zoom: 1, x: 50, y: 50 });
  const cropRef = useRef(crop);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const frameRef = useRef<HTMLDivElement>(null);
  const pointersRef = useRef(new Map<number, CropPoint>());

  const { zoom, x, y } = crop;
  const updateCrop = (next: CropPosition) => {
    cropRef.current = next;
    setCrop(next);
  };

  const minSide = Math.min(dimensions.width, dimensions.height);
  const width = minSide ? dimensions.width / minSide * zoom * 100 : 100;
  const height = minSide ? dimensions.height / minSide * zoom * 100 : 100;

  const moveImage = (dx: number, dy: number) => {
    const frame = frameRef.current;
    if (!frame) {
      return;
    }
    updateCrop(applyCropGesture(cropRef.current, dimensions, frame.getBoundingClientRect().width, [{ x: 0, y: 0 }], [{ x: dx, y: dy }]));
  };

  const changeZoom = (value: number) => updateCrop({ ...cropRef.current, zoom: clamp(value, 1, 3) });

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
      <div className="relative mx-auto flex aspect-square w-full max-w-[min(400px,calc(100dvh-220px))] items-center justify-center overflow-hidden">
        <div
          ref={frameRef}
          role="button"
          tabIndex={0}
          aria-label={t('cover_crop_move')}
          className="relative aspect-square w-3/4 cursor-move touch-none outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
          onPointerDown={(event) => {
            if (event.pointerType === 'mouse' && event.button !== 0) {
              return;
            }
            event.currentTarget.setPointerCapture(event.pointerId);
            pointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
          }}
          onPointerMove={(event) => {
            const pointers = pointersRef.current;
            if (!pointers.has(event.pointerId)) {
              return;
            }
            const frame = frameRef.current;
            if (!frame) {
              return;
            }
            const rect = frame.getBoundingClientRect();
            const previous = Array.from(pointers.values()).slice(0, 2).map(point => ({ x: point.x - rect.left, y: point.y - rect.top }));
            pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
            const current = Array.from(pointers.values()).slice(0, 2).map(point => ({ x: point.x - rect.left, y: point.y - rect.top }));
            updateCrop(applyCropGesture(cropRef.current, dimensions, rect.width, previous, current));
          }}
          onPointerUp={(event) => {
            pointersRef.current.delete(event.pointerId);
          }}
          onPointerCancel={(event) => {
            pointersRef.current.delete(event.pointerId);
          }}
          onLostPointerCapture={(event) => {
            pointersRef.current.delete(event.pointerId);
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
            <span className="hidden sm:inline">{t('cover_crop_move')}</span>
            <span className="sm:hidden">{t('cover_crop_touch')}</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-3 px-8 pb-7 pt-3">
        <button type="button" aria-label={t('cover_crop_zoom_out')} onClick={() => changeZoom(cropRef.current.zoom - 0.1)}><MinusIcon size={20} /></button>
        <input aria-label={t('cover_crop_zoom')} className="w-full accent-blue-500" type="range" min={1} max={3} step={0.01} value={zoom} onChange={event => changeZoom(Number(event.target.value))} />
        <button type="button" aria-label={t('cover_crop_zoom_in')} onClick={() => changeZoom(cropRef.current.zoom + 0.1)}><PlusIcon size={20} /></button>
      </div>
      <div className="flex justify-end gap-3 border-t border-white/20 p-4">
        <Button variant="ghost" size="lg" onClick={onCancel}>{t('cancel')}</Button>
        <Button size="lg" onClick={save} disabled={!minSide || disabled}>{t('done')}</Button>
      </div>
    </div>
  );
}
