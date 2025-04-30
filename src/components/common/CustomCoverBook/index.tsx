import Image from 'next/image';

import { svnRio } from '@/templates/BaseTemplate';

type Props = {
  titleStory: string;
  authorName: string;
  active?: boolean;
  widthImage?: number;
  heightImage?: number;
  srcImage: string;
};

const CustomCoverBook = ({
  titleStory,
  authorName,
  active = true,
  widthImage = 180,
  heightImage = 255,
  srcImage = '/assets/images/cover-book/story_background_yellow.png',
}: Props) => {
  return (
    <div
      id="cover-book"
      className={`relative ${active ? 'grayscale-0' : 'grayscale'}`}
    >
      <div
        className={`absolute left-0 top-[8px] line-clamp-3 w-full max-w-[180px] text-wrap px-5 text-center text-[22px] text-primary-50 ${svnRio.className} whitespace-pre-line`}
      >
        {titleStory}
      </div>
      <div className="absolute bottom-[8px] left-0 line-clamp-3 w-full max-w-[180px] text-wrap px-5 text-center text-xs font-bold  italic text-primary-50">
        {`_${authorName || 'author name'}_`}
      </div>
      <Image
        src={srcImage}
        alt={`${titleStory} - ${authorName}`}
        width={widthImage}
        height={heightImage}
      />
    </div>
  );
};

export default CustomCoverBook;
