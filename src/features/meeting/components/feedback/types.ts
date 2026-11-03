export type SessionFeedbackValue = {
  feelingRating: number;
  satisfactionRating: number;
  content: string;
};

export type HuberFeedbackValue = {
  rating: number;
  content: string;
};

export type HuberIdentity = {
  fullName?: string;
  photo?: {
    path?: string;
  };
};

export type HuberFeedbackPayload
  = | { skipped: true }
    | { skipped: false; rating: number; content?: string };

export type PostMeetingFeedbackPayload = {
  feelingRating: number;
  satisfactionRating: number;
  sessionContent?: string;
  huber: HuberFeedbackPayload;
};
