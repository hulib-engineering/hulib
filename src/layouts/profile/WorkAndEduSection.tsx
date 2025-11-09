'use client';

import React from 'react';

import type { User } from '@/features/users/types';
import { AdjustableListLayout } from '@/layouts/profile/AdjustableListLayout';
import { EducationItem } from '@/layouts/profile/EducationForm';
import { WorkExperienceItem } from '@/layouts/profile/WorkExperienceForm';

const WorkAndEducationSection = ({ data, editable }: { data?: User; editable?: boolean }) => (
  <>
    <AdjustableListLayout type="work" editable={editable}>
      {data && data?.works.map((work, index) => (
        <WorkExperienceItem
          key={work.id}
          editable={editable}
          data={{
            ...work,
            endedAt: index === data?.works.length - 1 ? work.endedAt : undefined,
          }}
        />
      ))}
    </AdjustableListLayout>
    <AdjustableListLayout type="education" editable={editable}>
      {data && data?.educations.map((education, index) => (
        <EducationItem
          key={education.id}
          editable={editable}
          data={{
            ...education,
            endedAt: index === data?.educations.length - 1 ? education.endedAt : undefined,
          }}
        />
      ))}
    </AdjustableListLayout>
  </>
);

export default WorkAndEducationSection;
