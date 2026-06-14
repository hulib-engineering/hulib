import type { TypedUseSelectorHook } from 'react-redux';
import { shallowEqual, useSelector } from 'react-redux';

import type { RootState } from '@/libs/store';

const useAppSelector: TypedUseSelectorHook<RootState> = selector =>
  useSelector(selector, shallowEqual);

export default useAppSelector;
