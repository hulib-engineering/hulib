'use client';

import { useTranslations } from 'next-intl';
import BackButton from '../_components/BackButton';
import StoryForm from '@/features/stories/components/StoryForm';

export default function CreateBook() {
  const t = useTranslations('Huber');
  return (
    <div>
      <BackButton text={t('create_book_title')} />
      <div className="py-1 xl:px-24">
        <StoryForm type="create" onCancel={() => { }} onSucceed={() => { }} />
      </div>
    </div>
  );
}
