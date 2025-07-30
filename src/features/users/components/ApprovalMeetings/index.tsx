import { useParams } from 'next/navigation';
import React, { useMemo } from 'react';

import { LoadingSkeleton } from '@/components/LoadingSkeleton';
import { SessionAttendees } from '@/components/schedule/components/sessionCard/SessionAttendees';
import { SessionDateTime } from '@/components/schedule/components/sessionCard/SessionDateTime';
import { useGetReadingSessionOfUserQuery } from '@/libs/services/modules/user';
import type { SessionStatus } from '@/libs/services/modules/user/getReadingSessionOfUser';

const ApprovalMeetings = () => {
  const { id } = useParams();
  const { data: pendingSessions, isLoading } = useGetReadingSessionOfUserQuery({
    id: id as string,
    sessionStatus: 'pending' as SessionStatus,
  });

  const sessions = useMemo(() => {
    if (!pendingSessions?.data) {
      return [];
    }
    const now = new Date();
    return pendingSessions.data.filter((session: any) => {
      const startDate = new Date(session.startedAt);
      return startDate >= now;
    });
  }, [pendingSessions]);

  if (isLoading) {
    return (
      <div className="flex size-full justify-center px-[10%]">
        <LoadingSkeleton />
      </div>
    );
  }

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 text-neutral-60">
      {sessions.length > 0
        ? (
            sessions.map((session: any) => (
              <div
                key={session.id}
                className="rounded-lg bg-neutral-98 px-3 pt-4 shadow-md"
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
              </div>
            ))
          )
        : (
            <span className="text-neutral-40">No completed meetings found.</span>
          )}
    </div>
  );
};

export default ApprovalMeetings;
