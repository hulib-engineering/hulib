import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

export type TimeSlot = {
  id: string;
  dayOfWeek: string;
  startTime: string;
  createdAt: string;
  updatedAt: string;
};

const getTimeSlots = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<TimeSlot[], void>({
    query: () => `time-slots`,
    providesTags: [{ type: 'TimeSlot' }],
  });

export default getTimeSlots;
