'use client';

import { useTranslations } from 'next-intl';

import type { LearningEntryFormValues, WorkEntryFormValues } from '../types/profile';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import {
  useAddEducationMutation,
  useAddWorkExperienceMutation,
  useEditEducationMutation,
  useEditWorkExperienceMutation,
  useUpdateProfileMutation,
  useUpdateUserTopicsMutation,
} from '@/libs/services/modules/auth';
import type { Topic } from '@/libs/services/modules/user/userType';

const useProfileActions = () => {
  const tCommon = useTranslations('Common');

  const [updateProfile] = useUpdateProfileMutation();
  const [addEducation] = useAddEducationMutation();
  const [editEducation] = useEditEducationMutation();
  const [addWork] = useAddWorkExperienceMutation();
  const [editWork] = useEditWorkExperienceMutation();
  const [updateUserTopics] = useUpdateUserTopicsMutation();

  const normalizeMonthDate = (value?: string) => {
    if (!value) {
      return undefined;
    }
    const match = value.match(/^(\d{4})-(\d{2})/);
    if (!match) {
      return undefined;
    }
    const [, year, month] = match;
    return `${year}-${month}-01`;
  };

  const handleSaveText = async (key: 'bio', value: string) => {
    try {
      await updateProfile({ [key]: value }).unwrap();
      pushSuccess(tCommon('update_successfully'));
    } catch {
      pushError(tCommon('update_failed'));
      throw new Error(tCommon('update_failed'));
    }
  };

  const handleSaveLearningEntry = async (
    values: LearningEntryFormValues,
    editingId?: number | string,
  ) => {
    const name = values.name.trim();
    const organization = values.organization?.trim();
    const payload = {
      major: name,
      institution: organization || '',
      startedAt: normalizeMonthDate(values.startedAt) ?? values.startedAt,
      endedAt: normalizeMonthDate(values.endedAt),
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
  };

  const handleSaveWorkEntry = async (
    values: WorkEntryFormValues,
    editingId?: number,
  ) => {
    const position = values.position.trim();
    const company = values.company.trim();
    const payload = {
      position,
      company,
      startedAt: normalizeMonthDate(values.startedAt) ?? values.startedAt,
      endedAt: normalizeMonthDate(values.endedAt),
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
  };

  const handleSaveTopics = async (topics: Topic[]) => {
    const topicIds = topics
      .map(topic => Number(topic.id))
      .filter(Number.isFinite);

    try {
      await updateUserTopics({ topics: topicIds }).unwrap();
      pushSuccess(tCommon('update_successfully'));
    } catch {
      pushError(tCommon('update_failed'));
      throw new Error(tCommon('update_failed'));
    }
  };

  return {
    handleSaveText,
    handleSaveLearningEntry,
    handleSaveWorkEntry,
    handleSaveTopics,
  };
};

export default useProfileActions;
