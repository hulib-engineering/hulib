'use client';

import Image from 'next/image';
import * as React from 'react';

import Button from '@/components/button/Button';
import Modal from '@/components/Modal';

import AvatarUploader from '../AvatarUploader';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};

const EditProfilePopup = (props: Props) => {
  return (
    <Modal open={props.open} onClose={() => {}}>
      <Modal.Backdrop />
      <Modal.Panel className="p-4 lg:p-10">
        <div className="flex flex-col items-center justify-center gap-5 rounded-lg bg-white">
          <div className="flex w-full items-center justify-center pb-5">
            <h4 className="text-[28px] font-medium text-[#000000]">
              Edit Profile
            </h4>
          </div>
          <div className="flex w-full flex-col gap-y-5 border-y border-neutral-90 py-5">
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between gap-x-2.5">
                <h6 className="text-2xl font-medium text-neutral-10">Avatar</h6>
              </div>
              <div className="flex h-fit w-full flex-col items-center justify-center gap-8 rounded-lg bg-white p-5">
                <AvatarUploader />
              </div>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between gap-x-2.5">
                <h6 className="text-2xl font-medium text-neutral-10">
                  Cover picture
                </h6>
              </div>
              <div className="relative h-[200px] w-full">
                <Image
                  src="/my-profile-banner.png"
                  className="object-contain"
                  fill
                  quality={100}
                  alt="banner"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button
              className="rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
              onClick={props.onClose}
              variant="outline"
            >
              Back
            </Button>
            <Button
              className="rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
              onClick={props.onSuccess}
            >
              Save
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default EditProfilePopup;
