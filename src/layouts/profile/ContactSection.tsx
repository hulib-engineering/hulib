'use client';

import { GlobeHemisphereWest, PencilSimple } from '@phosphor-icons/react';
import { useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';

import { format } from 'date-fns';
import IconButton from '@/components/core/iconButton/IconButton';
import type { User } from '@/features/users/types';
import ProfileForm from '@/layouts/profile/ProfileForm';
import type { Gender } from '@/types/common';
import { GenderName } from '@/types/common';
import { calculateAge } from '@/utils/dateUtils';

export default function ContactSection({ data, editable }: { data: User; editable?: boolean }) {
  const t = useTranslations('Common');
  const [editMode, setEditMode] = useState(false);

  const contactInfo = useMemo(() => {
    return [
      {
        title: t('full_name'),
        value: data?.fullName || t('not_provided'),
      },
      {
        title: t('gender'),
        value:
          GenderName[data?.gender?.id as Gender] || t('not_provided'),
      },
      { title: t('date_of_birth'), value: format(new Date(data?.birthday), 'dd/MM/yyy') || t('not_provided') },
      { title: t('address'), value: data?.address || t('not_provided') },
      { title: t('email'), value: data?.email || t('not_provided') },
      {
        title: t('phone_number'),
        value: data?.phoneNumber || t('not_provided'),
      },
      {
        title: t('guardian_name'),
        value: data?.parentFullname || t('not_provided'),
      },
      {
        title: t('guardian_phone_number'),
        value: data?.parentPhoneNumber || t('not_provided'),
      },
    ];
  }, [data]);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="font-medium text-black">{t('contact_information')}</p>
        {editable && !editMode && (
          <IconButton variant="soft" size="sm" className="p-2" onClick={() => setEditMode(true)}>
            <PencilSimple weight="bold" />
          </IconButton>
        )}
      </div>
      {editMode
        ? (
            <ProfileForm
              data={data}
              onCancel={() => setEditMode(false)}
              onSucceed={() => setEditMode(false)}
            />
          )
        : contactInfo
            .filter((item) => {
              const isGuardianField
              = ['Your guardian name', 'Your guardian phone number'].includes(item.title);
              if (isGuardianField) {
                return calculateAge(data?.birthday) < 18; // only show if under 18
              }
              return true; // always show other fields
            })
            .map((item, index) => {
              return (
                <div
                  key={index}
                  className="flex items-center justify-between"
                >
                  <div className="flex w-5/6 flex-col text-sm">
                    <p className="font-medium text-neutral-10">{item.title}</p>
                    <p className="font-light text-neutral-20">{item.value}</p>
                  </div>
                  <div className="rounded-full bg-neutral-90">
                    <IconButton
                      variant="soft"
                      size="sm"
                      className="p-2"
                      disabled
                    >
                      <GlobeHemisphereWest weight="bold" />
                    </IconButton>
                  </div>
                </div>
              );
            })}
    </div>
  );
};
