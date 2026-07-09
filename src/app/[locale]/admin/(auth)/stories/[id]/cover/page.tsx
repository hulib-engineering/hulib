'use client';

import { ArrowLeft } from '@phosphor-icons/react';
import { useParams, useRouter } from 'next/navigation';

import { useTranslations } from 'next-intl';
import Button from '@/components/core/button/Button';
import { StoryDetailSkeleton } from '@/components/loadingState/Skeletons';
import { AdminStoryCoverForm } from '@/features/stories/components/AdminStoryCoverForm';
import { useGetStoryDetailQuery } from '@/libs/services/modules/stories';

export default function AdminStoryCoverPage() {
  const { id } = useParams();
  const router = useRouter();
  const storyId = Number(id);
  const t = useTranslations('Admin');

  const { data: story, isLoading, refetch } = useGetStoryDetailQuery(storyId);

  if (isLoading) {
    return <StoryDetailSkeleton />;
  }

  if (!story) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-6 pb-8 pt-6">
      <Button
        variant="ghost"
        size="lg"
        iconLeft={<ArrowLeft />}
        className="w-fit text-black"
        onClick={() => router.push(`/admin/stories/${storyId}/approval`)}
      >
        {t('stories.back_to_story_approval')}
      </Button>

      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-medium text-neutral-10">Regenerate story cover</h1>
        <p className="text-sm text-neutral-40">
          {t('stories.cover_generation_description')}
        </p>
      </div>

      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <AdminStoryCoverForm
          story={story}
          onSaved={() => refetch()}
        />
      </div>
    </div>
  );
}
