import { Bookmark, BookOpen } from '@phosphor-icons/react/dist/ssr';
import Image from 'next/image';

import Button from '@/components/button/Button';

const Book = () => {
  return (
    <div className="flex h-[24rem] w-full flex-row gap-[12.5px]">
      <Image
        src="/assets/images/image-test.jfif"
        alt="book-image"
        width={275}
        height={366}
        className="h-full w-1/2 rounded-lg"
      />
      <div className="flex w-1/2 flex-col">
        <div className="text-[2rem] font-medium text-[#010D26]">
          Story of my life
        </div>
        <div className="flex flex-row items-center gap-3">
          <div className="flex flex-row items-center justify-center gap-1">
            <Image
              alt="image-test"
              src="/assets/images/Avatar.png"
              width={24}
              height={24}
              className="size-6 rounded-full"
            />
            <div className="text-sm font-medium text-[#73787C]">
              Author name
            </div>
          </div>
          <div className="flex flex-row items-center justify-center gap-1">
            <div className="text-sm font-medium text-[#2E3032]">20</div>
            <div className="text-sm font-medium text-neutral-40">Topics</div>
          </div>
        </div>

        <div className="mt-3 flex flex-row items-center gap-1">
          <Image
            src="/assets/images/icons/heart-yellow.svg"
            width={16}
            height={16}
            className="size-4"
            alt="heart-icon"
          />
          <p className="text-sm font-medium leading-4 text-neutral-20">4.2</p>
          <p className="text-xs font-normal text-neutral-40">40 rating</p>
        </div>
        <Button
          className="mt-4 min-h-11"
          iconLeft={<BookOpen color="#fff" size={20} />}
        >
          Read book
        </Button>
        <Button
          variant="outline"
          className="mt-2 min-h-11"
          iconLeft={<Bookmark color="#0442BF" size={20} />}
        >
          Add to favorite
        </Button>
        <div className="mt-4 gap-2 ">
          <h3 className="text-base font-medium text-[#010D26]">Abstract</h3>
          <p className="line-clamp-5 text-base leading-6 text-neutral-30">
            pEmbark on an exciting and immersive journey through the captivating
            pages of Chronicles of My Life, where every chapter unfolds new
            adventures and discoveries waiting to be explored. Join me as we
            delve deeper into the intricate tapestry of my experiences,
            emotions, and reflections, making this longer. Embark on an exciting
            and immersive journey through the captivating pages of Chronicles of
            My Life, where every chapter unfolds new adventures and discoveries
            waiting to be explored. Join me as we delve deeper into the
            intricate tapestry of my experiences, emotions, and reflections,
            making this longer. Embark on an exciting and immersive journey
            through the captivating pages of Chronicles of My Life, where every
            chapter unfolds new adventures and discoveries waiting to be
            explored.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Book;
