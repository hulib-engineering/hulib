import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import type { z } from 'zod';

import type { User } from '.';

import type { WorkExperienceValidation } from '@/validations/ProfileValidation';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<User, { id: number } & Partial<z.infer<typeof WorkExperienceValidation>>>({
    query: ({ id, ...patch }) => ({
      url: `auth/me/works/${id}`,
      method: 'PATCH',
      body: patch,
    }),
    invalidatesTags: [{ type: 'User', id: 'ME' }],
  });
