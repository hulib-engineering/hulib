import CredentialsProvider from 'next-auth/providers/credentials';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

import { Env } from '@/libs/Env.mjs';
import { AppConfig } from '@/utils/AppConfig';

export const authOptions = {
  // Configure one or more authentication providers
  debug: true,
  strategy: 'jwt',
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
          // eslint-disable-next-line no-param-reassign
          token = { ...token, accessToken: resParsed.token };
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
          // eslint-disable-next-line no-param-reassign
          token = { ...token, accessToken: resParsed.token };
        }
        if (account?.provider === 'credentials') {
          // eslint-disable-next-line no-param-reassign
          token = { ...token, accessToken: user.accessToken };
        }
      }

      return token;
    },
    async session({ session, token }: { session: any; token: any }) {
      session.accessToken = token.accessToken;

      return session;
    },
  },
};
