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

const getMeeting = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<any, void>({
    query: () => `${AppConfig.api.endpoint}/schedules`,
    providesTags: [{ type: 'getMeeting' }],
  });

export default getMeeting;
