import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

export type TimeSlot = {
  id: number;
  dayOfWeek: number;
  startTime: string;
  createdAt: string;
  updatedAt: string;
};

const getAllTimeSlots = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<PaginatedResponse<TimeSlot[]>, void>({
    query: () => `time-slots`,
    providesTags: [{ type: 'TimeSlot' }],
  });

export default getAllTimeSlots;
