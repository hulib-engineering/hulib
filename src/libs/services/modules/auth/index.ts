import { api } from '../../api';
import loginAsAdmin from './loginAsAdmin';
import loginAsUser from './loginAsUser';
import refresh from './refresh';

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
  addTagTypes: ['Admin', 'User'],
});

export const authApi = authenticationApiWithTag.injectEndpoints({
  endpoints: (build: any) => ({
    loginAsManager: loginAsUser(build),
    loginAsAdmin: loginAsAdmin(build),
    refresh: refresh(build),
  }),
  overrideExisting: false,
});

export const { useLoginAsManagerMutation, useLoginAsAdminMutation }: any =
  authApi;
