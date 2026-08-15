'use client';

import { Plus, SealCheck } from '@phosphor-icons/react';
import { useState } from 'react';

import type { WorkEntry, WorkEntryFormValues } from './type';
import WorkEntryForm from './WorkEntryForm';
import WorkItem from './WorkItem';
import { mergeClassnames } from '@/components/core/private/utils';
import IconButton from '@/components/core/iconButton/IconButton';

type LiberWorkSectionProps = {
  title: string;
  entries?: WorkEntry[];
  editable?: boolean;
  onSave?: (values: WorkEntryFormValues, editingId?: number) => Promise<void> | void;
};

export type { LiberWorkSectionProps };

export default function LiberWorkSection({
  title,
  entries = [],
  editable = false,
  onSave,
}: LiberWorkSectionProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  const hasContent = entries.length > 0;
  const isEditing = isAdding || editingId !== null;

  const handleStartEdit = (id?: number) => setEditingId(id ?? null);

  const handleAddSave = async (values: WorkEntryFormValues) => {
    await onSave?.(values);
    setIsAdding(false);
  };

  const handleEditSave = (id: number) => async (values: WorkEntryFormValues) => {
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
                  <WorkEntryForm
                    key={entry.id}
                    defaultValues={entry}
                    onSave={handleEditSave(entry.id!)}
                    onCancel={handleCancelEdit}
                  />
                )
              : (
                  <WorkItem
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
        <WorkEntryForm
          onSave={handleAddSave}
          onCancel={handleCancelAdd}
        />
      )}
    </div>
  );
}
