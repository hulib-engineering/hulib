import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { User } from '@/features/users/types';

/**
 * Interface for the upgrade user request body
 */
export interface UpgradeUserRequest {
  /**
   * The action to take on the upgrade request
   * - 'accept': Approve the user upgrade
   * - 'reject': Reject the user upgrade (requires a reason)
   */
  action: 'accept' | 'reject';

  /**
   * The reason for rejection (required when action is 'reject')
   */
  reason?: string;
}

/**
 * Service for handling user upgrade requests.
 *
 * This endpoint allows accepting or rejecting a user's upgrade request.
 * When rejecting, a reason must be provided to explain why the upgrade was denied.
 *
 * @param build - EndpointBuilder from RTK Query
 * @returns A mutation endpoint for handling user upgrades
 */
const upgradeUser = (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.mutation<User, { id: string; body: UpgradeUserRequest }>({
    query: ({ id, body }) => ({
      url: `users/${id}/upgrade`,
      method: 'POST',
      body,
    }),
    // Invalidate both the specific user and the users list to trigger refetch
    invalidatesTags: (result, error, { id }) => [
      { type: 'Users', id },
      { type: 'Users', id: 'LIST' },
    ],
  });

export default upgradeUser;
