import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse } from '../../type';

export type TimeSlot = {
  id: number;
  dayOfWeek: number;
  startTime: string;
  createdAt: string;
  updatedAt: string;
};

const getTimeSlotsHuber = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<TimeSlot[]>, { id: number }>({
    query: (params) => `time-slots/huber/${params.id}`,
    providesTags: [{ type: 'TimeSlotHuber' }],
  });

export default getTimeSlotsHuber;
