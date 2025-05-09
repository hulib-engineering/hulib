import React from 'react';

interface SessionActionsProps {
  status: string;
  isVibing?: boolean;
}

export const SessionActions: React.FC<SessionActionsProps> = ({
  status,
  isVibing,
}) => {
  const renderActionButtons = () => {
    if (status === 'pending' && isVibing === false) {
      return (
        <div className="flex w-full gap-3">
          <button
            type="button"
            className="w-1/2 rounded-[100px] bg-gray-100 px-4 py-1 text-sm font-medium text-blue-700 hover:bg-gray-200"
          >
            Reject
          </button>
          <button
            type="button"
            className="flex-1 rounded-[100px] bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700"
          >
            Accept
          </button>
        </div>
      );
    }

    if (status === 'finished' && isVibing === true) {
      return (
        <button
          type="button"
          className="w-full rounded-[100px] bg-blue-600 px-4 py-1 text-sm font-medium text-white hover:bg-blue-700"
        >
          Feedback
        </button>
      );
    }

    if (status === 'finished' && isVibing === false) {
      return null;
    }

    return (
      <button
        type="button"
        className="w-full rounded-[100px] bg-[#FFC9D5] px-4 py-1 text-sm font-medium text-[#EE0038]"
      >
        Cancel
      </button>
    );
  };

  return <div className="mt-4">{renderActionButtons()}</div>;
};
