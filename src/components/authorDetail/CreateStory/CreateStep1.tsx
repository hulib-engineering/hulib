'use client';

import { Trash } from '@phosphor-icons/react';
import Image from 'next/image';
import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { MultipleInputValue } from '@/components/authorDetail/MultipleInputValue';
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

  const elmnt = document.getElementById('leftPanel');
  const panelHeight = elmnt?.clientHeight ?? 440;
  const rightPanelWidth = elmnt?.clientWidth ?? 400;

  const [selectedImage, setSelectedImage] = React.useState<string>();
  const [height, setHeight] = React.useState<number>(panelHeight - 20);

  const onChangeTopics = (topicsList: string[]) => {
    topicsField.onChange([...topicsList]);
  };

  const onUploadFile = (file: File | undefined) => {
    uploadFileField.onChange(file);
  };

  const uploadFile = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    setSelectedImage(file ? URL.createObjectURL(file) : undefined);
    onUploadFile(file);
    setHeight(height + 400);
  };

  const removeImage = (): void => {
    setSelectedImage(undefined);
    onUploadFile(undefined);
    setHeight(height - 400);
  };

  const onHandleSubmit = handleSubmit((data) => {
    console.log('data', data);
    if (isValid) {
      onNextPress();
    }
  });

  const renderAbstract = React.useMemo(() => {
    return (
      <textarea
        id="abstract"
        placeholder="Hey, let's talk about your inspire story"
        style={{
          height: `${height}px`,
        }}
        className="mt-1 w-full resize-none rounded-lg border border-neutral-90 bg-neutral-98 p-2 text-xs"
        {...register('abstract')}
      />
    );
  }, [height]);

  return (
    <Form id="next-step" onSubmit={onHandleSubmit}>
      <div className="flex flex-col gap-y-8">
        <div className="mdDown:gap-4 xsDown:grid-cols-1 relative grid w-full grid-cols-10 gap-6">
          <div
            id="leftPanel"
            className="xsDown:w-full xsDown:col-span-1 col-span-4 flex h-fit flex-col gap-y-2"
          >
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
              <div className="mt-4 w-full">
                <div className="flex flex-col gap-y-4">
                  {selectedImage && (
                    <div className="relative">
                      <Image
                        src={selectedImage}
                        alt="Selected Image"
                        width={rightPanelWidth}
                        height={400}
                        className="h-[400px] rounded-lg border border-neutral-80 text-xs"
                      />
                      <button
                        type="button"
                        className="absolute -right-2 -top-2 z-auto cursor-pointer rounded-full bg-primary-60 p-2 hover:bg-primary-40"
                        onClick={removeImage}
                      >
                        <Trash size={16} color="white" />
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col gap-y-4">
                    <div className="flex flex-col items-center">
                      <input
                        id="upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple={false}
                        onChange={uploadFile}
                        value=""
                      />
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label
                        htmlFor="upload"
                        className="flex w-full cursor-pointer items-center justify-center gap-y-1 rounded-full border border-neutral-80 py-2 text-base font-medium text-primary-50"
                      >
                        Upload Picture (under 50 MB)
                      </label>
                    </div>
                    <div className="flex flex-col">
                      <input
                        id="upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        multiple={false}
                      />
                      {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
                      <label
                        htmlFor="upload"
                        className="flex w-full cursor-pointer items-center justify-center gap-y-1 rounded-full border border-neutral-80 py-2 text-base font-medium text-primary-50"
                      >
                        Choose System Design
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="xsDown:w-full xsDown:col-span-1 col-span-6 flex h-full flex-col">
            <p className="h-4 text-sm text-neutral-10">
              Your story abstract<span className="text-red-50">*</span>
            </p>
            <Form.Item>{renderAbstract}</Form.Item>
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
