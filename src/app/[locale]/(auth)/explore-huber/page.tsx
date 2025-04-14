import ListHuber from '@/components/huber/ListHuber';
import { mergeClassnames } from '@/components/private/utils';

const ExploreHuber = () => {
  return (
    <div
      className={mergeClassnames(
        'mx-auto h-full w-full px-5 py-12 rounded-lg',
        'md:px-28 ',
      )}
    >
      <div className="mx-auto h-full w-full max-w-[1216px] rounded-lg">
        Hubers
      </div>
      <ListHuber />
    </div>
  );
};

export default ExploreHuber;
