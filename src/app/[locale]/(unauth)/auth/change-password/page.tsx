import * as React from 'react';

import ChangePassword from '@/components/changePassword/ChangePassword';
import { MemberLayout } from '@/layouts/MemberLayout';

export default function Index() {
  return (
    <MemberLayout>
      <ChangePassword />
    </MemberLayout>
  );
}
