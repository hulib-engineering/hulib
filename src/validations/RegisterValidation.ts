import { z } from 'zod';

export const RegisterStep1Validation = z
  .object({
    email: z.string().trim().min(1).email(),
    password: z
      .string()
      .trim()
      .min(8)
      .refine((password) => /[A-Z]/.test(password))
      .refine((password) => /[a-z]/.test(password))
      .refine((password) => /[0-9]/.test(password))
      .refine((password) => /[!@#$%^&*]/.test(password)),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

export const RegisterStep2Validation = z
  .object({
    isUnderGuard: z.boolean().default(false),
    fullname: z.string().trim().min(2),
    gender: z.number().min(1).max(3).default(3),
    birthday: z
      .string()
      .trim()
      .refine(
        (value) => {
          return (
            /^\d{4}-\d{2}-\d{2}$/.test(value) &&
            !Number.isNaN(Date.parse(value))
          );
        },
        {
          message: 'Invalid date format.',
        },
      ),
    parentPhoneNumber: z.string().optional(),
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
        path: ['parentPhoneNumber'],
      });
    }
  });

export const RegisterStep3Validation = z.object({
  verificationCode: z.string().trim().length(6),
});

export const PhoneNumberValidation = z.object({
  isVerified: z.boolean().default(false),
  parentPhoneNumber: z
    .string()
    .trim()
    .regex(/^\+[1-9]\d{1,14}$/),
  verificationCode: z.string().trim().length(6),
  verificationId: z.string().trim().min(1),
});
