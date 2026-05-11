export type ModerationActionType = 'ban' | 'unban' | 'warn' | 'unwarn';
export type ModerationStatus = 'active' | 'reversed';

export type ModerationHistory = {
  id: number;
  actionType: ModerationActionType;
  status: ModerationStatus;
  manualReason?: string;
  report?: {
    id: number;
    reason: string;
    customReason?: string;
  };
  createdAt: string;
};

export type ModerationHistoryParams = {
  page?: number;
  limit?: number;
  userId: number;
};
