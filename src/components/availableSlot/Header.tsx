import * as React from 'react';

export enum HeaderPanelIndex {
  Monday = 'MON',
  Tuesday = 'TUE',
  Wednesday = 'WED',
  Thursday = 'THU',
  Friday = 'FRI',
  Saturday = 'SAT',
  Sunday = 'SUN',
}

export type HeaderMenuItem = {
  type: HeaderPanelIndex;
  label: React.ReactNode;
};
export const Header = ({
  tabsRender,
  handleChangeSelectedMenu,
}: {
  tabsRender: HeaderMenuItem[];
  handleChangeSelectedMenu: (item: HeaderMenuItem | undefined) => void;
}) => {
  return (
    <div className="flex w-fit items-center rounded-2xl bg-[#F3F4F6]">
      {tabsRender.map((item, index) => (
        <React.Fragment key={index}>
          <button type="button" onClick={() => handleChangeSelectedMenu(item)}>
            {item.label}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
};
