'use client';

import { useTranslations } from 'next-intl';
import BackButtonHeader from '../_components/BackButtonHeader';
import StoryForm from '@/features/stories/components/StoryForm';

export default function CreateBook() {
  const t = useTranslations('Huber');
  return (
    <div>
      <BackButtonHeader text={t('create_book_title')} />
      <div className="py-1 xl:px-24">
        <StoryForm type="create" onCancel={() => { }} onSucceed={() => { }} />
      </div>
    </div>
  );
}
