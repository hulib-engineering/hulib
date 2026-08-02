import { Warning } from '@phosphor-icons/react';

export default function TimeslotWarning() {
  return (
    <div
      className="flex w-full gap-2
      font-medium text-yellow-30 lg:rounded-lg
      lg:border lg:border-solid lg:border-[#FFAB67] lg:bg-[#FFF9F5] lg:p-2
      lg:text-[#662E00]"
    >
      <Warning size={16} className="shrink-0 text-yellow-50 lg:text-[#FF7301]" />
      <span className="text-sm leading-4">
        To help the Huber arrange their schedule, please choose a time slot at least 24 hours after your meeting request.
      </span>
    </div>
  );
}
