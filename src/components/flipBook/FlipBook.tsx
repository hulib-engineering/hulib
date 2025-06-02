import Image from 'next/image';
import { useTranslations } from 'next-intl';
import React from 'react';

import CustomFlipBook from '@/components/FlipBook';
import { mergeClassnames } from '@/components/private/utils';
import type { Story as StoryType } from '@/libs/services/modules/stories/storiesType';

// import CustomCoverBook from '../common/CustomCoverBook';

export type BookCommonProps = {
  data: StoryType;
  renderActions: () => React.ReactNode;
};
export const FlipBook = ({ data, renderActions }: BookCommonProps) => {
  const { title } = data;
  // const [isFlipped, setIsFlipped] = useState(false);
  // const [maxCharsPageLeft, setmaxCharsPageLeft] = useState(200);
  // const pageLeftRef = useRef<HTMLParagraphElement>(null);
  // const router = useRouter();
  const t = useTranslations('ExporeStory');
  // const [addStoryToFavorites] = useAddStoryToFavoritesMutation();

  // const handleAddToFavorites = async (storyId: number) => {
  //   try {
  //     // Call the mutation to add the story to favorites
  //     await addStoryToFavorites({ storyId: storyId.toString() }).unwrap();
  //   } catch (err) {
  //     // Handle the error if mutation fails
  //     pushError('Error adding story to favorites');
  //   }
  // };

  // const detectDeviceType = () =>
  //   /Mobile|Android|iPhone|iPad/i.test(navigator.userAgent)
  //     ? 'Mobile'
  //     : 'Desktop';

  // const isMobile = React.useMemo(() => {
  //   const deviceType = detectDeviceType();
  //   return deviceType === 'Mobile';
  // }, []);

  // const handleMouseLeave = () => {
  //   setIsFlipped(false);
  // };
  //
  // const handleMouseEnter = () => {
  //   setIsFlipped(true);
  // };
  // useEffect(() => {
  //   const calculateMaxChars = () => {
  //     const pElement = pageLeftRef.current;
  //     if (!pElement) return;
  //
  //     const tempElement = document.createElement('p');
  //     tempElement.style.width = `${pElement.offsetWidth}px`;
  //     tempElement.style.fontSize = window.getComputedStyle(pElement).fontSize;
  //     tempElement.style.lineHeight =
  //       window.getComputedStyle(pElement).lineHeight;
  //     tempElement.style.padding = window.getComputedStyle(pElement).padding;
  //     tempElement.style.visibility = 'hidden';
  //     tempElement.style.position = 'absolute';
  //     document.body.appendChild(tempElement);
  //
  //     let charCount = 0;
  //     for (let i = 0; i < abstract.length; i += 1) {
  //       tempElement.textContent = abstract.substring(0, i + 1);
  //       if (tempElement.scrollHeight > pElement.clientHeight) {
  //         charCount = i;
  //         break;
  //       }
  //     }
  //
  //     document.body.removeChild(tempElement);
  //     if (charCount > 0) {
  //       const lastSpaceChar = abstract.lastIndexOf(' ', charCount);
  //       setmaxCharsPageLeft(lastSpaceChar);
  //     }
  //   };
  //
  //   calculateMaxChars();
  //   window.addEventListener('resize', calculateMaxChars);
  //   return () => window.removeEventListener('resize', calculateMaxChars);
  // }, [abstract]);

  return (
    <div
      className={mergeClassnames(
        'relative flex w-full flex-row bg-pink-100 p-4 rounded-xl shadow-sm',
        'h-[287px] w-[392px]',
      )}
      // onMouseLeave={!isMobile ? handleMouseLeave : undefined}
    >
      {/* Front-Card */}
      <div
        className={mergeClassnames(
          'absolute inset-0 flex flex-row bg-white p-3 rounded-2xl transition-transform duration-500 transform-gpu',
          'md:[transform-style:preserve-3d] md:[backface-visibility:hidden]',
          // isFlipped ? 'md:rotate-y-180' : 'md:rotate-y-0',
        )}
      >
        <div
          className={mergeClassnames(
            'flex w-1/2 flex-col pt-3 relative',
            'md:h-full',
          )}
        >
          <div className={mergeClassnames('flex flex-col gap-2')}>
            <h2
              className={mergeClassnames(
                'text-base font-medium leading-6 text-primary-10 line-clamp-3 capitalize',
                'md:text-[18px] md:leading-7',
              )}
            >
              {data?.title.toLowerCase()}
            </h2>
            <div
              className={mergeClassnames('flex flex-row items-center gap-2')}
            >
              <div className="flex flex-row items-center gap-1">
                <Image
                  alt="author-avatar"
                  src="/assets/images/Avatar.png"
                  width={24}
                  height={24}
                  className="size-6 rounded-full"
                />
                <div className="flex flex-col items-start justify-center">
                  <span
                    className={mergeClassnames(
                      'text-xs font-medium leading-4 text-[#73787C] line-clamp-1',
                      'md:text-sm',
                    )}
                  >
                    {data?.humanBook?.fullName}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-2 flex flex-row items-center gap-1">
              <Image
                src="/assets/images/icons/heart-yellow.svg"
                width={16}
                height={16}
                className="size-4"
                alt="heart-icon"
              />
              <p
                className={mergeClassnames(
                  'text-xs font-medium leading-4 text-neutral-20',
                  'md:text-sm',
                )}
              >
                {data?.storyReview?.rating || 0}
              </p>
              <p
                className={mergeClassnames(
                  'text-[0.625rem] font-normal text-neutral-40',
                  'md:text-xs',
                )}
              >
                {`(${data?.storyReview?.numberOfReviews || 0} ${t('ratings')})`}
              </p>
            </div>

            <div className={mergeClassnames('mt-3 gap-2 block md:hidden')}>
              <h3
                className={mergeClassnames(
                  'text-sm font-medium leading-5 mb text-primary-10',
                  'md:text-base',
                )}
              >
                {t('abstract')}
              </h3>
              <p
                className={mergeClassnames(
                  'mt-1 line-clamp-3 text-sm font-normal mb-3 leading-6 text-[#45484A]',
                  'md:text-base md:line-clamp-5',
                )}
                style={{ letterSpacing: '0.005rem' }}
              >
                {data?.abstract}
              </p>
            </div>

            {renderActions && renderActions()}
          </div>
        </div>
        <div
          className={mergeClassnames(
            'h-full w-1/2 rounded-2xl relative',
            'md:h-full',
          )}
        >
          {/* <CustomCoverBook */}
          {/*  titleStory={title} */}
          {/*  authorName={data?.humanBook?.fullName || ''} */}
          {/*  // srcImage={data?.cover?.path} */}
          {/* /> */}
          <CustomFlipBook
            title={title}
            author={data?.humanBook?.fullName || ''}
            coverUrl={data?.cover?.path}
          />
        </div>
      </div>
      {/* Back-Card */}
      {/* <div */}
      {/*  className={mergeClassnames( */}
      {/*    'absolute inset-0 hidden md:block transition-transform duration-500 transform-gpu ', */}
      {/*    'md:[transform-style:preserve-3d] md:[backface-visibility:hidden]', */}
      {/*    // isFlipped ? 'md:rotate-y-0' : 'md:rotate-y-180', */}
      {/*  )} */}
      {/* > */}
      {/*  <div className="flip-card-back h-full rounded-2xl"> */}
      {/*    <div className="grid h-full w-full grid-cols-2 rounded-2xl bg-[#FFFFFF] p-4 shadow-[3px_4px_5px_3px_#1C1E211A]"> */}
      {/*      <div className="page-left relative h-full rounded-md  bg-[#f5f5f5] before:absolute before:inset-y-0 before:right-0 before:h-full before:w-[36px] before:rounded-lg before:bg-gradient-to-r before:from-transparent before:to-[#C7C9CB] before:content-['']"> */}
      {/*        <div> */}
      {/*          <h6 */}
      {/*            className={mergeClassnames( */}
      {/*              'book-title h-[56px] text-left text-base font-medium leading-6 text-gray-800', */}
      {/*              'md:text-[18px] md:leading-7', */}
      {/*            )} */}
      {/*            style={{ */}
      {/*              display: '-webkit-box', */}
      {/*              WebkitBoxOrient: 'vertical', */}
      {/*              WebkitLineClamp: 2, */}
      {/*              overflow: 'hidden', */}
      {/*              textTransform: 'capitalize', */}
      {/*            }} */}
      {/*          > */}
      {/*            {title.toLowerCase()} */}
      {/*          </h6> */}
      {/*          <p */}
      {/*            ref={pageLeftRef} */}
      {/*            className="w-full overflow-hidden text-left text-sm text-neutral-600" */}
      {/*            style={{ */}
      {/*              display: '-webkit-box', */}
      {/*              WebkitBoxOrient: 'vertical', */}
      {/*              WebkitLineClamp: 10, */}
      {/*            }} */}
      {/*          > */}
      {/*            {abstract.substring(0, maxCharsPageLeft) || ''} */}
      {/*          </p> */}
      {/*        </div> */}
      {/*      </div> */}

      {/*      <div className="page-right relative flex h-full flex-col justify-between rounded-l-[8px] bg-[#f5f5f5] before:absolute before:inset-y-0 before:right-0 before:h-full before:w-[36px] before:rounded-md before:bg-gradient-to-r before:from-transparent before:to-[#C7C9CB] before:opacity-30 before:content-['']"> */}
      {/*        <p */}
      {/*          className="mt-1 w-full  overflow-hidden  pl-2 pr-1 text-left text-sm font-normal text-neutral-600" */}
      {/*          style={{ */}
      {/*            display: '-webkit-box', */}
      {/*            WebkitBoxOrient: 'vertical', */}
      {/*            WebkitLineClamp: 10, */}
      {/*          }} */}
      {/*        > */}
      {/*          {abstract.substring(maxCharsPageLeft) || ''} */}
      {/*        </p> */}
      {/*        <div className="mb-2 flex justify-center"> */}
      {/*          <Button */}
      {/*            variant="primary" */}
      {/*            className={mergeClassnames( */}
      {/*              'text-sm h-8 max-h-8 flex-none', */}
      {/*              'md:h-10 md:max-h-10', */}
      {/*            )} */}
      {/*            onClick={() => router.push(`/explore-story/${data?.id}`)} */}
      {/*          > */}
      {/*            {t('read_story')} */}
      {/*          </Button> */}
      {/*        </div> */}
      {/*      </div> */}
      {/*    </div> */}
      {/*  </div> */}
      {/* </div> */}
    </div>
  );
};
