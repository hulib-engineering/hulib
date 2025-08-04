import { useParams } from 'next/navigation';
import React from 'react';

import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { SessionAttendees } from '@/components/schedule/sessionCard/SessionAttendees';
import { SessionDateTime } from '@/components/schedule/sessionCard/SessionDateTime';
import { useGetReadingSessionOfUserQuery } from '@/libs/services/modules/user';
import type { SessionStatus } from '@/libs/services/modules/user/getReadingSessionOfUser';

const CompletedMeetings = () => {
  const { id } = useParams();
  const { data: completedSessions, isLoading }
    = useGetReadingSessionOfUserQuery({
      id: id as string,
      sessionStatus: 'finished' as SessionStatus,
    });

  if (isLoading) {
    return (
      <div className="flex size-full justify-center px-[10%]">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 text-neutral-60">
      {completedSessions?.data?.length > 0
        ? (
            completedSessions?.data.map((session: any) => (
              <div
                key={session.id}
                className="rounded-lg bg-primary-98 px-3 pt-4 shadow-md"
              >
                <SessionDateTime
                  date={session.startedAt}
                  startDate={session.startTime}
                  endDate={session.endTime}
                />
                <SessionAttendees
                  huber={session.humanBook}
                  liber={session.reader}
                  isVibing={session.isVibing}
                  isAdmin
                />
              </div>
            ))
          )
        : (
            <span className="text-neutral-40">No completed meetings found.</span>
          )}
    </div>
  );
};

export default CompletedMeetings;
