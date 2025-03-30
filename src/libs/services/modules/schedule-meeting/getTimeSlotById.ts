import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import type { PaginatedResponse } from '@/libs/services/type';

import type { TimeSlot } from './getTimeSlot';

export interface TimeSlotsParams {
  id: number;
  page: number;
  limit: number;
}

const getTimeSlotsById = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<PaginatedResponse<TimeSlot>, TimeSlotsParams>({
    query: (params) => ({
      url: 'story-reviews',
      params: {
        page: params?.page || 1,
        limit: params?.limit || 10,
        id: params?.id,
      },
    }),
    serializeQueryArgs: ({ endpointName, queryArgs }) => {
      return `${endpointName}(${JSON.stringify(queryArgs?.id)})`;
    },
    forceRefetch: ({ currentArg, previousArg }) => {
      return (
        currentArg?.page !== previousArg?.page ||
        JSON.stringify(currentArg?.id) !== JSON.stringify(previousArg?.id)
      );
    },
    providesTags: [{ type: 'TimeSlot', id: 'ME' }],
  });

export default getTimeSlotsById;
