import Image from 'next/image';
import React from 'react';

type SessionStoryDescriptionProps = {
  note: string;
};

export const SessionStoryDescription: React.FC<
  SessionStoryDescriptionProps
> = ({ note }) => {
  // Truncate abstract to show only first few words
  // const truncateAbstract = (text: string, maxLength: number = 100): string => {
  //   if (!text) return '';
  //   if (text.length <= maxLength) return text;

  //   const truncated = text.substring(0, maxLength);
  //   return `${truncated.substring(0, truncated.lastIndexOf(' '))}...`;
  // };

  return (
    <div className="mb-3">
      <div className="mb-1 flex items-start gap-1 text-sm text-gray-800">
        <Image
          src="/assets/icons/Note.svg"
          alt="Note Icon"
          width={16}
          height={16}
          className="shrink-0"
        />
        <div>
          <p>{note}</p>
        </div>
      </div>
    </div>
  );
};
