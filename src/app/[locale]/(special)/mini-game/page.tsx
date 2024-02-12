import { getTranslations } from 'next-intl/server';
import React from 'react';

import { NumberOfMovements } from '@/components/Minigame/NumberOfMovements';
import { MinigameSection } from '@/layouts/MinigameSection';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = await getTranslations({ locale, namespace: 'MiniGame' });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function Index() {
  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="mb-4 flex items-center justify-between leading-tight text-white">
        <h1 className="text-5xl font-semibold capitalize">memory game</h1>
        <NumberOfMovements />
      </div>
      <MinigameSection />
    </div>
  );
}
