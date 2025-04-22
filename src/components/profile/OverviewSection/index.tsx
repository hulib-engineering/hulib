'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';

import { EditIcon } from '@/components/authorDetail/EditIcon';
import { useUpdateProfileMutation } from '@/libs/services/modules/auth';
import type { User } from '@/libs/services/modules/user/userType';

type Props = {
  liberDetail: User | undefined;
};

const OverviewSection = ({ liberDetail }: Props) => {
  const [openEditPopup, setOpenEditPopup] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [updateProfile, { isLoading: isSubmitting }] =
    useUpdateProfileMutation();

  const { register, handleSubmit, reset } = useForm<{ bio: string }>({
    defaultValues: { bio: liberDetail?.bio || '' },
  });

  return (
    <div className="mb-3 flex flex-col gap-y-2 border-b border-neutral-90/50 py-5">
      <div className="flex flex-row justify-between font-medium">
        <span>Bio</span>
        {!openEditPopup && (
          <EditIcon
            onClick={() => {
              reset({ bio: liberDetail?.bio || '' });
              setOpenEditPopup(true);
            }}
          />
        )}
      </div>
      {openEditPopup ? (
        <form
          className="flex flex-col gap-y-2 font-normal leading-[20px] tracking-wide"
          onSubmit={handleSubmit(async (data) => {
            setError(null);

            try {
              await updateProfile({ bio: data.bio }).unwrap();
              setOpenEditPopup(false);
            } catch (err) {
              setError(
                err instanceof Error ? err.message : 'Failed to update bio',
              );
            }
          })}
        >
          <textarea
            className="w-full rounded-lg border border-[#C2C6CF] p-2"
            rows={4}
            {...register('bio')}
          />
          {error && (
            <div className="mb-2 rounded bg-red-100 p-2 text-sm text-red-600">
              {error}
            </div>
          )}
          <div className="flex flex-row justify-end gap-x-2">
            <button
              type="submit"
              className="rounded-full border-[#C2C6CF] bg-primary-50 px-7 py-3 text-white disabled:bg-neutral-60"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              className="rounded-full border-[#C2C6CF] bg-neutral-90 px-7 py-3"
              onClick={() => {
                reset({ bio: liberDetail?.bio || '' });
                setOpenEditPopup(false);
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <div className="  ">
          <p className="leading-[20px] tracking-wide">{liberDetail?.bio}</p>
        </div>
      )}
    </div>
  );
};

export default OverviewSection;
