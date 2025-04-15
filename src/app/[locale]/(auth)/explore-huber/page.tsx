import ListHuber from '@/components/huber/ListHuber';
import { mergeClassnames } from '@/components/private/utils';
import ListTopics from '@/components/stories/ListTopics';

const ExploreHuber = () => {
  return (
    <div
      className={mergeClassnames(
        'mx-auto h-full w-full  px-5 py-12 rounded-lg',
        'md:px-28 ',
      )}
    >
      <div className="h-full w-full max-w-[1216px] rounded-lg text-[40px] font-bold">
        Explore our Hubers
      </div>
      <div className="text-lg font-normal">
        Discover and find your suitable huber
      </div>
      <ListTopics currentPathName="explore-huber" />
      <ListHuber />
    </div>
  );
};

export default ExploreHuber;
