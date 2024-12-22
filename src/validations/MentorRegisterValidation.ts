import { z } from 'zod';

export const MentorRegisterValidation = z
  .object({
    about: z
      .string()
      .trim()
      .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
    sections: z
      .string()
      .trim()
      .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
    education: z
      .string()
      .trim()
      .min(1, 'Bạn chưa điền thông tin này. Vui lòng hoàn tất trước khi gửi.'),
    from: z
      .number()
      .int('Năm phải là số nguyên')
      .min(1900, 'Năm không hợp lệ')
      .max(2024, 'Năm không thể trong tương lai')
      .default(2024),
    to: z
      .number()
      .int('Năm phải là số nguyên')
      .min(1900, 'Năm không hợp lệ')
      .max(2024, 'Năm không thể trong tương lai')
      .default(2024),
  })
  .refine((data) => data.to >= data.from, {
    message: 'Năm kết thúc phải lớn hơn hoặc bằng năm bắt đầu',
    path: ['to'],
  });
