import NextAuth from 'next-auth';
import FacebookProvider from 'next-auth/providers/facebook';
import GoogleProvider from 'next-auth/providers/google';

import { Env } from '@/libs/Env.mjs';
import { AppConfig } from '@/utils/AppConfig';

const authOptions = {
  // Configure one or more authentication providers
  debug: true,
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
  ],
  callbacks: {
    async jwt({ account, token }: { account: any; token: any }) {
      if (account) {
        if (account?.id_token) {
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
        } else {
          const res = await fetch(
            `${AppConfig.api.endpoint}/${AppConfig.api.version}/auth/facebook/login`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ accessToken: account?.access_token }),
            },
          );
          const resParsed = await res.json();
          console.log(resParsed);
        }
      }

      return token;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
