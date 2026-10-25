import { z } from 'zod';

export const PHONE_NUMBER_REGEX = /^\+?\d{7,15}$/;
export const VALIDATION_MESSAGES = {
  PHONE_NUMBER: 'phone_number_invalid',
  PARENT_PHONE_NUMBER: 'parent_phone_number_invalid',
  PARENT_REQUIRED: 'guardian_required',
  EMAIL_REQUIRED: 'email_required',
  EMAIL_INVALID: 'email_invalid',
};

export const DateOfBirthFieldsetValidation = z.object({
  day: z.number().min(1).max(31),
  month: z.number().min(1).max(12),
  year: z.number().min(1),
});

export const ProfileValidation = z
  .object({
    fullName: z.string().trim().min(1),
    birthday: z.string().trim().min(1),
    email: z.string().trim().min(1, { message: VALIDATION_MESSAGES.EMAIL_REQUIRED }).email({ message: VALIDATION_MESSAGES.EMAIL_INVALID }),
    gender: z.object({
      id: z.number().min(1).max(3),
      name: z.string().trim().min(1).optional(),
    }),
    phoneNumber: z.string().nullable().optional()
      .refine(value => !value || PHONE_NUMBER_REGEX.test(value), { message: VALIDATION_MESSAGES.PHONE_NUMBER }),
    address: z.string(),
    isUnderGuard: z.boolean(),
    parentPhoneNumber: z.string()
      .nullable()
      .optional(),
    parentEmail: z
      .string()
      .trim()
      .email({ message: VALIDATION_MESSAGES.EMAIL_INVALID })
      .nullable()
      .optional()
      .or(z.literal('')),
    parentFullname: z.string().optional(),
    countryCode: z.string().nullable(),
  })
  .superRefine((values, context) => {
    if (values.isUnderGuard) {
      if (!values.parentPhoneNumber || values.parentPhoneNumber.length <= 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_MESSAGES.PARENT_REQUIRED,
          path: ['parentPhoneNumber'],
        });
      }
    }
  });

export const WorkExperienceValidation = z.object({
  position: z.string().trim().min(1),
  company: z.string().trim().min(1),
  startedAt: z.string().trim().min(1),
  endedAt: z.string().optional(),
});

export const EducationValidation = z.object({
  major: z.string().trim().min(1),
  institution: z.string().trim().min(1),
  startedAt: z.string().trim().min(1),
  endedAt: z.string().optional(),
  type: z.string().optional(),
  isPublic: z.boolean().optional(),
});

export const EmailChangeValidation = z.object({
  verificationCode: z.string().trim().length(4),
});
