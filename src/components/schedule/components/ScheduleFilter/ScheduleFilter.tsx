import { CaretDown } from '@phosphor-icons/react';
import React from 'react';

import Input from '@/components/input/Input';
import Label from '@/components/Label';
import Popover from '@/components/popover/Popover';

interface RenderProps {
  open: boolean;
  close: () => void;
}

const ScheduleFilterPopoverMenuItems = [
  {
    label: 'Done',
  },
  {
    label: 'Huber',
  },
  {
    label: 'Liber',
  },
  {
    label: 'Waiting',
  },
];

const ScheduleFilterPopoverContent: React.FC<RenderProps> = () => {
  return (
    <div data-testid="popover-content" className="grid grid-cols-2">
      {ScheduleFilterPopoverMenuItems.map((item, index) => (
        <div key={index} className="flex items-center gap-x-1">
          <Input type="checkbox" id={item.label} readOnly={false} />
          <Label
            htmlFor={item.label}
            type="checkbox"
            className="cursor-pointer text-sm text-neutral-40"
          >
            {item.label}
          </Label>
        </div>
      ))}
    </div>
  );
};

export const ScheduleFilterPopover = () => (
  <Popover position="bottom-end">
    <Popover.Trigger
      data-testid="popover-trigger-arrow"
      {...{
        className: 'h-full',
      }}
    >
      <div className="flex items-center gap-x-2 rounded-lg border border-[#ABAEB1] px-4 py-1 text-sm text-neutral-40">
        Type of meeting
        <CaretDown size={12} />
      </div>
    </Popover.Trigger>
    <Popover.Panel className="flex flex-col gap-1 p-2">
      {({ open = false, close }) => (
        <ScheduleFilterPopoverContent close={close} open={open} />
      )}
    </Popover.Panel>
  </Popover>
);
