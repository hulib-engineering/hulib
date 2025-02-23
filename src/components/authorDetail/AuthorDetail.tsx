'use client';

import { MapPin, Star, Users } from '@phosphor-icons/react';
import Image from 'next/image';
import type { ReactNode } from 'react';
import * as React from 'react';

import { AboutPanel } from '@/components/authorDetail/AboutPanel';
import { MyBookPanel } from '@/components/authorDetail/MyBookPanel';
import { ReviewPanel } from '@/components/authorDetail/ReviewPanel';
import type { ProfileMenuItem } from '@/components/NavBar/NavBar';
import { MyProfilePanelIndex, NavBar } from '@/components/NavBar/NavBar';
import { useAppSelector } from '@/libs/hooks';
import { useGetAuthorDetailQuery } from '@/libs/services/modules/user';

import { LoadingSkeleton } from '../LoadingSkeleton';
import { EditButton } from './EditButton';
import { EditIcon } from './EditIcon';
import EditIntroductionPopup from './EditIntroductionPopup';
import EditProfilePopup from './EditProfilePopup';

type Props = {
  label: string;
  icon: ReactNode;
};

const LabelWithLeftIcon = ({ label, icon }: Props) => {
  return (
    <div className="flex items-center gap-x-2">
      {icon}
      <span>{label}</span>
    </div>
  );
};

const AuthorDetail = () => {
  const user = useAppSelector((state) => state.auth.userInfo);
  const { data: authorDetail, isLoading } = useGetAuthorDetailQuery(user?.id);

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
            <AboutPanel authorDetail={authorDetail} />
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
      {
        type: MyProfilePanelIndex.MY_BOOK,
        label: (
          <div>
            <p
              className={
                selectedMenuItem?.type === MyProfilePanelIndex.MY_BOOK
                  ? 'border-b-2 border-primary-50 py-2 text-sm font-medium text-primary-50'
                  : 'py-2 text-sm font-medium text-neutral-40'
              }
            >
              My Book
            </p>
          </div>
        ),
        component: <MyBookPanel />,
      },
    ];
  }, [authorDetail, selectedMenuItem?.type]);

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

  if (isLoading) {
    return (
      <div className="flex h-full w-full justify-center px-[10%]">
        <LoadingSkeleton />
      </div>
    );
  }

  // WIP: missing menteeCount field
  const menteeCount = 0;

  // WIP: missing rating field
  const rating = '5/5';

  return (
    <div className="h-full w-full bg-neutral-98 px-[10%]">
      <div className="h-full w-full">
        <div className="relative flex h-[200px] justify-end justify-items-end bg-[#A6D4FF]">
          <div className="relative h-[200px] w-full ">
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
          <div className="relative lg:absolute lg:-top-6 lg:left-4">
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
                {authorDetail?.fullName ?? 'Author Full name'}
              </p>
              <div className="flex items-center gap-x-10 text-sm text-neutral-20">
                <LabelWithLeftIcon
                  label={authorDetail?.address ?? 'Location'}
                  icon={<MapPin size={20} />}
                />
                <LabelWithLeftIcon
                  label={`${menteeCount} mentees`}
                  icon={<Users size={20} />}
                />
                <LabelWithLeftIcon
                  label={`${rating} rating`}
                  icon={<Star size={20} />}
                />
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
          <div className="h-full w-full bg-[##FFFFFF]">
            {tabsRender?.[selectedItemIndex]?.component}
          </div>
        </div>
        {selectedItemIndex !==
          getActiveMenuItemIndex(MyProfilePanelIndex.MY_BOOK) && (
          <div className="flex w-full flex-col gap-y-8 bg-[#FFFFFF] p-5 lg:w-[280px]">
            <div className="flex flex-col gap-y-5">
              <div className="flex items-center justify-between gap-x-2.5">
                <h6 className="text-xl font-medium text-[#000000] ">
                  Expertise
                </h6>
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
                <h6 className="text-xl font-medium text-[#000000] ">
                  Video Introduction
                </h6>
              </div>
              <div className="flex flex-col gap-y-1 text-sm text-neutral-20">
                <video
                  className="h-full w-full object-cover"
                  controls
                  src={authorDetail?.videoUrl ?? ''}
                >
                  <track kind="captions" srcLang="en" label="English" default />
                </video>
              </div>
            </div>
            <EditButton
              title="Edit introduction"
              onClick={() => setOpenEditIntroductionPopup(true)}
            />
          </div>
        )}
      </div>
      <EditProfilePopup
        open={openEditProfilePopup}
        onClose={() => setOpenEditProfilePopup(false)}
        onSuccess={() => setOpenEditProfilePopup(false)}
      />
      <EditIntroductionPopup
        open={openEditIntroductionPopup}
        authorDetail={authorDetail}
        onClose={() => setOpenEditIntroductionPopup(false)}
        onSuccess={() => setOpenEditIntroductionPopup(false)}
      />
    </div>
  );
};
export default AuthorDetail;
