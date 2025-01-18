'use client';

import { CaretCircleDown } from '@phosphor-icons/react/dist/ssr';
import React from 'react';

import Button from '@/components/button/Button';
import Book from '@/components/explore-books/Book';
import BookCategory from '@/components/explore-books/BookCategory';
import { mergeClassnames } from '@/components/private/utils';

const categories = [
  {
    id: 0,
    name: 'All',
    iconName: 'squares-four',
  },
  {
    id: 1,
    name: 'Health',
    iconName: 'heart',
  },
  {
    id: 2,
    name: 'Emotional',
    iconName: 'brain',
  },
  {
    id: 3,
    name: 'Motivation & Inspiration',
    iconName: 'brain',
  },
  {
    id: 4,
    name: 'Productivity',
    iconName: 'brain',
  },
  {
    id: 5,
    name: 'Career',
    iconName: 'brain',
  },
  {
    id: 6,
    name: 'Education',
    iconName: 'brain',
  },
  {
    id: 7,
    name: 'Productivity',
    iconName: 'brain',
  },
  {
    id: 8,
    name: 'Career',
    iconName: 'brain',
  },
  {
    id: 9,
    name: 'Motivation & Inspiration',
    iconName: 'brain',
  },
  {
    id: 10,
    name: 'Productivity',
    iconName: 'brain',
  },
  {
    id: 11,
    name: 'Career',
    iconName: 'brain',
  },
  {
    id: 12,
    name: 'Education',
    iconName: 'brain',
  },
  {
    id: 13,
    name: 'Career',
    iconName: 'brain',
  },
];

const Page = () => {
  const [selectedCategories, setSelectedCategories] = React.useState<number[]>(
    [],
  );
  console.log(selectedCategories);

  return (
    <div
      className={mergeClassnames(
        `flex min-h-screen flex-col items-center bg-neutral-98 pb-4 mt-[-5rem]`,
      )}
    >
      <div
        className={mergeClassnames(
          'flex flex-col gap-8 pt-[3rem] w-screen relative px-28',
          '',
        )}
      >
        <div className="h-full w-full rounded-lg bg-white p-5">
          <div>
            <h3 className="text-[2.5rem] font-bold leading-[3rem] text-neutral-20">
              Explore
            </h3>
            <p className="text-lg font-normal text-[#2E3032]">
              Discover and find your perfect book
            </p>
          </div>
          <div className="mt-6 flex flex-row flex-wrap gap-2">
            {categories.map((category) => (
              <BookCategory
                key={category.id}
                name={category.name}
                iconName={category.iconName as any}
                isActive={
                  category.name === 'All'
                    ? null
                    : selectedCategories.includes(category.id)
                }
                onClick={() =>
                  setSelectedCategories((prev) => {
                    if (prev.includes(category.id)) {
                      return prev.filter((item: any) => item !== category.id);
                    }
                    return [...prev, category.id];
                  })
                }
              />
            ))}
          </div>
          <div className="mt-6 grid grid-cols-2 gap-8">
            {[0, 1, 2, 3, 4, 5].map((item) => (
              <Book key={item} />
            ))}
          </div>

          <div className="mt-6 flex w-full items-center justify-center">
            <Button
              variant="outline"
              iconLeft={<CaretCircleDown size={16} color="#0442BF" />}
            >
              View More
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
