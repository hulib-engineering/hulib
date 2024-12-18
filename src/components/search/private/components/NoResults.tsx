import React, { useContext } from 'react';

import { mergeClassnames } from '@/components/private/utils';
import type { FreeSearchActionProps } from '@/components/search/private/types';

import { SearchContext } from '../utils/context';
import ListItem from './ResultItem';

const NoResults = ({
  label = 'Search for',
  className,
  ...props
}: FreeSearchActionProps) => {
  const { search } = useContext(SearchContext);

  return (
    <ListItem index={0} showType={false} {...props}>
      <p className={mergeClassnames('truncate text-bulma', className)}>
        {label} <span className="font-medium">{`${search}`}</span>
      </p>
    </ListItem>
  );
};

export default NoResults;
