'use client';

import { SmileySticker, TelegramLogo } from '@phosphor-icons/react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

import IconButton from '../iconButton/IconButton';
import Popover from '../popover/Popover';
import TextInput from '../textInput/TextInput';
import Tooltip from '../tooltip/Tooltip';
import type { Sticker } from '@/libs/services/modules/stickers/getStickers';
import { useGetStickersQuery } from '@/libs/services/modules/stickers';
import { mergeClassnames } from '@/components/private/utils';

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
            <Image
              alt={`Sticker ${sticker.name}`}
              width={120}
              height={120}
              className="size-full cursor-pointer object-contain"
              src={sticker.image?.path ?? ''}
            />
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
  onSend,
}: {
  outerStickerPicker?: boolean;
  onSend: (msg: string, type?: 'txt' | 'img') => void;
}) => {
  const { data: stickers } = useGetStickersQuery();

  const textInputRef = useRef<HTMLInputElement | null>(null);

  const [isTyping, setIsTyping] = useState(false);
  const [typingMessage, setTypingMessage] = useState('');
  const [stickerPickerOpen, setStickerPickerOpen] = useState(false);

  const handleTyping = () => {
    if (!isTyping) {
      setIsTyping(true);
    }
  };
  const handleClick = () => {
    onSend(typingMessage);
    if (textInputRef.current) {
      textInputRef.current.value = '';
    }
  };

  return (
    <div className="flex flex-col gap-2 border-t bg-white py-2.5">
      <div className="flex items-center justify-between gap-2.5 px-3">
        <TextInput
          id="message"
          ref={textInputRef}
          type="text"
          placeholder="Placeholder"
          icon={
            !outerStickerPicker
              ? (
                  <SmileySticker
                    className={mergeClassnames(
                      'size-6 cursor-pointer',
                      stickerPickerOpen && 'text-primary-60',
                    )}
                    onClick={() => setStickerPickerOpen(!stickerPickerOpen)}
                  />
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
            if (e.key === 'Enter') {
              onSend(e.currentTarget.value);
              e.currentTarget.value = '';
            }
          }}
          onInput={handleTyping}
          onBlur={() => setIsTyping(false)}
          onChange={e => setTypingMessage(e.currentTarget.value)}
        />
        {(isTyping || typingMessage !== '') && (
          <IconButton size="lg" className="h-11" onClick={handleClick}>
            <TelegramLogo size={20} />
          </IconButton>
        )}
      </div>
      {stickerPickerOpen && (
        <StickerPicker
          stickers={stickers?.data}
          onStickerClick={stickerId => onSend(stickerId, 'img')}
        />
      )}
    </div>
  );
};
