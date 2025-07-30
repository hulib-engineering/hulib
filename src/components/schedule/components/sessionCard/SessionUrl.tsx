import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

type SessionUrlProps = {
  url: string;
};

export const SessionUrl: React.FC<SessionUrlProps> = ({ url }) => {
  return (
    <div className="mb-3 flex items-center gap-1 text-sm">
      <Image
        src="/assets/icons/MapPinArea.svg"
        alt="link meet"
        width={16}
        height={16}
        className="shrink-0"
      />
      <Link
        href={url}
        passHref
        className="truncate text-blue-500 underline"
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </Link>
    </div>
  );
};
