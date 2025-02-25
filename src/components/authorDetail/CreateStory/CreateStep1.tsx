'use client';

import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { MultipleInputValue } from '@/components/authorDetail/MultipleInputValue';
import { UploadFileData } from '@/components/authorDetail/UploadFileData';
import Button from '@/components/button/Button';
import Form from '@/components/form/Form';
import TextInput from '@/components/textInput/TextInput';

type Props = {
  methods: UseFormReturn<
    {
      topics: string[];
      title: string;
      abstract: string;
      description?: string | null | undefined;
      uploadFile?: File | undefined;
    },
    any,
    undefined
  >;
  onNextPress: () => void;
};
export const CreateStep1 = (props: Props) => {
  const {
    methods: {
      register,
      handleSubmit,
      control,
      formState: { errors, isValid },
    },
    onNextPress,
  } = props;

  const { field: topicsField } = useController({
    control,
    name: 'topics',
  });

  const { field: uploadFileField } = useController({
    control,
    name: 'uploadFile',
  });

  const onChangeTopics = (topicsList: string[]) => {
    topicsField.onChange([...topicsList]);
  };

  const onUploadFile = (file: File | undefined) => {
    uploadFileField.onChange(file);
  };

  const onHandleSubmit = handleSubmit((data) => {
    console.log('data', data);
    if (isValid) {
      onNextPress();
    }
  });

  return (
    <Form id="next-step" onSubmit={onHandleSubmit}>
      <div className="flex flex-col gap-y-8">
        <div className="mdDown:gap-4 xsDown:grid-cols-1 relative grid w-full grid-cols-10 gap-6">
          <div className="xsDown:w-full xsDown:col-span-1 col-span-4 flex h-full flex-col gap-y-2">
            <div className="flex-1 flex-col gap-y-2">
              <p className="text-sm text-neutral-10">
                Topics<span className="text-red-50">*</span>
              </p>
              <MultipleInputValue
                onChangeValues={onChangeTopics}
                placeholder=""
              />
            </div>
            <div className="flex-1 flex-col gap-y-2">
              <p className="text-sm text-neutral-10">
                Tittle<span className="text-red-50">*</span>
              </p>
              <Form.Item>
                <TextInput
                  id="title"
                  type="text"
                  placeholder="Give a name for your story"
                  className="relative flex min-h-12 w-full items-center justify-center rounded-lg border border-neutral-90 bg-neutral-98 p-2 text-xs"
                  {...register('title')}
                  isError={!!errors.title}
                />
              </Form.Item>
            </div>
            <div className="flex-1 flex-col gap-y-2">
              <p className="text-sm text-neutral-10">Description</p>
              <Form.Item>
                <textarea
                  id="description"
                  placeholder="Short description about the story"
                  className="relative flex min-h-[110px] w-full resize-none items-center justify-center rounded-lg border border-neutral-90 bg-neutral-98 p-2 text-xs"
                  {...register('description')}
                />
              </Form.Item>
            </div>
            <div className="flex-1 flex-col gap-y-2">
              <p className="text-sm text-neutral-10">
                Cover picture<span className="text-red-50">*</span>
              </p>
              <div className="mt-4">
                <UploadFileData uploadSelectedFile={onUploadFile} />
              </div>
            </div>
          </div>
          <div className="xsDown:w-full xsDown:col-span-1 col-span-6 flex h-full flex-col">
            <p className="text-sm text-neutral-10">
              Your story abstract<span className="text-red-50">*</span>
            </p>
            <Form.Item>
              <textarea
                id="abstract"
                placeholder="Hey, let's talk about your inspire story"
                className="min-h-full w-full resize-none rounded-lg border border-neutral-90 bg-neutral-98 p-2 text-xs"
                {...register('abstract')}
              />
            </Form.Item>
          </div>
        </div>
      </div>
      <Form.Item className="mt-4 flex w-full justify-end">
        <Button
          type="submit"
          form="next-step"
          className="w-fit rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
          onClick={onHandleSubmit}
        >
          View as preview
        </Button>
      </Form.Item>
    </Form>
  );
};
