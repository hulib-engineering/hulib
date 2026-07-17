'use client';

import { useTranslations } from 'next-intl';
import { useCallback, useState } from 'react';
import { useSession } from 'next-auth/react';
import NiceAvatar, { genConfig } from 'react-nice-avatar';
import { usePathname, useRouter } from '@/libs/i18nNavigation';

import Button from '@/components/core/button/Button';
import Avatar from '@/components/core/avatar/Avatar';
import { useAppSelector } from '@/libs/hooks';
import { useCreateStoryReviewMutation } from '@/libs/services/modules/story-reviews';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';

type CommentInputProps = {
  storyId: number;
};

export default function CommentInput({ storyId }: CommentInputProps) {
  const t = useTranslations('ExploreStory');
  const tButton = useTranslations('LandingPage');

  const [comment, setComment] = useState('');
  const router = useRouter();
  const { data: session } = useSession();
  const pathname = usePathname();
  const [createStoryReview, { isLoading }] = useCreateStoryReviewMutation();

  const requireAuth = useCallback(() => {
    if (!session) {
      router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return false;
    }
    return true;
  }, [session, router, pathname]);

  const userInfo = useAppSelector(state => state.auth.userInfo);
  const avatarUrl = useAppSelector(state => state.auth.avatarUrl);
  const fullName = userInfo?.fullName;
  const id = userInfo?.id;

  const handleSubmit = async () => {
    if (!requireAuth()) {
      return;
    }
    if (!comment.trim()) {
      return;
    }

    try {
      await createStoryReview({
        preRating: 1,
        rating: 1,
        title: '',
        comment: comment.trim(),
        storyId,
        userId: id,
      });
      setComment('');
      pushSuccess(t('comment_submitted'));
    } catch {
      pushError(t('comment_error'));
    }
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-between gap-y-3 rounded-xl bg-primary-98 p-4 py-6 xxl:flex-row">
        <span className="text-center">{t('comment_login_prompt')}</span>

        <div className="flex items-center gap-2 xxl:gap-3">
          <Button
            variant="ghost"
            size="lg"
            className="w-[144px]"
            onClick={() => router.push('/auth/login')}
          >
            {tButton('button.sign_in')}
          </Button>
          <Button
            variant="fill"
            size="lg"
            className="w-[144px]"
            onClick={() => router.push('/auth/register')}
          >
            {tButton('button.sign_up')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-primary-98 p-4">
      <h6 className="text-base font-medium leading-6 text-neutral-20">
        {t('comment_title')}
      </h6>
      <div className="flex items-center gap-3">
        {avatarUrl
          ? (
              <Avatar imageUrl={avatarUrl} className="size-10 shrink-0" />
            )
          : (
              <NiceAvatar
                className="size-10 shrink-0 rounded-full"
                {...genConfig(fullName ?? String(id ?? 'huber'))}
              />
            )}
        <input
          type="text"
          value={comment}
          onChange={e => setComment(e.target.value)}
          placeholder={t('comment_placeholder')}
          className="flex-1 rounded-2xl border border-neutral-90 bg-neutral-98 px-4 py-2.5 text-sm text-neutral-20 placeholder:text-neutral-40 focus:outline-none"
        />
      </div>
      <div className="flex justify-end">
        <Button
          variant="fill"
          size="sm"
          onClick={handleSubmit}
          disabled={!comment.trim() || isLoading}
        >
          {t('share')}
        </Button>
      </div>
    </div>
  );
}
