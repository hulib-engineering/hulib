import type { BaseQueryFn, EndpointBuilder } from '@reduxjs/toolkit/query';
import { pick } from 'lodash';

import type { MessageResponse } from './index';

export type TransformedMessage = Pick<MessageResponse, 'id'> & {
  to: number;
  from: number;
  msg: string;
  time: string;
  chatType: string;
  stickerUrl?: string;
  direction: 'received' | 'sent';
  isRead: boolean;
};

export default (build: EndpointBuilder<BaseQueryFn, string, string>) =>
  build.query<TransformedMessage[], number>({
    query: (id: number) => `chat/user/${id}`,
    transformResponse: (response: MessageResponse[], _meta, id) => {
      return response.map(transformedMessage => ({
        ...pick(transformedMessage, ['id']),
        from: transformedMessage.senderId,
        to: transformedMessage.recipientId,
        msg: transformedMessage.message,
        time: transformedMessage.createdAt,
        chatType: transformedMessage.chatType.name,
        stickerUrl: transformedMessage.sticker?.image?.path,
        direction:
          `${transformedMessage.senderId}` === `${id}` ? 'received' : 'sent',
        isRead: !!transformedMessage.readAt,
      }));
    },
    providesTags: (_result, _error, id) => {
      return [{ type: 'Messages', id: `LIST-${id}` }];
    },
  });
