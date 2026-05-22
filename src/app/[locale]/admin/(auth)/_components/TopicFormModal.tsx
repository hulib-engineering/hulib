'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Button from '@/components/core/button/Button';
import Form from '@/components/core/form/Form';
import { mergeClassnames } from '@/components/core/private/utils';
import Radio from '@/components/core/radio/Radio';
import TextInput from '@/components/core/textInput/TextInput';
import Modal from '@/components/Modal';
import TopicBadge from '@/app/[locale]/admin/(auth)/_components/TopicBadge';
import type { Topic } from '@/libs/services/modules/topics/topicType';
import {
  usePostTopicsMutation,
  useUpdateTopicMutation,
} from '@/libs/services/modules/topics';

const TOPIC_COLORS = [
  'yellow',
  'orange',
  'pink',
  'lavender',
  'blue',
  'green',
  'primary',
] as const;

const topicSchema = z.object({
  name: z.string().trim().min(1, 'Topic name is required'),
  color: z.string().min(1, 'Topic color is required'),
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

  const form = useForm<TopicFormValues>({
    resolver: zodResolver(topicSchema),
    defaultValues: { name: '', color: '' },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    reset,
    control,
    watch,
    formState: { isValid },
  } = form;

  const selectedColorToken = watch('color');
  const topicName = watch('name');

  useEffect(() => {
    if (open) {
      reset({
        name: topic?.name ?? '',
        color: topic?.color ?? '',
      });
    }
  }, [open, topic, reset]);

  const onSubmit = async (values: TopicFormValues) => {
    try {
      if (isEdit && topic) {
        await updateTopic({
          id: topic.id,
          name: values.name,
          color: values.color,
        }).unwrap();
        pushSuccess('Topic updated successfully');
      } else {
        await createTopic({
          name: values.name,
          color: values.color,
        }).unwrap();
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
      <Modal.Panel className="flex w-[472px] flex-col gap-6 rounded-2xl bg-white px-6 py-5 shadow-sm">
        <h2 className="text-xl font-medium leading-8 text-neutral-10">
          {isEdit ? 'Edit' : 'Create new'}
          {' '}
          Topic
        </h2>

        <Form
          form={form}
          className="flex flex-col gap-5"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Form.Field
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <TextInput
                type="text"
                label="Topic name"
                required
                placeholder="Type here"
                isError={fieldState.invalid}
                {...field}
              />

            )}
          />

          <Form.Field
            control={control}
            name="color"
            render={({ field }) => (
              <Form.Item className="flex flex-col gap-2">
                <Form.Label required>Topic color</Form.Label>
                <Radio
                  value={field.value}
                  onChange={field.onChange}
                  className="flex gap-3"
                >
                  {TOPIC_COLORS.map(token => (
                    <Radio.Option
                      key={token}
                      value={token}
                      className="!cursor-pointer"
                    >
                      <span
                        className={mergeClassnames(
                          'inline-block size-11 rounded-full transition-transform duration-150',
                          'focus:outline-none focus-visible:ring-4 focus-visible:ring-primary-60',
                          `bg-${token}-90`,
                          field.value === token
                          && 'ring-4 ring-primary-60',
                        )}
                        aria-label={`Select ${token} color`}
                      />
                    </Radio.Option>
                  ))}
                </Radio>
                <Form.Message />
              </Form.Item>
            )}
          />

          <Form.Item className="flex flex-col gap-2">
            <Form.Label>Preview</Form.Label>
            {selectedColorToken ? (
              <TopicBadge
                topic={{
                  name: topicName.trim() || 'Type here',
                  color: selectedColorToken,
                  status: 'active',
                }}
                className="w-fit"
              />
            ) : (
              <span
                className={mergeClassnames(
                  'inline-flex w-fit items-center rounded-full border px-4 py-3',
                  'bg-neutral-98 border-neutral-90 text-neutral-30',
                  'text-base font-medium leading-5',
                )}
              >
                {topicName.trim() || 'Type here'}
              </span>
            )}
          </Form.Item>

          <Form.Item className="flex justify-center pt-1">
            <Button
              type="submit"
              variant="fill"
              size="lg"
              disabled={!isValid || isSubmitting}
              className={mergeClassnames(
                'rounded-full px-10 py-3',
                (!isValid || isSubmitting) && 'opacity-60',
              )}
            >
              Confirm
            </Button>
          </Form.Item>
        </Form>
      </Modal.Panel>
    </Modal>
  );
};

export default TopicFormModal;
