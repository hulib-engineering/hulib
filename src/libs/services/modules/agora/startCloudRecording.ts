import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<string, { channel: string }>({
    query: ({ channel }) => ({
      url: 'agora/recording/start',
      method: 'POST',
      body: { channel },
    }),
    invalidatesTags: [{ type: 'CloudRecording' }],
  });
