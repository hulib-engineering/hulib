import Image from 'next/image';
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
      <Image
        src="/assets/icons/note-pencil.svg"
        alt="Caret Down Icon"
        width={20}
        height={20}
        loading="lazy"
      />
      <span className="text-sm font-medium text-primary-98">{title}</span>
    </div>
  );
};
