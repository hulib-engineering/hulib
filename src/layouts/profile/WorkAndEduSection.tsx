'use client';

import { useLocale } from 'next-intl';
import React from 'react';

import type { User } from '@/features/users/types';
import { AdjustableListLayout } from '@/layouts/profile/AdjustableListLayout';
import { EducationItem } from '@/layouts/profile/EducationForm';
import { WorkExperienceItem } from '@/layouts/profile/WorkExperienceForm';

const WorkAndEducationSection = ({ data, editable }: { data?: User; editable?: boolean }) => {
  console.log('Data:', data);

  const locale = useLocale();

  return (
    <>
      <AdjustableListLayout type="work" editable={editable}>
        {data && data?.works.map((work, index) => (
          <WorkExperienceItem
            key={work.id}
            editable={editable}
            data={{
              ...work,
              startedAt: new Date(work.startedAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
              }),
              endedAt: index !== 0 && work.endedAt ? new Date(work.endedAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
              }) : undefined,
            }}
          />
        ))}
      </AdjustableListLayout>
      <AdjustableListLayout type="education" editable={editable}>
        {data && data?.educations.map(education => (
          <EducationItem
            key={education.id}
            editable={editable}
            data={{
              ...education,
              startedAt: new Date(education.startedAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
              }),
              endedAt: education.endedAt ? new Date(education.endedAt).toLocaleDateString(locale, {
                year: 'numeric',
                month: 'long',
              }) : undefined,
            }}
          />
        ))}
      </AdjustableListLayout>
    </>
  );
};

export default WorkAndEducationSection;
