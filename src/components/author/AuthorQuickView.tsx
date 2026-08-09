'use client';
import React from 'react';
import { useTranslations } from 'next-intl';
import {
  BookOpen,
  // GraduationCapIcon,
  // BagIcon,
} from '@phosphor-icons/react';
import { mergeClassnames } from '../core/private/utils';
import AuthorBasicInfo from './AuthorBasicInfo';
// import type { AuthorBasicInfoProps } from './private/types';
import Section from '@/components/Section';
// import { Chip } from '@/components/core/chip/Chip';
import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import { useGetHuberStoriesQuery } from '@/libs/services/modules/huber';
import type { User } from '@/features/users/types';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import type { GetHuberStoriesResponse, Story } from '@/libs/services/modules/stories/storiesType';

// TODO: Integrate API response for the Topics component once the 'topics' values are fixed in the BE - (if it's supposed to be removed then
// ...there will need to be a 3rd API call using 'useGetUsersByIdQuery')

function MaturingExperiences({ bio }: { bio: string | null }) {
  return (
    <div className={mergeClassnames('w-full text-sm leading-[22px] tracking-[0.015em] text-[#2E3032]', !bio && 'hidden')}>
      {bio}
    </div>
  );
}

function Topics({ topics }: { topics: Topic[] }) {
  const t = useTranslations('Schedule.HoverCard');

  return (
    <Section title={t('topics')} row>
      <div className="flex flex-wrap gap-2">
        {topics?.map((t: Topic) => (
          <div
            key={t?.id}
            className={mergeClassnames(
              'py-2 px-3 rounded-2xl border',
              'text-xs font-medium leading-[14px]',
              getTopicBadgeClasses(t?.color),
            )}
          >
            {t?.name}
          </div>
        ))}
      </div>
    </Section>
  );
}

/* TODO: finish this once there's works and education data to test
function About() {
  const t = useTranslations('Schedule.HoverCard');
  return (
    // Top is Work - Bottom is Education
    <Section title={t('about')}>
      <div className="flex h-[22px] items-start gap-2">
        <GraduationCapIcon size={20} color="#0442BF" />
        <span className="whitespace-nowrap text-sm leading-[22px] tracking-[0.015em] text-[#2E3032]">
          {}
        </span>
      </div>

      <div className="flex h-[22px] items-start gap-2">
        <BagIcon size={20} color="#0442BF" />
        <span className="whitespace-nowrap text-sm leading-[22px] tracking-[0.015em] text-[#2E3032]">
          {}
        </span>
      </div>
    </Section>
  );
} */

function Stories({ stories }: { stories: GetHuberStoriesResponse }) {
  const t = useTranslations('Schedule.HoverCard');
  return (
    <Section title={t('stories')}>
      {stories?.data?.map((story: Story) => (
        <div
          key={story.id}
          className="box-border flex w-full items-center gap-2 rounded-lg border border-[#C7C9CB] bg-[#F0F5FF] p-2"
        >
          <BookOpen color="#0442BF" size={16} />
          <span className="flex-1 text-sm leading-4 text-black translate-y-[2px]">
            {story.title}
          </span>
        </div>
      ))}
    </Section>
  );
}

export default function AuthorQuickView({ humanBook }: { humanBook: User }) {
  // 2nd API call - as the API call on parent component (which gets user's info) doesn't return list of stories (or at least their titles)
  // | remove if the 1st API call return response of stories list (or at least their titles)

  // Do add 'isLoading' to const {} if need to add loading for the hover card
  const { data: storiesList } = useGetHuberStoriesQuery(
    { huberId: humanBook.id, publishedOnly: true },
    { skip: !humanBook.id },
  );

  return (
    // (remove 'hidden') <- for easier debugging
    <div className="absolute z-50 box-border flex hidden
      w-[420px] flex-col items-start gap-5 rounded-2xl
      border-2 border-[#0858FA] bg-white p-5
      shadow-[0px_0px_4px_rgba(15,15,16,0.06),0px_4px_5px_rgba(28,30,33,0.1)] -translate-y-8 group-hover:flex
      max-lg:right-1/2 max-lg:top-full max-lg:mt-6 lg:left-full lg:ml-2"
    >
      <AuthorBasicInfo
        avatarSize="2xl"
        humanBook={humanBook}
        stories={storiesList}
      />
      <MaturingExperiences bio={humanBook.bio} />
      <Topics topics={humanBook.sharingTopics} />
      {/* <About /> */}
      <Stories stories={storiesList} />
    </div>
  );
}
