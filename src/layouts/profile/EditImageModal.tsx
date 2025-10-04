import { Trash, UploadSimple } from '@phosphor-icons/react';
import Image from 'next/image';
import type { ChangeEvent } from 'react';
import React, { useEffect, useRef, useState } from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { pushError } from '@/components/CustomToastifyContainer';
import Modal from '@/components/Modal';
import { useAppDispatch } from '@/libs/hooks';
import {
  useLazyGetPersonalAvatarQuery,
  useUpdateProfileMutation,
} from '@/libs/services/modules/auth';
import { useUploadMutation } from '@/libs/services/modules/files';
import { setAvatarUrl } from '@/libs/store/authentication';

type IEditImageModalProps = {
  type: 'avatar' | 'cover' | string;
  data: string;
  open: boolean;
  onClose: () => void;
};

export default function EditImageModal({ type, data, open, onClose }: IEditImageModalProps) {
  const [getNewlyUpdatedAvatar, { data: avatar }] = useLazyGetPersonalAvatarQuery();
  const [updateImageUrl, { isLoading }] = useUpdateProfileMutation();
  const [upload] = useUploadMutation();

  const dispatch = useAppDispatch();

  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const [currentImageData, setCurrentImageData] = useState(data);
  const [tempFile, setTempFile] = useState<File | null>(null);
  const isTempImage = currentImageData?.startsWith('blob:');

  useEffect(() => {
    setCurrentImageData(data || '');
  }, [data, open]);
  useEffect(() => {
    if (avatar) {
      setCurrentImageData(avatar.path);
      dispatch(setAvatarUrl(avatar));
    }
  }, [avatar, dispatch]);

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    // preview before upload
    setTempFile(file);
    const previewUrl = URL.createObjectURL(file);
    setCurrentImageData(previewUrl);

    e.target.value = '';
  };
  const handleDelete = () => {
    setTempFile(null);
    setCurrentImageData('');
    if (imageInputRef.current) {
      imageInputRef.current.value = '';
    }
  };
  const handleSave = async () => {
    if (data !== currentImageData) {
      try {
        let imageId = '';

        if (tempFile && isTempImage) {
          // 1. Ask server for presigned URL
          const fileName = `${tempFile.name}-${new Date().getTime()}.${tempFile.type.split('/')[1]}`;
          const uploadResult = await upload({
            fileName,
            fileSize: tempFile.size,
          });

          // 2. Upload file directly to S3
          await fetch(uploadResult.data?.uploadSignedUrl, {
            method: 'PUT',
            headers: { 'Content-Type': tempFile.type },
            body: tempFile,
          });

          imageId = uploadResult.data?.file.id;
        }
        await updateImageUrl({
          [type === 'avatar' ? 'photo' : 'cover']: { id: imageId },
        }).unwrap();
        if (type === 'avatar') {
          await getNewlyUpdatedAvatar();
        }
        onClose();
      } catch (error) {
        pushError(`Error editing ${type}`);
      }
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-11/12 overflow-hidden rounded-none shadow-none lg:w-[959px]">
        <div className="flex w-full flex-col items-center justify-center bg-neutral-98">
          {/* Modal Header */}
          <div className="inline-flex h-[85px] w-full items-center justify-center border-b border-neutral-90 bg-white">
            <h6 className="text-[28px] font-medium capitalize leading-9 text-black">
              {`edit ${type}`}
            </h6>
          </div>
          {/* Modal Body */}
          <div className="flex w-full flex-col items-center gap-5 py-12">
            {type === 'avatar' ? (
              <Avatar imageUrl={currentImageData} className="size-[120px]" />
            ) : (
              <div className="relative aspect-[4/1] w-5/6 lg:max-w-[800px]">
                <Image
                  src={currentImageData || '/assets/images/default-cover.png'}
                  alt="Cover Image"
                  fill
                  className="object-cover"
                />
              </div>

            )}

            {/* Hidden input */}
            <input
              type="file"
              accept="image/*"
              ref={imageInputRef}
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="flex flex-col items-center gap-3">
              <Button
                variant="outline"
                size="lg"
                iconLeft={<UploadSimple weight="bold" />}
                onClick={() => imageInputRef.current?.click()}
              >
                Upload Photo
              </Button>
              <Button
                variant="ghost"
                size="sm"
                iconLeft={<Trash weight="bold" />}
                className="text-neutral-40"
                onClick={handleDelete}
              >
                Delete
                {type === 'avatar' ? ' Avatar' : ' Cover'}
              </Button>
            </div>
          </div>
          {/* Modal Footer */}
          <div className="flex h-[85px] w-full items-center justify-end gap-3 border-t border-neutral-90 bg-white px-5">
            <Button variant="outline" size="lg" onClick={onClose}>Back</Button>
            <Button
              size="lg"
              disabled={isLoading}
              animation={isLoading && 'progress'}
              className="flex-1 lg:max-w-[360px]"
              onClick={handleSave}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};
