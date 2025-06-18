import React from 'react';

import { SessionAttendees } from '@/components/schedule/components/sessionCard/SessionAttendees';
import { SessionDateTime } from '@/components/schedule/components/sessionCard/SessionDateTime';

const CompletedMeetings = () => {
  const completedSessions = [
    {
      id: '1',
      startedAt: '2021-01-01',
      startTime: '10:00',
      endTime: '11:00',
      humanBook: {
        id: 1,
        fullName: 'John Doe',
        birthday: '1990-01-01',
        gender: { id: 1, name: 'male' },
        role: { id: 1, name: 'huber' },
        status: { id: 1, name: 'active' },
        photo: { id: 1, path: '' },
        createdAt: '2021-01-01',
        updatedAt: '2021-01-01',
        deletedAt: '2021-01-01',
        address: '123 Main St, Anytown, USA',
        phoneNumber: '123-456-7890',
        parentPhoneNumber: '123-456-7890',
        parentName: 'Jane Doe',
        parentEmail: 'jane@example.com',
        bio: 'I am a human book',
        videoUrl: '',
        education: 'Bachelor of Science',
        educationStart: '2021-01-01',
        educationEnd: '2021-01-01',
        educationDescription: 'I am a human book',
        email: 'john@example.com',
        topics: [],
      },
      reader: {
        id: 1,
        fullName: 'Jane Doe',
        birthday: '1990-01-01',
        gender: { id: 1, name: 'male' },
        role: { id: 1, name: 'liber' },
        status: { id: 1, name: 'active' },
        photo: { id: 1, path: '' },
        createdAt: '2021-01-01',
        updatedAt: '2021-01-01',
        deletedAt: '2021-01-01',
        address: '123 Main St, Anytown, USA',
        phoneNumber: '123-456-7890',
        parentPhoneNumber: '123-456-7890',
        parentName: 'Jane Doe',
        parentEmail: 'jane@example.com',
        bio: 'I am a human book',
        videoUrl: '',
        education: 'Bachelor of Science',
        educationStart: '2021-01-01',
        educationEnd: '2021-01-01',
        educationDescription: 'I am a human book',
        email: 'jane@example.com',
        topics: [],
      },
      isVibing: true,
    },
  ];

  return (
    <div className="mt-4 grid grid-cols-2 gap-4 text-neutral-60">
      {completedSessions?.length > 0 ? (
        completedSessions.map((session) => (
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
              humanBook={session.humanBook}
              reader={session.reader}
              isVibing={session.isVibing}
            />
          </div>
        ))
      ) : (
        <span className="col-span-2 text-center text-neutral-40">
          No completed meetings found.
        </span>
      )}
    </div>
  );
};

export default CompletedMeetings;
