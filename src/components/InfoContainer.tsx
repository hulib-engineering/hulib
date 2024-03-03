import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import {
  customMessage,
  highlightMessage,
  newLineMessage,
} from '@/utils/i18NRichTextUtils';

type IInfoContainerProps = {
  i18nKey: 'about_stories' | 'about_mission' | 'about_vision';
  isTitleOutstanding: boolean;
  titleHighlightTextColor: string;
  imageSrc: string;
  imageAlt: string;
  imagePos: 'right' | 'left';
};

const InfoContainer = (props: IInfoContainerProps) => {
  const t = useTranslations('Index');

  return (
    <>
      <div className="flex flex-col flex-wrap items-center justify-between gap-4 lg:hidden">
        <div className="max-w-xl lg:flex-1">
          <Image
            alt={props.imageAlt}
            src={props.imageSrc}
            priority
            width={600}
            height={600}
            className="rounded-3xl object-cover lg:hidden"
          />
        </div>
        <div className="w-full text-[2rem] font-semibold capitalize text-slate-1000 sm:max-w-xl sm:text-[3.5rem]">
          {t.rich(`${props.i18nKey}.title`, {
            highlight: highlightMessage(false, props.titleHighlightTextColor),
            br: newLineMessage(),
          })}
          <div className="text-lg font-normal normal-case text-slate-1000">
            {t.rich(`${props.i18nKey}.description`, {
              br: newLineMessage(),
              important: customMessage('font-bold'),
            })}
          </div>
        </div>
      </div>
      <div className="hidden flex-row flex-nowrap items-center justify-between gap-8 lg:flex">
        {props.imagePos === 'left' && (
          <div className="max-w-xl lg:flex-1">
            <Image
              alt={props.imageAlt}
              src={props.imageSrc}
              priority
              width={600}
              height={600}
              className="rounded-3xl object-cover"
            />
          </div>
        )}
        <div className="text-[2rem] font-semibold capitalize text-slate-1000 sm:text-[3.5rem] lg:max-w-xl lg:flex-1">
          {t.rich(`${props.i18nKey}.title`, {
            highlight: highlightMessage(
              props.isTitleOutstanding,
              props.titleHighlightTextColor,
            ),
            br: newLineMessage(),
          })}
          <div className="text-lg font-normal normal-case text-slate-1000">
            {t.rich(`${props.i18nKey}.description`, {
              br: newLineMessage(),
              important: customMessage('font-bold'),
            })}
          </div>
        </div>
        {props.imagePos === 'right' && (
          <div className="max-w-xl lg:flex-1">
            <Image
              alt={props.imageAlt}
              src={props.imageSrc}
              priority
              width={600}
              height={600}
              className="hidden rounded-3xl lg:block"
            />
          </div>
        )}
      </div>
    </>
  );
};

export default InfoContainer;
