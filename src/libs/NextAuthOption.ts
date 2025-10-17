import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

import { Env } from '@/libs/Env.mjs';
import { AppConfig } from '@/utils/AppConfig';
import { ROLE_NAME, Role } from '@/types/common';

export const authOptions = {
  // Configure one or more authentication providers
  debug: true,
  strategy: 'jwt',
  trustHost: true,
  // secret: Env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId: Env.GOOGLE_ID,
      clientSecret: Env.GOOGLE_SECRET,
      authorization: {
        params: {
          prompt: 'consent',
          access_type: 'offline',
          response_type: 'code',
        },
      },
    }),
    FacebookProvider({
      clientId: Env.FACEBOOK_ID,
      clientSecret: Env.FACEBOOK_SECRET,
    }),
    CredentialsProvider({
      name: 'Credentials',
      type: 'credentials',

      /*
       * As we are using our own Sign-in page, we do not need to change
       * username or password attributes manually in following credentials object.
       */
      credentials: {},
      async authorize(credentials: any) {
        if (credentials?.accessToken) {
          return {
            id: credentials.id,
            accessToken: credentials.accessToken,
            role: credentials.role,
          };
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({
      account,
      token,
      user,
    }: {
      account: any;
      token: any;
      user: any;
    }) {
      let tokenParsed = token;
      if (account && user) {
        if (account?.provider === 'google') {
          const res = await fetch(
            `${AppConfig.api.endpoint}/${AppConfig.api.version}/auth/google/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ idToken: account?.id_token }),
            },
          );
          const resParsed = await res.json();
          tokenParsed = {
            ...tokenParsed,
            accessToken: resParsed.token,
            role: resParsed.user?.role?.name ?? ROLE_NAME[Role.LIBER], // 🔹 attach role from API
          };
        }
        if (account?.provider === 'facebook') {
          const res = await fetch(
            `${AppConfig.api.endpoint}/${AppConfig.api.version}/auth/facebook/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessToken: account?.access_token }),
            },
          );
          const resParsed = await res.json();
          tokenParsed = {
            ...tokenParsed,
            accessToken: resParsed.token,
            role: resParsed.user?.role?.name ?? ROLE_NAME[Role.LIBER], // 🔹 attach role from API
          };
        }
        if (account?.provider === 'credentials') {
          console.log('User', user);
          tokenParsed = {
            ...tokenParsed,
            accessToken: user.accessToken,
            role: user.role ?? ROLE_NAME[Role.LIBER], // 🔹 attach role from API
          };
        }
      }

      return tokenParsed;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;
      session.role = token.role; // 🔹 expose role to client session

      return session;
    },
    redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      try {
        if (url.startsWith('/')) {
          if (url.includes('/admin/')) {
            return `http://admin.localhost:3000${url}`;
          }
          return `http://localhost:3000${url}`;
        }

        const u = new URL(url);
        const allowed = ['http://localhost:3000', 'http://admin.localhost:3000'];
        if (allowed.includes(`${u.protocol}//${u.host}`)) {
          return url;
        }

        return baseUrl;
      } catch {
        return baseUrl;
      }
    },
  },
};
