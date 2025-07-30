'use client';

import type { ReactNode } from 'react';
import React, { useMemo, useState } from 'react';

import MenuItem from './menuItem/MenuItem';
import Search, { searchFilterItems, searchGetItemIndex } from './search/Search';

type Item = {
  children?: ReactNode;
  href?: string;
  id: string;
};

type Items = {
  items: Item[];
  heading?: string;
  id: string;
};

const SearchEverything = () => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredItems = useMemo(
    () =>
      searchFilterItems(
        [
          {
            heading: 'Results',
            id: 'results',
            items: [
              {
                id: 'home',
                children: 'Home',
                href: '#home',
              },
              {
                id: 'settings',
                children: 'Settings',
                href: '#settings',
              },
              {
                id: 'projects',
                children: 'Projects',
                closeOnSelect: false,
                onClick: () => {
                  alert('projects');
                },
              },
            ],
          },
          {
            heading: 'Other',
            id: 'other',
            items: [
              {
                id: 'developer-settings',
                children: 'Developer settings',
                href: '#developer-settings',
              },
              {
                id: 'privacy-policy',
                children: 'Privacy policy',
                href: '#privacy-policy',
              },
              {
                id: 'log-out',
                children: 'Log out',
                onClick: () => {
                  alert('Logging out...');
                },
              },
            ],
          },
        ],
        search,
      ),
    [search],
  );

  return (
    <Search
      onChangeSearch={setSearch}
      onChangeOpen={setOpen}
      search={search}
      isOpen={open}
    >
      <Search.Input>
        <Search.Input.Input placeholder="Search by keyword" />
        <Search.Input.Icon />
      </Search.Input>

      <Search.Transition>
        <Search.Result>
          {filteredItems.length
            ? (
                filteredItems.map((list: Items) => (
                  <ul className="space-y-1" key={list.id}>
                    <li>
                      <Search.ResultHeading>{list.heading}</Search.ResultHeading>
                      {list.items.map(({ id, children, href, ...rest }: Item) => (
                        <Search.ResultItem
                          key={id}
                          index={searchGetItemIndex(filteredItems, id)}
                          closeOnSelect
                          {...rest}
                        >
                          {href
                            ? (
                                <a href={href}>
                                  <MenuItem>
                                    <MenuItem.Title>{children}</MenuItem.Title>
                                  </MenuItem>
                                </a>
                              )
                            : (
                                <MenuItem>
                                  <MenuItem.Title>{children}</MenuItem.Title>
                                </MenuItem>
                              )}
                        </Search.ResultItem>
                      ))}
                    </li>
                  </ul>
                ))
              )
            : (
                <Search.NoResults />
              )}
        </Search.Result>
      </Search.Transition>
    </Search>
  );
};

export default SearchEverything;
