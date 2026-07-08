// import { Spinner } from '@/components/loadingState/Spinner';
import { AnimationLoading } from '@/components/AnimationLoading';

export default function Loading() {
  // You can add any UI inside Loading, including a Skeleton.
  return (
    <AnimationLoading
      animationData="/assets/animations/book.json"
      width="300px"
      height="300px"
    />
  );
}
