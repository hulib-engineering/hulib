import CustomCoverBook from '@/components/common/CustomCoverBook';
// import Button from '@/components/button/Button';

const CustomCoverBox = ({
  titleStory,
  authorName,
}: {
  titleStory: string;
  authorName: string;
}) => {
  const isSelected = true;

  return (
    <div className="flex flex-col gap-2">
      <div className="text-sm font-medium text-black">
        Cover picture <span className="text-red-500">*</span>
        <div className="mt-2 flex justify-between gap-2 rounded-2xl bg-neutral-90 p-5">
          <div className="flex cursor-pointer flex-col gap-4">
            <CustomCoverBook
              titleStory={titleStory}
              authorName={authorName}
              isSelected={isSelected}
              widthImage={180}
              heightImage={255}
            />

            {/* <Button
                  onClick={() => handleSelectedCoverImage(indexCoverImage)}
                  className={`${
                    isSelected ? 'bg-primary-90' : 'border-neutral-80 bg-white'
                  } text-primary-50 hover:text-white`}
                >
                  {isSelected ? 'Custom' : `Style ${indexCoverImage + 1}`}
                </Button> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomCoverBox;
