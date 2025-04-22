import Image from 'next/image';
import { useState } from 'react';

import Button from '@/components/button/Button';

const CustomCoverBox = ({ setValue }: any) => {
  const [coverImages] = useState<{ id: string; path: string }[]>([
    {
      path: 'https://hulib-services.onrender.com/api/v1/files/9892921ed769ba0f94b6f.png',
      id: '51f3590b-4bc3-4c7a-bd8f-73f44dd7a9eb',
    },
    // {
    //   path: 'https://hulib-services.onrender.com/api/v1/files/921ed769ba0f94b6f5439.png',
    //   id: '8d23a2c8-4bc4-49d5-bb99-c03f10813efd',
    // },
    // {
    //   path: 'https://hulib-services.onrender.com/api/v1/files/21ed769ba0f94b6f54396.png',
    //   id: '6390ae14-2209-4d53-897a-0f65918780fd',
    // },
  ]);

  const [selectedCoverImage, setSelectedCoverImage] = useState<number>(0);

  const handleSelectedCoverImage = (indexCoverImage: number) => {
    setSelectedCoverImage(indexCoverImage);
    setValue('cover', coverImages[indexCoverImage]);
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-black">
        Cover picture <span className="text-red-500">*</span>
        <div className="mt-2 flex justify-between gap-2 rounded-2xl bg-neutral-90 p-5">
          {coverImages.map((coverImage, indexCoverImage) => {
            const isSelected = selectedCoverImage === indexCoverImage;
            return (
              <div
                className="flex cursor-pointer flex-col gap-4"
                key={`${coverImage.id}-${indexCoverImage}`}
              >
                <div className={`${isSelected ? 'grayscale-0' : 'grayscale'}`}>
                  <Image
                    src={coverImage?.path || ''}
                    alt="cover"
                    width={180}
                    height={255}
                  />
                </div>
                <Button
                  onClick={() => handleSelectedCoverImage(indexCoverImage)}
                  className={`${
                    isSelected ? 'bg-primary-90' : 'border-neutral-80 bg-white'
                  } text-primary-50 hover:text-white`}
                >
                  {isSelected ? 'Custom' : `Style ${indexCoverImage + 1}`}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomCoverBox;
