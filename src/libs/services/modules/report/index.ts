import updateReportById from './updateReportById';
import createReport from './createReport';

import { api } from '@/libs/services/api';

const reportApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Report'],
});

export const reportApi = reportApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    createReport: createReport(build),
    updateReportById: updateReportById(build),
  }),
  overrideExisting: false,
});

export const { useUpdateReportByIdMutation, useCreateReportMutation }: any = reportApi;
