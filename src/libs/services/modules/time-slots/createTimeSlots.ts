import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { TimeSlot } from './getAllTimeSlots';

export type CreateTimeSlotRequest = {
  timeSlots: {
    dayOfWeek: number;
    startTime: string;
  }[];
};

const createTimeSlots = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<TimeSlot, CreateTimeSlotRequest>({
    query: (body) => ({
      url: 'time-slots',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'TimeSlot' }],
  });

export default createTimeSlots;
