import * as React from 'react';

import OverviewSection from './OverviewSection';

import type { User } from '@/features/users/types';
import UserModerationList from '@/layouts/admin/UserModerationList';
import WorkAndEduSection from '@/layouts/profile/WorkAndEduSection';
import ContactSection from '@/layouts/profile/ContactSection';

type IAboutSectionRendererProps = {
  type: 'overview' | 'work' | 'contact' | 'moderations' | string;
  data: User;
  editable?: boolean;
};

export default function AboutSectionRenderer({ type, data, editable }: IAboutSectionRendererProps) {
  const Component
    = type === 'work' ? WorkAndEduSection : type === 'contact' ? ContactSection : type === 'overview' ? OverviewSection : UserModerationList;

  return <Component data={data} editable={editable} />;
}
