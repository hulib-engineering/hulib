import { api } from '../../api';
import changePassword from './changePassword';
import checkEmail from './checkEmail';
import confirmEmail from './confirmEmail';
import forgotPassword from './forgotPassword';
import getPersonalInfo from './getPersonalInfo';
import loginAsAdmin from './loginAsAdmin';
import loginAsUser from './loginAsUser';
import refresh from './refresh';
import register from './register';
import registerHuber from './registerHumanBook';
import resendOTP from './resendOTP';
import resetPassword from './resetPassword';
import updateProfile from './updateProfile';
import getPersonalAvatar from '@/libs/services/modules/auth/getPersonalAvatar';

type Enum = {
  id: number;
  name: string;
};

export type User = {
  id: number;
  email: string;
  provider: string;
  socialId?: string;
  fullName: string;
  birthday: string;
  gender: Enum;
  role: Enum;
  status: Enum;
  phoneNumber?: string;
  address?: string;
  parentPhoneNumber?: string;
  parentFullname?: string;
  // createdAt: Date;
  // updatedAt: Date;
  // deletedAt?: Date;
};

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
    getPersonalAvatar: getPersonalAvatar(build),
    loginAsAdmin: loginAsAdmin(build),
    loginAsManager: loginAsUser(build),
    refresh: refresh(build),
    register: register(build),
    resendOTP: resendOTP(build),
    forgotPassword: forgotPassword(build),
    resetPassword: resetPassword(build),
    changePassword: changePassword(build),
    updateProfile: updateProfile(build),
    registerHuber: registerHuber(build),
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
  useRegisterHuberMutation,
  useLazyGetPersonalAvatarQuery,
}: any = authApi;
