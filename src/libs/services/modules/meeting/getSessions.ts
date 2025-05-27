import type { BaseQueryFn } from '@reduxjs/toolkit/query';
import type { EndpointBuilder } from '@reduxjs/toolkit/src/query/endpointDefinitions';

const getSessions = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<any, string>({
    query: () => ({
      url: `reading/sessions`,
    }),
  });

export default getSessions;
