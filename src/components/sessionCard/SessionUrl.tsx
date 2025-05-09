import { LinkSimple } from '@phosphor-icons/react';
import Link from 'next/link';
import React from 'react';

interface SessionUrlProps {
  url: string;
}

export const SessionUrl: React.FC<SessionUrlProps> = ({ url }) => {
  return (
    <div className="mb-3 flex items-center text-sm">
      <LinkSimple size={16} className="mr-2 text-blue-500" />
      <Link
        href={url}
        passHref
        className="truncate text-blue-500"
        target="_blank"
        rel="noopener noreferrer"
      >
        {url}
      </Link>
    </div>
  );
};
