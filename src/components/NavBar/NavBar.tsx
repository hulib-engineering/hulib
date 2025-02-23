'use client';

import * as React from 'react';

export enum MyProfilePanelIndex {
  ABOUT = 'About',
  WHAT_MENTEE_SAYS = 'WhatMenteeSays',
  MY_BOOK = 'MyBook',
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
    <div className="flex items-center gap-x-8 border-b-[0.5px] border-neutral-90">
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
