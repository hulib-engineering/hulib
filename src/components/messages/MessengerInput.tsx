'use client';

import { SmileySticker, TelegramLogo } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useEffect, useRef, useState } from 'react';

import IconButton from '@/components/core/iconButton/IconButton';
import Popover from '@/components/core/popover/Popover';
import { mergeClassnames } from '@/components/core/private/utils';
import TextInput from '@/components/core/textInput/TextInput';
import Tooltip from '@/components/core/tooltip/Tooltip';
import { useGetStickersQuery } from '@/libs/services/modules/stickers';
import type { Sticker } from '@/libs/services/modules/stickers/getStickers';
import { StickerImage } from '@/components/messages/StickerImage';

const StickerPicker = ({
  stickers = [],
  onStickerClick,
}: {
  stickers: Sticker[];
  onStickerClick: (id: string) => void;
}) => (
  <div className="grid grid-cols-4">
    {stickers.map((sticker: Sticker) => (
      <Tooltip key={sticker.id}>
        <Tooltip.Trigger>
          <button
            type="button"
            onClick={() => onStickerClick(sticker.id.toString())}
          >
            <StickerImage src={sticker.image?.path} alt={`Sticker ${sticker.name}`} />
          </button>
        </Tooltip.Trigger>
        <Tooltip.Content position="top-center" className="z-[999] p-2">
          <p className="font-bold capitalize">{sticker.name}</p>
          <Tooltip.Arrow />
        </Tooltip.Content>
      </Tooltip>
    ))}
  </div>
);

export const MessengerInput = ({
  outerStickerPicker = false,
  className,
  onSend,
}: {
  outerStickerPicker?: boolean;
  className?: string;
  onSend: (msg: string, type?: 'txt' | 'img') => void;
}) => {
  const t = useTranslations('Common');

  const { data: stickers } = useGetStickersQuery();

  const stickerTriggerRef = useRef<HTMLSpanElement>(null);
  const stickerPickerRef = useRef<HTMLDivElement>(null);

  const [typingMessage, setTypingMessage] = useState('');
  const [stickerPickerOpen, setStickerPickerOpen] = useState(false);

  useEffect(() => {
    if (!stickerPickerOpen) {
      return undefined;
    }
    const closeOnOutsideClick = (event: MouseEvent) => {
      const target = event.target as Node;
      if (!stickerTriggerRef.current?.contains(target) && !stickerPickerRef.current?.contains(target)) {
        setStickerPickerOpen(false);
      }
    };
    document.addEventListener('click', closeOnOutsideClick);
    return () => document.removeEventListener('click', closeOnOutsideClick);
  }, [stickerPickerOpen]);

  const handleClick = () => {
    if (!typingMessage.trim()) {
      return;
    }
    onSend(typingMessage);
    setTypingMessage('');
  };

  return (
    <div className={mergeClassnames('flex flex-col gap-2 border-t bg-white py-2.5', className)}>
      <div className="flex items-center justify-between gap-2.5 px-3">
        <TextInput
          id="message"
          type="text"
          value={typingMessage}
          placeholder={t('placeholder')}
          icon={
            !outerStickerPicker
              ? (
                  <span ref={stickerTriggerRef}>
                    <SmileySticker
                      className={mergeClassnames(
                        'size-6 cursor-pointer',
                        stickerPickerOpen && 'text-primary-60',
                      )}
                      onClick={() => setStickerPickerOpen(!stickerPickerOpen)}
                    />
                  </span>
                )
              : (
                  <Popover position="bottom-end">
                    <Popover.Trigger data-testid="sticker-picker-trigger">
                      <SmileySticker
                        className={mergeClassnames(
                          'size-6 cursor-pointer',
                          stickerPickerOpen && 'text-primary-60',
                        )}
                      />
                    </Popover.Trigger>
                    <Popover.Panel className="w-[480px] p-0">
                      <StickerPicker
                        stickers={stickers?.data}
                        onStickerClick={stickerId => onSend(stickerId, 'img')}
                      />
                    </Popover.Panel>
                  </Popover>
                )
          }
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.nativeEvent.isComposing) {
              e.preventDefault();
              handleClick();
            }
          }}
          onChange={e => setTypingMessage(e.currentTarget.value)}
        />
        {typingMessage.trim() !== '' && (
          <IconButton size="lg" className="h-11" onClick={handleClick}>
            <TelegramLogo size={20} />
          </IconButton>
        )}
      </div>
      {stickerPickerOpen && (
        <div ref={stickerPickerRef} className="max-h-[35dvh] max-h-[35vh] overflow-y-auto">
          <StickerPicker
            stickers={stickers?.data}
            onStickerClick={stickerId => onSend(stickerId, 'img')}
          />
        </div>
      )}
    </div>
  );
};
