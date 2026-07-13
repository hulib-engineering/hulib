'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import BackButton from '../_components/BackButton';
import { useRouter } from '@/libs/i18nNavigation';
import { useGetStoryDetailQuery } from '@/libs/services/modules/stories';

export default function RegisterHuberSuccess() {
  const searchParams = useSearchParams();
  const storyId = searchParams.get('storyId');
  const router = useRouter();
  const t = useTranslations('Huber');
  const { data: story, isLoading } = useGetStoryDetailQuery(Number(storyId), {
    skip: !storyId,
  });
  // const userId = useAppSelector(state => state.auth.userInfo?.id);
  console.log('Data', story);
  return (
    <div className="min-h-screen bg-white">
      <BackButton />

      <div className="flex flex-col items-center px-[96px] pb-16 pt-10">
        <div className="mb-6">
          <Image
            src="/assets/images/register-huber/blue_book.png"
            alt="Book icon"
            width={100}
            height={100}
            className="object-contain"
          />
        </div>

        <h1 className="mb-3 text-center text-[28px] font-[500] leading-[36px] text-[#0442BF]">
          {t('success_create_book')}
        </h1>

        <p className="mb-10 max-w-md text-center text-[16px] font-[400] leading-[24px] tracking-[0.5%] text-gray-500">
          {t('thanks_for_story')}
        </p>

        {/* Story Card */}
        <div className="mb-10 flex w-full max-w-[420px] items-start justify-between gap-5 rounded-[16px] border border-[#DDC9EF] bg-[#FAF7FC] p-6 opacity-70">
          {/* Left: text content */}
          <div className="flex flex-1 flex-col gap-3">
            <span className="self-start rounded-full bg-[#7C5CBF] px-4 py-1.5 text-xs font-semibold text-white">
              {t('in_review')}
            </span>

            {story?.title && (
              <p className="text-lg font-semibold leading-6 text-gray-800">
                {story.title}
              </p>
            )}

            {story?.topics && story.topics.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                {story.topics.slice(0, 1).map((topic: any) => (
                  <span
                    key={topic.id}
                    className="rounded-[4px] border border-[#84ACFC] bg-[#CDDDFE] px-3 py-1 text-xs font-medium text-[#0858FA]"
                  >
                    {topic.name}
                  </span>
                ))}
                {story.topics.length > 1 && (
                  <span className="rounded-[4px] border border-[#84ACFC] bg-[#0858FA] px-3 py-1 text-xs font-medium text-white">
                    {`+${story.topics.length - 1}`}
                  </span>
                )}
              </div>
            )}

            <div className="mt-1 flex items-center gap-2">
              <div className="flex size-6 items-center justify-center rounded-full bg-[#EDEBFB] text-xs">
                😊
              </div>
              <span className="text-sm text-gray-500">
                {story?.humanBook?.fullName}
              </span>
            </div>
          </div>

          {/* Right: book cover */}
          {!isLoading && story?.cover?.path && (
            <div className="relative h-[220px] w-[150px] shrink-0 overflow-hidden rounded-[4px] shadow-[4px_4px_12px_rgba(0,0,0,0.15)]">
              <Image
                src={story.cover.path}
                alt={story.title || 'Story cover'}
                fill
                className="object-cover"
              />

              {/* Gáy sách giả lập bên trái ảnh */}
              {/* <div className="absolute inset-y-0 left-0 w-[6px] bg-black/10" /> */}

              {/* Tên tác giả, gạch chân, giữa và sát đáy bìa */}
              {/* {story?.humanBook?.fullName && (
                <div className="absolute inset-x-0 bottom-3 flex justify-center px-2">
                  <span className="truncate pb-0.5 text-[11px] font-medium text-[#F472B6]">
                    _{story.humanBook.fullName}_
                  </span>
                </div>
              )} */}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-4">
          <button onClick={() => router.push(`/users/${story.humanBookId}?tab=about`)} className="hover:bg-gray-50 h-[44px] w-[232px] rounded-full border border-[#C2C6CF] px-6 py-3 text-sm font-medium text-[#0442BF] transition-colors">
            {t('back_to_profile')}
          </button>
          <button onClick={() => router.push(`/`)} className="flex h-[44px] w-[232px] items-center justify-center gap-2 rounded-full bg-gradient-to-b from-[#007CBE] to-[#8845C6] px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-[#14144a]">
            <Image
              src="/assets/images/register-huber/white_book.png"
              alt={t('new_book_icon_alt')}
              width={18}
              height={18}
              className="object-contain brightness-[10]"
            />
            {t('create_new_book')}
          </button>
        </div>
      </div>
    </div>
  );
}
