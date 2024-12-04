import resetPassword from '@/libs/services/modules/auth/resetPassword';

import { api } from '../../api';
import confirmEmail from './confirmEmail';
import forgotPassword from './forgotPassword';
import loginAsAdmin from './loginAsAdmin';
import loginAsUser from './loginAsUser';
import refresh from './refresh';
import register from './register';
import resendOTP from './resendOTP';

interface Enum {
  id: string;
  name: string;
  __entity: string;
}

export interface User {
  id: string;
  email: string;
  provider: string;
  socialId?: string;
  fullName: string;
  birthday: string;
  gender: Enum;
  role: Enum;
  status: Enum;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

export type EmailLoginResponse = {
  refreshToken: string;
  token: string;
  tokenExpires: number;
  user: User;
};

const authenticationApiWithTag = api.enhanceEndpoints({
  addTagTypes: ['Admin', 'User', 'OTP'],
});

export const authApi = authenticationApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    confirmEmail: confirmEmail(build),
    loginAsAdmin: loginAsAdmin(build),
    loginAsManager: loginAsUser(build),
    refresh: refresh(build),
    register: register(build),
    resendOTP: resendOTP(build),
    forgotPassword: forgotPassword(build),
    resetPassword: resetPassword(build),
  }),
  overrideExisting: false,
});

export const {
  useConfirmEmailMutation,
  useRegisterMutation,
  useResendOTPMutation,
  useLoginAsManagerMutation,
  useLoginAsAdminMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
}: any = authApi;
