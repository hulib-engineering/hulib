export type TopicStatus = 'active' | 'inactive';

export const isTopicActive = (status?: TopicStatus) =>
  (status ?? 'active') === 'active';

export type Topic = {
  id: number;
  name: string;
  color?: string;
  status?: TopicStatus;
  createdAt?: string | undefined;
  updatedAt?: string | undefined;
};

export type GetTopicsParams = {
  page?: number;
  limit?: number;
  name?: string;
  type?: 'most-popular' | string;
};

export type CreateTopicParams = {
  name: string;
  color?: string;
  status?: TopicStatus;
};

export type UpdateTopicParams = {
  id: number;
  name?: string;
  color?: string;
  status?: TopicStatus;
};
