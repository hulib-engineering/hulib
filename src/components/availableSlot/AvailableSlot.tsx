import { Tab } from '@headlessui/react';
import { findIndex } from 'lodash';
import * as React from 'react';

import { TimeLineTable } from '@/components/availableSlot/TimeLineTable';
import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';

export enum HeaderPanelIndex {
  Monday = 'MON',
  Tuesday = 'TUE',
  Wednesday = 'WED',
  Thursday = 'THU',
  Friday = 'FRI',
  Saturday = 'SAT',
  Sunday = 'SUN',
}

export enum TabIndex {
  Monday,
  Tuesday,
  Wednesday,
  Thursday,
  Friday,
  Saturday,
  Sunday,
}

export const DAY_DISPLAY_NAMES: Record<number, string> = {
  [TabIndex.Monday]: 'Thứ Hai',
  [TabIndex.Tuesday]: 'Thứ Ba',
  [TabIndex.Wednesday]: 'Thứ Tư',
  [TabIndex.Thursday]: 'Thứ Năm',
  [TabIndex.Friday]: 'Thứ Sáu',
  [TabIndex.Saturday]: 'Thứ Bảy',
  [TabIndex.Sunday]: 'Chủ Nhật',
};

type SelectedTimeModel = {
  day: string;
  time: string[];
};

export const AvailableSlot = () => {
  const [selectedIndex, setSelectedIndex] = React.useState<TabIndex>(
    TabIndex.Monday,
  );

  const [selectedDateTime, setSelectedDateTime] = React.useState<
    SelectedTimeModel[]
  >([]);

  const [selectedTime, setSelectedTime] = React.useState<string[]>();
  const categories = [
    HeaderPanelIndex.Monday,
    HeaderPanelIndex.Tuesday,
    HeaderPanelIndex.Wednesday,
    HeaderPanelIndex.Thursday,
    HeaderPanelIndex.Friday,
    HeaderPanelIndex.Saturday,
    HeaderPanelIndex.Sunday,
  ];

  const updateSelectedDateTime = () => {
    const index = findIndex(selectedDateTime, {
      day: DAY_DISPLAY_NAMES[selectedIndex],
    });
    if (index !== -1) {
      const newSelectedItems = [...selectedDateTime];
      newSelectedItems[index] = {
        day: DAY_DISPLAY_NAMES[selectedIndex] ?? '',
        time: selectedTime ?? [],
      };
      setSelectedDateTime(newSelectedItems);
      return;
    }
    const newSelectedItems = [
      ...selectedDateTime,
      {
        day: DAY_DISPLAY_NAMES[selectedIndex] ?? '',
        time: selectedTime ?? [],
      },
    ];
    setSelectedDateTime(newSelectedItems);
  };

  const updateSelectedTime = (time: string[]) => {
    setSelectedTime(time);
  };

  const handleOnChangeDay = (index: number) => {
    setSelectedIndex(index);
    setSelectedTime([]);
  };

  const matchDateTimeData = React.useMemo(() => {
    return selectedDateTime.filter(
      (dateTime) => dateTime.day === DAY_DISPLAY_NAMES[selectedIndex],
    );
  }, [selectedDateTime, selectedIndex]);

  const numberOfSelectedTime = React.useMemo(() => {
    return matchDateTimeData?.[0]?.time?.length ?? 0;
  }, [matchDateTimeData]);

  const dayText = React.useMemo(() => {
    return DAY_DISPLAY_NAMES[selectedIndex];
  }, [selectedIndex]);

  return (
    <div className="md:p-5 flex flex-col gap-y-6 rounded-xl bg-[#FFFFFF]">
      <h2 className="text-4xl font-medium">Register as a Huber</h2>
      <div className="md:px-[60px] mx-auto flex w-fit flex-col gap-y-2 px-2 py-5 shadow-[0px_4px_5px_0px_#1C1E211A]">
        <p className="text-lg font-medium">My available slots</p>
        <p className="text-sm font-medium">
          Hãy chọn những khung giờ bạn có thể dành cho Liber
        </p>
        <div className="flex w-fit flex-col items-center gap-y-2 py-4">
          <Tab.Group selectedIndex={selectedIndex} onChange={handleOnChangeDay}>
            <Tab.List className="flex w-fit items-center rounded-2xl bg-[#F3F4F6]">
              {categories.map((day) => (
                <Tab as={React.Fragment} key={day}>
                  {({ selected }) => (
                    <button
                      type="button"
                      className={mergeClassnames(
                        'px-3 py-2 text-sm',
                        selected && 'bg-primary-90 rounded-2xl',
                      )}
                    >
                      {day}
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
            {numberOfSelectedTime > 0 ? (
              <p className="text-center text-xs text-[#38AA16]">
                Amazing!!! Bạn có thể gặp {numberOfSelectedTime}
                &nbsp;Liber vào những ngày {dayText}
                &nbsp;💚
              </p>
            ) : (
              <p className="text-center text-xs text-[#E0006F]">
                {dayText} hàng tuần bạn có thể bắt đầu một cuộc hẹn lúc mấy giờ?
              </p>
            )}
            <Tab.Panels>
              {categories.map((day) => {
                return (
                  <Tab.Panel key={day}>
                    <TimeLineTable
                      initialSelectedTime={matchDateTimeData?.[0]?.time ?? []}
                      onChange={updateSelectedTime}
                    />
                  </Tab.Panel>
                );
              })}
            </Tab.Panels>
          </Tab.Group>
          <Button
            className="w-fit rounded-full px-12 py-3"
            variant="outline"
            onClick={updateSelectedDateTime}
          >
            Confirm
          </Button>
        </div>
      </div>
      <div className="flex items-center justify-center gap-x-4">
        <Button className="w-fit rounded-full px-12 py-3" variant="outline">
          Back
        </Button>
        <Button
          className="w-fit rounded-full px-12 py-3"
          variant="primary"
          disabled={!selectedDateTime}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
