import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';

type TimeSlot = {
  id: number;
  dayOfWeek: number;
  startTime: string;
  createdAt: string;
  updatedAt: string;
};

const getTimeslotsByHuber = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<TimeSlot[]>, { id: number }>({
    query: params => `time-slots/huber/${params.id}`,
    providesTags: [{ type: 'TimeSlotHuber' }],
  });

export default getTimeslotsByHuber;
