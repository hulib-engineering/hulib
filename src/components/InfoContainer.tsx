import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import { highlightMessage, newLineMessage } from '@/utils/i18NRichTextUtils';

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
    <div className="flex flex-col flex-wrap items-center justify-between gap-4 lg:gap-8 lg:px-[5.625rem]">
      {props.imagePos === 'left' ? (
        <Image
          alt={props.imageAlt}
          src={props.imageSrc}
          priority
          width={600}
          height={600}
          className="rounded-3xl lg:basis-1/2"
        />
      ) : (
        <Image
          alt={props.imageAlt}
          src={props.imageSrc}
          priority
          width={600}
          height={600}
          className="rounded-3xl lg:hidden lg:basis-1/2"
        />
      )}
      <div className="hidden text-[2rem] font-semibold capitalize text-slate-1000 sm:text-[3.5rem] lg:block lg:max-w-xl lg:basis-1/2">
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
          })}
        </div>
      </div>
      <div className="w-full text-[2rem] font-semibold capitalize text-slate-1000 sm:max-w-xl sm:basis-1/2 sm:text-[3.5rem] lg:hidden">
        {t.rich(`${props.i18nKey}.title`, {
          highlight: highlightMessage(false, props.titleHighlightTextColor),
          br: newLineMessage(),
        })}
        <div className="text-lg font-normal normal-case text-slate-1000">
          {t.rich(`${props.i18nKey}.description`, {
            br: newLineMessage(),
          })}
        </div>
      </div>
      {props.imagePos === 'right' && (
        <Image
          alt={props.imageAlt}
          src={props.imageSrc}
          priority
          width={600}
          height={600}
          className="hidden rounded-3xl md:visible md:basis-1/2"
        />
      )}
    </div>
  );
};

export default InfoContainer;
