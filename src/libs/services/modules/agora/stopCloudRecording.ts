import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<string, { channel: string; resourceId: string; sid: string; uid: string }>({
    query: ({ channel, resourceId, sid, uid }) => ({
      url: 'agora/recording/stop',
      method: 'POST',
      body: { channel, resourceId, sid, uid },
    }),
    invalidatesTags: [{ type: 'CloudRecording' }],
  });
