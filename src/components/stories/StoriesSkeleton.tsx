import { mergeClassnames } from '../private/utils';

function StoriesSkeleton() {
  return (
    <div className="mx-auto h-full w-full max-w-[1216px] rounded-lg">
      <div
        className={mergeClassnames(
          'mt-6 grid grid-cols-1 gap-8',
          'md:grid-cols-3',
        )}
      >
        {[1, 2, 3, 4, 5, 6].map((index) => (
          <div
            key={index}
            className={mergeClassnames(
              'flex w-full items-center gap-1 py-2 px-0',
              'md:px-2 md:py-2',
            )}
          >
            <div className="relative h-full w-1/2 rounded-2xl bg-neutral-90">
              <div className="absolute left-2 top-2 h-7 w-[5.5rem] rounded-full bg-neutral-80" />
            </div>
            <div className="relative h-full w-1/2 rounded-2xl bg-neutral-90 px-4 py-3">
              <div className="h-10 w-full rounded-sm bg-neutral-80" />
              <div className="mt-1 h-6 w-3/4 rounded-sm bg-neutral-80" />
              <div className="mt-3 h-4 w-1/2 rounded-sm bg-neutral-80" />
              <div className="mt-5 h-5 w-1/3 rounded-sm bg-neutral-80" />
              <div className="mt-2 h-20 w-full rounded-sm bg-neutral-80" />

              <div className="absolute bottom-6 right-0 flex w-full flex-row items-center gap-2 px-3">
                <div className=" mt-2 h-11 flex-[1px] rounded-full bg-neutral-80" />
                <div className=" mt-2 h-11 w-11 rounded-full bg-neutral-80" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default StoriesSkeleton;
