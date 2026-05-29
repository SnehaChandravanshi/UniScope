import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const emailLower = credentials.email.toLowerCase();

        try {
          const user = await prisma.user.findUnique({
            where: { email: emailLower },
          });

          if (!user) {
            // Fallback for easy demo if database is down or empty
            if (emailLower === 'demo@example.com' && credentials.password === 'password123') {
              return { id: 'demo-user-id', name: 'Demo Student', email: 'demo@example.com' };
            }
            throw new Error('No user found with this email');
          }

          const isValid = await bcrypt.compare(credentials.password, user.password);
          if (!isValid) {
            throw new Error('Incorrect password');
          }

          return {
            id: user.id,
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          // Robust demo fallback in case database server is not reachable
          if (emailLower === 'demo@example.com' && credentials.password === 'password123') {
            console.warn("DB connection failed during authorize. Logging in as Demo Student.");
            return { id: 'demo-user-id', name: 'Demo Student', email: 'demo@example.com' };
          }
          throw error;
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    }
  },
  pages: {
    signIn: '/login',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
