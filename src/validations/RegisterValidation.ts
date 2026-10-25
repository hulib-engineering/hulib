import { z } from 'zod';

import { passwordSchema } from './PasswordValidation';

export const MIN_BIRTHDAY = '1900-01-01';

type RegisterStep2TranslationKey
  = | 'fullname_max_length'
    | 'birthday_invalid'
    | 'birthday_too_early'
    | 'birthday_in_future';

export const getLatestBirthday = () => {
  const today = new Date();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${today.getFullYear()}-${month}-${day}`;
};

const isValidIsoDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const [year, month, day] = value.split('-').map(Number);
  if (year === undefined || month === undefined || day === undefined) {
    return false;
  }
  const date = new Date(Date.UTC(year, month - 1, day));

  return date.getUTCFullYear() === year
    && date.getUTCMonth() === month - 1
    && date.getUTCDate() === day;
};

export const RegisterStep1Validation = z
  .object({
    email: z.string().trim().min(1).email(),
    password: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match!',
    path: ['confirmPassword'],
  });

export const RegisterStep2Validation = (t: (key: RegisterStep2TranslationKey) => string) => z
  .object({
    isUnderGuard: z.boolean().default(false),
    fullname: z
      .string()
      .trim()
      .min(2)
      .max(30, t('fullname_max_length')),
    gender: z.number().min(1).max(3).default(3),
    birthday: z
      .string()
      .trim()
      .refine(isValidIsoDate, { message: t('birthday_invalid') })
      .refine(value => value >= MIN_BIRTHDAY, {
        message: t('birthday_too_early'),
      })
      .refine(value => value <= getLatestBirthday(), {
        message: t('birthday_in_future'),
      }),
    parentPhoneNumber: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (
      values.isUnderGuard
      && (!values.parentPhoneNumber
        || values.parentPhoneNumber.length <= 0
        || !/^\+[1-9]\d{1,14}$/.test(values.parentPhoneNumber))
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Please specify a parent phone number if you are under 18!',
        path: ['parentPhoneNumber'],
      });
    }
  });

export type RegisterStep2Values = z.infer<
  ReturnType<typeof RegisterStep2Validation>
>;

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
