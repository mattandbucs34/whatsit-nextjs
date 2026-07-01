import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';

export const authConfig = {
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
    ],
    pages: {
        signIn: '/signin',
    },
    callbacks: {
        // NextAuth v5 default auth middleware handler
        authorized({ auth, request: { nextUrl } }) {
            const isLoggedIn = !!auth?.user;
            const isProtectedRoute = 
                nextUrl.pathname === '/topics/new' ||
                /^\/topics\/[^/]+\/edit$/.test(nextUrl.pathname);

            if (isProtectedRoute) {
                if (isLoggedIn) return true;
                return false; // Automatically redirects to signin
            }
            return true;
        },
    },
} satisfies NextAuthConfig;
