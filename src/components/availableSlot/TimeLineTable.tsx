import * as React from 'react';

import { mergeClassnames } from '@/components/private/utils';

type Props = {
  initialSelectedTime: string[];
  onChange: (value: string[]) => void;
};
export const TimeLineTable = ({ onChange, initialSelectedTime }: Props) => {
  const [selectedTime, setSelectedTime] =
    React.useState<string[]>(initialSelectedTime);
  const items = [];
  for (let hour = 6; hour < 24; hour += 1) {
    items.push([hour, 0]);
    items.push([hour, 30]);
  }

  const date = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  });

  const range = items.map((time) => {
    const [hour, minute] = time;
    date.setHours(hour ?? 6);
    date.setMinutes(minute ?? 0);

    return formatter.format(date);
  });

  const onClickTime = (time: string) => {
    if (selectedTime?.includes(time)) {
      const newSelectedTime = selectedTime.filter((item) => item !== time);
      setSelectedTime(newSelectedTime);
      onChange(newSelectedTime);
      return;
    }
    const newVal: string[] = [...selectedTime, time];
    setSelectedTime(newVal);
    onChange(newVal);
  };

  const timeItem = (value: string) => {
    return (
      <button
        type="button"
        className={mergeClassnames(
          'rounded-full  px-3 py-1 text-sm font-medium ',
          selectedTime?.includes(value)
            ? 'bg-[#D9F9CF] text-[#2A8010]'
            : 'bg-[#E3E4E5] text-[#73787C]',
        )}
        onClick={() => onClickTime(value)}
      >
        {value}
      </button>
    );
  };

  const timeBlock = (list: string[]) => {
    if (list.length === 0) {
      return null;
    }
    return (
      <div className="grid w-full grid-cols-5 items-center gap-2 rounded-lg bg-[#F9F9F9] p-3 md:grid-cols-6">
        {list.map((item) => (
          <>{timeItem(item)}</>
        ))}
      </div>
    );
  };
  return (
    <div className="grid w-max grid-rows-3 gap-y-4">
      {timeBlock(range.slice(0, 12))}
      {timeBlock(range.slice(12, 24))}
      {timeBlock(range.slice(24))}
    </div>
  );
};
