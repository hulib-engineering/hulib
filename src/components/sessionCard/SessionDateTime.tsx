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

    const start = formatTime(startDate);
    const end = formatTime(endDate);
    return `${start} - ${end}`;
  };

  return (
    <div className="mb-3 flex items-center">
      <Calendar size={16} className="mr-2" />
      <div>
        <span>Tue, {formatDate(startDate)} | </span>
        <span>{getSessionDuration()}</span>
      </div>
    </div>
  );
};
