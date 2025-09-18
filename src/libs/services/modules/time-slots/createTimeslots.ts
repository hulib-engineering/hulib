import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { TimeSlot } from './getTimeslots';

type CreateTimeSlotRequest = {
  timeSlots: {
    dayOfWeek: number;
    startTime: string;
  }[];
};

const createTimeslots = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<TimeSlot, CreateTimeSlotRequest>({
    query: body => ({
      url: 'time-slots',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'Timeslot', id: 'LIST' }],
  });

export default createTimeslots;
