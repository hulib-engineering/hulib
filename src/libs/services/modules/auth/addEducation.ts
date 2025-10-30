import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { z } from 'zod';

import type { User } from '.';

import type { EducationValidation } from '@/validations/ProfileValidation';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<User, z.infer<typeof EducationValidation>>({
    query: body => ({
      url: 'auth/me/educations',
      method: 'POST',
      body,
    }),
    invalidatesTags: [{ type: 'User', id: 'ME' }],
  });
