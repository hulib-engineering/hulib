import { PlusCircle } from '@phosphor-icons/react';
import * as React from 'react';

import Button from '../button/Button';
import { CreateStory } from './CreateStory/CreateStory';

export const MyBookPanel = () => {
  const [isOpenCreateStory, setIsOpenCreateStory] = React.useState(false);
  if (isOpenCreateStory) return <CreateStory />;
  return (
    <div className="flex flex-col py-8">
      <h6 className="text-4xl font-medium text-[#000000] ">Library</h6>
      <div className="flex w-full flex-col items-center justify-center gap-y-6 rounded-3xl border border-neutral-80 py-[70px]">
        <div className="rounded-full bg-primary-98 p-6">
          <PlusCircle size={20} color="#0858FA" weight="fill" />
        </div>
        <Button
          className="rounded-full capitalize shadow-[0px_8px_24px_#1979ff40] transition-all duration-300 hover:shadow-none hover:translate-y-0.5"
          onClick={() => setIsOpenCreateStory(!isOpenCreateStory)}
        >
          View as preview
        </Button>
      </div>
    </div>
  );
};
