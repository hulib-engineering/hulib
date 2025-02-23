'use client';

import Image from 'next/image';
import * as React from 'react';
import type { UseFormReturn } from 'react-hook-form';
import { useController } from 'react-hook-form';

import { ValueTag } from '@/components/authorDetail/MultipleInputValue';
import Button from '@/components/button/Button';

import classes from './styles.module.css';

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
  onBackPress: () => void;
  onNextPress: () => void;
};
export const CreateStep2 = (props: Props) => {
  const {
    methods: { control },
    onBackPress,
    onNextPress,
  } = props;

  const { field: titleField } = useController({
    control,
    name: 'title',
  });

  const { field: topicsField } = useController({
    control,
    name: 'topics',
  });

  const { field: abstractField } = useController({
    control,
    name: 'abstract',
  });

  const { field: uploadFileField } = useController({
    control,
    name: 'uploadFile',
  });

  const imgURL = React.useMemo(() => {
    return uploadFileField?.value
      ? URL.createObjectURL(uploadFileField.value)
      : '';
  }, [uploadFileField.value]);

  return (
    <>
      <div className="flex rounded-xl border shadow-2xl">
        <div className="flex flex-col gap-y-4 rounded-l-xl bg-white px-6 py-8">
          <h2 className="text-4xl font-bold text-neutral-20">
            {titleField.value}
          </h2>
          <Image
            src={imgURL}
            // src="https://fonts.googleapis.com/css?family=Cormorant+Garamond:300,400,600|Tulpen+One&display=swap"
            alt="Selected Image"
            width={400}
            height={400}
            className="max-h-[400px] rounded-lg border border-neutral-80 object-contain text-xs"
          />
        </div>
        <div className={classes['gap-book']} />
        <div className="flex flex-col gap-y-4 rounded-r-xl bg-white px-6 py-8">
          <h6 className="text-xl font-bold text-neutral-20">Abstract</h6>
          <p id="abstract" className="text-base text-neutral-30">
            {abstractField.value}
          </p>
        </div>
      </div>
      <div className="mt-4 flex flex-col gap-y-4">
        <h4 className="text-2xl font-medium">Topic</h4>
        <div className="flex items-center gap-x-2">
          {topicsField?.value?.map((val, idx) => (
            <ValueTag
              value={val}
              key={idx}
              className="bg-primary-90 text-black"
            />
          ))}
        </div>
      </div>
      <div className="mt-4 flex w-full items-center gap-x-3">
        <Button onClick={onBackPress} variant="outline">
          Back
        </Button>
        <Button
          className="w-fit rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
          onClick={onNextPress}
        >
          Publish
        </Button>
      </div>
    </>
  );
};
