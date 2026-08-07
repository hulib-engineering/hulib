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
// import { getTopicBadgeClasses } from '@/features/admin/utils/getTopicBadgeClasses';
import { useGetHuberStoriesQuery } from '@/libs/services/modules/huber';
import type { User } from '@/features/users/types';
// import type { Topic, TopicResponse } from '@/libs/services/modules/topics/topicType';
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

/* function Topics({ stories }: any) {
  const t = useTranslations('Schedule.HoverCard');

  return (
    <Section title={t('topics')} row>
      {topics?.map((t: any) => (
        <Chip
          key={t?.topicId}
          as="span"
          className={mergeClassnames(
            'h-full rounded-2xl border p-2 text-xs font-medium leading-[14px]',
            getTopicBadgeClasses(t?.topic.color),
          )}
        >
          {t?.topic.name}
        </Chip>
      ))}
    </Section>
  );
} */

/* function About() {
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
// TODO: remove this query, use a gethuberinfo at the ancestor component instead
export default function AuthorQuickView({ humanBook }: { humanBook: User }) {
  // 2nd API call - as the API call on parent component (which gets user's info) doesn't return list of stories (or at least their titles)
  // Do add 'isLoading' to const {} if need to add loading for the hover card
  const { data: storiesList } = useGetHuberStoriesQuery(
    { huberId: humanBook.id, publishedOnly: true },
    { skip: !humanBook.id },
  );

  return (
    // (remove the first line of css) <- if somebody decided to make a hover card and wrap it around this component:
    // (remove 'hidden') <- for easier debugging
    <div className="absolute left-full z-50 ml-2 box-border flex hidden
      w-[420px] flex-col items-start gap-5
      rounded-2xl border-2 border-[#0858FA] bg-white p-5 shadow-[0px_0px_4px_rgba(15,15,16,0.06),0px_4px_5px_rgba(28,30,33,0.1)]
      -translate-y-8 group-hover:flex"
    >
      <AuthorBasicInfo
        avatarSize="2xl"
        humanBook={humanBook}
        stories={storiesList}
      />
      <MaturingExperiences bio={humanBook.bio} />
      {/* <Topics stories={storiesList} /> */}
      {/* <About /> */}
      <Stories stories={storiesList} />
    </div>
  );
}
