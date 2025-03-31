import { BookOpen } from '@phosphor-icons/react';

import Button from '../button/Button';

interface OpenStoryProps {
  content: string;
  title: string;
  data?: { id: string };
  router?: any;
}

const OpenStory = ({ content, title, data, router }: OpenStoryProps) => {
  const abstract = content || '';

  return (
    <div className="flip-card-back rounded-2xl">
      <div className="grid h-full w-full grid-cols-2 rounded-2xl bg-[#FFFFFF] p-4 shadow-[3px_4px_5px_3px_#1C1E211A]">
        <button
          type="button"
          className="page-left before:absolute before:inset-y-0 before:right-0 before:h-full before:w-[36px] before:bg-gradient-to-r before:from-transparent before:to-[#C7C9CB] before:opacity-30 before:content-['']"
        >
          <div>
            <h6 className="book-title text-left text-lg font-semibold text-gray-800">
              {title}
            </h6>
            <p className="h-[220px] w-full text-left text-sm text-neutral-600">
              {abstract.substring(0, 200) || ''}
            </p>
          </div>
        </button>
        <div className="page-right flex flex-col justify-between before:absolute before:inset-y-0 before:right-0 before:h-full before:w-[36px] before:bg-gradient-to-r before:from-transparent before:to-[#C7C9CB] before:opacity-30 before:content-['']">
          <p className="mt-1 h-full w-full pl-2 pr-1 text-left text-sm text-neutral-600">
            {abstract.substring(200, 380) || ''}
          </p>
          <div className="mb-2 flex justify-center">
            <Button
              variant="primary"
              iconLeft={<BookOpen size={20} weight="bold" />}
              className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white"
              onClick={() => router?.push(`/explore-story/${data?.id}`)}
            >
              Read all
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenStory;
