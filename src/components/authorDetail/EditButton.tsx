import { NotePencil } from '@phosphor-icons/react';
import * as React from 'react';

type EditButtonProps = {
  title: string;
  onClick: () => void;
};

export const EditButton = ({ title, onClick }: EditButtonProps) => {
  return (
    <div
      className="flex w-fit cursor-pointer items-center justify-center gap-x-2 rounded-full bg-primary-50 px-3 py-2"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      <NotePencil size={20} color="white" />
      <span className="text-sm font-medium text-primary-98">{title}</span>
    </div>
  );
};
