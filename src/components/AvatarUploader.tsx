'use client';

import { Trash, UploadSimple } from '@phosphor-icons/react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import type { ChangeEvent } from 'react';
import React, { useRef } from 'react';

import Button from '@/components/button/Button';
import { pushError } from '@/components/CustomToastifyContainer';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import { useUploadMutation } from '@/libs/services/modules/files';
import { setAvatarUrl } from '@/libs/store/authentication';
import FormDataBuilder from '@/utils/FormDataBuilder';

const AvatarUploader = () => {
  const [upload] = useUploadMutation();
  const [updateProfile] = useUpdateProfileMutation();

  const avatarUrl = useAppSelector((state) => state.auth.avatarUrl);

  const dispatch = useAppDispatch();

  const t = useTranslations('MyProfile');

  const billUploader = useRef<HTMLInputElement>(null);

  const handleAvatarUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (event.target.files && event.target.files.length > 0) {
      dispatch(
        setAvatarUrl({
          path: URL.createObjectURL(event.target.files[0] as Blob),
        }),
      );
      try {
        const result = await upload(
          FormDataBuilder({ file: event.target.files[0] }),
        ).unwrap();
        if (result?.file) {
          dispatch(
            setAvatarUrl({ id: result?.file?.id, path: result?.file?.path }),
          );

          await updateProfile({
            photo: {
              id: result?.file?.id,
              path: result?.file?.path,
            },
          }).unwrap();
        }
      } catch (error: any) {
        pushError(`Error: ${error.message}`);
      }
    }
  };
  const handleRemovingAvatar = () => {
    dispatch(setAvatarUrl({ id: '', path: '' }));
  };

  return (
    <div className="flex w-full flex-col items-center gap-5">
      <Image
        src={avatarUrl === '' ? '/assets/images/user-avatar.jpeg' : avatarUrl}
        alt="Avatar"
        width={120}
        height={120}
        priority
        className="h-[120px] w-[120px] rounded-full border-4 border-neutral-98 object-contain object-center"
      />
      <div className="flex w-full flex-col gap-3">
        <input
          id="avatar"
          type="file"
          accept="image/*"
          hidden
          aria-hidden
          ref={billUploader}
          onChange={handleAvatarUpload}
        />
        <Button
          size="lg"
          iconLeft={<UploadSimple />}
          className="border border-solid border-[#C2C6CF] bg-white capitalize text-primary-40 ring-0"
          onClick={() =>
            billUploader &&
            billUploader?.current &&
            billUploader?.current?.click()
          }
        >
          {t('upload')}
        </Button>
        <Button
          size="sm"
          iconLeft={<Trash />}
          variant="ghost"
          className="capitalize text-neutral-40"
          onClick={handleRemovingAvatar}
        >
          {t('delete_ava')}
        </Button>
      </div>
    </div>
  );
};

export default AvatarUploader;
