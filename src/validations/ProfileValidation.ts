import { z } from 'zod';

export const PHONE_NUMBER_REGEX = /^\+[1-9]\d{1,3}[ -]?\d{6,14}$/;
export const VALIDATION_MESSAGES = {
  PHONE_NUMBER: 'phone_number_invalid',
  PARENT_PHONE_NUMBER_REQUIRED: 'parent_phone_number_required',
  GUARDIAN_PHONE_NUMBER: 'guardian_phone_number_invalid',
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
    parentPhoneNumber: z.string().nullable().optional()
      .refine(value => !value || PHONE_NUMBER_REGEX.test(value), { message: VALIDATION_MESSAGES.GUARDIAN_PHONE_NUMBER }),
    parentEmail: z.string().trim().optional().or(z.literal(''))
      .refine(value => !value || z.string().email().safeParse(value).success, { message: VALIDATION_MESSAGES.EMAIL_INVALID }),
    parentFullname: z.string().optional(),
  })
  .superRefine((values, context) => {
    if (values.isUnderGuard) {
      if (!values.parentPhoneNumber || values.parentPhoneNumber.length <= 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: VALIDATION_MESSAGES.PARENT_PHONE_NUMBER_REQUIRED,
          path: ['parentPhoneNumber'],
        });
      }
      if (!values.parentEmail || values.parentEmail.length <= 0) {
        context.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'guardian_placeholder',
          path: ['parentEmail'],
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
