'use client';

import { useTranslations } from 'next-intl';

import Checkbox from '@/components/core/checkbox/Checkbox';
import { mergeClassnames } from '@/components/core/private/utils';
import type { ScreenShareSource } from '../types';

export type ScreenSharePickerProps = {
  sources: ScreenShareSource[];
  includeAudio: boolean;
  onIncludeAudioChange: (value: boolean) => void;
  onSelect: (source?: ScreenShareSource) => void;
  onClose: () => void;
};

/**
 * Custom source picker for screen sharing.
 *
 * When `enumerateDevices()` exposes no usable display sources — the common case
 * on Firefox and Safari until a capture permission prompt has been answered —
 * the panel offers a single "share screen" action that hands straight over to the
 * browser's own picker, rather than rendering an empty grid.
 */
export function ScreenSharePicker({
  sources,
  includeAudio,
  onIncludeAudioChange,
  onSelect,
  onClose,
}: ScreenSharePickerProps) {
  const t = useTranslations('Reading.AgoraMeeting');

  const kindLabel = (kind: ScreenShareSource['kind']) =>
    kind === 'window' ? t('window_source') : t('screen_source');

  return (
    <div
      role="dialog"
      aria-label={t('share_content')}
      className="absolute bottom-full right-0 z-20 mb-3 w-[420px] rounded-2xl bg-white p-5 shadow-popover"
    >
      <div className="flex items-center justify-between gap-4">
        <h6 className="text-lg font-semibold text-neutral-10">{t('share_content')}</h6>

        <label className="flex cursor-pointer items-center gap-2">
          <Checkbox
            shape="square"
            checked={includeAudio}
            onChange={event => onIncludeAudioChange(event.target.checked)}
          />
          <span className="text-sm text-neutral-30">{t('include_system_audio')}</span>
        </label>
      </div>

      {sources.length === 0
        ? (
            <div className="mt-4 flex flex-col items-center gap-3">
              <p className="text-center text-sm text-neutral-40">{t('no_sources_available')}</p>
              <button
                type="button"
                className="w-full rounded-full bg-primary-60 px-4 py-2 text-sm font-medium text-white"
                onClick={() => onSelect(undefined)}
              >
                {t('share_content')}
              </button>
            </div>
          )
        : (
            <div className="mt-4 grid grid-cols-2 gap-3">
              {sources.map(source => (
                <button
                  key={source.deviceId}
                  type="button"
                  onClick={() => onSelect(source)}
                  className={mergeClassnames(
                    'flex flex-col items-center gap-2 rounded-xl p-2 transition-colors',
                    'hover:bg-neutral-98 focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary-60',
                  )}
                >
                  <span className="flex aspect-video w-full items-center justify-center rounded-lg bg-black text-xs text-neutral-70">
                    {kindLabel(source.kind)}
                  </span>
                  <span className="line-clamp-2 text-center text-xs text-neutral-30">
                    {source.label}
                  </span>
                </button>
              ))}
            </div>
          )}

      <button
        type="button"
        className="mt-4 w-full text-center text-xs text-neutral-40 underline"
        onClick={onClose}
      >
        {t('cancel')}
      </button>
    </div>
  );
}