import * as React from 'react';

import type { HeaderMenuItem } from '@/components/availableSlot/Header';
import { Header, HeaderPanelIndex } from '@/components/availableSlot/Header';
import { TimeLineTable } from '@/components/availableSlot/TimeLineTable';
import Button from '@/components/button/Button';
import { mergeClassnames } from '@/components/private/utils';

export const AvailableSlot = () => {
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<
    HeaderMenuItem | undefined
  >();

  const handleChangeSelectedMenu = (item: HeaderMenuItem | undefined) => {
    setSelectedMenuItem(item);
  };

  const tabsRender: HeaderMenuItem[] = React.useMemo(() => {
    return [
      {
        type: HeaderPanelIndex.Monday,
        label: (
          <div>
            <p
              className={mergeClassnames(
                'px-3 py-2 text-sm',
                selectedMenuItem?.type === HeaderPanelIndex.Monday
                  ? 'bg-primary-90 rounded-2xl'
                  : '',
              )}
            >
              {HeaderPanelIndex.Monday}
            </p>
          </div>
        ),
      },
      {
        type: HeaderPanelIndex.Tuesday,
        label: (
          <div>
            <p
              className={mergeClassnames(
                'px-3 py-2 text-sm',
                selectedMenuItem?.type === HeaderPanelIndex.Tuesday
                  ? 'bg-primary-90 rounded-2xl'
                  : '',
              )}
            >
              {HeaderPanelIndex.Tuesday}
            </p>
          </div>
        ),
      },
      {
        type: HeaderPanelIndex.Wednesday,
        label: (
          <div>
            <p
              className={mergeClassnames(
                'px-3 py-2 text-sm',
                selectedMenuItem?.type === HeaderPanelIndex.Wednesday
                  ? 'bg-primary-90 rounded-2xl'
                  : '',
              )}
            >
              {HeaderPanelIndex.Wednesday}
            </p>
          </div>
        ),
      },
      {
        type: HeaderPanelIndex.Thursday,
        label: (
          <div>
            <p
              className={mergeClassnames(
                'px-3 py-2 text-sm',
                selectedMenuItem?.type === HeaderPanelIndex.Thursday
                  ? 'bg-primary-90 rounded-2xl'
                  : '',
              )}
            >
              {HeaderPanelIndex.Thursday}
            </p>
          </div>
        ),
      },
      {
        type: HeaderPanelIndex.Friday,
        label: (
          <div>
            <p
              className={mergeClassnames(
                'px-3 py-2 text-sm',
                selectedMenuItem?.type === HeaderPanelIndex.Friday
                  ? 'bg-primary-90 rounded-2xl'
                  : '',
              )}
            >
              {HeaderPanelIndex.Friday}
            </p>
          </div>
        ),
      },
      {
        type: HeaderPanelIndex.Friday,
        label: (
          <div>
            <p
              className={mergeClassnames(
                'px-3 py-2 text-sm',
                selectedMenuItem?.type === HeaderPanelIndex.Saturday
                  ? 'bg-primary-90 rounded-2xl'
                  : '',
              )}
            >
              {HeaderPanelIndex.Saturday}
            </p>
          </div>
        ),
      },
      {
        type: HeaderPanelIndex.Sunday,
        label: (
          <div>
            <p
              className={mergeClassnames(
                'px-3 py-2 text-sm',
                selectedMenuItem?.type === HeaderPanelIndex.Sunday
                  ? 'bg-primary-90 rounded-2xl'
                  : '',
              )}
            >
              {HeaderPanelIndex.Sunday}
            </p>
          </div>
        ),
      },
    ];
  }, [selectedMenuItem?.type]);

  return (
    <div className="flex flex-col gap-y-6 rounded-xl bg-[#FFFFFF] md:p-5">
      <h2 className="text-4xl font-medium">Register as a Huber</h2>
      <div className="flex flex-col gap-y-2 px-2 py-5 shadow-[0px_4px_5px_0px_#1C1E211A] md:px-[60px]">
        <p className="text-lg font-medium">My available slots</p>
        <p className="text-sm font-medium">
          Hãy chọn những khung giờ bạn có thể dành cho Liber
        </p>
        <div className="flex w-fit flex-col items-center gap-y-2 py-4">
          <Header
            tabsRender={tabsRender}
            handleChangeSelectedMenu={handleChangeSelectedMenu}
          />
          <p className="text-center text-xs text-[#E0006F]">
            Thứ hai hàng tuần bạn có thể bắt đầu một cuộc hẹn lúc mấy giờ?
          </p>
          <TimeLineTable />
          <Button className="w-fit rounded-full px-12 py-3" variant="outline">
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
          disabled
        >
          Next
        </Button>
      </div>
    </div>
  );
};
