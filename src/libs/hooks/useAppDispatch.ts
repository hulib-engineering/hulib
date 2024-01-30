import { useDispatch } from 'react-redux';

import type { AppDispatch } from '@/libs/store';

const useAppDispatch: () => AppDispatch = useDispatch;

export default useAppDispatch;
