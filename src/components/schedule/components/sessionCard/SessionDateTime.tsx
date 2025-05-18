import { Calendar } from '@phosphor-icons/react';
import React from 'react';

interface SessionDateTimeProps {
  startDate: string;
  endDate: string;
}

export const SessionDateTime: React.FC<SessionDateTimeProps> = ({
  startDate,
  endDate,
}) => {
  // Format date: convert ISO date string to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  // Get day of week from date
  const getDayOfWeek = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()] ?? '';
  };

  // Format time: convert ISO date string to readable time
  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  };

  // Calculate session duration
  const getSessionDuration = (): string => {
    if (!startDate || !endDate) return '';
    const startTime = formatTime(startDate);
    const endTime = formatTime(endDate);
    return `${startTime} - ${endTime}`;
  };

  return (
    <div className="mb-3 flex items-center text-black">
      <Calendar size={16} className="mr-2" />
      <div>
        <span>
          {getDayOfWeek(startDate)}, {formatDate(startDate)} |{' '}
        </span>
        <span>{getSessionDuration()}</span>
      </div>
    </div>
  );
};
