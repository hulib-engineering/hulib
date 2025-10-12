import { CalendarDot, CaretDown, Check, FilmReel, MapPinArea, Note } from '@phosphor-icons/react';
import type { FC } from 'react';
import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import Link from 'next/link';

import Accordion from '@/components/core/accordion/Accordion';
import Button from '@/components/core/button/Button';
import { pushError, pushSuccess } from '@/components/CustomToastifyContainer';
import { mergeClassnames } from '@/components/core/private/utils';
import TextInput from '@/components/core/textInput-v1/TextInput';
import { ScheduleInfoItemLayout } from '@/layouts/scheduling/ScheduleInfoItemLayout';
import { SessionAttendees } from '@/layouts/scheduling/SessionAttendees';
import { useAppSelector } from '@/libs/hooks';
import { useUpdateReadingSessionMutation } from '@/libs/services/modules/reading-session';
import type {
  ReadingSession,
  StatusType,
} from '@/libs/services/modules/reading-session/createNewReadingSession';
import { StatusEnum } from '@/types/common';
import { toLocaleDateString, toLocaleTimeString } from '@/utils/dateUtils';

type SessionCardProps = {
  session: ReadingSession;
  className?: string;
};

const SessionDetailCard: FC<SessionCardProps> = ({ session }) => {
  const isMissed = session.sessionStatus === StatusEnum.Missed;
  const isDone = session.sessionStatus === StatusEnum.Finished;

  const locale = useLocale();

  const [updateStatus, { isLoading }] = useUpdateReadingSessionMutation();

  const userId = useAppSelector(state => state.auth.userInfo?.id);
  const isLiber = Number(userId) === Number(session?.reader?.id);

  const [isAddingReason, setIsAddingReason] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [reason, setReason] = useState('');

  const handleReject = () => {
    setIsRejecting(true);
    setIsAddingReason(true);
  };
  const handleCancelAddingReason = () => {
    setIsRejecting(false);
    setIsAddingReason(false);
  };
  const handleUpdateStatus = async (newStatus: StatusType, reason?: string) => {
    try {
      const payload: any = {
        id: session.id,
        sessionStatus: newStatus,
      };

      if (newStatus === StatusEnum.Canceled) {
        payload.note = reason;
      }
      if (newStatus === StatusEnum.Rejected) {
        payload.rejectReason = reason;
      }

      await updateStatus(payload).unwrap();

      pushSuccess('Status updated successfully!');
    } catch (error) {
      pushError('Failed to update status. Please try again.');
    }
  };
  const handleConfirmReason = async () => {
    setReason('');
    await handleUpdateStatus(isRejecting ? 'rejected' : 'canceled', reason);
  };

  if (isMissed) {
    return (
      <div className="w-full overflow-hidden rounded-2xl bg-red-98 px-5 py-4 font-medium shadow-sm sm:max-w-[25rem]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-red-60 px-4 py-2 text-sm font-medium uppercase leading-4 text-white">missed</div>
            <h5 className="text-2xl font-medium text-neutral-10">{isLiber ? 'Vibing with Huber' : 'Session with Liber'}</h5>
          </div>
          <div className="flex items-center gap-1.5">
            <CalendarDot className="text-[#343330]" />
            <span className="text-sm leading-4 text-neutral-20">
              {toLocaleDateString(session.startedAt, locale === 'en' ? 'en-US' : 'vi-VI')}
              {' '}
              |
              {' '}
              {toLocaleTimeString(session.startedAt, locale)}
              {' '}
              -
              {' '}
              {toLocaleTimeString(session.endedAt, locale)}
            </span>
          </div>
          <SessionAttendees
            huber={session.humanBook}
            liber={session.reader}
            isVibing={isLiber}
            showParticipantOnly
          />
        </div>
      </div>
    );
  }

  return (
    <div
      className={mergeClassnames(
        'w-full overflow-hidden rounded-2xl py-4 px-5 shadow-sm sm:max-w-[396px] font-medium',
        isLiber ? 'bg-primary-98' : 'bg-yellow-98',
      )}
    >
      <Accordion>
        <Accordion.Item value="single-session">
          <Accordion.Header
            className={mergeClassnames(
              'flex flex-col gap-2 moon-open:[&_svg]:rotate-180 font-medium',
              isLiber ? 'bg-primary-98' : 'bg-yellow-98',
            )}
          >
            <Accordion.Button className="p-0">
              <div className="flex items-center gap-2.5">
                <h5 className="text-2xl font-medium text-neutral-10">{isLiber ? 'Vibing with Huber' : 'Session with Liber'}</h5>
                {session.sessionStatus === StatusEnum.Pending && (
                  <span
                    className="rounded-[100px] bg-orange-90 p-[7px] text-sm font-medium leading-4 text-orange-50 hulib-open:hidden"
                  >
                    Waiting...
                  </span>
                )}
                {session.sessionStatus === StatusEnum.Finished && (
                  <div
                    className="flex gap-0.5 rounded-full bg-green-90 px-4 py-2 text-sm font-medium leading-4 text-green-40 hulib-open:hidden"
                  >
                    <Check />
                    <span>Done</span>
                  </div>
                )}
              </div>
              <CaretDown className="text-2xl text-neutral-10 hulib-open:rotate-180" />
            </Accordion.Button>
            {session.sessionStatus === StatusEnum.Pending && (
              <span
                className="hidden w-fit rounded-[100px] bg-orange-90 p-[7px] text-sm font-medium leading-4 text-orange-50 hulib-open:block"
              >
                Waiting for approving
              </span>
            )}
            {session.sessionStatus === StatusEnum.Finished && (
              <div
                className="hidden w-fit gap-0.5 rounded-full bg-green-90 px-4 py-2 text-sm font-medium leading-4 text-green-40 hulib-open:flex"
              >
                <Check />
                <span>Done</span>
              </div>
            )}
            <div className="mt-2 hidden items-center gap-1 text-sm font-medium leading-4 text-neutral-10 hulib-open:flex">
              <span>From:</span>
              <span className="text-primary-60">{session.story.title}</span>
            </div>
            {session.sessionStatus !== StatusEnum.Finished && (
              <ScheduleInfoItemLayout
                icon={<CalendarDot className="text-[#343330]" />}
                title={`${toLocaleDateString(session.startedAt, locale === 'en' ? 'en-US' : 'vi-VI')} | ${toLocaleTimeString(session.startedAt, locale)} - ${toLocaleTimeString(session.endedAt, locale)}`}
                className="mt-2"
              />
            )}
            {session.sessionStatus === StatusEnum.Approved && (
              <div className="mt-2 flex items-center gap-2 text-black">
                <MapPinArea className="text-[#343330]" />
                {session.sessionUrl !== ''
                  ? (
                      <Link
                        href={session.sessionUrl}
                        className="text-sm font-medium leading-4 text-primary-70 underline"
                      >
                        {session.sessionUrl}
                      </Link>
                    ) : <span className="font-medium">TBU</span>}
              </div>
            )}
            {session.sessionStatus === StatusEnum.Finished && (
              <div className="mt-2 flex items-center gap-2 text-black">
                <FilmReel className="text-sm text-neutral-10" width={140} />
                {session.recordingUrl !== ''
                  ? (
                      <Link
                        href={session.recordingUrl}
                        className="truncate text-sm font-medium leading-4 text-primary-70 underline"
                      >
                        {session.recordingUrl}
                      </Link>
                    ) : <span className="font-medium">TBU</span>}
              </div>
            )}
            <SessionAttendees
              huber={session.humanBook}
              liber={session.reader}
              isVibing={isLiber}
              showParticipantOnly
              classname="mt-2 hulib-open:hidden"
            />
            <SessionAttendees
              huber={session.humanBook}
              liber={session.reader}
              isVibing={isLiber}
              classname="mt-2 hidden hulib-open:flex"
              childClassname="pl-4"
            />
          </Accordion.Header>
          <Accordion.Content className={mergeClassnames('mt-4 p-0 border-none', isLiber ? 'bg-primary-98' : 'bg-yellow-98')}>
            <div className="flex w-full flex-col gap-4">
              {!isAddingReason ? (
                <>
                  {!isDone && !isMissed && (
                    <div className="flex gap-2 text-neutral-20">
                      <Note className="text-base text-[#343330]" />
                      <p className="text-sm">{session.note}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-2.5">
                    {session.sessionStatus === StatusEnum.Pending && isLiber && (
                      <Button
                        size="lg"
                        fullWidth
                        className="border border-red-90 bg-red-90 text-red-50 hover:border-red-50 hover:bg-red-50 hover:text-white"
                        onClick={() => setIsAddingReason(true)}
                      >
                        Cancel
                      </Button>
                    )}
                    {session.sessionStatus === StatusEnum.Pending && !isLiber && (
                      <>
                        <Button
                          variant="outline"
                          size="lg"
                          fullWidth
                          onClick={handleReject}
                        >
                          Reject
                        </Button>
                        <Button
                          size="lg"
                          fullWidth
                          animation={isLoading && 'progress'}
                          onClick={() => handleUpdateStatus('approved')}
                        >
                          Accept
                        </Button>
                      </>
                    )}
                    {session.sessionStatus === StatusEnum.Finished && isLiber && (
                      <Button size="lg" fullWidth>Feedback</Button>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <TextInput
                    id="reason"
                    type="text"
                    label="Reason"
                    isError={isAddingReason && reason === ''}
                    onChange={e => setReason(e.target.value)}
                  />
                  <div className="flex items-center gap-2.5">
                    <Button variant="outline" size="lg" fullWidth onClick={handleCancelAddingReason}>
                      Cancel
                    </Button>
                    <Button
                      size="lg"
                      fullWidth
                      animation={isLoading && 'progress'}
                      disabled={isAddingReason && reason === ''}
                      onClick={handleConfirmReason}
                    >
                      Confirm
                    </Button>
                  </div>
                </>
              )}
            </div>
          </Accordion.Content>
        </Accordion.Item>
      </Accordion>
    </div>
  );
};

export default SessionDetailCard;
