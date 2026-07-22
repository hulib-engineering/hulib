'use client';

import {
  Certificate,
  GlobeHemisphereWest,
  GraduationCap,
  PencilSimple,
  UserSwitch,
} from '@phosphor-icons/react';
import { useLocale, useTranslations } from 'next-intl';
import React, { memo } from 'react';

import type { LearningEntry, LearningType } from './type';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';

type TypeConfig = {
  renderIcon: () => React.ReactNode;
  bgClass: string;
  textClass: string;
};

const TYPE_CONFIG: Record<LearningType, TypeConfig> = {
  vocational: {
    renderIcon: () => <Certificate weight="duotone" size={24} />,
    bgClass: 'bg-[#C9ECFF]',
    textClass: 'text-[#009BEE]',
  },
  university: {
    renderIcon: () => <GraduationCap weight="duotone" size={24} />,
    bgClass: 'bg-primary-90',
    textClass: 'text-primary-60',
  },
  life_experience: {
    renderIcon: () => <UserSwitch weight="duotone" size={24} />,
    bgClass: 'bg-pink-90',
    textClass: 'text-pink-40',
  },
};

type LearningItemProps = {
  entry: LearningEntry;
  editable?: boolean;
  onEdit: (id?: number | string) => void;
};

const LearningItem = memo(({ entry, editable, onEdit }: LearningItemProps) => {
  const locale = useLocale();
  const t = useTranslations('MyProfile');
  const config = TYPE_CONFIG[entry.type];

  const startDate = new Date(entry.startedAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'numeric',
  });
  const endDate = entry.endedAt
    ? new Date(entry.endedAt).toLocaleDateString(locale, { year: 'numeric', month: 'numeric' })
    : t('liber_about.present');

  return (
    <div className="flex items-center gap-4">
      <div className={mergeClassnames(
        'flex size-10 shrink-0 items-center justify-center rounded-full',
        config.bgClass,
        config.textClass,
      )}
      >
        {config.renderIcon()}
      </div>
      <div className="flex flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1">
          <span className="text-base font-medium leading-6 tracking-[0.005em] text-neutral-20">
            {entry.name}
          </span>
          {entry.isPublic && (
            <GlobeHemisphereWest weight="bold" className="size-5 text-primary-60" />
          )}
        </div>
        <span className="text-sm leading-[22px] tracking-[0.015em] text-neutral-20">
          {`${startDate} - ${endDate}`}
        </span>
      </div>
      {editable && (
        <IconButton
          variant="outline"
          size="sm"
          type="button"
          onClick={() => onEdit(entry.id)}
        >
          <PencilSimple weight="bold" />
        </IconButton>
      )}
    </div>
  );
});

LearningItem.displayName = 'LearningItem';

export type { LearningItemProps };
export default LearningItem;
