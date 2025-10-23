'use client';

import {
  CalendarDot,
  CaretCircleRight,
  CaretDown,
  ChartLine,
  Clock,
  VideoConference,
  Warning,
  X,
  XSquare,
} from '@phosphor-icons/react';
import * as React from 'react';
import { useRef, useState } from 'react';

import { useLocale } from 'next-intl';
import Accordion from '@/components/core/accordion/Accordion';
import MenuItem from '@/components/core/menuItem/MenuItem';
import { mergeClassnames } from '@/components/core/private/utils';
import { StatusEnum } from '@/types/common';
import { useGetReadingSessionOfUserQuery } from '@/libs/services/modules/user';
import type { Huber } from '@/libs/services/modules/huber/huberType';
import { toLocaleDateString, toLocaleTimeString } from '@/utils/dateUtils';
import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';
import { SessionAttendees } from '@/layouts/scheduling/SessionAttendees';
import type { ReadingSession } from '@/libs/services/modules/reading-session/createNewReadingSession';
import Button from '@/components/core/button/Button';
import Modal from '@/components/Modal';
import IconButton from '@/components/core/iconButton/IconButton';

const SessionOverviewForAdminCard = ({
  session,
  isLiber = false,
  isRejected = false,
  isMissed = false,
}: { session: ReadingSession; isLiber?: boolean; isRejected?: boolean; isMissed?: boolean }) => {
  const locale = useLocale();

  const dummyRef = useRef<HTMLDivElement>(null);

  const [isCancelationReasonModalOpen, setIsCancelationReasonModalOpen] = useState(false);

  return (
    <>
      <div
        className={mergeClassnames(
          'rounded-2xl shadow-sm flex flex-col gap-4 py-4 px-5',
          !isLiber ? 'bg-primary-98' : 'bg-yellow-98',
          isRejected && 'bg-red-98',
          isMissed && 'border border-red-50 bg-neutral-variant-98',
        )}
      >
        <ScheduleInfoItemLayout
          icon={<CalendarDot className="text-[#343330]" />}
          title={`${toLocaleDateString(session.startedAt, locale === 'en' ? 'en-US' : 'vi-VI')} | ${toLocaleTimeString(session.startedAt, locale)} - ${toLocaleTimeString(session.endedAt, locale)}`}
          className="mt-2"
        />
        <SessionAttendees
          huber={session.humanBook}
          liber={session.reader}
          isVibing={isLiber}
          isAdmin
          childClassname="pl-4"
        />
        {isRejected && (
          <Button
            size="lg"
            fullWidth
            onClick={() => setIsCancelationReasonModalOpen(true)}
          >
            <div className="flex items-center gap-1.5">
              <CaretCircleRight className="text-xl" />
              <span>View reason</span>
            </div>
          </Button>
        )}
      </div>
      <Modal
        open={isCancelationReasonModalOpen}
        initialFocus={dummyRef}
        onClose={() => setIsCancelationReasonModalOpen(false)}
      >
        <Modal.Backdrop />
        <Modal.Panel className="w-full max-w-xl bg-yellow-98 px-1 py-5 shadow-sm xl:px-6">
          <div tabIndex={-1} ref={dummyRef} aria-hidden="true" />

          <div className="flex flex-col items-center justify-center gap-4">
            {/* Title */}
            <h5 className="text-center text-2xl font-medium leading-8 text-neutral-10">
              ⚠️ Cancel vibing with Liber
            </h5>

            <ScheduleInfoItemLayout
              icon={<Clock className="text-[#343330]" />}
              title={`${toLocaleDateString(session.startedAt, locale === 'en' ? 'en-US' : 'vi-VI')} | ${toLocaleTimeString(session.startedAt, locale)} - ${toLocaleTimeString(session.endedAt, locale)}`}
              className="w-full"
            />

            <SessionAttendees
              huber={session.humanBook}
              liber={session.reader}
              isVibing={isLiber}
              isAdmin
              classname="w-full"
              childClassname="pl-4"
            />

            <div className="flex w-full flex-col gap-1">
              <p className="font-medium text-neutral-10">Reason:</p>
              <div className="flex h-14 rounded-lg border border-primary-60 bg-white px-3 py-2 text-sm font-medium leading-4 text-neutral-10">
                {session.rejectReason}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex w-full items-center justify-center">
              <IconButton
                variant="outline"
                size="lg"
                onClick={() => setIsCancelationReasonModalOpen(false)}
              >
                <X />
              </IconButton>
            </div>
          </div>
        </Modal.Panel>
      </Modal>
    </>

  );
};

type ActivityType = StatusEnum.Finished | StatusEnum.Rejected | StatusEnum.Missed | 'frequency';

