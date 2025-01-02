import * as React from 'react';

import AuthorDetail from '@/components/authorDetail/AuthorDetail';
import { MemberLayout } from '@/layouts/MemberLayout';

export default function Index() {
  return (
    <MemberLayout>
      <AuthorDetail />
    </MemberLayout>
  );
}
