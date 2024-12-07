'use client';

import * as React from 'react';

import Button from '@/components/button/Button';
import Modal from '@/components/Modal';

type Props = {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
};
const ConfirmChangePassword = (props: Props) => {
  return (
    <Modal open={props.open} onClose={() => {}}>
      <Modal.Backdrop />
      <Modal.Panel className="!w-fit p-10">
        <div className="flex !w-fit flex-col items-center justify-center gap-5 rounded-lg bg-white">
          <h4 className="text-[28px] font-medium capitalize text-slate-1000">
            Change Your Password
          </h4>
          <p className="text-base font-normal text-slate-1000">
            Are you sure you want to change your password?
          </p>
          <div className="flex items-center gap-3">
            <Button
              className="rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
              onClick={props.onClose}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              className="rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
              onClick={props.onSuccess}
            >
              Change
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default ConfirmChangePassword;
