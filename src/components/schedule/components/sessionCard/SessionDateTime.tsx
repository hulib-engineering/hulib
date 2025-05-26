import { Calendar } from '@phosphor-icons/react';
import React from 'react';

interface SessionDateTimeProps {
  date: string;
  startDate: string;
  endDate: string;
}

export const SessionDateTime: React.FC<SessionDateTimeProps> = ({
  date,
  startDate,
  endDate,
}) => {
  // Format date: convert ISO date string to readable format
  const formatDate = (dateString: string): string => {
    const parsedDate = new Date(dateString);
    return parsedDate.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Get day of week from date
  const getDayOfWeek = (dateString: string): string => {
    const parsedDate = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[parsedDate.getDay()] ?? '';
  };

  return (
    <div className="mb-3 flex items-center text-black">
      <Calendar size={16} className="mr-2" />
      <div>
        <span>
          {getDayOfWeek(date)}, {formatDate(date)} |{' '}
        </span>
        <span>
          {startDate} - {endDate}
        </span>
      </div>
    </div>
  );
};
