import { useTranslations } from 'next-intl';
import { useEffect, useRef, useState } from 'react';

import Button from '../button/Button';
import { mergeClassnames } from '../private/utils';

interface OpenStoryProps {
  content: string;
  title: string;
  data?: { id: string };
  router?: any;
}

const OpenStory = ({ content, title, data, router }: OpenStoryProps) => {
  const abstract = content || '';
  const t = useTranslations('ExporeStory');
  const [maxCharsPage1, setMaxCharsPage1] = useState(200);
  const page1Ref = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const calculateMaxChars = () => {
      const pElement = page1Ref.current;
      if (!pElement) return;

      const tempElement = document.createElement('p');
      tempElement.style.width = `${pElement.offsetWidth}px`;
      tempElement.style.fontSize = window.getComputedStyle(pElement).fontSize;
      tempElement.style.lineHeight =
        window.getComputedStyle(pElement).lineHeight;
      tempElement.style.padding = window.getComputedStyle(pElement).padding;
      tempElement.style.visibility = 'hidden';
      tempElement.style.position = 'absolute';
      document.body.appendChild(tempElement);

      let charCount = 0;
      for (let i = 0; i < abstract.length; i += 1) {
        tempElement.textContent = abstract.substring(0, i + 1);
        if (tempElement.scrollHeight > pElement.clientHeight) {
          charCount = i;
          break;
        }
      }

      document.body.removeChild(tempElement);
      if (charCount > 0) {
        const lastSpaceChar = abstract.lastIndexOf(' ', charCount);
        setMaxCharsPage1(lastSpaceChar);
      }
    };

    calculateMaxChars();
    window.addEventListener('resize', calculateMaxChars);
    return () => window.removeEventListener('resize', calculateMaxChars);
  }, [abstract]);

  return (
    <div className="flip-card-back h-full rounded-2xl">
      <div className="grid h-full w-full grid-cols-2 rounded-2xl bg-[#FFFFFF] p-4 shadow-[3px_4px_5px_3px_#1C1E211A]">
        <div className="page-left relative h-full rounded-2xl before:absolute before:inset-y-0 before:right-0 before:h-full before:w-[36px] before:bg-gradient-to-r before:from-transparent before:to-[#C7C9CB] before:opacity-30 before:content-['']">
          <div>
            <h6
              className={mergeClassnames(
                'book-title h-[56px] text-left text-base font-medium leading-6 text-gray-800',
                'md:text-[18px] md:leading-7',
              )}
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 2,
                overflow: 'hidden',
                textTransform: 'capitalize',
              }}
            >
              {title.toLowerCase()}
            </h6>
            <p
              ref={page1Ref}
              className="w-full overflow-hidden text-left text-sm text-neutral-600"
              style={{
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                WebkitLineClamp: 10,
              }}
            >
              {abstract.substring(0, maxCharsPage1) || ''}
            </p>
          </div>
        </div>

        <div className="page-right relative flex h-full flex-col justify-between before:absolute before:inset-y-0 before:right-0 before:h-full before:w-[36px] before:rounded-2xl before:bg-gradient-to-r before:from-transparent before:to-[#C7C9CB] before:opacity-30 before:content-['']">
          <p
            className="mt-1 w-full overflow-hidden pl-2 pr-1 text-left text-sm font-normal text-neutral-600"
            style={{
              display: '-webkit-box',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 10,
            }}
          >
            {abstract.substring(maxCharsPage1) || ''}
          </p>
          <div className="mb-2 flex justify-center">
            <Button
              variant="primary"
              className={mergeClassnames(
                'text-sm h-8 max-h-8 flex-none',
                'md:h-10 md:max-h-10',
              )}
              onClick={() => router.push(`/explore-story/${data?.id}`)}
            >
              {t('read_story')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OpenStory;
