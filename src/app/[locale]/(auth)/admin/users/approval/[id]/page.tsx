'use client';

import { Check, X } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useParams } from 'next/navigation';
import React, { useState } from 'react';

import Button from '@/components/button/Button';
import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { ContactInformationSection } from '@/components/profile/ContactInformationSection';
import OverviewSection from '@/components/profile/OverviewSection';
import WorkAndEducationSection from '@/components/profile/WorkAndEducationSection';
import HeaderProfileInfo from '@/features/users/components/HeaderProfileInfo';
import StorySession from '@/features/users/components/StorySession';
import { useGetPersonalInfoQuery } from '@/libs/services/modules/auth';
import { useGetUsersByIdQuery } from '@/libs/services/modules/user';

// --- Sidebar section definitions ---
const SIDEBAR_SECTIONS = [
  {
    key: 'overview',
    label: 'Huber Overview',
  },
  {
    key: 'work',
    label: 'Work and Education',
  },
  {
    key: 'contact',
    label: 'Contact Information',
  },
  {
    key: 'story',
    label: 'Story',
  },
];
// --- Main UserApprovalPage Component ---
const UserApprovalPage = () => {
  // Get the user id from the route params
  const { id } = useParams();

  // Fetch the user info by id
  const { data: user, isLoading: isUserLoading } = useGetUsersByIdQuery(
    Number(id),
  );
  // Fetch the current logged-in user's info
  const { data: currentUser, isLoading: isCurrentUserLoading } =
    useGetPersonalInfoQuery();

  // Sidebar state: which section is selected
  const [selectedSection, setSelectedSection] = useState('overview');

  // Show loading skeleton if either user or current user info is loading
  if (isUserLoading || isCurrentUserLoading) {
    return (
      <div className="flex h-full w-full justify-center px-[10%]">
        <LoadingSkeleton />
      </div>
    );
  }

  // If the user to approve is the current user, do not allow self-approval
  if (!user || !currentUser || String(user.id) === String(currentUser.id)) {
    return (
      <div className="flex h-full w-full items-center justify-center text-lg text-neutral-60">
        You cannot approve your own account.
      </div>
    );
  }

  // --- Render the main layout ---
  return (
    <div
      className={clsx(
        'my-4 w-full justify-between rounded-md bg-neutral-98 p-0 px-4 py-[-2rem] lg:flex-row lg:px-28',
      )}
    >
      <div className="flex w-full flex-col gap-4 rounded-lg bg-white px-8 py-6 shadow-sm">
        {/* Header: Custom, Apple HIG style, with back button and status badge */}
        <div>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="text-base font-medium text-primary-60 hover:underline focus:outline-none"
          >
            ← Back to Awaiting approval - Hubers
          </button>
        </div>
        {/* Profile Info: Avatar, name, status, location, etc. */}
        <div>
          <HeaderProfileInfo data={user} />
        </div>

        {/* Main Content Layout: Sidebar + Main Section */}
        <div className="mx-auto flex w-full max-w-7xl flex-1 rounded-lg shadow-sm">
          {/* Sidebar: Apple HIG, modern, vertical, minimal */}
          <div className="flex w-[260px] min-w-[200px] flex-col gap-2 border-r border-neutral-90 p-4">
            {SIDEBAR_SECTIONS.map((section) => (
              <button
                key={section.key}
                type="button"
                className={clsx(
                  'flex items-center px-4 py-2 text-left text-sm font-medium transition-colors',
                  selectedSection === section.key
                    ? 'rounded-lg bg-primary-90 text-primary-60'
                    : 'text-neutral-40 hover:bg-primary-98',
                )}
                onClick={() => setSelectedSection(section.key)}
              >
                {section.label}
              </button>
            ))}
          </div>

          {/* Main Content: Switch by selected section */}
          <div className="min-h-[400px] flex-1 p-8">
            {selectedSection === 'overview' && (
              <OverviewSection isLiber={false} data={user} />
            )}
            {selectedSection === 'work' && (
              <WorkAndEducationSection data={user} />
            )}
            {selectedSection === 'contact' && (
              <ContactInformationSection data={user} />
            )}
            {selectedSection === 'story' && <StorySession />}
          </div>
        </div>

        {/* Approve/Declined buttons at the bottom */}
        <div className="flex gap-4">
          <Button
            iconLeft={<Check size={16} />}
            variant="primary"
            className="h-[44px] w-[240px] px-8 py-2"
            onClick={() => {}}
          >
            Approve
          </Button>
          <Button
            iconLeft={<X size={16} />}
            className="h-[44px] w-[240px] bg-red-90 px-8 py-2 text-red-50 hover:bg-white hover:text-red-90"
            onClick={() => {}}
          >
            Declined
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UserApprovalPage;
