'use client';

import { Trash, UploadSimple } from '@phosphor-icons/react';
import Image from 'next/image';
import React from 'react';

import Button from '@/components/button/Button';

const AvatarUploader = () => {
  // const t = useTranslations('Index');

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <Image
        src="/assets/images/user-avatar.jpeg"
        alt="Avatar"
        width={120}
        height={120}
        priority
        className="h-[120px] w-[120px] rounded-full border-4 border-neutral-98 object-contain object-center"
      />
      <div className="flex w-full flex-col gap-3">
        <Button size="lg" iconRight={<UploadSimple />}>
          Upload Photo
        </Button>
        <Button size="sm" iconRight={<Trash />} variant="ghost">
          Delete Avatar
        </Button>
      </div>
    </div>
  );
};

export default AvatarUploader;