const ActivityTypes = [
  {
    type: 'frequency',
    label: 'Frequency of access',
    icon: (
      <ChartLine />
    ),
  },
  {
    type: StatusEnum.Finished,
    label: 'Completed meeting',
    icon: (
      <VideoConference />
    ),
  },
  {
    type: StatusEnum.Rejected,
    label: 'Declined meeting',
    icon: (
      <XSquare />
    ),
  },
  {
    type: StatusEnum.Missed,
    label: 'Missed meeting',
    icon: (
      <Warning />
    ),
  },
] as const;

const UserActivityList = ({ userInfo }: { userInfo: Huber }) => {
  // const t = useTranslations('MyProfile.about_panel');

  const [type, setType] = useState<ActivityType>('frequency');

  const { data, isLoading } = useGetReadingSessionOfUserQuery({
    id: userInfo?.id,
    sessionStatus: type,
    limit: 100,
  }, { skip: type === 'frequency' });

  const renderActivityListTitle = () => {
    switch (type) {
      case StatusEnum.Finished:
        return 'Completed meeting';
      case StatusEnum.Rejected:
        return 'Declined meeting';
      case StatusEnum.Missed:
        return 'Missed meeting';
      default:
        return 'Frequency of access';
    }
  };

  if (isLoading) {
    return null;
  }

  return (
    <div className="w-full overflow-hidden bg-white xl:rounded-xl xl:shadow-sm">
      {/* Mobile View - Accordion Style */}
      <div className="flex w-full flex-col rounded-xl border-neutral-90 px-5 py-4 lg:hidden">
        <div className="px-3 py-1 font-medium leading-5 text-neutral-10">
          {`${userInfo?.fullName}'s Activities`}
        </div>
        <Accordion defaultValue="about-section-overview" singleOpen>
          {ActivityTypes.map(section => (
            <Accordion.Item key={section.type} value={`about-section-${section.type}`}>
              <Accordion.Header className="hulib-open:rounded-b-lg hulib-open:bg-primary-98">
                <Accordion.Button className="ps-2">
                  <div className="flex items-center gap-2">
                    {section.icon}
                    <span className="text-sm leading-4">{section.label}</span>
                  </div>
                  <CaretDown className="text-2xl hulib-open:text-primary-20 hulib-open:rotate-180" />
                </Accordion.Button>
              </Accordion.Header>
              <Accordion.Content className="mt-1 rounded-none border-t-0 p-0">
                <div className="flex flex-1 flex-col gap-6 border-r bg-white px-8 py-5 shadow-sm">
                  <p className="font-medium leading-loose">{renderActivityListTitle()}</p>
                  <div className="grid grid-cols-1 gap-4">
                    {data?.data.map((item: ReadingSession) => (
                      <SessionOverviewForAdminCard
                        key={item.id}
                        session={item}
                        isLiber={Number(userInfo.id) === Number(item?.reader?.id)}
                        isRejected={type === StatusEnum.Rejected}
                        isMissed={type === StatusEnum.Missed}
                      />
                    ))}
                  </div>
                </div>
              </Accordion.Content>
            </Accordion.Item>
          ))}
        </Accordion>
      </div>

      {/* Desktop View - Side by Side */}
      <div className="hidden h-full overflow-hidden rounded-xl border-neutral-90 bg-white lg:flex">
        <div className="flex w-1/4 flex-col gap-1 border-r border-neutral-80 bg-white px-4 py-5">
          <div className="rounded-lg bg-white px-3 py-1 font-medium text-neutral-10">
            {`${userInfo?.fullName}'s Activities`}
          </div>
          {ActivityTypes.map((section, index) => (
            <MenuItem
              key={index}
              as="button"
              isSelected={type === section.type}
              onClick={() => setType(section.type)}
            >
              {section.icon}
              <MenuItem.Title
                className={mergeClassnames(
                  'text-neutral-10 ',
                  type === section.type && 'text-primary-60',
                )}
              >
                {section.label}
              </MenuItem.Title>
            </MenuItem>
          ))}
        </div>
        <div className="flex flex-1 flex-col gap-6 border-r bg-white px-8 py-5 shadow-sm">
          <p className="font-medium leading-loose">{renderActivityListTitle()}</p>
          <div className="grid grid-cols-2 gap-4">
            {data?.data.map((item: ReadingSession) => (
              <SessionOverviewForAdminCard
                key={item.id}
                session={item}
                isLiber={Number(userInfo.id) === Number(item?.reader?.id)}
                isRejected={type === StatusEnum.Rejected}
                isMissed={type === StatusEnum.Missed}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserActivityList;
