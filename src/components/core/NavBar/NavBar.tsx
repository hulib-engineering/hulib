'use client';

import * as React from 'react';

export enum MyProfilePanelIndex {
  ABOUT = 'about',
  WHAT_MENTEE_SAYS = 'what-mentee-says',
  AVAILABLE_SLOT = 'available-slot',
  MY_FAVORITE = 'my-favorite',
  STORY = 'my-stories',
}

export type ProfileMenuItem = {
  type: MyProfilePanelIndex;
  label: React.ReactNode;
  component: React.ReactNode;
};
export const NavBar = ({
  tabsRender,
  handleChangeSelectedMenu,
}: {
  tabsRender: ProfileMenuItem[];
  handleChangeSelectedMenu: (item: ProfileMenuItem | undefined) => void;
}) => {
  return (
    <div className="relative left-4 flex gap-x-8 lg:left-0 lg:ml-[210px] lg:mr-5 lg:flex-row lg:pt-4">
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
