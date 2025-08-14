import { z } from 'zod';

const SurveyAnswerValidation = z.object({
  questionId: z.number(),
  answer: z.number().min(1).max(5),
});

export const SurveyValidation = z.object({
  answers: z.array(SurveyAnswerValidation),
});

const FeedbackValidation = z.object({
  rating: z.number().min(1).max(5),
  content: z.string().trim().min(1),
});

export const PostSurveyValidation = z.object({
  sessionRating: z.number().min(1).max(5),
  feelingRating: z.number().min(1).max(5),
  storyFeedback: FeedbackValidation,
  huberFeedback: FeedbackValidation,
});
