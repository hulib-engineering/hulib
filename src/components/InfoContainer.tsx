import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React, { type ReactNode } from 'react';

import { mergeClassnames } from '@/components/private/utils';

const highlightMessage = (
  isOutstanding: boolean,
  textColor: string,
): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (...chunks: ReactNode[]): ReactNode => {
    return (
      <span
        className={mergeClassnames(
          textColor === 'primary' ? 'text-primary' : 'text-secondary',
          isOutstanding && 'text-[5.625rem]',
        )}
      >
        {chunks}
      </span>
    );
  };
};

const newLineMessage = (): (() => ReactNode) => {
  // eslint-disable-next-line react/display-name
  return (): ReactNode => {
    return <br />;
  };
};

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
    <div className="flex items-center justify-between gap-8 px-[5.625rem]">
      {props.imagePos === 'left' && (
        <Image
          alt={props.imageAlt}
          src={props.imageSrc}
          priority
          width={600}
          height={600}
          className="rounded-3xl"
        />
      )}
      <div className="w-[36.5rem] text-[3.5rem] font-semibold capitalize text-slate-1000">
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
      {props.imagePos === 'right' && (
        <Image
          alt={props.imageAlt}
          src={props.imageSrc}
          priority
          width={600}
          height={600}
          className="rounded-3xl"
        />
      )}
    </div>
  );
};

export default InfoContainer;
