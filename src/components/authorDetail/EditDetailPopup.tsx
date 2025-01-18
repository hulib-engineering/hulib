'use client';

import * as React from 'react';

import Button from '@/components/button/Button';
import Modal from '@/components/Modal';
import type { Author } from '@/libs/services/modules/user';

import { AddButton } from './AddButton';
import { EditIcon } from './EditIcon';

type Props = {
  open: boolean;
  authorDetail: Author;
  onClose: () => void;
  onSuccess: () => void;
};

const EditDetailPopup = (props: Props) => {
  const { authorDetail } = props;

  return (
    <Modal open={props.open} onClose={() => {}}>
      <Modal.Backdrop />
      <Modal.Panel className="p-4 lg:p-10">
        <div className="flex flex-col items-center justify-center gap-5 rounded-lg bg-white">
          <div className="flex w-full items-center justify-center pb-5">
            <h4 className="text-[28px] font-medium text-[#000000]">
              Edit details
            </h4>
          </div>
          <div className="flex w-full flex-col gap-y-5 border-y border-neutral-90 py-5">
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between gap-x-2.5">
                <h6 className="text-2xl font-medium text-neutral-10">About</h6>
                <EditIcon />
              </div>
              <p className="text-sm font-normal text-neutral-20">
                {authorDetail?.bio ?? 'No information'}
              </p>
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between gap-x-2.5">
                <h6 className="text-2xl font-medium text-neutral-10">
                  Education
                </h6>
              </div>
              <p className="text-sm font-normal text-neutral-20">
                {authorDetail?.education ?? 'FPT University'}
                {authorDetail?.educationStart &&
                  authorDetail?.educationEnd &&
                  `(${authorDetail?.educationStart} - ${authorDetail?.educationEnd})`}
              </p>
              <AddButton title="Add education" />
            </div>
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between gap-x-2.5">
                <h6 className="text-2xl font-medium text-neutral-10">
                  Occupation
                </h6>
              </div>

              <AddButton title="Add job" />
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

export default EditDetailPopup;
