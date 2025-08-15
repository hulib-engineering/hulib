import { api } from '../../api';

import startCloudRecording from './startCloudRecording';
import stopCloudRecording from './stopCloudRecording';

const agoraApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Agora'],
});

export const agoraApi = agoraApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    startCloudRecording: startCloudRecording(build),
    stopCloudRecording: stopCloudRecording(build),
  }),
  overrideExisting: false,
});

export const {
  useStartCloudRecordingMutation,
  useStopCloudRecordingMutation,
}: any = agoraApi;
