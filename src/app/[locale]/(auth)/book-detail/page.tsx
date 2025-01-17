import * as React from 'react';

import HumanBookInfo from '@/components/book-detail/HumanBookInfo';

export default function Index() {
  return (
    <div className="mx-auto w-full px-28">
      <div className="rounded-[20px] bg-white">
        <div className="p-5">
          <div className="flex items-start justify-start gap-5">
            <div className="flex-1 bg-primary-90">scash</div>
            <div className="w-[268px] bg-primary-10">
              <HumanBookInfo />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
