'use client';

import type { User } from '@/libs/services/modules/user/userType';

import IconButtonEdit from '../IconButtonEdit';

type Props = {
  data: User | undefined;
};
// eslint-disable-next-line unused-imports/no-unused-vars
const WorkAndEducationSection = ({ data }: Props) => {
  return (
    <div className="flex flex-col gap-y-4 py-5">
      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <span>Work Experience</span>
          <IconButtonEdit disabled onClick={() => {}} />
        </div>

        <div className="mb-4">
          <div className="flex items-baseline">
            <h3 className="text-neutral-20">{data?.role?.name || ''}</h3>
            <span className="mx-2 text-gray-500">as</span>
            <span className="font-medium text-neutral-20">Hulib</span>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-y-2">
        <div className="flex items-center justify-between">
          <span>Education</span>
          <IconButtonEdit disabled onClick={() => {}} />
        </div>

        <div className="mb-4">
          <div className="flex items-baseline">
            <h3 className="text-neutral-20">{data?.education}</h3>
          </div>
          <p className="text-sm text-gray-600">
            {data?.educationStart} - {data?.educationEnd}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WorkAndEducationSection;
