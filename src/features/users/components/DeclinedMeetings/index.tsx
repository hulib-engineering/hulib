import { useParams } from 'next/navigation';
import React from 'react';

import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { SessionAttendees } from '@/components/schedule/components/sessionCard/SessionAttendees';
import { SessionDateTime } from '@/components/schedule/components/sessionCard/SessionDateTime';
import { useGetReadingSessionOfUserQuery } from '@/libs/services/modules/user';
import type { SessionStatus } from '@/libs/services/modules/user/getReadingSessionOfUser';

const DeclinedMeetings = () => {
  const { id } = useParams();
  const { data: declinedSessions, isLoading } = useGetReadingSessionOfUserQuery(
    {
      id: id as string,
      sessionStatus: 'rejected' as SessionStatus,
    },
  );

  if (isLoading) {
    return (
      <div className="flex h-full w-full justify-center px-[10%]">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 text-neutral-60">
      {declinedSessions?.data?.length > 0 ? (
        declinedSessions?.data.map((session: any) => (
          <div
            key={session.id}
            className="rounded-lg bg-red-98 px-3 py-4 shadow-md"
          >
            <SessionDateTime
              date={session.startedAt}
              startDate={session.startTime}
              endDate={session.endTime}
            />
            <SessionAttendees
              humanBook={session.humanBook}
              reader={session.reader}
              isVibing={session.isVibing}
              isAdmin
            />
            <p className="text-sm text-red-50">Reason: WIP</p>
          </div>
        ))
      ) : (
        <span className="text-neutral-40">No declined meetings found.</span>
      )}
    </div>
  );
};

export default DeclinedMeetings;
