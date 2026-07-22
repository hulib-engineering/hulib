'use client';

import { CaretDown, CircleNotch, PencilSimple, Plus, SealCheck } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import type { Topic } from './type';
import TopicChip from './TopicChip';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';

type LiberTopicsSectionProps = {
  title: string;
  topics?: Topic[];
  availableTopics?: Topic[];
  editable?: boolean;
  onSave?: (topics: Topic[]) => Promise<void> | void;
};

const LiberTopicsSection = memo(({
  title,
  topics = [],
  availableTopics = [],
  editable = false,
  onSave,
}: LiberTopicsSectionProps) => {
  const t = useTranslations('MyProfile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [draft, setDraft] = useState<Topic[]>(topics);
  const [dropOpen, setDropOpen] = useState(false);
  const [panelStyle, setPanelStyle] = useState<React.CSSProperties>({});

  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const hasContent = topics.length > 0;
  const unselected = availableTopics.filter(t => !draft.some(d => d.id === t.id));

  const openDrop = () => {
    if (triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      setPanelStyle({ top: rect.bottom + 8, left: rect.left, width: rect.width });
    }
    setDropOpen(true);
  };

  useEffect(() => {
    if (!dropOpen) {
      return;
    }
    const handleOutside = (e: MouseEvent) => {
      const outsideTrigger = !triggerRef.current?.contains(e.target as Node);
      const outsidePanel = !panelRef.current?.contains(e.target as Node);
      if (outsideTrigger && outsidePanel) {
        setDropOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [dropOpen]);

  const handleSelect = (topic: Topic) => setDraft(prev => [...prev, topic]);

  const handleRemove = useCallback((id?: number | string) => {
    setDraft(prev => prev.filter(d => d.id !== id));
  }, []);

  const handleEdit = () => {
    setDraft(topics);
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave?.(draft);
      setIsEditing(false);
      setDropOpen(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setDraft(topics);
    setIsEditing(false);
    setDropOpen(false);
  };

  if (isEditing) {
    return (
      <div className="flex flex-col gap-4 rounded-xl bg-primary-98 p-5 shadow-[0_4px_5px_rgba(28,30,33,0.10),0_0_4px_rgba(15,15,16,0.06)]">
        <h3 className="text-xl font-medium leading-7 tracking-tight text-neutral-10">{title}</h3>

        {/* Selected chips */}
        {draft.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {draft.map(topic => (
              <TopicChip key={topic.id} topic={topic} removable onRemove={handleRemove} />
            ))}
          </div>
        )}

        {/* Trigger */}
        <button
          ref={triggerRef}
          type="button"
          onClick={openDrop}
          className="flex h-11 w-full items-center justify-between rounded-2xl border border-neutral-80 bg-neutral-98 px-3 text-sm text-neutral-40 transition-colors hover:border-primary-60 focus:border-primary-60 focus:outline-none"
        >
          <span>{t('liber_about.topics_placeholder')}</span>
          <CaretDown
            weight="bold"
            size={20}
            className={`flex-shrink-0 transition-transform ${dropOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Portal dropdown panel */}
        {dropOpen && createPortal(
          <div
            ref={panelRef}
            style={panelStyle}
            className="fixed z-[9999] flex flex-wrap gap-2 rounded-2xl bg-white p-2 shadow-[0_0_4px_rgba(15,15,16,0.08),0_8px_18px_-1px_rgba(28,30,33,0.14)]"
          >
            {unselected.length > 0
              ? unselected.map(topic => (
                  <button
                    key={topic.id}
                    type="button"
                    className="rounded-lg p-0.5 transition-colors hover:bg-neutral-90"
                    onClick={() => handleSelect(topic)}
                  >
                    <TopicChip topic={topic} />
                  </button>
                ))
              : (
                  <span className="px-2 py-1 text-sm text-neutral-40">{t('liber_about.topics_all_selected')}</span>
                )}
          </div>,
          document.body,
        )}

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
        <div className="flex items-center gap-2.5">
          <h3 className="text-xl font-medium leading-7 tracking-tight text-neutral-10">{title}</h3>
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
        <div className="flex max-h-40 flex-wrap gap-2 overflow-y-auto">
          {topics.map(topic => (
            <TopicChip key={topic.id} topic={topic} />
          ))}
        </div>
      )}
    </div>
  );
});

LiberTopicsSection.displayName = 'LiberTopicsSection';

export type { LiberTopicsSectionProps };
export default LiberTopicsSection;
