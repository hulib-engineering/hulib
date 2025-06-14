'use client';

import { useRouter } from 'next/navigation';
import { useMemo, useState } from 'react';

import Button from '@/components/button/Button';
import { FlipBook } from '@/components/flipBook/FlipBook';
import { mergeClassnames } from '@/components/private/utils';
import StoryPagination from '@/components/storyDetails/StoryPagination';
import AdminLayout from '@/layouts/AdminLayout';
import { useGetStoriesQuery } from '@/libs/services/modules/stories';
import {
  type Story,
  StoryPublishStatus,
} from '@/libs/services/modules/stories/storiesType';

export default function AwaitingApprovalStories() {
  // Router for navigation
  const router = useRouter();

  // State for current page
  const [currentPage, setCurrentPage] = useState(0);

  // Fetch stories with pagination
  const { data, isLoading } = useGetStoriesQuery({
    page: currentPage + 1, // API uses 1-based indexing
    limit: 6,
  });

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Custom renderActions for FlipBook: just a 'View Detail' button
  const renderActions = (storyId: number) => (
    <div
      className={mergeClassnames(
        'flex w-full items-center gap-2 justify-self-end mt-3 absolute bottom-[10px]',
        'md:flex-row md:mt-2 md:px-3 md:pl-0',
      )}
    >
      <Button
        variant="primary"
        className="w-full rounded-full py-2 text-base font-medium"
        onClick={() => router.push(`/admin/stories/approval/${storyId}`)}
      >
        View Detail
      </Button>
    </div>
  );

  const storiesAwaitingApproval = useMemo(() => {
    return data?.data?.filter(
      (story: Story) => story.publishStatus === StoryPublishStatus.DRAFT,
    );
  }, [data]);

  return (
    // AdminLayout provides sidebar and main content area
    <AdminLayout pendingStoriesCount={storiesAwaitingApproval?.length || 0}>
      {/* Outer container with padding and max width for Apple-style spaciousness */}
      <div className="mx-auto flex h-screen w-full flex-col md:p-8">
        {/* Header section */}
        <h1 className="mb-1 text-2xl font-bold">Awaiting approval - Stories</h1>
        <p className="mb-6 text-base text-neutral-40">
          List of Stories awaiting approval
        </p>

        <div className="flex flex-1 flex-wrap gap-4">
          {/* Show loading skeleton or actual stories */}
          {isLoading ? (
            <div className="col-span-full py-12 text-center text-lg text-neutral-40">
              Loading...
            </div>
          ) : storiesAwaitingApproval?.length > 0 ? (
            storiesAwaitingApproval.map((story: Story) => (
              <FlipBook
                key={story.id}
                data={story}
                renderActions={() => renderActions(story.id)}
                refetch={() => {}}
              />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-lg text-neutral-40">
              No stories awaiting approval.
            </div>
          )}
        </div>

        {/* Pagination component */}
        {data?.data?.hasNextPage && (
          <div className="mt-10">
            <StoryPagination
              currentPage={currentPage}
              totalPages={data?.data?.totalPages || 0}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
