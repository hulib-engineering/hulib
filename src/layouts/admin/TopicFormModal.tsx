'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { X } from '@phosphor-icons/react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Button from '@/components/core/button/Button';
import IconButton from '@/components/core/iconButton/IconButton';
import { mergeClassnames } from '@/components/core/private/utils';
import TextInput from '@/components/core/textInput/TextInput';
import Modal from '@/components/Modal';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import {
  usePostTopicsMutation,
  useUpdateTopicMutation,
} from '@/libs/services/modules/topics';

const topicSchema = z.object({
  name: z.string().trim().min(1, 'Topic name is required'),
});

type TopicFormValues = z.infer<typeof topicSchema>;

type TopicFormModalProps = {
  open: boolean;
  onClose: () => void;
  topic?: Topic | null;
};

const TopicFormModal = ({ open, onClose, topic }: TopicFormModalProps) => {
  const isEdit = Boolean(topic?.id);
  const [createTopic, { isLoading: isCreating }] = usePostTopicsMutation();
  const [updateTopic, { isLoading: isUpdating }] = useUpdateTopicMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: { name: '' },
  });

  useEffect(() => {
    if (open) {
      reset({ name: topic?.name ?? '' });
    }
  }, [open, topic, reset]);

  const onSubmit = async (values: TopicFormValues) => {
    try {
      if (isEdit && topic) {
        await updateTopic({ id: topic.id, name: values.name }).unwrap();
        pushSuccess('Topic updated successfully');
      } else {
        await createTopic({ name: values.name }).unwrap();
        pushSuccess('Topic created successfully');
      }
      onClose();
    } catch {
      pushError(isEdit ? 'Failed to update topic' : 'Failed to create topic');
    }
  };

  const isSubmitting = isCreating || isUpdating;

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="max-w-md rounded-2xl p-0">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-6 p-6"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium leading-8 text-neutral-10">
              {isEdit ? 'Edit topic' : 'New topic'}
            </h2>
            <IconButton
              type="button"
              variant="ghost"
              size="md"
              icon={<X className="text-xl" />}
              aria-label="Close"
              onClick={onClose}
            />
          </div>
          <TextInput
            type="text"
            label="Topic name"
            placeholder="Enter topic name"
            isError={Boolean(errors.name)}
            hintText={errors.name?.message}
            {...register('name')}
          />
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="fill"
              disabled={isSubmitting}
              className={mergeClassnames(isSubmitting && 'opacity-70')}
            >
              {isEdit ? 'Save changes' : 'Create topic'}
            </Button>
          </div>
        </form>
      </Modal.Panel>
    </Modal>
  );
};

export default TopicFormModal;
