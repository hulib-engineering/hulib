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

function MaturingExperiences({ bio }: { bio: string | null }) {
  return (
    <div className={mergeClassnames('w-full text-sm leading-[22px] tracking-[0.015em] text-[#2E3032]', !bio && 'hidden')}>
      {bio}
    </div>
  );
}

// Design note: no limit to the number of Topics - "as the user won't have so much free time to choose so many of them anyway", said the designer
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

// Design note: only 2 stories will be shown at max -- according to the designer
function Stories({ stories }: { stories: GetHuberStoriesResponse }) {
  const t = useTranslations('Schedule.HoverCard');
  return (
    <Section title={t('stories')}>
      {stories?.data?.slice(0, 2).map((story: Story) => (
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

  const { data: storiesList } = useGetHuberStoriesQuery(
    { huberId: humanBook.id, publishedOnly: true },
    { skip: !humanBook.id },
  );

  return (
    // (remove 'hidden') <- for easier debugging
    //
    <div className="absolute z-50 box-border flex
      w-[420px] flex-col items-start gap-5 rounded-2xl
      border-2 border-[#0858FA] bg-white p-5
      shadow-[0px_0px_4px_rgba(15,15,16,0.06),0px_4px_5px_rgba(28,30,33,0.1)] -translate-y-8 group-hover:flex
      max-lg:top-full max-lg:mt-8 lg:left-full lg:ml-2"
    >
      <AuthorBasicInfo
        humanBook={humanBook}
        numStories={storiesList?.data?.length}
        type="hovercard"
      />
      <MaturingExperiences bio={humanBook.bio} />
      <Topics topics={humanBook.sharingTopics} />
      {/* <About /> */}
      <Stories stories={storiesList} />
    </div>
  );
}
