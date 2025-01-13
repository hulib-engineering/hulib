function TopicSkeleton() {
  return (
    <>
      {[1, 2].map((index) => (
        <div key={index} className="flex w-full items-center gap-2 p-2">
          <div className="flex-1">
            <div className="h-8 w-full animate-pulse rounded bg-neutral-90" />
          </div>
        </div>
      ))}
    </>
  );
}
export default TopicSkeleton;
