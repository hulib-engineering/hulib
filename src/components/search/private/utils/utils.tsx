import { Children, type ReactNode } from 'react';

import type { JsonStructure } from '../types';

export function getItemIndex(
  items: JsonStructure,
  id: string,
  startIndex: number = 0,
) {
  return (
    items
      .map((list) => list.items)
      .reduce((a, b) => a.concat(b))
      .findIndex((i) => i.id === id) + startIndex
  );
}

function getLabelFromChildren(children: ReactNode) {
  let label = '';

  Children.map(children, (child) => {
    if (typeof child === 'string') {
      label += child;
    }
  });

  return label;
}

function doesChildMatchSearch(search: string, children?: ReactNode) {
  return children
    ? getLabelFromChildren(children)
        .toLowerCase()
        .includes(search?.toLowerCase())
    : false;
}

function doesKeywordsMatchSearch(search: string, keywords: string[]) {
  return keywords.includes('*')
    ? true
    : keywords.some((keyword) =>
        keyword?.toLowerCase().includes(search?.toLowerCase()),
      );
}

export function filterItems(
  items: JsonStructure,
  search: string,
  {
    filterOnListHeading,
  }: {
    filterOnListHeading: boolean;
  } = {
    filterOnListHeading: true,
  },
) {
  return items
    .filter((list) => {
      const listHasMatchingItem = list.items.some(
        (item) =>
          doesChildMatchSearch(search, item.children) ||
          doesKeywordsMatchSearch(search, item.keywords ?? []),
      );

      return filterOnListHeading
        ? list.heading?.toLowerCase().includes(search.toLowerCase()) ||
            listHasMatchingItem
        : listHasMatchingItem;
    })
    .map((list) => {
      const matchingItems = list.items.filter(
        (item) =>
          doesChildMatchSearch(search, item.children) ||
          doesKeywordsMatchSearch(search, item.keywords ?? []),
      );

      return {
        ...list,
        items: filterOnListHeading
          ? matchingItems.length
            ? matchingItems
            : list.items
          : matchingItems,
      };
    });
}
