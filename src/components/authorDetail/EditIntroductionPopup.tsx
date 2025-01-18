'use client';

import { Plus, X } from '@phosphor-icons/react';
import * as React from 'react';
import { useState } from 'react';

import Button from '@/components/button/Button';
import Modal from '@/components/Modal';
import type { Author } from '@/libs/services/modules/auth';

import Input from '../input/Input';

type Props = {
  open: boolean;
  authorDetail: Author;
  onClose: () => void;
  onSuccess: () => void;
};

const AddButton = ({ title }: { title: string }) => {
  return (
    <div className="flex w-fit items-center gap-x-2 text-sm font-medium text-[#4E74BF]">
      <div className="rounded-full bg-primary-90 p-2">
        <Plus size={16} color="#033599" />
      </div>
      <span>{title}</span>
    </div>
  );
};

const EditIntroductionPopup = (props: Props) => {
  const [videoUrl, setVideoUrl] = useState<string | null>(
    props.authorDetail.videoUrl,
  );

  // TODO: missing field skills
  const listSkill = ['Life', 'Study', 'Career'];

  return (
    <Modal open={props.open} onClose={() => {}}>
      <Modal.Backdrop />
      <Modal.Panel className="p-4 lg:p-10">
        <div className="flex flex-col items-center justify-center gap-5 rounded-lg bg-white">
          <div className="flex w-full items-center justify-center pb-5">
            <h4 className="text-[28px] font-medium text-[#000000]">
              Edit Introduction
            </h4>
          </div>
          <div className="flex w-full flex-col gap-y-5 border-y border-neutral-90 py-5">
            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between gap-x-2.5">
                <h6 className="text-2xl font-medium text-neutral-10">
                  Expertise
                </h6>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {listSkill.map((skill, index) => {
                  return (
                    <div
                      key={index}
                      className="flex w-fit items-center gap-x-2 rounded-full bg-primary-90 px-3 py-2 text-sm font-medium text-primary-40"
                    >
                      <span>{skill}</span>
                      <X size={16} color="#033599" />
                    </div>
                  );
                })}
                <AddButton title="Add" />
              </div>
            </div>

            <div className="flex flex-col gap-y-2">
              <div className="flex items-center justify-between gap-x-2.5">
                <h6 className="text-2xl font-medium text-neutral-10">
                  Video introduction
                </h6>
              </div>
              <video
                className="h-full w-full object-cover"
                controls
                src={videoUrl ?? ''}
              >
                <track kind="captions" srcLang="en" label="English" default />
              </video>
              <p className="text-xl text-neutral-10">Import from URL Link</p>
              <Input
                value={videoUrl ?? ''}
                onChange={(e) => setVideoUrl(e.target.value)}
                placeholder="Paste file URL"
              />
              <p className="text-sm text-neutral-60">Supporting text</p>
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

export default EditIntroductionPopup;
