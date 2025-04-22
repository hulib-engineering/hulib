import { PencilSimple } from '@phosphor-icons/react';
import * as React from 'react';

export const EditIcon = ({ onClick }: { onClick?: () => void }) => {
  return (
    <div
      className="flex size-5 items-center justify-center rounded-full border-[2px] border-solid border-white bg-primary-90 lg:size-8"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
    >
      <PencilSimple size={16} color="#033599" className="p-0.5" />
    </div>
  );
};
