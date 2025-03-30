'use client';

function TimeTag({ time }: { time: string }) {
  return (
    <div className="my-[2px] flex h-[20px] w-[calc((100%/6)-4px)] items-center justify-center rounded-[16px] bg-[#D9F9CF] text-[8px] text-[#2A8010]">
      {time}
    </div>
  );
}

export default TimeTag;
