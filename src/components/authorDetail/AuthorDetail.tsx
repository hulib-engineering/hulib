'use client';

import Image from 'next/image';
import * as React from 'react';

import { AboutPanel } from '@/components/authorDetail/AboutPanel';
import { ReviewPanel } from '@/components/authorDetail/ReviewPanel';
import type { ProfileMenuItem } from '@/components/NavBar/NavBar';
import { MyProfilePanelIndex, NavBar } from '@/components/NavBar/NavBar';

import { EditButton } from './EditButton';
import EditIntroductionPopup from './EditIntroductionPopup';
import EditProfilePopup from './EditProfilePopup';

export const EditIcon = () => {
  return (
    <div className="flex size-8 items-center justify-center rounded-full border-[2px] border-solid border-white bg-primary-90">
      <Image
        src="/assets/icons/pencil-simple.svg"
        alt="Caret Down Icon"
        width={16}
        height={16}
        loading="lazy"
        color="#033599"
      />
    </div>
  );
};

const AuthorDetail = () => {
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<
    ProfileMenuItem | undefined
  >();
  const [openEditIntroductionPopup, setOpenEditIntroductionPopup] =
    React.useState(false);
  const [openEditProfilePopup, setOpenEditProfilePopup] = React.useState(false);
  const handleChangeSelectedMenu = (item: ProfileMenuItem | undefined) => {
    setSelectedMenuItem(item);
  };

  const listSkill = ['Life', 'Study', 'Career'];

  const tabsRender: ProfileMenuItem[] = React.useMemo(() => {
    return [
      {
        type: MyProfilePanelIndex.ABOUT,
        label: (
          <div>
            <p
              className={
                selectedMenuItem?.type === MyProfilePanelIndex.ABOUT
                  ? 'border-b-2 border-primary-50 py-2 text-sm font-medium text-primary-50'
                  : 'py-2 text-sm font-medium text-neutral-40'
              }
            >
              About
            </p>
          </div>
        ),
        component: (
          <div>
            <AboutPanel />
          </div>
        ),
      },
      {
        type: MyProfilePanelIndex.WHAT_MENTEE_SAYS,
        label: (
          <div>
            <p
              className={
                selectedMenuItem?.type === MyProfilePanelIndex.WHAT_MENTEE_SAYS
                  ? 'border-b-2 border-primary-50 py-2 text-sm font-medium text-primary-50'
                  : 'py-2 text-sm font-medium text-neutral-40'
              }
            >
              What mentee says
            </p>
          </div>
        ),
        component: (
          <div>
            <ReviewPanel />
          </div>
        ),
      },
    ];
  }, [selectedMenuItem?.type]);

  const getActiveMenuItemIndex = React.useCallback(
    (type: MyProfilePanelIndex | undefined) => {
      if (!type) return 0;
      return tabsRender.findIndex((o) => o.type === type) ?? 0;
    },
    [tabsRender],
  );

  const selectedItemIndex = React.useMemo(() => {
    return getActiveMenuItemIndex(selectedMenuItem?.type);
  }, [getActiveMenuItemIndex, selectedMenuItem?.type]);

  React.useEffect(() => {
    return setSelectedMenuItem(tabsRender?.[selectedItemIndex]);
  }, [selectedItemIndex, tabsRender]);

  return (
    <div className="h-full w-full bg-[#F9F9F9] px-[10%]">
      <div className="w-full">
        <div className="relative flex h-[200px] justify-end justify-items-end bg-[#A6D4FF]">
          <div className="absolute right-[10%] h-[200px] w-[200px]">
            <Image
              src="/my-profile-banner.png"
              className="object-cover"
              fill
              quality={100}
              alt="banner"
              loading="lazy"
            />
          </div>
        </div>
        <div className="relative flex w-full flex-col items-center bg-[#FFFFFF] lg:h-[164px] lg:flex-row">
          <div className="relative -top-6 left-4 lg:absolute">
            <Image
              alt="Avatar Icon"
              width={160}
              height={160}
              loading="lazy"
              src="/assets/images/icons/avatar.svg"
            />

            <div className="absolute bottom-0 right-2">
              <EditIcon />
            </div>
          </div>
          <div className="mb-5 flex w-full flex-col items-center justify-between gap-2 lg:ml-[210px] lg:mr-5 lg:flex-row">
            <div className="flex-col gap-y-2">
              <p className="text-3xl font-medium text-[#000000]">
                Ngo Thanh Nhan
              </p>
              <div className="flex items-center gap-x-10 text-sm text-neutral-20">
                <span>Address</span>
                <span>Address</span>
                <span>Address</span>
              </div>
            </div>
            <EditButton
              title="Edit"
              onClick={() => setOpenEditProfilePopup(true)}
            />
          </div>
        </div>
      </div>
      <div className="mt-8 flex w-full flex-col items-start justify-between gap-8 lg:flex-row">
        <div className="flex-1 bg-[#FFFFFF] p-5">
          <NavBar
            handleChangeSelectedMenu={handleChangeSelectedMenu}
            tabsRender={tabsRender}
          />
          <div className="mt-2 h-full w-full bg-[##FFFFFF]">
            {tabsRender?.[selectedItemIndex]?.component}
          </div>
        </div>
        <div className="flex w-full flex-col gap-y-8 bg-[#FFFFFF] p-5 lg:w-[280px]">
          <div className="flex flex-col gap-y-5">
            <div className="flex items-center justify-between gap-x-2.5">
              <h6 className="text-xl font-medium text-[#000000] ">Expertise</h6>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-[#2E3032]">
              {listSkill.map((skill, index) => {
                return (
                  <span
                    key={index}
                    className="w-fit rounded-full border border-[#FFC9E3] bg-[#FFE4F1] px-3 py-2 "
                  >
                    {skill}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-y-5 border-t-[0.5px] border-neutral-90 pt-8">
            <div className="flex items-center justify-between gap-x-2.5">
              <h6 className="text-xl font-medium text-[#000000] ">Languages</h6>
            </div>
            <div className="flex flex-col gap-y-1 text-sm text-neutral-20">
              <p>English:&nbsp;Native or Bilingual</p>
              <p>Vietnamese:&nbsp;Native or Bilingual</p>
            </div>
          </div>
          <EditButton
            title="Edit introduction"
            onClick={() => setOpenEditIntroductionPopup(true)}
          />
        </div>
      </div>
      <EditProfilePopup
        open={openEditProfilePopup}
        onClose={() => setOpenEditProfilePopup(false)}
        onSuccess={() => setOpenEditProfilePopup(false)}
      />
      <EditIntroductionPopup
        open={openEditIntroductionPopup}
        listSkill={listSkill}
        onClose={() => setOpenEditIntroductionPopup(false)}
        onSuccess={() => setOpenEditIntroductionPopup(false)}
      />
    </div>
  );
};
export default AuthorDetail;
