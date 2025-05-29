'use client';

import { CardMedia } from '@mui/material';
import React from 'react';
import { useForm } from 'react-hook-form';

import Button from '@/components/button/Button';
import { Chip } from '@/components/common/chip/Chip';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import type { User } from '@/libs/services/modules/user/userType';

import IconButtonEdit from '../IconButtonEdit';

type Props = {
  data: User | undefined;
  onInvalidate?: () => void; // Called after successful update to refetch
};

const OverviewSection = ({ data, onInvalidate }: Props) => {
  const [openEditPopup, setOpenEditPopup] = React.useState(false);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

  const [updateProfile, { isLoading: isSubmitting }] =
    useUpdateProfileMutation();

  const { register, handleSubmit, reset } = useForm<{ bio: string }>({
    defaultValues: { bio: data?.bio || '' },
  });

  const onSubmit = async (formData: { bio: string }) => {
    try {
      setErrorMessage(null);
      await updateProfile({ bio: formData.bio }).unwrap();
      setOpenEditPopup(false);
      if (onInvalidate) onInvalidate();
    } catch (error) {
      console.log(error);
    }
  };
  const truncateText = (text: string, maxLength = 30) => {
    if (!text) return '';
    return text.length > maxLength
      ? `${text.substring(0, maxLength)}...`
      : text;
  };
  return (
    <div className="mb-3 flex flex-col gap-y-4 py-5 font-light">
      {data?.topics && (
        <div className="flex flex-col gap-y-2">
          <span className="font-medium">Topic</span>
          <div className="flex flex-row gap-x-2">
            {data?.topics.map((topic) => (
              <Chip
                key={topic?.id}
                className="h-full rounded-full border border-primary-60 bg-primary-90 px-3 py-2 text-primary-60"
              >
                <span>{truncateText(topic?.name)}</span>
              </Chip>
            ))}
          </div>
        </div>
      )}
      <div className="flex flex-row justify-between font-medium">
        <span>Bio</span>
        <IconButtonEdit
          isHidden={openEditPopup}
          onClick={() => {
            reset({ bio: data?.bio || '' });
            setOpenEditPopup(true);
          }}
        />
      </div>
      {openEditPopup ? (
        <form
          className="flex flex-col gap-y-2 font-normal leading-[20px] tracking-wide"
          onSubmit={handleSubmit(onSubmit)}
        >
          <textarea
            className="w-full rounded-lg border border-[#C2C6CF] p-2 font-light"
            rows={4}
            {...register('bio')}
          />
          {errorMessage && (
            <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-600">
              {errorMessage}
            </div>
          )}
          <div className="flex flex-row justify-end gap-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isSubmitting}
              onClick={() => {
                reset({ bio: data?.bio || '' });
                setOpenEditPopup(false);
              }}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              size="sm"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </form>
      ) : (
        <div className="font-light">
          <p>{data?.bio}</p>
        </div>
      )}
      {data?.videoUrl && (
        <div className="flex flex-col gap-y-4">
          <span className="font-medium">Video Introduction</span>
          <div className="h-[200px] w-1/2 overflow-hidden rounded-lg">
            <CardMedia
              component="video"
              src={data?.videoUrl}
              controls
              autoPlay={false}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewSection;
