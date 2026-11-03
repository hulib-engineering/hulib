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
