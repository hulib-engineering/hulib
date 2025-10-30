import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { z } from 'zod';

import type { EditReportValidation, ReportValidation } from '@/validations/ReportValidation';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<z.infer<typeof ReportValidation>, z.infer<typeof EditReportValidation> & { id: string }>({
    query: ({ id, ...body }) => ({
      url: `reports/${id}`,
      method: 'PATCH',
      body,
    }),
    // Invalidate both the specific report and the report list to trigger refetch
    invalidatesTags: (_result, _error, { id }) => [
      { type: 'Report', id },
    ],
  });
