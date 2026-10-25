'use client';

import { useTranslations } from 'next-intl';

import type { LearningEntryFormValues, WorkEntryFormValues } from '../types/profile';
import { pushApiError, pushSuccess } from '@/components/CustomToastifyContainer';
import {
  useAddEducationMutation,
  useAddWorkExperienceMutation,
  useEditEducationMutation,
  useEditWorkExperienceMutation,
  useUpdateProfileMutation,
  useUpdateUserTopicsMutation,
} from '@/libs/services/modules/auth';
import type { Topic } from '@/libs/services/modules/user/userType';

const useProfileActions = (skipAll = false) => {
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

  /**
   * Reports the backend's own wording when there is any — a 422 field error
   * such as `company should not be empty` — and falls back to the generic
   * string otherwise.
   *
   * The re-throw is deliberate: every caller (`MyWorkSection`,
   * `MyLearningPathSection`, `MyAboutSection`, `MyTopicsSection`) keeps its
   * inline editor open by closing it only after the awaited save resolves, and
   * it swallows this rejection to avoid an unhandled promise rejection.
   */
  const reportFailure = (error: unknown): never => {
    pushApiError(error, tCommon('error_contact_admin'));
    throw new Error(tCommon('error_contact_admin'));
  };

  const handleSaveText = async (key: 'bio', value: string) => {
    try {
      await updateProfile({ [key]: value }).unwrap();
      pushSuccess(tCommon('update_successfully'));
    } catch (error) {
      reportFailure(error);
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
    } catch (error) {
      reportFailure(error);
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
    } catch (error) {
      reportFailure(error);
    }
  };

  const handleSaveTopics = async (topics: Topic[]) => {
    const topicIds = topics
      .map(topic => Number(topic.id))
      .filter(Number.isFinite);

    try {
      await updateUserTopics({ topics: topicIds }).unwrap();
      pushSuccess(tCommon('update_successfully'));
    } catch (error) {
      reportFailure(error);
    }
  };

  if (skipAll) {
    return {
      handleSaveText: async () => {},
      handleSaveLearningEntry: async () => {},
      handleSaveWorkEntry: async () => {},
      handleSaveTopics: async () => {},
    };
  }

  return {
    handleSaveText,
    handleSaveLearningEntry,
    handleSaveWorkEntry,
    handleSaveTopics,
  };
};

export default useProfileActions;
