/* eslint-disable tailwindcss/no-custom-classname */
export default function SkeletonShimmer() {
  return (
    <div className="relative h-[40px] w-[200px] overflow-hidden rounded-full bg-gray-300">
      <div className="animate-shimmer absolute left-[-150px] top-0 h-full w-[150px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
    </div>
  );
}
