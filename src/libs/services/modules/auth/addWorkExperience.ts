import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { z } from 'zod';

import type { User } from '.';

import type { WorkExperienceValidation } from '@/validations/ProfileValidation';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<User, z.infer<typeof WorkExperienceValidation>>({
    query: body => ({
      url: 'auth/me/works',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'User', id: 'ME' }],
  });
