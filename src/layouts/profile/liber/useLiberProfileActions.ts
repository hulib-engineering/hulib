'use client';

import { useTranslations } from 'next-intl';

import type { LearningEntryFormValues, Topic, WorkEntryFormValues } from './type';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import {
  useAddEducationMutation,
  useAddWorkExperienceMutation,
  useEditEducationMutation,
  useEditWorkExperienceMutation,
  useUpdateProfileMutation,
  useUpdateUserTopicsMutation,
} from '@/libs/services/modules/auth';

const useLiberProfileActions = () => {
  const tCommon = useTranslations('Common');

  const [updateProfile] = useUpdateProfileMutation();
  const [addEducation] = useAddEducationMutation();
  const [editEducation] = useEditEducationMutation();
  const [addWork] = useAddWorkExperienceMutation();
  const [editWork] = useEditWorkExperienceMutation();
  const [updateUserTopics] = useUpdateUserTopicsMutation();

  const handleSaveText = async (key: 'bio', value: string) => {
    try {
      await updateProfile({ [key]: value }).unwrap();
      pushSuccess(tCommon('update_successfully'));
    } catch {
      pushError(tCommon('update_failed'));
    }
  };

  const handleSaveLearningEntry = async (
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
  };

  const handleSaveWorkEntry = async (
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
  };

  const handleSaveTopics = async (topics: Topic[]) => {
    try {
      await updateUserTopics({ topics: topics.map(topic => topic.id) }).unwrap();
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

export default useLiberProfileActions;
