import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';

import type { Contact, MessageResponse } from './index';

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<Contact[], void>({
    query: () => 'chat',
    transformResponse: (
      response: (Omit<Contact, 'lastMessage'> & {
        last_message: MessageResponse;
        recipient: Contact['participant'];
      })[],
    ) => {
      return response.map(({ last_message, recipient, ...rest }) => ({
        ...rest,
        lastMessage: last_message,
        participant: recipient,
      }));
    },
    providesTags: [{ type: 'Messages', id: 'LIST' }],
  });
