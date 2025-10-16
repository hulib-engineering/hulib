export type Topic = {
  id: number;
  name: string;
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
};
