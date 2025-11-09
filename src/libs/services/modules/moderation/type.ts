export enum ModerationActionType {
  BAN = 'ban',
  UNBAN = 'unban',
  WARN = 'warn',
  UNWARN = 'unwarn',
}
export enum ModerationStatus {
  ACTIVE = 'active',
  REVERSED = 'reversed',
}

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
