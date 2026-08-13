import type { ReactNode } from 'react';

import type { Topic } from '@/libs/services/modules/user/userType';

export type { Topic };

export type SectionMenu = {
  type: string;
  label: ReactNode;
  icon: ReactNode;
};

export type LearningType = 'vocational' | 'university' | 'life_experience';

export type LearningEntry = {
  id?: number | string;
  type: LearningType;
  name: string;
  organization?: string;
  startedAt: string;
  endedAt?: string;
  isPublic: boolean;
};

export type LearningEntryFormValues = Omit<LearningEntry, 'id'>;

export type WorkEntry = {
  id?: number;
  position: string;
  company: string;
  startedAt: string;
  endedAt?: string;
};

export type WorkEntryFormValues = Omit<WorkEntry, 'id'>;

export type LiberAboutData = {
  journey?: string;
  learningPath?: LearningEntry[];
  works?: WorkEntry[];
  topics?: Topic[];
};
