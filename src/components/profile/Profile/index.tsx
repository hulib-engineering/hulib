'use client';

import {
  CaretCircleRight,
  MapPin,
  Star,
  TelegramLogo,
  Users,
} from '@phosphor-icons/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import type { ReactNode } from 'react';
import * as React from 'react';

import AboutPanel from '../AboutPanel';
import FavoriteTab from '../FavoriteTab';
import IconButtonEdit from '../IconButtonEdit';
import StoriesTab from '../StoriesTab';
import Button from '@/components/button/Button';
import type { ProfileMenuItem } from '@/components/core/NavBar/NavBar';
import { MyProfilePanelIndex, NavBar } from '@/components/core/NavBar/NavBar';
import { pushError } from '@/components/CustomToastifyContainer';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import { useUploadMutation } from '@/libs/services/modules/files';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';
import { setAvatarUrl } from '@/libs/store/authentication';
import { openChat } from '@/libs/store/messenger';
import { Role } from '@/types/common';

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
  const t = useTranslations('MyProfile');

  const searchParams = useSearchParams();

  const userInfo = useAppSelector(state => state.auth.userInfo);
  const avatarUrl = useAppSelector(state => state.auth.avatarUrl);

  const isAdmin = userInfo?.role?.id === Role.ADMIN;
  // isLiber: if a user is a Liber, means user is a Liber
  const isLiber = userInfo?.role?.id === 3;
  // huberId: if Huber is not defined, means someone is viewing huber's profile
  const huberId = searchParams.get('huberId');
  const {
    data: userDetail,
    isLoading,
    refetch,
  } = useGetUsersByIdQuery(huberId || userInfo?.id, {
    skip: !huberId && !userInfo?.id,
  });

  const dispatch = useAppDispatch();
  const billUploader = React.useRef<HTMLInputElement>(null);
  const [upload] = useUploadMutation();
  const [updateProfile] = useUpdateProfileMutation();

  const [selectedMenuItem, setSelectedMenuItem] = React.useState<
    ProfileMenuItem | undefined
  >();

  const router = useRouter();
  const pathname = usePathname();

  const handleChangeSelectedMenu = (item: ProfileMenuItem | undefined) => {
    if (item) {
      setSelectedMenuItem(item);

      // Update the URL query param
      const params = new URLSearchParams(searchParams.toString());
      params.set('tab', item.type.toString()); // Ensure the item.type is string
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    }
  };

  const handleAvatarUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ): Promise<void> => {
    if (event.target.files && event.target.files.length > 0) {
      dispatch(
        setAvatarUrl({
          path: URL.createObjectURL(event.target.files[0] as Blob),
        }),
      );
      try {
        const file = event.target.files[0];
        if (file) {
          const result = await upload({
            fileName: file.name,
            fileSize: file.size,
          }).unwrap();
          if (result?.file && result?.uploadSignedUrl) {
            await fetch(result?.uploadSignedUrl, {
              method: 'PUT',
              body: file,
            });

            dispatch(
              setAvatarUrl({ id: result?.file?.id, path: result?.file?.path }),
            );

            await updateProfile({
              photo: {
                id: result?.file?.id,
                path: result?.file?.path,
              },
            }).unwrap();

            // Refetch user data to update the UI with the new avatar
            await refetch();
          }
        }
      } catch (error: any) {
        pushError(`Error: ${error.message}`);
      }
    }
  };
  const handleOpenChatWindow = () => {
    dispatch(
      openChat({
        id: userDetail?.id ?? '',
        name: userDetail?.fullName ?? '',
        avatarUrl: userDetail?.photo?.path,
        isOpen: true,
        isMinimized: false,
      }),
    );
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
              {t('tabs.about')}
            </p>
          </div>
        ),
        component: (
          <AboutPanel
            isLiber={isLiber}
            data={userDetail}
            onInvalidate={refetch}
          />
        ),
      },

      !huberId && userDetail?.role?.id === Role.HUBER
        ? {
            type: MyProfilePanelIndex.STORY,
            label: (
              <div>
                <p
                  className={
                    selectedMenuItem?.type === MyProfilePanelIndex.STORY
                      ? 'border-b-2 border-primary-50 py-2 text-sm font-medium text-primary-50'
                      : 'py-2 text-sm font-medium text-neutral-40'
                  }
                >
                  {t('tabs.my_stories')}
                </p>
              </div>
            ),
            component: <StoriesTab />,
          }
        : null,
      huberId && isAdmin
        ? {
            type: MyProfilePanelIndex.STORY,
            label: (
              <div>
                <p
                  className={
                    selectedMenuItem?.type === MyProfilePanelIndex.STORY
                      ? 'border-b-2 border-primary-50 py-2 text-sm font-medium text-primary-50'
                      : 'py-2 text-sm font-medium text-neutral-40'
                  }
                >
                  {t('tabs.stories')}
                </p>
              </div>
            ),
            component: <div>WIP</div>,
          }
        : null,

      !huberId
        ? {
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
                  {t('tabs.my_favorite')}
                </p>
              </div>
            ),
            component: <FavoriteTab />,
          }
        : ' null,',
    ].filter(Boolean) as ProfileMenuItem[];
  }, [userDetail, selectedMenuItem?.type, huberId, isAdmin]);

  React.useEffect(() => {
    const tabParam = searchParams.get('tab'); // lấy từ ?tab=...

    if (tabParam && tabsRender.length > 0) {
      const foundItem = tabsRender.find(item => item.type === tabParam);
      if (foundItem) {
        setSelectedMenuItem(foundItem);
        return;
      }
    }

    if (tabsRender.length > 0 && !selectedMenuItem) {
      setSelectedMenuItem(tabsRender[0]);
    }
  }, [searchParams, tabsRender]);

  const getActiveMenuItemIndex = React.useCallback(
    (type: MyProfilePanelIndex | undefined) => {
      if (!type) {
        return 0;
      }
      return tabsRender.findIndex(o => o.type === type) ?? 0;
    },
    [tabsRender],
  );

  const selectedItemIndex = React.useMemo(() => {
    return getActiveMenuItemIndex(selectedMenuItem?.type);
  }, [getActiveMenuItemIndex, selectedMenuItem?.type]);

  if (isLoading) {
    return (
      <div className="flex size-full justify-center px-[10%]">
        <LoadingSkeleton />
      </div>
    );
  }

  // WIP: missing menteeCount field
  const menteeCount = 0;

  // WIP: missing rating field
  const rating = '5/5';

  return (
    <div className="mb-5 flex size-full flex-col gap-y-4">
      <div>
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
          </div>
        </div>
        <div className="flex w-full flex-row gap-y-2 bg-[#FFFFFF]">
          <div className="relative flex h-[181px] w-full flex-col lg:h-[144px] lg:flex-row">
            <div className="group relative -top-4 left-4 lg:absolute lg:-top-6 lg:left-4">
              <Image
                alt="Avatar Icon"
                width={160}
                height={160}
                className="size-[100px] rounded-full lg:size-[160px]"
                loading="lazy"
                src={
                  avatarUrl
                  || '/assets/images/ava-placeholder.png'
                }
                unoptimized={!!avatarUrl}
              />

              <div className="absolute bottom-0 left-20 opacity-0 transition-opacity duration-200 group-hover:opacity-100 lg:left-28 ">
                <input
                  id="avatar"
                  type="file"
                  accept="image/*"
                  hidden
                  aria-hidden
                  ref={billUploader}
                  onChange={handleAvatarUpload}
                />
                <IconButtonEdit
                  disabled={!!huberId}
                  onClick={() =>
                    billUploader
                    && billUploader?.current
                    && billUploader?.current?.click()}
                />
              </div>
            </div>

            <div className="relative left-4 mb-10 flex w-full items-center justify-between gap-2 lg:left-0 lg:ml-[210px] lg:mr-5">
              <div className="flex-col gap-y-1 lg:gap-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-3xl font-medium text-[#000000]">
                    {userDetail?.fullName ?? ''}
                    {' '}
                  </p>
                  {userDetail?.role?.name && (
                    <span className="inline-flex items-center gap-2 rounded-full bg-primary-90 px-4 py-1 text-sm text-primary-40">
                      {userDetail?.role?.name || '-'}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-x-10 text-sm text-neutral-20">
                  <LabelWithLeftIcon
                    label={userDetail?.address ?? 'Location'}
                    icon={<MapPin size={20} className="text-primary-60" />}
                  />
                  {!isLiber && (
                    <LabelWithLeftIcon
                      label={`${menteeCount} liber`}
                      icon={<Users size={20} className="text-primary-60" />}
                    />
                  )}
                  {!isLiber && (
                    <LabelWithLeftIcon
                      label={`${rating} rating`}
                      icon={<Star size={20} className="text-pink-50" />}
                    />
                  )}
                </div>
              </div>
              {isAdmin
                ? (
                    <div className="px-8 lg:px-0">
                      <Link href={`/admin/users/manage/${huberId}`}>
                        <Button
                          iconLeft={<CaretCircleRight size={20} />}
                          variant="primary"
                          className="mt-auto rounded-full"
                          onClick={() => {}}
                        >
                          View Activity
                        </Button>
                      </Link>
                    </div>
                  )
                : (
                    <div className="flex gap-2">
                      <Button variant="outline" size="lg">
                        Report
                      </Button>
                      <Button
                        size="lg"
                        iconRight={<TelegramLogo />}
                        onClick={handleOpenChatWindow}
                      >
                        Chat
                      </Button>
                    </div>
                  )}
            </div>
          </div>
        </div>
        <div className="left-4 mb-5 flex w-full flex-col rounded-b-lg border-b  border-t-[0.5px] border-t-neutral-90/50 bg-[#FFFFFF] shadow-[0_4px_6px_-1px_neutral-90]">
          <NavBar
            handleChangeSelectedMenu={handleChangeSelectedMenu}
            tabsRender={tabsRender}
          />
        </div>
      </div>

      <div className="flex w-full flex-col items-start justify-between lg:flex-row">
        {tabsRender?.[selectedItemIndex]?.component}
      </div>
    </div>
  );
};
export default Profile;
