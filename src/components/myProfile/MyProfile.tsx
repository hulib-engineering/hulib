'use client';

import Image from 'next/image';
import * as React from 'react';

import { AboutPanel } from '@/components/myProfile/AboutPanel';
import { ReviewPanel } from '@/components/myProfile/ReviewPanel';
import type { ProfileMenuItem } from '@/components/NavBar/NavBar';
import { MyProfilePanelIndex, NavBar } from '@/components/NavBar/NavBar';

const MyProfile = () => {
  const [selectedMenuItem, setSelectedMenuItem] = React.useState<
    ProfileMenuItem | undefined
  >();
  const handleChangeSelectedMenu = (item: ProfileMenuItem | undefined) => {
    setSelectedMenuItem(item);
  };

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
        <div className="relative flex h-[164px] w-full items-center bg-[#FFFFFF]">
          <div className="absolute -top-6 left-4">
            <Image
              alt="Avatar Icon"
              width={160}
              height={160}
              loading="lazy"
              src="/assets/images/icons/avatar.svg"
            />

            <div className="absolute bottom-0 right-2">
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
            </div>
          </div>
          <div className="mb-5 ml-[210px] mr-5 flex w-full items-center justify-between">
            <div className="flex-col gap-y-2">
              <p>Ngo Thanh Nhan</p>
              <div className="flex items-center gap-x-10">
                <span>Address</span>
                <span>Address</span>
                <span>Address</span>
              </div>
            </div>
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
          </div>
        </div>
      </div>
      <div className="mt-8 flex w-full items-start justify-between gap-x-8">
        <div className="flex-1 bg-[#FFFFFF] p-5">
          <NavBar
            handleChangeSelectedMenu={handleChangeSelectedMenu}
            tabsRender={tabsRender}
          />
          <div className="mt-2 h-full w-full bg-[##FFFFFF]">
            {tabsRender?.[selectedItemIndex]?.component}
          </div>
        </div>
        <div className="flex w-[280px] flex-col gap-y-8 bg-[#FFFFFF] p-5">
          <div className="flex flex-col gap-y-5">
            <div className="flex items-center justify-between gap-x-2.5">
              <h6 className="text-xl font-medium text-[#000000] ">Expertise</h6>
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
            </div>
            <div className="flex items-center gap-x-2">
              <span className="w-fit rounded-full border border-[#FFC9E3] bg-[#FFE4F1] px-3 py-2 text-[#2E3032]">
                Life
              </span>
              <span className="w-fit rounded-full border border-[#FFC9E3] bg-[#FFE4F1] px-3 py-2 text-[#2E3032]">
                Social
              </span>
              <span className="w-fit rounded-full border border-[#FFC9E3] bg-[#FFE4F1] px-3 py-2 text-[#2E3032]">
                Hobbit
              </span>
            </div>
          </div>
          <div className="flex flex-col gap-y-5 border-t-[0.5px] border-neutral-90 pt-8">
            <div className="flex items-center justify-between gap-x-2.5">
              <h6 className="text-xl font-medium text-[#000000] ">Languages</h6>
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
            </div>
            <div className="flex flex-col gap-y-1">
              <p>English:&nbsp;Native or Bilingual</p>
              <p>Vietnamese:&nbsp;Native or Bilingual</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default MyProfile;
