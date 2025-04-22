'use client';

import type { User } from '@/libs/services/modules/user/userType';

export const WorkAndEducationSection = ({
  // eslint-disable-next-line unused-imports/no-unused-vars
  liberDetail,
}: {
  liberDetail: User | undefined;
}) => {
  return (
    <div className="flex flex-col gap-y-2 py-5">
      <div className="flex flex-row justify-between font-medium">
        <span>Work Experience</span>
      </div>
    </div>
  );
};

export default WorkAndEducationSection;
