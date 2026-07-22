'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { LIBER_OTHERS_TABS, LIBER_OWN_TABS } from '../profile.contant';
import type { TUserDetail } from '../profile.type';
import { ControlOverview } from './ControlOverview';
import LiberMyFavorite from './LiberMyFavorite';
import LiberAboutPanel from './LiberAboutPanel';
import type { LearningEntryFormValues, LearningType, Topic, WorkEntryFormValues } from './type';
import { usePathname, useRouter } from '@/libs/i18nNavigation';
import MyStoriesPanel from '@/app/[locale]/(auth)/users/[id]/_components/MyStoriesPanel';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';
import {
  useAddEducationMutation,
  useAddWorkExperienceMutation,
  useEditEducationMutation,
  useEditWorkExperienceMutation,
  useUpdateProfileMutation,
  useUpdateUserTopicsMutation,
} from '@/libs/services/modules/auth';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';

type LiberProfileContentProps = {
  userDetail: TUserDetail;
  notMe: boolean;
};

export default function LiberProfileContent({ userDetail, notMe }: LiberProfileContentProps) {
  const t = useTranslations('MyProfile');
  const tCommon = useTranslations('Common');
  const router = useRouter();
  const currentPathname = usePathname();
  const searchParams = useSearchParams();

  const tabs = notMe ? LIBER_OTHERS_TABS : LIBER_OWN_TABS;
  const [currentTab, setCurrentTab] = useState(searchParams.get('tab') || 'about');

  const { data: topicsData } = useGetTopicsQuery({ limit: 100 });
  const [updateProfile] = useUpdateProfileMutation();
  const [addEducation] = useAddEducationMutation();
  const [editEducation] = useEditEducationMutation();
  const [addWork] = useAddWorkExperienceMutation();
  const [editWork] = useEditWorkExperienceMutation();
  const [updateUserTopics] = useUpdateUserTopicsMutation();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', currentTab);
    router.push(`${currentPathname}?${params.toString()}`, { scroll: false });
  }, [currentPathname, currentTab, router, searchParams]);

  const liberData = useMemo(() => ({
    journey: (userDetail as any)?.bio,
    learningPath: (userDetail as any)?.educations?.map((e: any) => ({
      id: e.id,
      type: (e.type ?? 'university') as LearningType,
      name: e.major,
      organization: e.institution,
      startedAt: e.startedAt,
      endedAt: e.endedAt,
      isPublic: e.isPublic ?? false,
    })),
    works: (userDetail as any)?.works,
    topics: userDetail.humanBookTopic?.map(h => h.topic),
  }), [userDetail]);

  const handleSaveText = useCallback(async (key: 'bio', value: string) => {
    try {
      await updateProfile({ [key]: value }).unwrap();
      pushSuccess(tCommon('update_successfully'));
    } catch {
      pushError(tCommon('update_failed'));
    }
  }, [updateProfile]);

  const handleSaveLearningEntry = useCallback(async (
    values: LearningEntryFormValues,
    editingId?: number | string,
  ) => {
    const payload = {
      major: values.name,
      institution: values.organization ?? '',
      startedAt: values.startedAt,
      endedAt: values.endedAt,
      type: values.type,
      isPublic: values.isPublic,
    };
    try {
      if (editingId !== undefined) {
        await editEducation({ id: editingId as number, ...payload }).unwrap();
      } else {
        await addEducation(payload).unwrap();
      }
      pushSuccess(tCommon('update_successfully'));
    } catch {
      pushError(tCommon('update_failed'));
      throw new Error(tCommon('update_failed'));
    }
  }, [addEducation, editEducation]);

  const handleSaveWorkEntry = useCallback(async (
    values: WorkEntryFormValues,
    editingId?: number,
  ) => {
    const payload = {
      position: values.position,
      company: values.company,
      startedAt: values.startedAt,
      endedAt: values.endedAt,
    };
    try {
      if (editingId !== undefined) {
        await editWork({ id: editingId, ...payload }).unwrap();
      } else {
        await addWork(payload).unwrap();
      }
      pushSuccess(tCommon('update_successfully'));
    } catch {
      pushError(tCommon('update_failed'));
      throw new Error(tCommon('update_failed'));
    }
  }, [addWork, editWork]);

  const handleSaveTopics = useCallback(async (topics: Topic[]) => {
    try {
      await updateUserTopics({ topics: topics.map(topic => topic.id) }).unwrap();
      pushSuccess(tCommon('update_successfully'));
    } catch {
      pushError(tCommon('update_failed'));
      throw new Error(tCommon('update_failed'));
    }
  }, [updateUserTopics]);

  return (
    <ControlOverview
      className="p-2"
      currentTab={currentTab}
      onTabChange={setCurrentTab}
      tabs={tabs.map(({ value, label }) => ({ value, label: t(label) }))}
    >
      {currentTab === 'about' && (
        <LiberAboutPanel
          data={liberData}
          availableTopics={topicsData?.data}
          editable={!notMe}
          onSaveText={handleSaveText}
          onSaveLearningEntry={handleSaveLearningEntry}
          onSaveWorkEntry={handleSaveWorkEntry}
          onSaveTopics={handleSaveTopics}
        />
      )}
      {currentTab === 'stories' && (
        <MyStoriesPanel
          topics={userDetail?.humanBookTopic}
          storyOwnerId={userDetail.id}
        />
      )}
      {currentTab === 'favorite-list' && <LiberMyFavorite />}
    </ControlOverview>
  );
}
