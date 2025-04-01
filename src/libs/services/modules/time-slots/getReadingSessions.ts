import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

import { AppConfig } from '@/utils/AppConfig';

// export type TimeSlot = {
//   id: string;
//   dayOfWeek: string;
//   startTime: string;
//   createdAt: string;
//   updatedAt: string;
// };

const getReadingSessions = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.query<any, void>({
    query: () => `${AppConfig.api.endpoint}/reading-sessions`,
    providesTags: [{ type: 'getReadingSessions' }],
  });

export default getReadingSessions;
