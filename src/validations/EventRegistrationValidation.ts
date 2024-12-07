import { z } from 'zod';

export const EmailRegistrationValidation = z.object({
  fullname: z
    .string()
    .trim()
    .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
  birthday: z
    .string()
    .trim()
    .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
  email: z
    .string()
    .trim()
    .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
  socialMedia: z
    .string()
    .trim()
    .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
  career: z
    .string()
    .trim()
    .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
  hometown: z
    .string()
    .trim()
    .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
  firstChoice: z
    .string()
    .trim()
    .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
  secondChoice: z
    .string()
    .trim()
    .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
  question: z
    .string()
    .trim()
    .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
  // transferBill: z.instanceof(File, {
  //   message:
  //     'Bạn chưa đính kèm hình ảnh chứng minh đã chuyển khoản. Vui lòng hoàn tất trước khi gửi.',
  // }),
  transferInfo: z.string(),
  //   .trim()
  //   .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
  willingToBecomeAmbassador: z.string().optional(),
});

export const BillUploadValidation = z.object({
  transferBill: z.string().optional(),
});
