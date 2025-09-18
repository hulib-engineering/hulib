import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

export type TimeSlot = {
  id: number;
  dayOfWeek: number;
  startTime: string;
};

const getTimeslots = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<TimeSlot[]>, void>({
    query: () => `time-slots`,
    providesTags: [{ type: 'Timeslot', id: 'LIST' }],
  });

export default getTimeslots;
