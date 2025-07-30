import { useCallback } from 'react';
import { extendTailwindMerge } from 'tailwind-merge';

import { useAppDispatch, useAppSelector } from '@/libs/hooks';
import { registerChild, unregisterChild } from '@/libs/store/menuItem';

const mergeClassnames = extendTailwindMerge({
  cacheSize: 0,
});

const useRegisterChild = () => {
  const items = useAppSelector(state => state.menuItem.items);

  const dispatch = useAppDispatch();

  const register = useCallback((child: string) => {
    dispatch(registerChild({ child }));
    return () => dispatch(unregisterChild({ child }));
  }, []);
  return { items, register };
};

export { mergeClassnames, useRegisterChild };
