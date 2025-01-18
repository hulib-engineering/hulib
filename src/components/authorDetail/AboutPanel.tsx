'use client';

import { X } from '@phosphor-icons/react';
import * as React from 'react';

import type { Author } from '@/libs/services/modules/auth';

import { EditButton } from './EditButton';
import EditDetailPopup from './EditDetailPopup';

type Props = {
  authorDetail: Author;
};

export const AboutPanel = ({ authorDetail }: Props) => {
  const listSkill = [
    'Front-end Development',
    'User Experience Design',
    'User Interface Design',
    'Typography',
  ];

  const [openEditPopup, setOpenEditPopup] = React.useState(false);

  return (
    <>
      <div className="flex flex-col gap-y-5 border-b-[0.5px] border-neutral-90 py-8">
        <div className="flex items-center justify-between gap-x-2.5">
          <h6 className="text-xl font-medium text-[#000000] ">About</h6>
        </div>
        <p className="text-sm font-normal text-[#000000CC]">
          {authorDetail?.bio ?? 'No information'}
        </p>
      </div>
      <div className="flex flex-col gap-y-5 border-b-[0.5px] border-neutral-90 py-8">
        <div className="flex items-center justify-between gap-x-2.5">
          <h6 className="text-xl font-medium text-[#000000] ">Skills</h6>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {listSkill.map((skill, index) => {
            return (
              <div
                key={index}
                className="flex w-fit items-center gap-x-2 rounded-full bg-primary-50 px-3 py-2 text-sm font-medium text-primary-98"
              >
                <span>{skill}</span>
                <X size={16} color="#F0F5FF" />
              </div>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-y-5 py-8">
        <div className="flex items-center justify-between gap-x-2.5">
          <h6 className="text-xl font-medium text-[#000000] ">Education</h6>
        </div>
        <p className="text-sm font-normal text-[#000000CC]">
          {authorDetail?.education ?? 'FPT University'}
          {authorDetail?.educationStart &&
            authorDetail?.educationEnd &&
            `(${authorDetail?.educationStart} - ${authorDetail?.educationEnd})`}
        </p>
      </div>
      <EditButton title="Edit details" onClick={() => setOpenEditPopup(true)} />
      <EditDetailPopup
        open={openEditPopup}
        authorDetail={authorDetail}
        onClose={() => setOpenEditPopup(false)}
        onSuccess={() => setOpenEditPopup(false)}
      />
    </>
  );
};
