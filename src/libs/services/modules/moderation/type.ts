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
  report?: {
    id: number;
    reason: string;
    customReason?: string;
  };
};
