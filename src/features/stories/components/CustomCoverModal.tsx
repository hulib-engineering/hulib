import {
  Minus,
  PaintBrushBroad,
  Plus,
  TextAUnderline,
} from '@phosphor-icons/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { ColorPicker } from './ColorPicker';
import { FontSelect } from './FontSelect';

import Button from '@/components/core/button/Button';
import { mergeClassnames } from '@/components/core/private/utils';
import Modal from '@/components/Modal';
import { CustomCoverBuilder } from '@/features/stories/components/CustomCoverBuilder';
import {
  BACKGROUND_COLORS,
  COVER_ILLUSTRATIONS,
  COVER_PREVIEW_ELEMENT_ID,
  MAX_TITLE_FONT_SIZE,
  MIN_TITLE_FONT_SIZE,
  TEXT_COLORS,
  TITLE_FONT_SIZE_STEP,
} from '@/features/stories/constants';
import type { CoverCustomization } from '@/features/stories/types';

export type CustomCoverModalProps = {
  open: boolean;
  title: string;
  authorName: string;
  initialCustomization: CoverCustomization;
  onClose: () => void;
  onDoneClick: (payload: { customization: CoverCustomization }) => void;
};

export const CustomCoverModal = ({
  open,
  title,
  authorName,
  initialCustomization,
  onClose,
  onDoneClick,
}: CustomCoverModalProps) => {
  const t = useTranslations('Common');

  const [customization, setCustomization] = useState<CoverCustomization>(initialCustomization);
  const [selectedIllustrationId, setSelectedIllustrationId] = useState<string | null>(null);
  const [rightPanelHeight, setRightPanelHeight] = useState<number | null>(null);
  const rightPanelRef = useRef<HTMLDivElement>(null);

  const isExpanded = selectedIllustrationId !== null;

  useEffect(() => {
    if (open) {
      setCustomization(initialCustomization);
      setSelectedIllustrationId(
        initialCustomization.illustrationSrc
          ? COVER_ILLUSTRATIONS.find(item => item.src === initialCustomization.illustrationSrc)?.id ?? null
          : null,
      );
    }
  }, [open, initialCustomization]);

  useLayoutEffect(() => {
    if (!isExpanded) {
      setRightPanelHeight(null);
      return;
    }

    const node = rightPanelRef.current;
    if (!node) {
      return;
    }

    const syncHeight = () => setRightPanelHeight(node.offsetHeight);
    syncHeight();

    const observer = new ResizeObserver(syncHeight);
    observer.observe(node);
    return () => observer.disconnect();
  }, [isExpanded, customization, title, authorName]);

  const patchCustomization = useCallback((patch: Partial<CoverCustomization>) => {
    setCustomization(prev => ({ ...prev, ...patch }));
  }, []);

  const handleSelectIllustration = (id: string, src: string) => {
    setSelectedIllustrationId(id);
    patchCustomization({ illustrationSrc: src });
  };

  const handleCancel = () => {
    onClose();
  };

  const handleDoneClick = () => {
    onDoneClick({ customization });
    onClose();
  };

  const adjustFontSize = (delta: number) => {
    const next = customization.titleFontSize + delta;
    if (next >= MIN_TITLE_FONT_SIZE && next <= MAX_TITLE_FONT_SIZE) {
      patchCustomization({ titleFontSize: next });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-auto overflow-hidden rounded-[20px] shadow-xl">
        <div className="flex max-h-[90vh] flex-col gap-8 bg-white p-8">
          <div
            className={mergeClassnames(
              'flex min-h-0 flex-1 gap-6',
              isExpanded ? 'lg:flex-row lg:items-start' : 'flex-col',
            )}
          >
            <div
              className={mergeClassnames(
                'w-full shrink-0',
                isExpanded && 'lg:w-[384px]',
              )}
            >
              <div
                className={mergeClassnames(
                  'flex flex-col overflow-hidden rounded-2xl bg-neutral-variant-98 p-5',
                  !isExpanded && 'max-h-[456px]',
                )}
                style={
                  isExpanded && rightPanelHeight != null
                    ? { maxHeight: rightPanelHeight }
                    : undefined
                }
              >
                <div className="custom-scrollbar min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-3">
                  <div className="grid grid-cols-3 gap-3">
                    {COVER_ILLUSTRATIONS.map(item => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelectIllustration(item.id, item.src)}
                        className={mergeClassnames(
                          'flex items-center justify-center overflow-hidden rounded-lg border transition',
                          !isExpanded
                            ? 'size-[132px]'
                            : 'size-[100px]',
                          selectedIllustrationId === item.id
                            ? 'border-primary-50'
                            : 'border-neutral-80',
                        )}
                      >
                        <Image
                          src={item.src}
                          alt={`Illustration cover ${item.id}`}
                          width={isExpanded ? 131 : 100}
                          height={isExpanded ? 131 : 100}
                          className="size-full rounded-lg object-cover"
                          unoptimized
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {isExpanded && (
              <div
                ref={rightPanelRef}
                className="flex w-auto shrink-0 flex-col items-center gap-5 self-start rounded-2xl bg-neutral-variant-98 p-5"
              >
                <div className="flex w-full items-center gap-4">
                  <FontSelect
                    value={customization.titleFontFamily}
                    onChange={fontFamily => patchCustomization({ titleFontFamily: fontFamily })}
                    ariaLabel={t('cover_font')}
                  />
                  <div className="flex shrink-0 items-center gap-2 rounded-full bg-white px-4 py-3">
                    <button
                      type="button"
                      aria-label={t('decrease_font_size')}
                      onClick={() => adjustFontSize(-TITLE_FONT_SIZE_STEP)}
                      className="flex size-5 items-center justify-center text-primary-10"
                    >
                      <Minus size={20} weight="bold" />
                    </button>
                    <span className="min-w-6 text-center text-base font-medium leading-5 text-primary-10">
                      {customization.titleFontSize}
                    </span>
                    <button
                      type="button"
                      aria-label={t('increase_font_size')}
                      onClick={() => adjustFontSize(TITLE_FONT_SIZE_STEP)}
                      className="flex size-5 items-center justify-center text-primary-10"
                    >
                      <Plus size={20} weight="bold" />
                    </button>
                  </div>
                </div>

                <ColorPicker
                  icon={TextAUnderline}
                  colors={TEXT_COLORS}
                  value={customization.titleColor}
                  ariaLabel={t('cover_text_color')}
                  onChange={color => patchCustomization({
                    titleColor: color,
                    authorColor: color,
                  })}
                />

                <div className="flex justify-center overflow-visible">
                  <CustomCoverBuilder
                    previewId={COVER_PREVIEW_ELEMENT_ID}
                    storyTitle={title.trim() || t('placeholder_title')}
                    authorName={authorName}
                    customization={customization}
                    active
                  />
                </div>

                <ColorPicker
                  icon={PaintBrushBroad}
                  colors={BACKGROUND_COLORS}
                  value={customization.backgroundColor}
                  ariaLabel={t('cover_background_color')}
                  onChange={color => patchCustomization({ backgroundColor: color })}
                />
              </div>
            )}
          </div>

          <div
            className={mergeClassnames(
              'flex justify-between gap-8',
              isExpanded && 'w-2/3 justify-center self-center',
            )}
          >
            <Button variant="outline" size="lg" fullWidth onClick={handleCancel}>
              {t('cancel')}
            </Button>
            <Button
              size="lg"
              fullWidth
              onClick={handleDoneClick}
              disabled={!isExpanded}
            >
              {t('done')}
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};
