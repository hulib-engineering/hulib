import { useTranslations } from 'next-intl';
import StoryReviews from '@/app/[locale]/(auth)/explore-story/[id]/_components/StoryReviews';
import CommentInput from '@/app/[locale]/(auth)/explore-story/[id]/_components/CommentInput';
import { mergeClassnames } from '@/components/core/private/utils';

type CommentProps = {
  storyId: number;
  comment: string;
  setComment: React.Dispatch<React.SetStateAction<string>>;
};

export default function CommentSection({ storyId, comment, setComment }: CommentProps) {
  const t = useTranslations('ExploreStory');

  return (
    <div
      className={mergeClassnames(
        'flex w-full flex-col gap-4 rounded-2xl bg-white p-5 shadow-sm',
      )}
      style={{ height: 'auto' }}
    >
      <h6 className="text-xl font-medium leading-7 text-neutral-20">
        {t('review_title')}
      </h6>
      <CommentInput storyId={storyId} comment={comment} setComment={setComment} />
      <StoryReviews />
    </div>
  );
}
