import { MapPin, Star, Users } from '@phosphor-icons/react';
import Image from 'next/image';
import React from 'react';

import { ROLE_NAME } from '@/types/common';

import ProfileActionDropdown from '../ProfileActionDropdown';

/**
 * ProfileInfo component
 * Displays the user's banner, avatar, and basic information (shared between huber and liber)
 * Props:
 *   - data: object containing user information
 */
const HeaderProfileInfo = ({ data }: { data: any }) => {
  return (
    <div className="mx-auto w-full rounded-lg bg-white shadow-md">
      {/* Banner Section - can be replaced with a real image if needed */}
      <div className="relative h-[200px] w-full rounded-t-lg bg-[#A6D4FF]">
        {/* Banner background, can be replaced with <Image /> if a banner image is available */}
        <div className="absolute right-4 top-4 z-20">
          <ProfileActionDropdown data={data} />
        </div>
      </div>
      {/* Profile Info Row */}
      <div className="relative flex flex-row items-end px-8 pb-6">
        {/* Avatar (read-only, rounded, with border and shadow) */}
        <div className="-mt-16 mr-6 h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-white shadow-lg">
          <Image
            src={data?.photo?.path || '/assets/images/avatar-placeholder.png'}
            alt="Avatar"
            width={128}
            height={128}
            className="h-32 w-32 object-cover"
          />
        </div>
        {/* Basic user info: role, name, location, mentee count, rating */}
        <div className="flex flex-col gap-2">
          {/* User role and name */}
          {data?.approval === 'Pending' && (
            <div className="mt-2">
              <span className="rounded bg-orange-90 px-2 py-1 text-xs font-semibold text-orange-50">
                Waiting for approval
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <span className="rounded bg-primary-90 px-2 py-1 text-xs font-semibold text-primary-40">
              {ROLE_NAME[data?.role?.id as keyof typeof ROLE_NAME] || '-'}
            </span>
            <span className="text-2xl font-semibold text-black">
              {data.fullName || '-'}
            </span>
          </div>
          {/* Location, mentee count, rating */}
          <div className="flex items-center gap-6 text-neutral-20">
            <span className="flex items-center gap-1 text-sm">
              <MapPin size={18} className="text-primary-60" />
              {data.location || '-'}
            </span>
            <span className="flex items-center gap-1 text-sm">
              <Users size={18} className="text-primary-60" />
              {data.menteeCount || 0} mentees
            </span>
            <span className="flex items-center gap-1 text-sm">
              <Star size={18} className="text-pink-50" />
              {data.rating || 0}/5 ({data.ratingCount || 0} hearts)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderProfileInfo;
