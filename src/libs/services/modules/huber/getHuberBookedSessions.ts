import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

const getHuberBookedSessions = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<Date[], { id: number }>({
    query: ({ id }) => ({
      url: `hubers/${id}/booked-sessions`,
    }),
    providesTags: [{ type: 'Hubers' as const, id: 'BOOKED-LIST' }],
  });

export default getHuberBookedSessions;
