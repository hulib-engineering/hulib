'use client';

import dynamic from 'next/dynamic';

const CustomToastifyContainer = dynamic(
  () => import('./CustomToastifyContainer'),
  { ssr: false },
);

export default function LazyToastContainer() {
  return <CustomToastifyContainer />;
}
