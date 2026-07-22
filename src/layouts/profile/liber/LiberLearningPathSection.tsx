'use client';

import { Plus, SealCheck } from '@phosphor-icons/react';
import React, { memo, useCallback, useState } from 'react';

import type { LearningEntry, LearningEntryFormValues } from './type';
import LearningEntryForm from './LearningEntryForm';
import LearningItem from './LearningItem';
import { mergeClassnames } from '@/components/core/private/utils';
import IconButton from '@/components/core/iconButton/IconButton';

type LiberLearningPathSectionProps = {
  title: string;
  entries?: LearningEntry[];
  editable?: boolean;
  onSave?: (values: LearningEntryFormValues, editingId?: number | string) => Promise<void> | void;
};

const LiberLearningPathSection = memo(({
  title,
  entries = [],
  editable = false,
  onSave,
}: LiberLearningPathSectionProps) => {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | string | null>(null);

  const hasContent = entries.length > 0;
  const isEditing = isAdding || editingId !== null;

  // useCallback: stable ref for memo'd LearningItem.onEdit
  const handleStartEdit = useCallback(
    (id?: number | string) => setEditingId(id ?? null),
    [],
  );

  const handleAddSave = async (values: LearningEntryFormValues) => {
    await onSave?.(values);
    setIsAdding(false);
  };

  const handleEditSave = (id: number | string) => async (values: LearningEntryFormValues) => {
    await onSave?.(values, id);
    setEditingId(null);
  };

  const handleCancelAdd = () => setIsAdding(false);
  const handleCancelEdit = () => setEditingId(null);

  return (
    <div className={mergeClassnames(
      'flex flex-col gap-4 rounded-xl p-5 shadow-[0_4px_5px_rgba(28,30,33,0.10),0_0_4px_rgba(15,15,16,0.06)]',
      isEditing ? 'bg-primary-98' : 'bg-white',
    )}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <h3 className="text-xl font-medium leading-7 tracking-tight text-neutral-10">{title}</h3>
          {hasContent && !isEditing && (
            <SealCheck weight="fill" className="size-6 text-primary-60" />
          )}
        </div>
        {editable && !isEditing && (
          <IconButton
            variant="soft"
            size="sm"
            type="button"
            onClick={() => setIsAdding(true)}
          >
            <Plus weight="bold" />
          </IconButton>
        )}
      </div>

      {hasContent && (
        <div className="flex flex-col gap-5">
          {entries.map(entry => (
            editingId === entry.id
              ? (
                  <LearningEntryForm
                    key={entry.id}
                    defaultValues={entry}
                    onSave={handleEditSave(entry.id!)}
                    onCancel={handleCancelEdit}
                  />
                )
              : (
                  <LearningItem
                    key={entry.id}
                    entry={entry}
                    editable={editable && !isEditing}
                    onEdit={handleStartEdit}
                  />
                )
          ))}
        </div>
      )}

      {isAdding && (
        <LearningEntryForm
          onSave={handleAddSave}
          onCancel={handleCancelAdd}
        />
      )}
    </div>
  );
});

LiberLearningPathSection.displayName = 'LiberLearningPathSection';

export type { LiberLearningPathSectionProps };
export default LiberLearningPathSection;
