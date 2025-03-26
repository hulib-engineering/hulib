import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { PaginatedResponse } from '../../type';
import type { TimeSlot } from './getTimeSlot';

const addTimeSlots = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<
    PaginatedResponse<TimeSlot>,
    { dayOfWeek: string; startTime: string }
  >({
    query: ({ dayOfWeek, startTime }) => ({
      url: 'time-slots',
      method: 'POST',
      body: JSON.stringify({
        dayOfWeek,
        startTime,
      }),
    }),
    // Invalidates the cache of the 'stories' endpoint (or any other relevant query)
    invalidatesTags: [{ type: 'TimeSlot' }],
  });

export default addTimeSlots;
