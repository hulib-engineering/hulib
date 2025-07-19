import { useMemo } from 'react';
import { useGetTopicsQuery } from '@/libs/services/modules/topics';

export const useTopics = () => {
  const params = useMemo(() => ({ page: 1, limit: 100 }), []);
  return useGetTopicsQuery(params);
};
