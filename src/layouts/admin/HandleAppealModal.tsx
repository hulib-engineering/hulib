import { ArrowLeft, ArrowRight, X } from '@phosphor-icons/react';
import React from 'react';

import Avatar from '@/components/core/avatar/Avatar';
import Button from '@/components/core/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import Modal from '@/components/Modal';
import type { FileType } from '@/libs/services/modules/files/fileType';
import { useRespondAppealMutation } from '@/libs/services/modules/appeal';
import { pad } from '@/utils/numberUtils';

type IHandleReportModalProps = {
  open?: boolean;
  onClose?: () => void;
  data?: {
    id: number;
    message: string;
    reportId: number;
    reportee: {
      id: number;
      fullName: string;
      photo: FileType;
    };
  };
};

const HandleAppealModal = ({
  open = true,
  onClose = () => {},
  data,
}: IHandleReportModalProps) => {
  const [respond, { isLoading }] = useRespondAppealMutation();

  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };
  const handleRespondAppeal = async (status: 'accepted' | 'rejected') => {
    try {
      await respond({ id: data?.id, status }).unwrap();
      pushSuccess(`Appeal request has been ${status === 'accepted' ? 'approved' : 'rejected'} successfully.`);
      handleClose();
    } catch (error: any) {
      pushError(`Error: ${error.message}`);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Modal.Backdrop />
      <Modal.Panel className="w-full max-w-[607px] overflow-hidden rounded-2xl text-neutral-10 shadow-sm">
        <div className="flex w-full flex-col items-center justify-center bg-white">
          {/* Modal Header */}
          <div className="inline-flex w-full items-center justify-between p-4 outline outline-1 -outline-offset-1 outline-neutral-90">
            <ArrowLeft className="invisible size-6" />
            <h5 className="text-2xl font-medium leading-8">Appeal request</h5>
            <X
              className="size-6 cursor-pointer text-[#343330]"
              onClick={handleClose}
            />
          </div>
          {/* Modal Body */}
          <div className="flex w-full flex-col">
            <div className="inline-flex items-center justify-between bg-neutral-98 px-6 py-2">
              <p className="text-lg font-medium">{`Report #${pad(data?.reportId ?? 0)}`}</p>
              <ArrowRight
                className="size-6 cursor-pointer text-primary-60"
                // onClick={handleClose}
              />
            </div>
            <div className="flex flex-col">
              <div className="bg-red-60 px-6 py-2 text-lg font-medium text-white outline outline-1 -outline-offset-1">
                Reported user
              </div>
              <div className="flex h-[72px] items-center gap-2 border-b border-neutral-80 px-6 text-sm font-medium leading-4">
                <Avatar imageUrl={data?.reportee.photo.path} className="size-11" />
                <span className="rounded-full bg-primary-90 px-2.5 py-0.5 text-primary-50">
                  Huber
                </span>
                <span>{data?.reportee.fullName}</span>
              </div>
            </div>
            <div className="flex flex-col gap-4 p-6">
              <p className="text-lg font-medium">Appeal form</p>
              <div
                className="h-[162px] rounded-2xl bg-neutral-98 px-3 py-0.5 leading-10 text-neutral-40 outline outline-1 -outline-offset-1 outline-neutral-90"
              >
                {data?.message}
              </div>
            </div>
          </div>
          {/* Modal Footer */}
          <div className="flex w-full items-center gap-2.5 px-6 py-5 outline outline-1 -outline-offset-1 outline-neutral-90">
            <Button
              size="lg"
              variant="outline"
              fullWidth
              disabled={isLoading}
              onClick={() => handleRespondAppeal('rejected')}
            >
              Reject
            </Button>
            <Button
              size="lg"
              variant="outline"
              fullWidth
              disabled={isLoading}
              onClick={() => handleRespondAppeal('accepted')}
            >
              Approve
            </Button>
          </div>
        </div>
      </Modal.Panel>
    </Modal>
  );
};

export default HandleAppealModal;
