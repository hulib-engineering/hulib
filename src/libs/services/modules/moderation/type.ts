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
  reasons: string;
  customReason?: string;
  actionType: ModerationActionType;
  status: ModerationStatus;
};
