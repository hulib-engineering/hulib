'use client';

import { CircleNotch, PencilSimple, Plus, SealCheck } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { memo, useState } from 'react';

import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import TextArea from '@/components/core/textArea/TextArea';

type LiberAboutSectionProps = {
  title: string;
  value?: string;
  editable?: boolean;
  placeholder?: string;
  onSave?: (value: string) => Promise<void> | void;
};

const LiberAboutSection = memo(({
  title,
  value,
  editable = false,
  placeholder,
  onSave,
}: LiberAboutSectionProps) => {
  const t = useTranslations('MyProfile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState(value ?? '');

  const hasContent = Boolean(value?.trim());

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(draft);
      setIsEditing(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(value ?? '');
    setIsEditing(false);
  };

  const handleEdit = () => {
    setDraft(value ?? '');
    setIsEditing(true);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4 rounded-xl bg-primary-98 p-5 shadow-[0_4px_5px_rgba(28,30,33,0.10),0_0_4px_rgba(15,15,16,0.06)]">
        <h3 className="text-xl font-medium leading-7 tracking-tight text-neutral-10">{title}</h3>
        <TextArea
          rows={6}
          value={draft}
          placeholder={placeholder}
          onChange={e => setDraft(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <Button variant="outline" size="sm" type="button" onClick={handleCancel} disabled={isSaving}>
            {t('liber_about.cancel')}
          </Button>
          <Button size="sm" type="button" onClick={handleSave} disabled={isSaving}>
            {isSaving
              ? <CircleNotch weight="bold" size={16} className="animate-spin" />
              : t('liber_about.save')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-5 shadow-[0_4px_5px_rgba(28,30,33,0.10),0_0_4px_rgba(15,15,16,0.06)]">
      <div className="flex items-center justify-between">
        <div className="flex max-w-[85%] items-center md:max-w-none md:gap-2.5">
          <h3 className="max-w-[90%] text-xl font-medium leading-7 tracking-tight text-neutral-10 md:max-w-none">{title}</h3>
          {hasContent && <SealCheck weight="fill" className="size-6 text-primary-60" />}
        </div>
        {editable && (
          hasContent
            ? (
                <IconButton variant="outline" size="sm" type="button" onClick={handleEdit}>
                  <PencilSimple weight="bold" />
                </IconButton>
              )
            : (
                <IconButton variant="soft" size="sm" type="button" onClick={handleEdit}>
                  <Plus weight="bold" />
                </IconButton>
              )
        )}
      </div>
      {hasContent && (
        <p className="text-sm leading-[22px] tracking-[0.015em] text-neutral-10">{value}</p>
      )}
    </div>
  );
});

LiberAboutSection.displayName = 'LiberAboutSection';

export type { LiberAboutSectionProps };
export default LiberAboutSection;
