import { z } from 'zod';

export const ProfileValidation = z
  .object({
    fullname: z.string().trim().min(1),
    birthday: z.string().trim().min(1),
    email: z.string().trim().min(1).email(),
    gender: z.number().min(1).max(3).default(3),
    phoneNumber: z.string(),
    address: z.string(),
    isUnderGuard: z.boolean().default(false),
    parentPhoneNumber: z.any(),
  })
  .superRefine((values, context) => {
    if (
      values.isUnderGuard &&
      (!values.parentPhoneNumber ||
        values.parentPhoneNumber.length <= 0 ||
        !/^\+[1-9]\d{1,14}$/.test(values.parentPhoneNumber))
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please specify a parent phone number if you are under 18!',
        path: ['phoneNumber'],
      });
    }
  });
