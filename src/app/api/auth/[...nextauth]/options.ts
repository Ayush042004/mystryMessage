import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

interface CustomUser {
  _id?: string;
  email: string;
  username: string;
  isVerified: boolean;
  isAcceptingMessages?: boolean;
  password?: string;
}


export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'Credentials',
      credentials: {
        identifier: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials): Promise<CustomUser | null> {
          if (!credentials?.identifier || !credentials?.password) {
          return null;
        }
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifier },
              { username: credentials.identifier },
            ],
          });
          if (!user) {
            throw new Error('No user found with this email');
          }
          if (!user.isVerified) {
            throw new Error('Please verify your account before logging in');
          }
          const isPasswordCorrect = await bcrypt.compare(
            credentials.password,
            user.password
          );
          if (isPasswordCorrect) {
            return {
              _id: (user._id as { toString: () => string }).toString(),
              email: user.email,
              username: user.username,
              isVerified: user.isVerified,
              isAcceptingMessages: user.isAcceptingMessages,
            };
          } else {
            throw new Error('Incorrect password');
          }
        }catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'An error occurred';
          throw new Error(errorMessage);
        }
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!
    })
  ],
  callbacks: {
    /* When is this run? Every time a JWT is created/updated (i.e., on sign-in or session fetch).

What it does:

When the user is present (usually at sign-in), custom user fields (_id, isVerified, etc.) are stored in the token.

This allows you to persist extra user data inside the token.

*/
 
async jwt({ token, user, account }) {
  if (account?.provider === 'google') {
    await dbConnect();

    let dbUser = await UserModel.findOne({ email: user.email });

    if (!dbUser) {
      dbUser = await UserModel.create({
        email: user?.email,
        username: user?.name || (user.email ? user.email.split('@')[0] : ''),
        isVerified: true,
        password: 'GOOGLE_OAUTH',
      });
    }

    token._id = (dbUser._id as { toString: () => string }).toString();
    token.isVerified = dbUser.isVerified;
    token.isAcceptingMessages = dbUser.isAcceptingMessages;
    token.username = dbUser.username;
  } else if (user) {
    const customUser = user as CustomUser;
    token._id = customUser._id?.toString?.();
    token.isVerified = customUser.isVerified;
    token.isAcceptingMessages = customUser.isAcceptingMessages;
    token.username = customUser.username;
  }

  return token;
},

    /* When is this run? Every time useSession() is called or an API hits the /api/auth/session endpoint.

What it does:

Takes the custom data from the token and injects it into the session.user object.

This makes _id, isVerified, username, etc., accessible on the client side (session.user in React).

*/
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id as string | undefined;
        session.user.isVerified = token.isVerified as boolean | undefined;
        session.user.isAcceptingMessage = typeof token.isAcceptingMessages === 'boolean' ? token.isAcceptingMessages : undefined;
        session.user.username = typeof token.username === 'string' ? token.username : undefined;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/sign-in',
  },
};