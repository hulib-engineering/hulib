'use client';

import { IconButton } from '@mui/material';
import { MapPin, PencilSimple, Star, Users } from '@phosphor-icons/react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import type { ReactNode } from 'react';
import * as React from 'react';

import type { ProfileMenuItem } from '@/components/core/NavBar/NavBar';
import { MyProfilePanelIndex, NavBar } from '@/components/core/NavBar/NavBar';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useAppSelector } from '@/libs/hooks';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { useGetAuthorDetailQuery } from '@/libs/services/modules/user';

import { AboutPanel } from '../AboutPanel';

type Props = {
  label: string;
  icon: ReactNode;
};

const LabelWithLeftIcon = ({ label, icon }: Props) => {
  return (
    <div className="flex items-center gap-x-2">
      {icon}
      <span className="text-[12px] font-medium sm:text-sm">{label}</span>
    </div>
  );
};

const Profile = () => {
  // const searchParams = useSearchParams();
  // const huberId = searchParams.get('huberId');
  const user = useAppSelector((state) => state.auth.userInfo);
  const path = usePathname().split('/').filter(Boolean);
  const isMyProfilePage = path[1] === 'profile' && path.length === 2;
  const {
    data: authorData,
    isLoading: authorLoading,
    refetch: authorRefetch,
  } = useGetAuthorDetailQuery(user?.id, {
    skip: isMyProfilePage || !user?.id,
  });
  const {
    data: personalData,
    isLoading: personalLoading,
    refetch: personalRefetch,
  } = useGetPersonalInfoQuery();

  const userDetail = isMyProfilePage ? personalData : authorData;
  const isLoading = isMyProfilePage ? personalLoading : authorLoading;
  const refetch = isMyProfilePage ? personalRefetch : authorRefetch;
  const isLiber = userDetail?.role?.name === 'Reader';

  const [selectedMenuItem, setSelectedMenuItem] = React.useState<
    ProfileMenuItem | undefined
  >();

  const handleChangeSelectedMenu = (item: ProfileMenuItem | undefined) => {
    setSelectedMenuItem(item);
  };

  // const listSkill = ['Life', 'Study', 'Career'];

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
          <AboutPanel liberDetail={userDetail} onInvalidate={refetch} />
        ),
      },
      {
        type: MyProfilePanelIndex.MY_FAVORITE,
        label: (
          <div>
            <p
              className={
                selectedMenuItem?.type === MyProfilePanelIndex.MY_FAVORITE
                  ? 'border-b-2 border-primary-50 py-2 text-sm font-medium text-primary-50'
                  : 'py-2 text-sm font-medium text-neutral-40'
              }
            >
              My Favorite
            </p>
          </div>
        ),
        component: <div>TBD</div>,
      },
    ];
  }, [userDetail, selectedMenuItem?.type]);

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
    <div className="h-full w-full bg-neutral-98 shadow-[0_2px_4px_0px_rgba(0,0,0,0.1)]">
      <div className="h-full w-full">
        <div className="relative flex h-[99.99px] justify-end justify-items-end bg-[#A6D4FF] lg:h-[200px]">
          <div className="relative h-[99.99px] w-full lg:h-[200px]">
            <Image
              src="/my-profile-banner.png"
              className="h-full object-cover"
              fill
              quality={100}
              alt="banner"
              loading="lazy"
            />
            {/* <div className="absolute right-2 top-8">
              <EditIcon />
            </div> */}
          </div>
        </div>
        <div className="flex w-full flex-row gap-y-2 bg-[#FFFFFF]">
          <div className="relative flex h-[181px] w-full flex-col lg:h-[144px] lg:flex-row">
            <div className="group relative -top-4 left-4 lg:absolute lg:-top-6 lg:left-4">
              <Image
                alt="Avatar Icon"
                width={160}
                height={160}
                className="h-[100px] w-[100px] lg:h-[160px] lg:w-[160px]"
                loading="lazy"
                src="/assets/images/icons/avatar.svg"
              />

              <div className="absolute bottom-0 left-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:left-28 ">
                <IconButton
                  sx={{
                    backgroundColor: '#CDDDFE',
                    border: '1px solid white',
                  }}
                  onClick={() => {}}
                  title="Edit"
                >
                  <PencilSimple size={16} color="#033599" className="p-0.5" />
                </IconButton>
              </div>
            </div>

            <div className="relative left-4 mb-10 flex w-full flex-row items-center justify-between gap-2 lg:left-0 lg:ml-[210px] lg:mr-5">
              <div className="flex-col gap-y-1 lg:gap-y-1">
                <p className="text-3xl font-medium text-[#000000]">
                  {userDetail?.fullName ?? 'Author Full name'}
                </p>
                <div className="flex items-center gap-x-10 text-sm text-neutral-20">
                  <LabelWithLeftIcon
                    label={userDetail?.address ?? 'Location'}
                    icon={<MapPin size={20} />}
                  />
                  {!isLiber && (
                    <LabelWithLeftIcon
                      label={`${menteeCount} mentees`}
                      icon={<Users size={20} />}
                    />
                  )}
                  {!isLiber && (
                    <LabelWithLeftIcon
                      label={`${rating} rating`}
                      icon={<Star size={20} />}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="left-4 mb-10 flex w-full flex-col rounded-b-lg border-b  border-t-[0.5px] border-t-neutral-90/50 bg-[#FFFFFF] shadow-[0_4px_6px_-1px_neutral-90]">
          <NavBar
            handleChangeSelectedMenu={handleChangeSelectedMenu}
            tabsRender={tabsRender}
          />
        </div>
        <div className="mt-8 flex w-full flex-col items-start justify-between gap-8 lg:flex-row">
          {/* <div className="mb-10 w-full flex-1 bg-[#FFFFFF] p-5"> */}
          <div className="h-full w-full bg-[#FFFFFF]">
            {tabsRender?.[selectedItemIndex]?.component}
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
