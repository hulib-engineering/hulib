'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { IconButton } from '@mui/material';
import { GlobeHemisphereWest } from '@phosphor-icons/react';
import * as React from 'react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';

import IconButtonEdit from '../IconButtonEdit';
import { ProfileForm } from '@/components/profile/ContactInformationSection/ProfileForm';
import type { Gender } from '@/types/common';
import { GenderName } from '@/types/common';
import { ProfileValidation } from '@/validations/ProfileValidation';

export const ContactInformationSection = ({ data }: { data: any }) => {
  const [contactInfoData, setContactInfoData] = React.useState<any>(data);
  const methods = useForm({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      isUnderGuard: false,
      fullName: data?.fullName ?? '',
      birthday: data?.birthday ?? '',
      email: data?.email ?? '',
      gender: data?.gender?.id ?? 0,
      phoneNumber: data?.phoneNumber ?? null,
      address: data?.address ?? '',
      parentPhoneNumber: data?.parentPhoneNumber ?? null,
    },
  });
  const formValues = methods.watch();
  const [editMode, setEditMode] = React.useState(false);

  useEffect(() => {
    if (!editMode) {
      setContactInfoData({
        ...formValues,
        gender: { id: formValues.gender },
      });
    }
  }, [editMode]);

  const contactInfo = React.useMemo(() => {
    return [
      {
        title: 'Full Name',
        value: contactInfoData?.fullName || 'Not provided',
      },
      {
        title: 'Gender',
        value:
          GenderName[contactInfoData?.gender?.id as Gender] || 'Not provided',
      },
      { title: 'Birthday', value: contactInfoData?.birthday || 'Not provided' },
      { title: 'Address', value: contactInfoData?.address || 'Not provided' },
      { title: 'Email', value: contactInfoData?.email || 'Not provided' },
      {
        title: 'Phone Number',
        value: contactInfoData?.phoneNumber || 'Not provided',
      },
    ];
  }, [contactInfoData]);

  return (
    <div className="flex flex-col gap-y-2 ">
      <div className="flex flex-row items-center justify-between">
        <span>Contact Information</span>
        <IconButtonEdit
          isHidden={editMode}
          onClick={() => {
            setEditMode(true);
          }}
        />
      </div>
      {editMode
        ? (
            <ProfileForm methods={methods} setEditMode={setEditMode} />
          )
        : (
            <div className="flex flex-col gap-y-3">
              {contactInfo.map((item) => {
                return (
                  <div
                    key={item.title}
                    className="flex flex-row items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{item.title}</p>
                      <p className="font-light text-neutral-20">{item.value}</p>
                    </div>
                    <div className="rounded-full bg-neutral-90">
                      <IconButton disabled>
                        <GlobeHemisphereWest
                          size={16}
                          className="text-neutral-40"
                        />
                      </IconButton>
                    </div>
                  </div>
                );
              })}
              {' '}

            </div>
          )}
    </div>
  );
};
