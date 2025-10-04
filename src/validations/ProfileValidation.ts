import { z } from 'zod';

export const DateOfBirthFieldsetValidation = z.object({
  day: z.number().min(1).max(31),
  month: z.number().min(1).max(12),
  year: z.number().min(1),
});

export const ProfileValidation = z
  .object({
    fullName: z.string().trim().min(1),
    birthday: z.string().trim().min(1),
    email: z.string().trim().min(1).email(),
    gender: z.object({
      id: z.number().min(1).max(3),
      name: z.string().trim().min(1).optional(),
    }),
    phoneNumber: z.string().optional(),
    address: z.string(),
    isUnderGuard: z.boolean(),
    parentPhoneNumber: z.string().optional(),
    parentFullname: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (
      values.isUnderGuard
      && (!values.parentPhoneNumber
        || values.parentPhoneNumber.length <= 0
        || !/^\+?[1-9]\d{1,3}[ -]?\d{6,14}$/.test(values.parentPhoneNumber))
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please specify a parent phone number if you are under 18!',
        path: ['parentPhoneNumber'],
      });
    }
  });
