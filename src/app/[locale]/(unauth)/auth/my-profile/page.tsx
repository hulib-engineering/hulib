import * as React from 'react';

import MyProfile from '@/components/myProfile/MyProfile';
import { MemberLayout } from '@/layouts/MemberLayout';

export default function Index() {
  return (
    <MemberLayout>
      <MyProfile />
    </MemberLayout>
  );
}
