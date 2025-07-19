import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { UpdateUserStatusRequest } from './userType';
import type { User } from '@/features/users/types';

/**
 * Service for updating a user's status.
 *
 * This endpoint allows updating the status of a user (active, inactive, under_warning)
 * by sending a PATCH request to /users/{id} with the new status in the request body.
 *
 * @param build - EndpointBuilder from RTK Query
 * @returns A mutation endpoint for updating user status
 */
const updateUserStatus = (
  build: EndpointBuilder<BaseQueryFn, string, string>,
) =>
  build.mutation<User, { id: string; body: UpdateUserStatusRequest }>({
    // The query function defines the PATCH request
    query: ({ id, body }) => ({
      url: `users/${id}`,
      method: 'PATCH',
      body,
    }),
    // Optionally, you can invalidate tags here if you want to refetch user data after update
    invalidatesTags: (_result, _error, { id }) => [
      { type: 'Users', id },
      { type: 'Users', id: 'LIST' },
    ],
  });

export default updateUserStatus;
