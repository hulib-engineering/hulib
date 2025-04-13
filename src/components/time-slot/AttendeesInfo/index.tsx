import clsx from 'clsx';
import Image from 'next/image';

interface Props {
  source: string;
  role: string;
  name: string;
}

const AttendeesInfo = ({ source, role, name }: Props) => {
  if (!role) return null;

  return (
    <div className="flex items-center gap-x-2">
      <Image
        src={source || '/assets/images/Avatar.png'}
        alt="avatar author"
        width={32}
        height={32}
      />
      <span
        className={clsx(
          'rounded-md px-2 py-0.5 text-sm font-medium',
          role === 'Reader'
            ? 'bg-[#FFE3CC] text-[#FF7301]'
            : 'bg-primary-90 text-primary-50',
        )}
      >
        {role}
      </span>
      <span className="text-sm font-medium text-neutral-10">{name || ''}</span>
    </div>
  );
};

export default AttendeesInfo;
