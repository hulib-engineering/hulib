import { Plus } from '@phosphor-icons/react';
import * as React from 'react';

type AddButtonProps = {
  title: string;
};

export const AddButton = ({ title }: AddButtonProps) => {
  return (
    <div className="flex w-fit items-center gap-x-2 text-sm font-medium text-[#4E74BF]">
      <div className="rounded-full bg-primary-90 p-2">
        <Plus size={16} color="#033599" />
      </div>
      <span>{title}</span>
    </div>
  );
};
