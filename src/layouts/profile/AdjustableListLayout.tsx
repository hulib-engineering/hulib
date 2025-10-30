// Need to rework as there still task in backup

'use client';

import { Plus } from '@phosphor-icons/react';
import React, { useState } from 'react';

import IconButton from '@/components/core/iconButton/IconButton';
import type { WithChildren } from '@/components/core/private/types';
import EducationForm from '@/layouts/profile/EducationForm';
import WorkExperienceForm from '@/layouts/profile/WorkExperienceForm';

const AdjustableListLayout = ({ editable, type, children }: WithChildren<{ editable?: boolean; type: string }>) => {
  const [isAdding, setIsAdding] = useState(false);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3">
        <p className="text-lg font-medium capitalize">{type}</p>
        {children}
        {editable && !isAdding && (
          <button
            type="button"
            className="flex items-center gap-4 text-sm font-medium capitalize leading-4 text-[#4E74BF]"
            onClick={() => setIsAdding(true)}
          >
            <IconButton variant="secondary" size="sm">
              <Plus />
            </IconButton>
            {`add ${type === 'work' ? 'experience' : 'education'}`}
          </button>
        )}
      </div>
      {isAdding && (type === 'work'
        ? <WorkExperienceForm onCancel={() => setIsAdding(false)} />
        : <EducationForm onCancel={() => setIsAdding(false)} />)}
    </div>
  );
};

export { AdjustableListLayout };
