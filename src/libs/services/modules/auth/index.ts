import { api } from '../../api';
import changePassword from './changePassword';
import checkEmail from './checkEmail';
import confirmEmail from './confirmEmail';
import forgotPassword from './forgotPassword';
import getAuthorDetail from './getAuthorDetail';
import getPersonalInfo from './getPersonalInfo';
import loginAsAdmin from './loginAsAdmin';
import loginAsUser from './loginAsUser';
import refresh from './refresh';
import register from './register';
import resendOTP from './resendOTP';
import resetPassword from './resetPassword';
import updateProfile from './updateProfile';

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

export interface Author {
  id: number;
  fullName: string | null;
  birthday: string | null;
  gender: {
    id: number;
    name: string;
    __entity: string;
  };
  role: {
    id: number;
    name: string;
    __entity: string;
  };
  status: {
    id: number;
    name: string;
    __entity: string;
  };
  createdAt: string | null;
  updatedAt: string | null;
  deletedAt: string | null;
  address: string | null;
  phoneNumber: string | null;
  parentPhoneNumber: string | null;
  bio: string | null;
  videoUrl: string | null;
  education: string | null;
  educationStart: string | null;
  educationEnd: string | null;
}

export type EmailLoginResponse = {
  refreshToken: string;
  token: string;
  tokenExpires: number;
  user: User;
};

const authenticationApiWithTag = api.enhanceEndpoints?.({
  addTagTypes: ['Admin', 'User', 'OTP'],
});

export const authApi = authenticationApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    checkEmail: checkEmail(build),
    confirmEmail: confirmEmail(build),
    getPersonalInfo: getPersonalInfo(build),
    loginAsAdmin: loginAsAdmin(build),
    loginAsManager: loginAsUser(build),
    refresh: refresh(build),
    register: register(build),
    resendOTP: resendOTP(build),
    forgotPassword: forgotPassword(build),
    resetPassword: resetPassword(build),
    changePassword: changePassword(build),
    updateProfile: updateProfile(build),
    getAuthorDetail: getAuthorDetail(build),
  }),
  overrideExisting: false,
});

export const {
  useCheckEmailMutation,
  useConfirmEmailMutation,
  useGetPersonalInfoQuery,
  useRegisterMutation,
  useResendOTPMutation,
  useLoginAsManagerMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useChangePasswordMutation,
  useUpdateProfileMutation,
  useGetAuthorDetailQuery,
}: any = authApi;
